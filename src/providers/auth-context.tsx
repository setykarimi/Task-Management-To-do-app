import http from "@/lib/axios";
import { PROFILES_API } from "@/services/api";
import { decodeToken, getTokensFromUrl } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

export interface SupabaseUser {
  id: string;
  email: string | null;
  phone: string | null;
  phone_confirmed_at: string | null;
  confirmation_sent_at: string | null;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  role: string;
  updated_at: string | null;
  created_at: string | null;
  sub: string;

  app_metadata: {
    provider: string;
    providers: string[];
    [key: string]: any;
  };

  user_metadata: {
    [key: string]: any;
  };

  identities?: Array<{
    id: string;
    user_id: string;
    identity_data: Record<string, any>;
    provider: string;
    created_at: string;
    last_sign_in_at: string;
    updated_at: string;
  }>;
}

interface AuthContextType {
  user: SupabaseUser | null;
  token: string | null;
  logout: () => void;
  profile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const access_token = localStorage.getItem("access_token");
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [token, setToken] = useState<string | null>(access_token);

  const { mutateAsync: fetchProfile, data: profile } = useMutation({
    mutationFn: async (user_id: string) => {
      const res = await http.get(`${PROFILES_API.PROFILE}?id=eq.${user_id}`);
      return res.data;
    },
    onSuccess: (result) => {
      return result;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error_code);
    },
  });

  // @@@______________ Save token from url (when user signup) ______________@@@
  useEffect(() => {
    const { access_token: signup_token, refresh_token } =
      getTokensFromUrl(location);
    if (signup_token) localStorage.setItem("access_token", signup_token);
    if (refresh_token) {
      localStorage.setItem("refresh_token", refresh_token);
      navigate("/dashboard");
    }
  }, [location]);

  // @@@______________ Save token and userData in context ______________@@@
  useEffect(() => {
    if (access_token) {
      setToken(access_token);
      setUser(decodeToken(access_token));
    }
  }, [access_token]);

  // @@@______________ Check for no token ______________@@@
  useEffect(() => {
    if (!token) {
      if (location.pathname.startsWith("/dashboard")) {
        navigate("/login", { replace: true });
      }
    } else {
      if (location.pathname === "/login") {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [token, location.pathname, navigate]);

  // @@@______________ Fetch user Profile ______________@@@
  useEffect(() => {
    if (user?.sub) fetchProfile(user?.sub);
  }, [user]);

  // @@@______________ Logout ______________@@@
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
