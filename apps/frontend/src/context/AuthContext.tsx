import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendOtp, verifyOtp, activateUser, logout } from "../api";
import type { ApiRequestError } from "../api";
import type {
  SendOtpResponse,
  VerifyOtpInput,
  VerifyOtpResponse,
  ActivateUserInput,
  LogoutResponse,
  User,
} from "../api/types";
import { toast } from "react-hot-toast";

interface IProps {
  children: ReactNode;
}

type SetKeys = 1 | 2 | 3;

export interface AuthData {
  email: string;
  hash: string;
  user?: User;
}

interface SendOtpRequestParams {
  email: string;
  onNext: () => void;
}

interface VerifyOtpRequestParams {
  otp: string;
  onNext: () => void;
}

interface ActivateUserRequestParams {
  name: string;
  phone: number;
}

interface ActivateUserVariables {
  id: string;
  body: ActivateUserInput;
}

interface IAuthContext {
  step: SetKeys;
  setStep: Dispatch<SetStateAction<SetKeys>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  toggleModal: () => void;
  authData: AuthData | null;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
  sendOtpRequest: (params: SendOtpRequestParams) => void;
  verifyOtpRequest: (params: VerifyOtpRequestParams) => void;
  activateUserRequest: (params: ActivateUserRequestParams) => void;
  logoutRequest: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: IProps) => {
  const [step, setStep] = useState<SetKeys>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<boolean>(false);

  const sendOtpRequestMutation = useMutation<
    SendOtpResponse,
    ApiRequestError,
    string
  >({
    mutationFn: (email) => sendOtp({ email }),
  });

  const verifyOtpRequestMutation = useMutation<
    VerifyOtpResponse,
    ApiRequestError,
    VerifyOtpInput
  >({
    mutationFn: (body) => verifyOtp(body),
  });

  const activateUserRequestMutation = useMutation<
    User,
    ApiRequestError,
    ActivateUserVariables
  >({
    mutationFn: ({ id, body }) => activateUser(id, body),
  });

  const logoutRequestMutation = useMutation<
    LogoutResponse,
    ApiRequestError,
    void
  >({
    mutationFn: () => logout(),
  });

  const toggleModal = () => setShowModal(!showModal);

  const sendOtpRequest = ({ email, onNext }: SendOtpRequestParams) => {
    sendOtpRequestMutation.mutate(email, {
      onSuccess: (res) => {
        setAuthData({ email: res.email, hash: res.hash });
        toast.success("OTP sent to your email");
        onNext();
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  };

  const verifyOtpRequest = ({ otp, onNext }: VerifyOtpRequestParams) => {
    if (!authData) {
      toast.error("Session expired. Please enter your email again.");
      return;
    }

    verifyOtpRequestMutation.mutate(
      { email: authData.email, otp, hash: authData.hash },
      {
        onSuccess: (res) => {
          setAuthData(null);
          setUser(res.user);
          setAuth(true);
          if (!res.user.activateUser) {
            onNext();
          } else {
            setStep(1);
            toggleModal();
          }
        },
        onError: (err) => {
          toast.error(err.message || "Invalid OTP");
        },
      },
    );
  };

  const activateUserRequest = ({ name, phone }: ActivateUserRequestParams) => {
    if (!user?.id) {
      toast.error("User not found. Please verify OTP first.");
      return;
    }

    activateUserRequestMutation.mutate(
      {
        id: user.id,
        body: { name, phone, activateUser: true },
      },
      {
        onSuccess: (updatedUser) => {
          setUser(updatedUser);
          setAuth(true);
          toast.success("Account activated successfully");
          setStep(1);
          toggleModal();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to activate account");
        },
      },
    );
  };

  const logoutRequest = () => {
    logoutRequestMutation.mutate(undefined, {
      onSuccess: () => {
        setAuth(false);
        setUser(null);
        setAuthData(null);
        setStep(1);
        toast.success("Logged out successfully");
        window.location.href = "/";
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        step,
        setStep,
        showModal,
        setShowModal,
        toggleModal,
        authData,
        user,
        sendOtpRequest,
        verifyOtpRequest,
        activateUserRequest,
        logoutRequest,
        setUser,
        auth,
        setAuth,
      }}
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
