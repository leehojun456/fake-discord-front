import { Link, useNavigate } from "react-router-dom";
import loginBG from "../assets/loginbackground.svg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  // 로그인 버튼 클릭 시, accessToken을 localStorage에 저장하고 채널 페이지로 이동
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 버튼 클릭");
    try {
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log(response);
      const token = response.data.accessToken;
      localStorage.setItem("accessToken", token);
      setUser(response);
    } catch (error) {
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    navigate("/channels/@me", { replace: true });
  };

  // 로그인 페이지에 접근했을 때, accessToken이 있으면 채널 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/channels/@me", { replace: true });
    }
  }, []);

  return (
    <>
      <div className="w-dvw h-dvh relative flex justify-center items-center text-white">
        <img
          src={loginBG}
          alt="Background"
          className="absolute w-full h-full object-cover -z-10"
          draggable="false"
        />
        <div className="bg-zinc-800 flex p-6 rounded-lg shadow-lg">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">돌아오신 것을 환영해요!</div>
              <div className="text-zinc-300">다시 만나다니 너무 반가워요!</div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                이메일 또는 전화번호
                <span className="text-xs text-red-400">*</span>
              </label>
              <input
                type="email"
                className="px-2 h-[44px] bg-zinc-900 w-[414px] border-zinc-700 border-1 rounded-lg transition-all "
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="flex gap-1 text-zinc-200 text-sm">
                비밀번호
                <span className="text-xs text-red-400">*</span>
              </label>
              <input
                type="password"
                className="px-2 h-[44px] bg-zinc-900 w-[414px] border-zinc-700 border-1 rounded-lg transition-all"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="cursor-pointer text-sm text-indigo-300 w-fit hover:underline">
                비밀번호를 잊으셧나요?
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="flex justify-center items-center bg-indigo-500 rounded-lg h-[44px] w-[414px] cursor-pointer hover:bg-indigo-600 transition-all select-none">
                로그인
              </button>
              <div className="flex gap-2 text-sm text-zinc-400">
                <div>계정이 필요한가요?</div>
                <Link
                  className="cursor-pointer text-indigo-300 hover:underline"
                  to="/register"
                >
                  가입하기
                </Link>
              </div>
            </div>
          </form>
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">QR 코드로 로그인</div>
            <div>Discord 모바일 앱으로 스캔해 바로 로그인 하세요.</div>
            <div>또는, 패스키로 로그인하세요</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
