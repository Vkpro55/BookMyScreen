import { useEffect, useState } from "react";
import { getUser } from "../api";
import { useAuth } from "../context/AuthContext";

export const useLoadUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, setAuth } = useAuth();

  useEffect(() => {
    void (async () => {
      try {
        const data = await getUser();
        setUser(data);
        setAuth(true);
      } catch {
        // handle error
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading };
};
