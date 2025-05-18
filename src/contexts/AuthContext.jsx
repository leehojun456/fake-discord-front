import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
import axios from "../axios";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settingsModal, setSettingsModal] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await axios.get("https://fakecord.kr/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User data fetched:", response);
        setUser(response);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
    } finally {
      // 1초 뒤에 로딩 상태 false로 변경
      setTimeout(() => {
        setIsUserLoading(false);
      }, 100);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });
      const token = response.accessToken;
      localStorage.setItem("accessToken", token);
      await fetchUser();
      window.location.href = "/channels/@me";

      return;
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      return;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        isUserLoading,
        setSettingsModal,
        settingsModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
