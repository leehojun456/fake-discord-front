import { Link } from "react-router-dom";

const LandingPage = () => {
  const Menu = [
    { name: "다운로드", path: "/download" },
    { name: "Nitro", path: "/support" },
    { name: "찾기", path: "/blog" },
    { name: "보안센터", path: "/careers" },
    { name: "퀘스트", path: "/community" },
    { name: "지원", path: "/community" },
    { name: "블로그", path: "/community" },
    { name: "개발자", path: "/community" },
    { name: "인재채용", path: "/community" },
  ];
  return (
    <div
      style={{
        background:
          "linear-gradient(153deg,rgba(0, 0, 0, 1) 0%, rgba(23, 26, 116, 1) 30%, rgba(57, 67, 192, 1) 62%, rgba(57, 67, 192, 1) 100%",
      }}
      className="bg-gradient-to-r from-red-500  via-red-500 to-pink-500 h-dvh fixed w-dvw text-white"
    >
      <div className="flex w-full h-[120px] px-10 py-10 justify-center">
        <ul className="flex items-center gap-10">
          {Menu.map((item) => (
            <li>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full h-[120px] px-10 py-10 justify-between fixed top-0">
        <Link className="font-extrabold text-2xl" to="/">
          FAKECORD
        </Link>

        <Link
          to={"/login"}
          className="bg-white text-indigo-950 px-4 py-2 rounded-2xl font-bold"
        >
          Fakecord 열기
        </Link>
      </div>
      <div className="p-20 m-auto max-w-[1320px]">
        <div className="w-[496px]">
          <div className="text-6xl font-bold my-4">
            재미와 게임으로 가득한 그룹채팅
          </div>
          <div className="text-xl">
            Fakecord는 친구들과 게임을 플레이하며 놀거나 글로벌 커뮤니티를
            만들기에 좋습니다. 나만의 공간을 만들어 대화하고, 게임을 플레이하며,
            어울려 보세요.
          </div>
        </div>
        <div className="flex justify-center my-[300px] gap-4 h-[60px]">
          <button
            type="button"
            className="bg-white text-indigo-950 px-4 text-xl rounded-xl"
          >
            Windows용 다운로드
          </button>
          <Link
            to={"/login"}
            type="button"
            className="bg-indigo-500 text-white px-4 text-xl rounded-xl content-center"
          >
            웹브라우저에서 Discord 열기
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
