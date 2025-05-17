import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
import axios from "axios";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settingsModal, setSettingsModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await axios.get("https://fakecord.kr/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      }
    };
    if (!localStorage.getItem("accessToken")) {
      setUser(null);
      return;
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, setSettingsModal, settingsModal }}
    >
      {children}
    </AuthContext.Provider>
  );
};
