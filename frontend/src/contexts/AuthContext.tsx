import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";

/* =========================
   TYPES
========================= */

export type UserRole = "client" | "student" | "admin";

export type User = {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  isVerified?: boolean;
  idDocumentUrl?: string;
};

const normalizeUser = (raw: any): User | null => {
  if (!raw || typeof raw !== 'object') return null;

  const id = raw.id || raw._id;
  if (!id) return null;

  const role = raw.role === 'local' ? 'client' : raw.role;

  return {
    ...raw,
    id: String(id),
    role,
  } as User;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
};

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

/* =========================
   PROVIDER
========================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     RESTORE SESSION
  ========================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsed = JSON.parse(storedUser);
        const normalized = normalizeUser(parsed);
        if (normalized) {
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
        } else {
          throw new Error('Invalid stored user');
        }
      } catch (error) {
        console.error("Invalid stored user, clearing auth", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const normalized = normalizeUser(data.user);
      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
      localStorage.setItem("token", data.token);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     REGISTER
  ========================= */
 const register = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
) => {
  setLoading(true);
  try {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, role }),
    });

    // auto-login after register
    const normalized = normalizeUser(data.user);
    setUser(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));
    localStorage.setItem("token", data.token);
  } finally {
    setLoading(false);
  }
};


  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* =========================
     PROVIDER VALUE
  ========================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
