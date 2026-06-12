import type { SeatStatus } from "../../api/types";

interface SeatProps {
  seat: {
    id: string;
    number: number;
    status: SeatStatus;
  };
  rowLabel: string;
  isSelected: boolean;
  onClick: () => void;
}

function Seat({ seat, isSelected, onClick }: SeatProps) {
  const isUnavailable = seat.status === "BOOKED" || seat.status === "BLOCKED";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isUnavailable}
      className={`w-9 h-9 m-[2px] rounded-lg border text-sm
                ${isSelected ? "bg-purple-600 text-white border-purple-600" : ""}
                ${isUnavailable ? "bg-gray-200 border-gray-300 cursor-not-allowed text-gray-400" : "hover:bg-gray-100 border-black cursor-pointer"}
            `}
    >
      {isUnavailable ? "×" : seat.number}
    </button>
  );
}

export default Seat;
