import { NavLink, Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import {
  faBold,
  faBolt,
  faCloud,
  faCube,
  faGear,
  faHeadphonesSimple,
  faMicrophone,
  faShop,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useContext, useEffect, useRef, useState } from "react";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";
import PersonalChannels from "../components/sidemenu/PersonalChannels";
import { AuthContext } from "../contexts/AuthContext";
import SettingsPage from "../pages/SettingsPage";
import CircleProfileWithStatus from "../components/user/CircleProfileWithStatus";
import InitLoadingScreen from "../../screen/InitLoadingScreen";
import MyStatusBar from "../components/user/MyStatusBar";
import UserOverlay from "../components/dialog/userOverlay";
import { ModalContext } from "../contexts/ModalContext";

const DefaultLayout = () => {
  const [headerMessage, setHeaderMessage] = useState("");
  const [headerIcon, setHeaderIcon] = useState(faCloud);
  const { settingsModal, setSettingsModal, user, isUserLoading } =
    useContext(AuthContext);
  const [sidebarWidth, setSidebarWidth] = useState(
    JSON.parse(localStorage.getItem("userSettings") || "{}")?.sidebarWidth ??
      340
  ); // 초기 너비
  const isResizing = useRef(false);

  const { userOverlay } = useContext(ModalContext);

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = Math.min(Math.max(e.clientX, 300), 500);
    setSidebarWidth(newWidth - 72);
    // localStorage에 showProfile 값을 저장합니다.
    localStorage.setItem(
      "userSettings",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("userSettings") || "{}"),
        sidebarWidth: newWidth - 72,
      })
    );
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    // localStorage에서 showProfile 값을 가져와서 상태를 설정합니다.
    setSidebarWidth(
      JSON.parse(localStorage.getItem("userSettings") || "{}")?.sidebarWidth ??
        340
    );
  }, []);

  return (
    <>
      {isUserLoading && <InitLoadingScreen />}
      {!isUserLoading && (
        <>
          <HeaderMessageContext.Provider
            value={{ setHeaderMessage, setHeaderIcon }}
          >
            <div className="w-dvw h-dvh flex flex-col bg-zinc-800 select-none">
              <div className="flex min-h-[36px] bg-zinc-800 text-white justify-center items-center text-sm select-none gap-2">
                <FontAwesomeIcon icon={headerIcon} />
                {headerMessage}
              </div>
              <div className="flex w-dvw h-full z-0 overflow-hidden">
                <div className="flex flex-col">
                  <div className="flex flex-1">
                    <SideBar />
                    <div
                      className="flex overflow-hidden relative"
                      style={{ width: sidebarWidth, minWidth: sidebarWidth }}
                    >
                      <div className="flex flex-col w-full rounded-tl-xl border-t-1 border-l-1 border-zinc-700">
                        <div className="border-b-1 p-2 min-h-[50px] border-zinc-700 ">
                          <div className="rounded-lg h-[32px] bg-zinc-700 text-white content-center text-center cursor-pointer">
                            대화 찾기 또는 시작하기
                          </div>
                        </div>
                        <div className="flex flex-col mx-2 py-2 text-zinc-400 border-b-1 border-zinc-700 gap-2">
                          <NavLink
                            to="channels/@me"
                            className={({ isActive }) =>
                              `h-[48px] flex items-center cursor-pointer hover:bg-zinc-700 hover:text-white rounded-lg gap-3 px-2 ${
                                isActive ? "bg-zinc-700 text-white" : ""
                              }`
                            }
                          >
                            <div className="w-[24px] flex justify-center items-center">
                              <FontAwesomeIcon icon={faUser} />
                            </div>
                            친구
                          </NavLink>
                          <NavLink
                            to="library"
                            className={({ isActive }) =>
                              `h-[48px] flex items-center cursor-pointer hover:bg-zinc-700 hover:text-white rounded-lg gap-3 px-2 ${
                                isActive ? "bg-zinc-700 text-white" : ""
                              }`
                            }
                          >
                            <div className="w-[24px] flex justify-center items-center">
                              <FontAwesomeIcon icon={faCube} />
                            </div>
                            라이브러리
                          </NavLink>
                          <NavLink
                            to="nitro"
                            className={({ isActive }) =>
                              `h-[48px] flex items-center cursor-pointer hover:bg-zinc-700 hover:text-white rounded-lg gap-3 px-2 ${
                                isActive ? "bg-zinc-700 text-white" : ""
                              }`
                            }
                          >
                            <div className="w-[24px] flex justify-center items-center">
                              <FontAwesomeIcon icon={faBolt} />
                            </div>
                            Nitro
                          </NavLink>
                          <NavLink
                            to="shop"
                            className={({ isActive }) =>
                              `h-[48px] flex items-center cursor-pointer hover:bg-zinc-700 hover:text-white rounded-lg gap-3 px-2 ${
                                isActive ? "bg-zinc-700 text-white" : ""
                              }`
                            }
                          >
                            <div className="w-[24px] flex justify-center items-center">
                              <FontAwesomeIcon icon={faShop} />
                            </div>
                            상점
                          </NavLink>
                        </div>
                        <PersonalChannels />
                      </div>
                      <div
                        className="absolute h-full hover:bg-white/10 w-1 transition-all cursor-ew-resize right-0 "
                        onMouseDown={handleMouseDown}
                      />
                    </div>
                  </div>
                  <MyStatusBar />
                </div>

                <div className="w-dvw h-full border-t-1 border-zinc-700 flex">
                  <div className="flex-1 flex flex-col bg-zinc-700/30">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </HeaderMessageContext.Provider>
          {settingsModal && (
            <SettingsPage setSettingsModal={setSettingsModal} />
          )}
          {userOverlay && <UserOverlay />}
        </>
      )}
    </>
  );
};

export default DefaultLayout;
