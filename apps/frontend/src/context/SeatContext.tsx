import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type { ShowBookingDetails } from "../api/types";

interface IProps {
    children: ReactNode;
}

export interface SelectedSeat {
    seatId: string;
    rowLabel: string;
    seatNumber: string;
    price: number;
    type: string;
}

interface ISeatContext {
    selectedSeats: SelectedSeat[];
    setSelectedSeats: Dispatch<SetStateAction<SelectedSeat[]>>;
    shows: ShowBookingDetails | null;
    setShows: Dispatch<SetStateAction<ShowBookingDetails | null>>;
}

const SeatContext = createContext<ISeatContext | undefined>(undefined);

export const SeatContextProvider = ({ children }: IProps) => {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [shows, setShows] = useState<ShowBookingDetails | null>(null);

    return (
        <SeatContext.Provider
            value={{ selectedSeats, setSelectedSeats, shows, setShows }}
        >
            {children}
        </SeatContext.Provider>
    );
};

export const useSeatContext = () => {
    const context = useContext(SeatContext);
    if (!context) {
        throw new Error("useSeatContext must be used within a SeatContextProvider");
    }
    return context;
};