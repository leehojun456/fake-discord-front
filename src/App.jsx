import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import { WebsocketProvider } from "./contexts/WebSocketContext";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// React Query 클라이언트 생성
const queryClient = new QueryClient();

const sessionStoragePersister = createSyncStoragePersister({
  storage: window.sessionStorage,
});

persistQueryClient({
  queryClient,
  persister: sessionStoragePersister,
});

function App() {
  useEffect(() => {
    document.oncontextmenu = function () {
      return false;
    };
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WebsocketProvider>
            <RouterProvider router={router} />
            <div className="h-dvh fixed z-50 top-0 right-0 flex items-end justify-end flex-col pointer-events-none select-none">
              <div className="text-white text-6xl opacity-20">
                Personal learning project.
              </div>
              <div className="text-white text-2xl opacity-20">
                이 프로젝트는 개인 학습 및 포트폴리오 용도로 제작되었습니다.
              </div>
            </div>
          </WebsocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
