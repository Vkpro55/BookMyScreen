import { createContext, useContext, useEffect, useState } from "react";
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

interface PersistedSeatState {
  selectedSeats: SelectedSeat[];
  shows: ShowBookingDetails | null;
  checkoutExpiresAt: string | null;
}

interface ISeatContext {
  selectedSeats: SelectedSeat[];
  setSelectedSeats: Dispatch<SetStateAction<SelectedSeat[]>>;
  shows: ShowBookingDetails | null;
  setShows: Dispatch<SetStateAction<ShowBookingDetails | null>>;
  checkoutExpiresAt: string | null;
  setCheckoutExpiresAt: Dispatch<SetStateAction<string | null>>;
}

const STORAGE_KEY = "book-my-screen-checkout-state";

const SeatContext = createContext<ISeatContext | undefined>(undefined);

function getPersistedSeatState(): PersistedSeatState {
  if (typeof window === "undefined") {
    return { selectedSeats: [], shows: null, checkoutExpiresAt: null };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { selectedSeats: [], shows: null, checkoutExpiresAt: null };
  }

  try {
    const parsed = JSON.parse(raw) as PersistedSeatState;
    return {
      selectedSeats: Array.isArray(parsed.selectedSeats)
        ? parsed.selectedSeats
        : [],
      shows: parsed.shows ?? null,
      checkoutExpiresAt:
        typeof parsed.checkoutExpiresAt === "string"
          ? parsed.checkoutExpiresAt
          : null,
    };
  } catch {
    return { selectedSeats: [], shows: null, checkoutExpiresAt: null };
  }
}

export const SeatContextProvider = ({ children }: IProps) => {
  const persistedState = getPersistedSeatState();
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>(
    persistedState.selectedSeats,
  );
  const [shows, setShows] = useState<ShowBookingDetails | null>(
    persistedState.shows,
  );
  const [checkoutExpiresAt, setCheckoutExpiresAt] = useState<string | null>(
    persistedState.checkoutExpiresAt,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedSeats, shows, checkoutExpiresAt }),
    );
  }, [selectedSeats, shows, checkoutExpiresAt]);

  return (
    <SeatContext.Provider
      value={{
        selectedSeats,
        setSelectedSeats,
        shows,
        setShows,
        checkoutExpiresAt,
        setCheckoutExpiresAt,
      }}
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
