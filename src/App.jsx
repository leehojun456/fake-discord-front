import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { AuthProvider } from "./contexts/AuthContext";
import { WebsocketProvider } from "./contexts/WebSocketContext";
function App() {
  return (
    <>
      <AuthProvider>
        <WebsocketProvider>
          <RouterProvider router={router} />
        </WebsocketProvider>
      </AuthProvider>
    </>
  );
}

export default App;
