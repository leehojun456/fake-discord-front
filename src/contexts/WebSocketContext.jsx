import React, { useContext, useEffect, useState, createContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext"; // AuthContext를 임포트

export const WebSocketContext = createContext(null);

export const WebsocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // AuthContext에서 token을 가져옴
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (user) {
      const newSocket = io("https://fakecord.kr", {
        path: "/ws", // 필요 시 사용
        auth: { token },
        transports: ["websocket"], // 강제로 WebSocket 사용
      });

      newSocket.on("connect", () => {
        console.log("✅ WebSocket connected:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ Connection error:", err.message);
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
