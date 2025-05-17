import { useContext, useState } from "react";
import SubMenu from "./SubMenu";
import ProfileCard from "../user/ProfileCard";
import { AuthContext } from "../../contexts/AuthContext";

const Profile = () => {
  const profileSettingList = [
    { title: "메인 프로필" },
    { title: "서버별 프로필" },
  ];
  const [selected, setSelected] = useState(0);
  const { user } = useContext(AuthContext);
  return (
    <>
      <SubMenu
        menu={profileSettingList}
        setSelected={setSelected}
        selected={selected}
      />
      <div className="flex gap-6 max-xl:flex-col">
        <div className="flex flex-col gap-6 w-full">
          <div className="text-white gap-2 flex flex-col">
            <div>별명</div>
            <input
              className="bg-zinc-800 h-[44px] rounded-md border-1 border-zinc-700 p-2 text-zinc-300"
              defaultValue={user?.name}
              placeholder={user?.userid}
            />
          </div>
          <div className="border-b-1 border-zinc-700" />
          <div className="w-full text-white gap-2 flex flex-col">
            <div>대명사</div>
            <input
              className="bg-zinc-800 h-[44px] rounded-md border-1 border-zinc-700 p-2 text-zinc-300"
              placeholder="대명사를 추가해보세요"
            />
          </div>
          <div className="border-b-1 border-zinc-700" />
          <div className="w-full text-white gap-2 flex flex-col">
            <div>아바타</div>
            <div className="text-sm text-zinc-300">
              이제 최대 6개의{" "}
              <span className="text-blue-400 cursor-pointer">최신 아바타</span>
              에 액세스할 수 있어요
            </div>
          </div>
        </div>

        <div className="w-full flex">
          <div className="w-full text-white gap-2 flex flex-col">
            <ProfileCard userId={user.id} isEdit={true} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
