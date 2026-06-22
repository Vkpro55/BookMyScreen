import { useParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById } from "../api";
import type { ShowBookingDetails, ShowRowWithSeats } from "../api/types";
import Footer from "../components/seatlayout/Footer";
import Header from "../components/seatlayout/Header";
import Seat from "../components/seatlayout/Seat";
import screenImg from "../assets/screen.png";
import { useSeatContext } from "../context/SeatContext";
import { useLocation } from "../context/LocationContext";
import { getSeatType } from "../utils";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

/* eslint-disable no-console */

function groupRowsByPrice(rows: ShowRowWithSeats[]) {
  return rows.reduce<
    Record<number, { price: number; rows: ShowRowWithSeats[] }>
  >((acc, row) => {
    acc[row.price] ??= { price: row.price, rows: [] };
    acc[row.price].rows.push(row);
    return acc;
  }, {});
}

function SeatLayout() {
  const { showId } = useParams();
  const { selectedSeats, setSelectedSeats } = useSeatContext();
  const { location } = useLocation();
  const [lockedSeats, setLockedSeats] = useState<string[]>();
  const { setSocket } = useSocket();

  const { data: showData, isLoading } = useQuery<ShowBookingDetails>({
    queryKey: ["show", showId],
    queryFn: () => getShowById(showId ?? ""),
    placeholderData: keepPreviousData,
    enabled: !!showId,
  });

  const handleSelectSeat = (
    rowLabel: string,
    seat: { id: string; number: number; status: string },
    price: number,
  ) => {
    if (seat.status !== "AVAILABLE") return;

    const seatNumber = `${rowLabel}${seat.number}`;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatId === seat.id);
      if (exists) {
        return prev.filter((s) => s.seatId !== seat.id);
      }
      return [
        ...prev,
        {
          seatId: seat.id,
          rowLabel,
          seatNumber,
          price,
          type: getSeatType(seatNumber),
        },
      ];
    });
  };

  // Socket code
  useEffect(() => {
    if (!showId) {
      return;
    }

    const ws = new WebSocket("ws://localhost:4000");

    console.log("Socket state:", ws.readyState);

    ws.onopen = () => {
      console.log("WebSocket connected");

      // Send join-show event when connected
      ws.send(
        JSON.stringify({
          type: "join-show",
          showId,
        }),
      );
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as unknown;

        if (typeof parsed !== "object" || !parsed) {
          return;
        }

        const message = parsed as Record<string, unknown>;

        switch (message.type) {
          case "locked-seats-initials": {
            const seatIds = message.seatIds as string[];
            setLockedSeats(seatIds);
            break;
          }

          case "seat-locked": {
            const seatIds = message.seatIds as string[];
            const incomingShowId = message.showId as string;

            if (incomingShowId !== showId) {
              return;
            }

            setLockedSeats((prev) => [
              ...new Set<string>([...(prev ?? []), ...seatIds]),
            ]);

            break;
          }

          case "seat-locked-failed": {
            const alreadyLocked = message.alreadyLocked as string[] | undefined;
            if (alreadyLocked && alreadyLocked.length > 0) {
              // remove locked seats from user's selection and mark them locked
              setSelectedSeats((prev) =>
                prev.filter((s) => !alreadyLocked.includes(s.seatId)),
              );
              setLockedSeats((prev) => [
                ...new Set<string>([...(prev ?? []), ...alreadyLocked]),
              ]);
              // notify user
              alert(
                `Some seats are no longer available: ${alreadyLocked.join(", ")}`,
              );
            }
            break;
          }

          case "seat-unlocked": {
            const seatIds = message.seatIds as string[] | undefined;
            if (seatIds && seatIds.length > 0) {
              setLockedSeats((prev) =>
                (prev ?? []).filter((id) => !seatIds.includes(id)),
              );
            }
            break;
          }

          default:
            break;
        }
      } catch (error) {
        console.error("Failed to parse message", error);
      }
    };

    ws.onerror = (e) => {
      console.error("WS Error", e);
    };

    ws.onclose = (e) => {
      console.log("WS Closed", e.code, e.reason);
    };

    setSocket(ws);
  }, [showId]);

  if (isLoading || !showData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const priceGroups = groupRowsByPrice(showData.rows);

  console.log(
    "Current all ocked seats are returned by websocket server: ",
    lockedSeats,
  );

  return (
    <div className="h-screen overflow-y-hidden">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header showData={showData} />
      </div>

      <div className="max-w-7xl mx-auto mt-[210px] px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="flex flex-col items-center justify-center">
          {Object.entries(priceGroups)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([priceKey, { price, rows }]) => (
              <div
                key={priceKey}
                className="mb-12 w-full flex flex-col items-center justify-center"
              >
                <h2 className="text-center font-semibold text-lg mb-4">
                  ₹{price}
                </h2>
                <div className="space-y-2">
                  {rows.map((rowObj) => (
                    <div key={rowObj.label} className="flex items-center">
                      <div className="w-6 text-right mr-2 text-sm text-gray-600">
                        {rowObj.label}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rowObj.seats.map((seat) => (
                          <Seat
                            key={seat.id}
                            seat={seat}
                            lockedSeats={lockedSeats ?? []}
                            rowLabel={rowObj.label}
                            isSelected={selectedSeats.some(
                              (s) => s.seatId === seat.id,
                            )}
                            onClick={() =>
                              handleSelectSeat(rowObj.label, seat, price)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          <div className="flex justify-center mt-5">
            <img
              src={screenImg}
              alt="Screen"
              className="w-[300px] md:w-[400px] object-contain opacity-80"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-10 h-[100px] bg-white border-t border-gray-200 p-4">
        <Footer
          selectedCount={selectedSeats.length}
          state={location}
          showData={showData}
          selectedSeats={selectedSeats}
        />
      </div>
    </div>
  );
}

export default SeatLayout;
