import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import CircleProfileWithStatus from "./CircleProfileWithStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faHeadphonesSimple,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";

// 로컬 스토리지에서 초기 설정값을 가져오는 함수
const getInitialSetting = (key, defaultValue) => {
  const settings = JSON.parse(localStorage.getItem("userSettings") || "{}");
  return settings[key] ?? defaultValue;
};

// 사용자 상태 표시줄 컴포넌트
const MyStatusBar = () => {
  const { user, settingsModal, setSettingsModal } = useContext(AuthContext);

  const [isMiceOn, setIsMiceOn] = useState(() =>
    getInitialSetting("isMiceOn", true)
  );
  const [isHeadphoneOn, setIsHeadphoneOn] = useState(() =>
    getInitialSetting("isHeadphoneOn", true)
  );

  // 마이크 클릭 핸들러
  const handleMiceClick = () => {
    if (!isMiceOn) {
      // 마이크를 켜려 할 때, 헤드폰이 꺼져있으면 켬
      if (!isHeadphoneOn) setIsHeadphoneOn(true);
      setIsMiceOn(true);
    } else {
      // 마이크를 끄는 건 자유롭게 가능
      setIsMiceOn(false);
    }
  };

  // 헤드폰 클릭 핸들러
  const handleHeadphoneClick = () => {
    if (isHeadphoneOn) {
      // 헤드폰을 끄면 마이크도 같이 꺼짐
      setIsHeadphoneOn(false);
      setIsMiceOn(false);
    } else {
      // 헤드폰을 켜면 마이크도 같이 켜짐
      setIsHeadphoneOn(true);
      setIsMiceOn(true);
    }
  };

  // 로컬 스토리지에 설정 저장
  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem("userSettings") || "{}");
    localStorage.setItem(
      "userSettings",
      JSON.stringify({ ...prev, isMiceOn, isHeadphoneOn })
    );
  }, [isMiceOn, isHeadphoneOn]);

  return (
    <div className="p-2">
      <div className="bottom-2 h-[56px] bg-zinc-700 w-full rounded-lg border border-zinc-600 flex items-center justify-between px-4 gap-2">
        <button
          className="flex items-center gap-3 text-left cursor-pointer hover:bg-zinc-600 w-full rounded-l-full"
          type="button"
        >
          <CircleProfileWithStatus
            width="40px"
            height="40px"
            user={user}
            border="0"
          />
          <div className="flex flex-col text-sm leading-4 w-0 flex-1">
            <div className="text-zinc-200 truncate">{user?.name}</div>
            <div className="text-zinc-300">온라인</div>
          </div>
        </button>

        <div className="flex items-center h-full gap-2 text-white py-3">
          <button
            type="button"
            className={`cursor-pointer flex items-center justify-center rounded-lg p-2 hover:bg-zinc-600 h-full aspect-square ${
              !isMiceOn ? "text-red-400 bg-red-800/10" : ""
            }`}
            onClick={handleMiceClick}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </button>

          <button
            type="button"
            className={`cursor-pointer flex items-center justify-center rounded-lg p-2 hover:bg-zinc-600 h-full aspect-square ${
              !isHeadphoneOn ? "text-red-400 bg-red-800/10" : ""
            }`}
            onClick={handleHeadphoneClick}
          >
            <FontAwesomeIcon icon={faHeadphonesSimple} />
          </button>

          <button
            type="button"
            className="cursor-pointer flex items-center justify-center rounded-lg p-2 hover:bg-zinc-600 h-full aspect-square"
            onClick={() => setSettingsModal(!settingsModal)}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyStatusBar;
