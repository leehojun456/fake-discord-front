import { createContext, use, useEffect, useState } from "react";
import axios from "../axios";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [settingsModal, setSettingsModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("/auth/login", {
      email: email,
      password: password,
    });
    console.log(response);
    const token = response.data.accessToken;
    localStorage.setItem("accessToken", token);
    setToken(token);
    await fetchUser();
  };

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await axios.get("/user");
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
      window.location.href = "/login";
      console.log("로그인 페이지로 이동");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, setUser, setSettingsModal, settingsModal }}
    >
      {children}
    </AuthContext.Provider>
  );
};
