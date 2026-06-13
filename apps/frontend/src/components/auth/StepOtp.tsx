import { useRef, useState } from "react";
import type { MouseEvent, ChangeEvent } from "react";
import { useCountdown } from "../../hooks/useCountDown";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

function StepOtp({ onNext }: { onNext: () => void }) {
  const [otpArray, setOtpArray] = useState<string[]>(new Array(4).fill(""));
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOtpRequest } = useAuth();


  const { displayTime, isExpired } = useCountdown({
    initialTimeInSeconds: 2 * 60,
  });

  const handleVerifyOtp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const otp = otpArray.join("");
    verifyOtpRequest({ otp, onNext })
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();

    const value = e.target.value;

    if (!isNaN(parseInt(value))) {
      setOtpArray([...otpArray.map((d, idx) => (idx === index ? value : d))]);

      // Focus on next input
      if (value !== "" && index < inputRef.current.length - 1) {
        inputRef.current[index + 1]?.focus();
      }
    }
  };

  const handleClearOtp = () => {
    setOtpArray(new Array(4).fill(""));
    inputRef.current[0]?.focus();
  };

  const handleResendOtp = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter the code we just mailed you
      </h2>
      <p className="text-center text-sm text-gray-500">
        If you don't have an account, we'll create one for you.
      </p>

      <div className="flex items-center justify-center">
        {otpArray.map((digit, index) => {
          return (
            <input
              key={index}
              type="text"
              ref={(ref) => {
                inputRef.current[index] = ref;
                return;
              }}
              onChange={(e) => handleOtpChange(e, index)}
              name="otp"
              maxLength={1}
              value={digit}
              className="w-12 h-12 font-bold text-center rounded-md mx-1 border border-gray-200 text-white-500 outline-none"
            />
          );
        })}

        <button
          onClick={handleClearOtp}
          type="button"
          className="w-8 cursor-pointer h-8 border border-gray-200 items-center
        text-[#f74565] ml-1 font-bold rounded-md"
        >
          <IoClose size={24} className="inline" />
        </button>
      </div>

      {isExpired ? (
        <p className="text-center text-xs text-indigo-500 cursor-pointer">
          OTP expired. Please{" "}
          <a href="" className="underline" onClick={handleResendOtp}>
            resend OTP
          </a>
          .
        </p>
      ) : (
        <p className="text-center text-sm ">OTP expires in {displayTime}</p>
      )}

      <button
        onClick={handleVerifyOtp}
        type="submit"
        className="w-full cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        Continue
      </button>

      <p className="text-[#c4c5c5] text-center m-auto text-[12px]">
        By entering your email id, you're agreeing to our{" "}
        <a href="" className="text-[#f74565]">
          Terms of Service
        </a>{" "}
        and
        <a href="" className="text-[#f74565]">
          Privacy Policy
        </a>
        . Thanks!
      </p>
    </div>
  );
}

export default StepOtp;
