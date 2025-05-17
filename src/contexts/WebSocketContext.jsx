import React, { useContext, useEffect, useState, createContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext"; // AuthContext를 임포트

export const WebSocketContext = createContext(null);

export const WebsocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // AuthContext에서 token을 가져옴
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // localStorage에서 token을 가져옴
    if (user) {
      const newSocket = io("wss://fakecord.kr/ws", {
        auth: { token }, // token을 WebSocket 연결 시 사용
      });

      setSocket(newSocket);
      console.log("WebSocket connected");

      // 컴포넌트가 unmount 될 때 소켓 연결 종료
      return () => newSocket.disconnect();
    }
  }, [user]); // token이 변경되면 WebSocket 연결을 재설정

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
