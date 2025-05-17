import { Popover } from "react-tiny-popover";
import ProfileCard from "../user/ProfileCard";
import { useState } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "../../utils/dateFormat";

const ChatName = ({ userChat }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const portalElement = document.getElementById("root");

  return (
    <>
      <Popover
        isOpen={showProfileCard}
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
            setShowProfileCard(true);
          }}
        >
          {userChat?.name}
        </button>
      </Popover>
      {showProfileCard && (
        <>
          {createPortal(
            <div
              className="w-dvw h-dvh absolute top-0 left-0"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setShowProfileCard(false);
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
