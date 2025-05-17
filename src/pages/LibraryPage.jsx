import {
  faBolt,
  faComment,
  faCube,
  faMagnifyingGlass,
  faShop,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";

const LibraryPage = () => {
  const { setHeaderMessage, setHeaderIcon } = useContext(HeaderMessageContext);
  useEffect(() => {
    setHeaderMessage("라이브러리");
    setHeaderIcon(faCube);
  }, []);
  return (
    <>
      <div className="flex flex-col h-full w-full bg-zinc-700/30">
        <div className="flex min-h-[50px] border-b-1 border-zinc-700 text-white items-center justify-between px-8 py-2 gap-6">
          <div className="flex gap-4 items-center h-full">
            <div className="flex gap-2 justify-center items-center">
              <FontAwesomeIcon icon={faCube} />
              라이브러리
            </div>
            <div className="h-[4px] w-[4px] bg-zinc-700 rounded-full" />
            <div className="flex gap-2 justify-center items-center">
              내 게임
            </div>
            <div className="flex gap-2 justify-center items-center">설정</div>
          </div>

          <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default LibraryPage;
