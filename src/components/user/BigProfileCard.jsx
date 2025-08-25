import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import CircleProfileWithStatus from "./CircleProfileWithStatus";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ModalContext } from "../../contexts/ModalContext";

const BigProfileCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userOverlay, setUserOverlay, setUserOverlayUserId } =
    useContext(ModalContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleShowProfilePopup = () => {
    setUserOverlay(true);
    setUserOverlayUserId(userId);
  };

  return (
    <div className="min-w-[340px] flex-col justify-between bg-zinc-700 flex max-xl:hidden">
      {!isLoading && (
        <>
          <div className="relative">
            <img src={user?.banner} className="w-full h-[120px] object-cover" />
            <div className="p-4 relative">
              <button
                type="button"
                className="absolute -top-[50px] cursor-pointer"
                onClick={handleShowProfilePopup}
              >
                <CircleProfileWithStatus
                  user={user}
                  width={"80px"}
                  height={"80px"}
                />
              </button>
              <div className="pt-[30px] flex flex-col gap-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="text-white text-2xl cursor-pointer hover:underline w-fit"
                    onClick={handleShowProfilePopup}
                  >
                    {user?.name}
                  </button>
                  <button
                    type="button"
                    className="text-white cursor-pointer hover:underline w-fit"
                    onClick={handleShowProfilePopup}
                  >
                    {user?.userid}
                  </button>
                </div>
                <div className="bg-zinc-600/75 text-white p-2 rounded-md">
                  <div>가입시기</div>
                  <div>
                    {format(user?.createdAt, "PPP", {
                      locale: ko,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="w-[374px] h-[44px] border-t-1 text-zinc-300 border-zinc-600 cursor-pointer"
            onClick={handleShowProfilePopup}
          >
            전체 프로필 보기
          </button>
        </>
      )}
    </div>
  );
};

export default BigProfileCard;
