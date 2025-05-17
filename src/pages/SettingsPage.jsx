import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import MyAccount from "../components/settings/MyAccount";
import Profile from "../components/settings/Profile";
import SettingLayout from "../layouts/SettingLayout";
import axios from "../axios";

const SettingsPage = ({ setSettingsModal }) => {
  const portalElement = document.getElementById("root");
  const [selected, setSelected] = useState(0);

  const userSettingList = [
    {
      name: "내 계정",
      icon: null,
      page: <MyAccount setSettingSelected={setSelected} />,
    },
    { name: "프로필", icon: null, page: <Profile /> },
    { name: "콘텐츠 및 소설", icon: null },
    { name: "데이터 및 개인정보", icon: null },
    { name: "가족 센터", icon: null },
    { name: "승인한 앱", icon: null },
    { name: "기기", icon: null },
    { name: "연결", icon: null },
    { name: "클립", icon: null },
  ];

  const handleClose = () => {
    setSettingsModal(false);
    console.log("close");
  };

  return (
    <>
      {createPortal(
        <div className="flex w-dvw h-dvh absolute top-0 left-0 bg-zinc-800">
          <div className="bg-zinc-800 max-w-1/2 w-full flex justify-end">
            <div className="flex flex-col gap-2 px-[20px] py-[60px] w-[264px] select-none">
              <div className="text-zinc-400 text-sm">사용자 설정</div>
              {userSettingList.map((setting, index) => (
                <button
                  key={index}
                  type="button"
                  className={` cursor-pointer text-left p-1 rounded-md ${
                    selected === index
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-300"
                  }`}
                  onClick={() => {
                    setSelected(index);
                    console.log(setting.name);
                  }}
                >
                  {setting.name}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-zinc-700/30 w-full flex px-[40px] py-[60px]">
            <div className="w-full max-w-[740px]">
              <SettingLayout
                title={userSettingList[selected].name}
                component={userSettingList[selected].page}
              />
            </div>

            <button
              type="button"
              className="text-white text-center cursor-pointer h-fit"
              onClick={handleClose}
            >
              <FontAwesomeIcon icon={faCircleXmark} size="2xl" />
              <div>닫기</div>
            </button>
          </div>
        </div>,
        portalElement
      )}
    </>
  );
};

export default SettingsPage;
