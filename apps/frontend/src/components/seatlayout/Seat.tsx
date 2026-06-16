import type { SeatStatus } from "../../api/types";

interface SeatProps {
  seat: {
    id: string;
    number: number;
    status: SeatStatus;
  };
  lockedSeats: string[];
  rowLabel: string;
  isSelected: boolean;
  onClick: () => void;
}

function Seat({ seat, lockedSeats, isSelected, onClick }: SeatProps) {
  const isLocked = lockedSeats.includes(String(seat.id));

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={seat.status === "BOOKED" || isLocked}
      className={`w-9 h-9 m-[2px] rounded-lg border text-sm
                ${seat.status === "BOOKED"
          ? "bg-gray-100 border-red-200 text-red-400 cursor-not-allowed"
          : isLocked
            ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
            : isSelected
              ? "bg-[#6e52fa] text-white border-[#cec4f7] border-3 cursor-pointer"
              : "hover:bg-gray-100 border-black cursor-pointer"
        }`}
    >
      {seat.status === "BOOKED" || isLocked ? "X" : seat.number}
    </button>
  );
}

export default Seat;
