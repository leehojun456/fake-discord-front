import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import DialogLayout from "../../layouts/DialogLayout";
import AvatarImageChange from "../dialog/AvartarImageChange";
import { AuthContext } from "../../contexts/AuthContext";
import BannerImageChange from "../dialog/BannerImageChange";
import axios from "../../axios";
import SettingsPage from "../../pages/SettingsPage";
import CircleProfileWithStatus from "./CircleProfileWithStatus";

const ProfileCard = ({ userId, isEdit, setShowProfileCard }) => {
  const [dialog, setDialog] = useState(false);
  const [user, setUser] = useState(null);
  const {
    user: authUser,
    settingsModal,
    setSettingsModal,
  } = useContext(AuthContext);
  const [dialogComponent, setDialogComponent] = useState(null);
  const handleClick = (component) => {
    setDialogComponent(component);
    setDialog(true);
  };

  useEffect(() => {
    console.log("userId", userId);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-[300px] bg-amber-400 rounded-md p-1">
        <div className="w-full h-full bg-amber-200 rounded-md overflow-hidden">
          <button
            className={`w-full h-[106px] bg-amber-600 ${
              isEdit && "cursor-pointer"
            } overflow-hidden relative`}
            onClick={() => {
              isEdit && handleClick(<BannerImageChange setUser={setUser} />);
            }}
          >
            <img src={user?.banner} />
            {isEdit && (
              <div className="w-full h-full bg-black/20 content-center opacity-0  hover:opacity-100 absolute top-0 left-0">
                <FontAwesomeIcon icon={faPen} />
              </div>
            )}
          </button>
          <div className="relative p-4">
            <button
              className="bg-amber-100 left-2  border-amber-200 -top-10 cursor-pointer absolute rounded-full overflow-hidden"
              onClick={() => {
                isEdit && handleClick(<AvatarImageChange setUser={setUser} />);
              }}
            >
              <CircleProfileWithStatus
                user={user}
                width={"80px"}
                height={"80px"}
              />

              {isEdit && (
                <div className="w-full h-full bg-black/20 content-center opacity-0  hover:opacity-100 absolute top-0 left-0">
                  <FontAwesomeIcon icon={faPen} />
                </div>
              )}
            </button>
            <div className="pt-[50px] text-zinc-900 flex flex-col gap-2">
              <div>
                <div className="text-2xl font-bold">{user?.name}</div>
                <div>
                  <div className="text-sm">{user?.userid}</div>
                </div>
              </div>
              <div>여기에 텍스트 입력</div>
              {user?.id === authUser?.id && (
                <button
                  className="bg-zinc-600 p-1 text-white rounded-md cursor-pointer"
                  onClick={() => {
                    if (user?.id === authUser?.id && !isEdit) {
                      setSettingsModal(!settingsModal);
                      setShowProfileCard(false);
                    }
                  }}
                >
                  {isEdit ? "예시 버튼" : "프로필 편집"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {dialog && (
        <DialogLayout children={dialogComponent} setClose={setDialog} />
      )}
    </>
  );
};

export default ProfileCard;
