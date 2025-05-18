import { Popover } from "react-tiny-popover";
import ProfileCard from "../user/ProfileCard";
import { useState } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "../../utils/dateFormat";

const ChatName = ({
  userChat,
  showProfileCardName,
  setShowProfileCardName,
}) => {
  const portalElement = document.getElementById("root");

  return (
    <>
      <Popover
        isOpen={showProfileCardName}
        content={<ProfileCard userId={userChat.userId} />}
        positions={"right"}
        padding={10}
        boundaryInset={10}
        align="start"
      >
        <button
          type="button"
          className="cursor-pointer hover:underline"
          onClick={() => {
            console.log("프로필 클릭");
            setShowProfileCardName(true);
          }}
        >
          {userChat?.name}
        </button>
      </Popover>
      {showProfileCardName && (
        <>
          {createPortal(
            <div
              className="w-dvw h-dvh absolute top-0 left-0"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setShowProfileCardName(false);
                }
              }}
            ></div>,
            portalElement
          )}
        </>
      )}
    </>
  );
};

export default ChatName;
