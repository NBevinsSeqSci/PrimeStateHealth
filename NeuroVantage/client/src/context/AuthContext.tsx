import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentClinician, logoutClinician } from "@/lib/api";

type Clinician = {
  id: number;
  email: string;
  name?: string | null;
  clinicId?: string | null;
};

interface AuthContextValue {
  clinician: Clinician | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (clinician: Clinician) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [clinician, setClinician] = useState<Clinician | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = (await getCurrentClinician()) as {
        clinician?: Clinician;
      };
      setClinician(result?.clinician ?? null);
    } catch {
      setClinician(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = (nextClinician: Clinician) => setClinician(nextClinician);
  const logout = async () => {
    try {
      await logoutClinician();
    } catch {
      // If the API is unreachable, still clear local state.
    } finally {
      setClinician(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      clinician,
      isAuthenticated: Boolean(clinician),
      isLoading,
      login,
      logout,
      refresh,
    }),
    [clinician, isLoading, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
