import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface IProps {
  children: ReactNode;
}

interface ISocketContext {
  socket: WebSocket | undefined;
  setSocket: Dispatch<SetStateAction<WebSocket | undefined>>;
}

export const SocketContext = createContext<ISocketContext | null>(null);

export const SockerProvider = ({ children }: IProps) => {
  const [socket, setSocket] = useState<WebSocket>();

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
};
