import { useEffect, useRef, useState } from "react";
import loginBG from "../assets/loginbackground.svg";
import axios from "../axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import BirthDropDownMenu from "../components/user/BirthDropDownMenu";
import BirthSelector from "../components/user/BirthSelector";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 2);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDate, setBirthDate] = useState(1);

  const [checked, setChecked] = useState(false);
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const nicknameRef = useRef();
  const usernameRef = useRef();
  const dropDownMenuRef = useRef();
  const [nicknameInfo, setNicknameInfo] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
      name: nickname,
      userid: username,
      birthday: `${new Date(
        `${birthYear}-${birthMonth}-${birthDate}`
      ).toISOString()}`,
    };
    await axios.post("/user/register", data).then((res) => {
      if (res.status === 201) {
        alert("회원가입이 완료되었습니다.");
        window.location.replace("/login");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    });
  };

  useEffect(() => {
    setBirthDate(1);
  }, [birthMonth, birthYear]);

  return (
    <>
      <div className="w-dvw h-dvh relative flex justify-center items-center text-white overflow-x-hidden">
        <div className="absolute w-full h-full overflow-hidden -z-10">
          <img
            src={loginBG}
            alt="Background"
            className="fixed w-full h-full object-cover"
            draggable="false"
          />
        </div>
        <div className="bg-zinc-800 flex p-6 rounded-lg shadow-lg w-[480px] select-none">
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">계정 만들기</div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                이메일
                <span className="text-xs text-red-400">*</span>
              </label>
              <input
                type="email"
                className="px-2 h-[44px] bg-zinc-900 w-full border-zinc-700 border-1 rounded-lg transition-all "
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                별명
                <span className="text-xs text-red-400">*</span>
              </label>
              <input
                ref={nicknameRef}
                type="text"
                className="px-2 h-[44px] bg-zinc-900 w-full border-zinc-700 border-1 rounded-lg"
                required
                onChange={(e) => setNickname(e.target.value)}
                onFocus={() => {
                  setNicknameInfo(true);
                }}
                onBlur={() => {
                  setNicknameInfo(false);
                }}
              />
              {nicknameInfo && (
                <div>
                  다른 회원에게 표시되는 이름이에요. 특수 문자와 이모지를 사용할
                  수 있어요.
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                사용자명
                <span className="text-xs text-red-400">*</span>
              </label>
              <input
                type="text"
                className="px-2 h-[44px] bg-zinc-900 w-full border-zinc-700 border-1 rounded-lg transition-all "
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                비밀번호
                <span className="text-xs text-red-400">*</span>
              </label>
              <input
                type="password"
                className="px-2 h-[44px] bg-zinc-900 w-full border-zinc-700 border-1 rounded-lg transition-all"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                생년월일
                <span className="text-xs text-red-400">*</span>
              </label>
              <div className="flex gap-2 h-[44px]">
                <BirthSelector
                  start={1900}
                  end={new Date().getFullYear() - 2}
                  setData={setBirthYear}
                  data={birthYear}
                  format={"년"}
                  reverse={true}
                />
                <BirthSelector
                  start={1}
                  end={12}
                  setData={setBirthMonth}
                  data={birthMonth}
                  format={"월"}
                  reverse={false}
                />
                <BirthSelector
                  start={1}
                  end={
                    new Date(birthYear, birthMonth, 0).getDate() // Get the last date of the month
                  }
                  setData={setBirthDate}
                  data={birthDate}
                  format={"일"}
                  reverse={false}
                />
              </div>
            </div>
            <button
              type="button"
              className="flex gap-2 items-center text-left cursor-pointer"
              onClick={() => {
                setChecked(!checked);
              }}
            >
              {checked ? (
                <div className="min-w-[24px] h-[24px] rounded-md text-center content-center items-center bg-indigo-500">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              ) : (
                <div className="min-w-[24px] h-[24px] border-1 border-zinc-700 rounded-md text-center" />
              )}

              <div className="text-sm text-zinc-300 ">
                (선택사항) Discord 소식, 도움말, 특별 할인을 이메일로
                보내주세요. 언제든지 취소하실 수 있어요
              </div>
            </button>
            <div className="flex flex-col gap-2">
              <button className="flex justify-center items-center bg-indigo-500 rounded-lg h-[44px] w-full cursor-pointer hover:bg-indigo-600 transition-all select-none">
                계속하기
              </button>
              <div className="flex gap-2 text-sm text-zinc-400">
                <Link
                  className="cursor-pointer text-indigo-300 hover:underline"
                  to={"/login"}
                >
                  이미 계정이 있으신가요?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
