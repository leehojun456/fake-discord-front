import { createContext, useEffect, useState } from "react";

export const ModalProvider = ({ children }) => {
  // 현재 모달 상태를 관리하는 로직을 여기에 추가할 수 있습니다.
  const [userOverlay, setUserOverlay] = useState(false);
  const [userOverlayUserId, setUserOverlayUserId] = useState(null);
  return (
    <ModalContext.Provider
      value={{
        userOverlayUserId,
        setUserOverlayUserId,
        userOverlay,
        setUserOverlay,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const ModalContext = createContext();
