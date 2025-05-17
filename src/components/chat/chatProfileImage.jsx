import { Popover } from "react-tiny-popover";
import ProfileCard from "../user/ProfileCard";
import { useState } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "../../utils/dateFormat";

const ChatProfileImage = ({ userChat, index }) => {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const portalElement = document.getElementById("root");
  return (
    <>
      <Popover
        isOpen={showProfileCard}
        content={
          <ProfileCard
            userId={userChat?.userId}
            setShowProfileCard={setShowProfileCard}
          />
        }
        positions={"right"}
        padding={10}
        boundaryInset={10}
        align="start"
      >
        <button
          type="button"
          className={`w-[40px]  min-w-[40px]  rounded-full bg-amber-400 mr-2 cursor-pointer overflow-hidden ${
            index !== 0 ? "invisible h-[0px]" : "visible h-[40px]"
          }`}
          onClick={() => {
            console.log("프로필 클릭");
            setShowProfileCard(true);
          }}
        >
          <img src={userChat?.avatar} />
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

export default ChatProfileImage;
