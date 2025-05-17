import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settingsModal, setSettingsModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      setUser(null);
      return;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, setSettingsModal, settingsModal }}
    >
      {children}
    </AuthContext.Provider>
  );
};
