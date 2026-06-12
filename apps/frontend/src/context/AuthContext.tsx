import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface IProps {
  children: ReactNode;
}

type SetKeys = 1 | 2 | 3;

interface IAuthContext {
  step: SetKeys;
  setStep: Dispatch<SetStateAction<SetKeys>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  toggleModal: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: IProps) => {
  const [step, setStep] = useState<SetKeys>(1);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => setShowModal(!showModal);

  return (
    <AuthContext.Provider
      value={{ step, setStep, showModal, setShowModal, toggleModal }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
