export type SeatType = "PREMIUM" | "EXECUTIVE" | "NORMAL" | "UNKNOWN";

import type { SelectedSeat } from "../context/SeatContext";

export interface ISeatProps {
  seatNumber: string;
  price: number;
}

export const getSeatType = (seatNumber: string): SeatType => {
  const row = seatNumber.charAt(0);

  if (row === "D") return "PREMIUM";
  if (["B", "C"].includes(row)) return "EXECUTIVE";
  if (row === "A") return "NORMAL";

  return "UNKNOWN";
};

export const groupSeatsByType = (seats: ISeatProps[]) => {
  const grouped: Record<SeatType, ISeatProps[]> = {
    PREMIUM: [],
    EXECUTIVE: [],
    NORMAL: [],
    UNKNOWN: [],
  };

  seats.forEach((seat) => {
    const type = getSeatType(seat.seatNumber);
    grouped[type].push(seat);
  });

  return Object.entries(grouped)
    .filter(([, seats]) => seats.length > 0)
    .map(([type, seats]) => ({ type, seats }));
};

export const calculateTotalPrice = (seats: SelectedSeat[]) => {
  const base = seats.reduce((acc, seat) => acc + seat.price, 0);
  const tax = +(base * 0.05).toFixed(2); // 5% tax
  const total = +(base + tax).toFixed(2);
  return { base, tax, total };
};
