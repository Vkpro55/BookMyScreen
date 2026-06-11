export type SeatType = "PREMIUM" | "EXECUTIVE" | "NORMAL" | "UNKNOWN";

export interface ISeatProps {
  type: string;
  seatNumber: string;
  price: number;
}

export const getSeatType = (seatNumber: string): SeatType => {
  const row = seatNumber.charAt(0);

  if (row === "E") return "PREMIUM";
  if (["B", "C", "D"].includes(row)) return "EXECUTIVE";
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
