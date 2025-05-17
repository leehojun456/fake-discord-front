import { useContext, useEffect, useState } from "react";
import SubMenu from "./SubMenu";
import DialogLayout from "../../layouts/DialogLayout";
import PhoneAuth from "../dialog/PhoneAuth";
import { AuthContext } from "../../contexts/AuthContext";
import { emailHide } from "../../utils/hideFormat";
import CircleProfileWithStatus from "../user/CircleProfileWithStatus";

const MyAccount = ({ setSettingSelected }) => {
  const [selected, setSelected] = useState(0);

  const userSettingList = [{ title: "보안" }, { title: "상태" }];
  const [dialog, setDialog] = useState(false);
  const [component, setComponent] = useState(null);
  const { user } = useContext(AuthContext);
  const [showEmail, setShowEmail] = useState(true);

  const handlePhoneChange = () => {
    setComponent(<PhoneAuth />);
    setDialog(true);
  };

  return (
    <>
      <SubMenu
        menu={userSettingList}
        setSelected={setSelected}
        selected={selected}
      />
      <div className="w-[660px] bg-zinc-800 rounded-md overflow-hidden">
        <div className="h-[100px] bg-amber-500 overflow-hidden">
          <img src={user?.banner} />
        </div>
        <div className="p-4">
          <div className="flex gap-4 relative h-[60px]">
            <CircleProfileWithStatus
              user={user}
              width={"80px"}
              height={"80px"}
              position={"absolute"}
            />
            <div className="pl-[100px] flex justify-between  w-full">
              <div className="text-2xl text-white">{user?.name}</div>
              <button
                type="button"
                className="cursor-pointer bg-indigo-500 text-white h-fit px-4 py-1 rounded-md"
                onClick={() => {
                  setSettingSelected(1);
                }}
              >
                사용자 프로필 편집
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-zinc-700/30 rounded-md p-3 flex flex-col gap-8 select-none">
            <div className="flex justify-between text-white items-center">
              <div>
                <div>별명</div>
                <div>{user?.name}</div>
              </div>
              <button
                type="button"
                className="bg-zinc-700 px-4 py-1 rounded-md h-fit cursor-pointer"
              >
                수정
              </button>
            </div>
            <div className="flex justify-between text-white items-center">
              <div>
                <div>사용자명</div>
                <div>{user?.userid}</div>
              </div>
              <button
                type="button"
                className="bg-zinc-700 px-4 py-1 rounded-md h-fit cursor-pointer"
              >
                수정
              </button>
            </div>
            <div className="flex justify-between text-white items-center">
              <div>
                <div>이메일</div>
                <div className="flex gap-2">
                  <div>{emailHide(user?.email, showEmail)}</div>
                  <button
                    type="button"
                    className="text-indigo-300  cursor-pointer"
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    {showEmail ? "보이기" : "숨기기"}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="bg-zinc-700 px-4 py-1 rounded-md h-fit cursor-pointer"
              >
                수정
              </button>
            </div>
            <div className="flex justify-between text-white items-center">
              <div>
                <div>전화번호</div>
                <div>{user?.phone || "전화번호를 추가해주세요"}</div>
              </div>
              <button
                type="button"
                className="bg-zinc-700 px-4 py-1 rounded-md h-fit cursor-pointer"
                onClick={handlePhoneChange}
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
      {dialog && <DialogLayout setClose={setDialog} children={component} />}
    </>
  );
};

export default MyAccount;
