import { useState } from "react";
import { useParams } from "react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getShowById } from "../api";
import type { ShowRowWithSeats } from "../api/types";
import Footer from "../components/seatlayout/Footer";
import Header from "../components/seatlayout/Header";
import Seat from "../components/seatlayout/Seat";
import screenImg from "../assets/screen.png";

interface SelectedSeat {
  seatId: string;
  rowLabel: string;
  seatNumber: number;
  price: number;
}

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
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const { data: showData, isLoading } = useQuery({
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
          seatNumber: seat.number,
          price,
        },
      ];
    });
  };

  if (isLoading || !showData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const priceGroups = groupRowsByPrice(showData.rows);

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
        <Footer selectedCount={selectedSeats.length} />
      </div>
    </div>
  );
}

export default SeatLayout;
