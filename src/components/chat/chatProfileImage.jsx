import { Popover } from "react-tiny-popover";
import ProfileCard from "../user/ProfileCard";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../axios";

const ChatProfileImage = ({
  userChat,
  showProfileCard,
  setShowProfileCard,
}) => {
  const portalElement = document.getElementById("root");

  const { data, isLoading, error } = useQuery({
    queryKey: ["avatar", userChat?.userId],
    enabled: !!userChat?.userId,
    refetchOnMount: false,
    queryFn: async () => {
      const response = await axios.get(`/user/${userChat.userId}/avatar`);
      return response;
    },
  });

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
        reposition="true"
      >
        <button
          type="button"
          className={`w-[40px]  min-w-[40px]  rounded-full bg-amber-400 mr-2 cursor-pointer overflow-hidden absolute`}
          onClick={() => {
            console.log("프로필 클릭");
            setShowProfileCard(true);
          }}
        >
          <img src={data?.avatar} />
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
            />,
            portalElement
          )}
        </>
      )}
    </>
  );
};

export default ChatProfileImage;
