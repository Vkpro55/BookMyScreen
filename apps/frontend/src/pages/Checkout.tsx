import dayjs from "dayjs";
import Header from "../components/seatlayout/Header";
import { calculateTotalPrice, groupSeatsByType } from "../utils";
import { FaInfoCircle } from "react-icons/fa";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { useSeatContext } from "../context/SeatContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";
import {
  createBooking,
  createPaymentOrder,
  reconcilePaymentOrder,
  verifyPayment,
} from "../api";
import type { PaymentOrder, PaymentOrderStatus } from "../api/types";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const PAYMENT_RECOVERY_KEY = "book-my-screen-payment-recovery-key";

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string | null;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayCheckout {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailureResponse) => void,
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

const loadRazorpayScript = async (): Promise<boolean> => {
  if (window.Razorpay) return true;

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${RAZORPAY_SCRIPT_URL}"]`,
  );

  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), {
        once: true,
      });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { location } = useLocation();

  const {
    selectedSeats,
    shows,
    checkoutExpiresAt,
    setSelectedSeats,
    setShows,
    setCheckoutExpiresAt,
  } = useSeatContext();
  const { base, tax, total } = calculateTotalPrice(selectedSeats);
  const { socket } = useSocket();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReconcilingPayment, setIsReconcilingPayment] = useState(false);
  const [isFinalizingBooking, setIsFinalizingBooking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentOrderStatus | null>(
    null,
  );
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  const getInitialTimeLeft = () => {
    if (!checkoutExpiresAt) {
      return 300;
    }

    const expiresAt = new Date(checkoutExpiresAt).getTime();
    const diffSeconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    return diffSeconds > 0 ? diffSeconds : 0;
  };

  const [timeLeft, setTimeLeft] = useState<number>(getInitialTimeLeft);

  const createIdempotencyKey = () => {
    return [
      "payment",
      user?.id ?? "guest",
      shows?.id ?? "show",
      checkoutExpiresAt ?? "checkout",
    ].join(":");
  };

  const clearCheckoutAndNavigateHome = () => {
    window.localStorage.removeItem(PAYMENT_RECOVERY_KEY);
    setSelectedSeats([]);
    setShows(null);
    setCheckoutExpiresAt(null);
    void navigate("/");
  };

  const isConfirmedPayment = (order: PaymentOrder): boolean => {
    return order.status === "PAID" || order.status === "AUTHORIZED";
  };

  const finalizeBooking = async (order: PaymentOrder): Promise<boolean> => {
    if (!shows || selectedSeats.length === 0) {
      setPaymentMessage(
        "Payment is confirmed, but checkout details are missing.",
      );
      return false;
    }

    setIsFinalizingBooking(true);
    setPaymentMessage("Payment confirmed. Creating your booking...");

    try {
      const booking = await createBooking({
        razorpayOrderId: order.razorpayOrderId ?? order.id,
        showId: shows.id,
        seats: selectedSeats.map((seat) => ({
          seatId: seat.seatId,
          seatNumber: seat.seatNumber,
        })),
        paymentMethod: "Razorpay",
      });

      toast.success(`Booking confirmed: ${booking.bookingRef}`);
      clearCheckoutAndNavigateHome();
      return true;
    } catch (error) {
      setPaymentStatus("PAID");
      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Payment is confirmed, but booking could not be created yet.",
      );
      return false;
    } finally {
      setIsFinalizingBooking(false);
    }
  };

  const handleRecoveredOrder = async (
    order: PaymentOrder,
  ): Promise<boolean> => {
    setPaymentStatus(order.status);

    if (isConfirmedPayment(order)) {
      return finalizeBooking(order);
    }

    if (order.status === "FAILED") {
      setPaymentMessage(
        "Payment failed. Your seats are still held until the timer ends, so you can retry.",
      );
      return false;
    }

    setPaymentMessage(
      "Payment status is still being confirmed. You can check again or retry before the timer ends.",
    );
    return false;
  };

  const reconcileCurrentPayment = async (): Promise<boolean> => {
    setIsReconcilingPayment(true);
    setPaymentMessage("Checking payment status with the server...");

    try {
      const order = await reconcilePaymentOrder({
        idempotencyKey: createIdempotencyKey(),
      });

      return await handleRecoveredOrder(order);
    } catch (error) {
      setPaymentStatus("UNKNOWN");
      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Unable to check payment status right now.",
      );
      return false;
    } finally {
      setIsReconcilingPayment(false);
    }
  };

  const handleVerifiedPayment = async (response: RazorpaySuccessResponse) => {
    setIsPaymentModalOpen(false);
    setPaymentStatus("PROCESSING");
    setPaymentMessage("Verifying your payment...");

    try {
      const order = await verifyPayment(response);

      if (await handleRecoveredOrder(order)) {
        return;
      }

      if (order.status === "AUTHORIZED" || order.status === "UNKNOWN") {
        await reconcileCurrentPayment();
      }
    } catch (error) {
      setPaymentStatus("UNKNOWN");
      setPaymentMessage(
        "Payment response was received, but verification did not finish. Checking the gateway status now.",
      );

      const recovered = await reconcileCurrentPayment();

      if (!recovered) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Payment verification is pending",
        );
      }
    }
  };

  const handlePaymentFailure = async (response: RazorpayFailureResponse) => {
    setIsPaymentModalOpen(false);
    setPaymentStatus("FAILED");
    setPaymentMessage(
      response.error?.description ??
        "Payment failed. You can retry while the seats are still held.",
    );

    await reconcileCurrentPayment();
  };

  const handleProceedToPay = async () => {
    if (
      !shows ||
      selectedSeats.length === 0 ||
      isCreatingOrder ||
      isPaymentModalOpen ||
      isReconcilingPayment
    ) {
      return;
    }

    try {
      setIsCreatingOrder(true);
      setPaymentStatus("PROCESSING");
      setPaymentMessage("Creating a secure payment order...");
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || !window.Razorpay) {
        setPaymentStatus("UNKNOWN");
        setPaymentMessage(
          "Razorpay SDK failed to load. Check your connection.",
        );
        toast.error("Razorpay SDK failed to load. Check your connection.");
        return;
      }

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

      if (!razorpayKeyId) {
        setPaymentStatus("UNKNOWN");
        setPaymentMessage("Razorpay key is missing in frontend env.");
        toast.error("Razorpay key is missing in frontend env.");
        return;
      }

      const order = await createPaymentOrder({
        amount: Math.round(total * 100),
        idempotencyKey: createIdempotencyKey(),
      });

      if (!order.id) {
        setPaymentStatus(order.status);
        setPaymentMessage("Payment order is not ready. Please retry shortly.");
        toast.error("Payment order is not ready. Please retry.");
        return;
      }

      window.localStorage.setItem(PAYMENT_RECOVERY_KEY, createIdempotencyKey());

      // create new razorpay checkout object
      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "BookMyScreen",
        description: "Secure Payment for Your Booking",
        order_id: order.id,
        handler: async (response) => {
          await handleVerifiedPayment(response);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#111827" },
        modal: {
          ondismiss: () => {
            setIsPaymentModalOpen(false);
            setPaymentStatus("ATTEMPTED");
            setPaymentMessage(
              "Payment window was closed. Your seats are still held until the timer ends.",
            );
            toast.error("Payment cancelled");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        void handlePaymentFailure(response);
        toast.error(response.error?.description ?? "Payment failed");
      });

      setPaymentStatus("CREATED");
      setPaymentMessage("Opening Razorpay checkout...");
      setIsPaymentModalOpen(true);
      razorpay.open();
    } catch (error) {
      setPaymentStatus("UNKNOWN");
      setPaymentMessage(
        error instanceof Error ? error.message : "Unable to create payment",
      );
      toast.error(
        error instanceof Error ? error.message : "Unable to create payment",
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    if (!shows || selectedSeats.length === 0) {
      void navigate("/");
      return;
    }

    const expire = () => {
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "unlock-seats",
            showId: shows.id,
            seatIds: selectedSeats.map((seat) => seat.seatId),
            userId: user?.id,
          }),
        );
      }

      setSelectedSeats([]);
      setShows(null);
      setCheckoutExpiresAt(null);
      window.localStorage.removeItem(PAYMENT_RECOVERY_KEY);
      toast.error("Time expired!");
      void navigate("/");
    };

    if (timeLeft <= 0) {
      expire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev): number => {
        if (prev <= 1) {
          expire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    checkoutExpiresAt,
    navigate,
    selectedSeats,
    shows,
    socket,
    user,
    setSelectedSeats,
    setShows,
    setCheckoutExpiresAt,
  ]);

  useEffect(() => {
    if (!shows || selectedSeats.length === 0 || paymentMessage) {
      return;
    }

    const recoveryKey = window.localStorage.getItem(PAYMENT_RECOVERY_KEY);

    if (recoveryKey !== createIdempotencyKey()) {
      return;
    }

    void reconcileCurrentPayment();
  }, [selectedSeats.length, shows, paymentMessage]);

  const isPaymentBusy =
    isCreatingOrder ||
    isPaymentModalOpen ||
    isReconcilingPayment ||
    isFinalizingBooking;

  const paymentButtonLabel = isCreatingOrder
    ? "Creating Order..."
    : isPaymentModalOpen
      ? "Payment Window Open"
      : isReconcilingPayment
        ? "Checking Status..."
        : isFinalizingBooking
          ? "Creating Booking..."
          : "Proceed To Pay";

  return (
    <div className="min-h-screen w-full bg-white">
      <Header type="checkout" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-red-500 text-center mb-3 text-lg border rounded-[14px] border-dashed py-2 font-semibold">
          Time left: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Part */}
          <div className="flex-1 space-y-4">
            {/* Movie Details */}
            <div className="flex gap-4">
              <img
                src={shows?.movie.posterUrl}
                alt={shows?.movie.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{shows?.movie.title}</h3>
                <p className="text-sm text-gray-600">
                  {shows?.movie.certification} •{" "}
                  {shows?.movie.languages.join(", ")} • {shows?.movie.format}
                </p>
                <p className="text-sm text-gray-600">
                  {shows?.screen.theater.name}, {shows?.screen.theater.city},{" "}
                  {shows?.screen.theater.state}
                </p>
              </div>
            </div>
            {/* Show Details */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-md font-medium border-b pb-5 border-gray-200">
                {dayjs(shows?.startTime, "DD-MM-YYYY")
                  .format("D MMMM YYYY")
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")}{" "}
                &nbsp;•{" "}
                <span className="font-semibold">{shows?.startTime}</span>
              </p>
              <div className="flex items-center justify-between mt-4 mb-4">
                <div>
                  <p className="text-md mt-2 font-semibold">
                    {selectedSeats.length} ticket
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">
                      {groupSeatsByType(selectedSeats).map(
                        ({ type, seats }) => (
                          <div key={type} className="font-medium">
                            <p className="inline mr-2 text-gray-800">
                              {type} -{" "}
                            </p>
                            <ul className="inline-flex gap-1">
                              {seats.map((seat) => (
                                <li key={seat.seatNumber}>{seat.seatNumber}</li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </span>
                  </div>
                </div>
                <p className="text-md font-semibold mt-2">
                  <span className="text-gray-700">₹</span>
                  {base}
                </p>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="bg-white border rounde-[24px] border-gray-200 text-yellow-800 text-sm px-6 py-5 tracking-wide">
              <span className="font-medium flex items-center gap-2">
                <FaInfoCircle size={24} /> No cancellation or refund available
                after payment.
              </span>
            </div>
          </div>

          {/* Right Part */}
          {/* Right Section */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="font-medium text-gray-900 text-lg">
              Payment Summary
            </h4>
            <div className="border border-gray-200 rounded-[24px] px-6 py-7 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-sm text-gray-500">Order amount</span>
                <span>₹{base}</span>
              </div>
              <div className="flex justify-between text-md pb-4">
                <span className="font-semibold text-sm">Taxes & fees (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-md font-semibold border-t border-gray-200 pt-4">
                <span>To be paid</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* User details */}
            <h4 className="text-lg font-medium">Your details</h4>
            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="-mt-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">+91-{user?.phone}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{location}</p>
              </div>
            </div>

            {/* Terms and button */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <CiCircleQuestion size={24} /> Terms and conditions
              </p>
            </div>

            {paymentMessage && (
              <div className="border border-gray-200 rounded-[24px] px-6 py-5 text-sm">
                <p className="font-semibold text-gray-900">
                  Payment status: {paymentStatus ?? "PENDING"}
                </p>
                <p className="mt-2 text-gray-600">{paymentMessage}</p>
                {(paymentStatus === "UNKNOWN" ||
                  paymentStatus === "AUTHORIZED" ||
                  paymentStatus === "ATTEMPTED" ||
                  paymentStatus === "PAID") && (
                  <button
                    type="button"
                    onClick={() => void reconcileCurrentPayment()}
                    disabled={isPaymentBusy}
                    className="mt-4 w-full border border-black rounded-[16px] px-4 py-3 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isReconcilingPayment
                      ? "Checking Status..."
                      : paymentStatus === "PAID"
                        ? "Finalize Booking"
                        : "Check Payment Status"}
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleProceedToPay}
              disabled={isPaymentBusy}
              className="w-full flex justify-between items-center bg-black rounded-[24px] px-6 py-4 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <p className="text-white font-bold">
                ₹{total} <span className="text-xs font-medium">TOTAL</span>
              </p>
              <p className="text-white font-medium">{paymentButtonLabel}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
