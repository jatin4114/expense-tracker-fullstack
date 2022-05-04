import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

// wrap the whole app with this so any component can check if someone
// is logged in, and call login/register/logout
export function AuthProvider({ children }) {
  // start by reading whatever we saved in localStorage last time
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail"));

  // keep localStorage in sync whenever token/userEmail changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  async function login(email, password) {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    setUserEmail(email);
  }

  async function register(email, password) {
    await registerUser(email, password);
    // auto login right after registering, nicer UX than making them
    // log in again with the same details they just typed
    await login(email, password);
  }

  function logout() {
    setToken(null);
    setUserEmail(null);
  }

  const value = {
    token,
    userEmail,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// small hook so components can just do `const { user } = useAuth()`
export function useAuth() {
  return useContext(AuthContext);
}
