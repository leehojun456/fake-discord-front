import { faBolt, faComment, faGift } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nitroBG from "../assets/nitrobackground.svg";
import nitro from "../assets/nitro.svg";
import { useContext, useEffect } from "react";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";

const NitroPage = () => {
  const { setHeaderMessage, setHeaderIcon } = useContext(HeaderMessageContext);
  useEffect(() => {
    setHeaderMessage("Nitro");
    setHeaderIcon(faBolt);
  }, []);
  return (
    <>
      <div className="flex flex-col h-full w-full bg-zinc-700/30">
        <div className="flex min-h-[50px] border-b-1 border-zinc-700 text-white items-center justify-between px-8 py-2 gap-6">
          <div className="flex gap-6 items-center h-full">
            <div className="flex gap-2 justify-center items-center">
              <FontAwesomeIcon icon={faBolt} />
              Nitro
            </div>
          </div>

          <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
        </div>
        <div className="relative w-full h-full flex justify-center">
          <img
            src={nitroBG}
            alt="Nitro"
            className="w-full h-auto object-cover absolute z-0"
          />
          <div className="flex flex-col items-center p-28 select-none">
            <div className="text-white font-black text-4xl  z-10">
              Welcome to Your Nitro Home
            </div>
            <div className="flex gap-2 items-center text-white p-2 shadow-xl rounded-lg m-4 backdrop-blur-sm brightness-125 cursor-pointer transition-all hover:bg-zinc-700/20 active:bg-zinc-700/30 z-10">
              <FontAwesomeIcon icon={faGift} />
              <div>Nitro를 선물하세요</div>
            </div>
            <div className="flex w-[840px] z-10 bg-black/20 text-white backdrop p-8 rounded-lg backdrop-blur-sm gap-8">
              <img src={nitro} alt="Nitro" className="w-[120px] h-[120px]" />
              <div className="flex flex-col gap-4">
                <div className="text-4xl font-bold">친구와 Nitro 공유하기</div>
                <div className="text-lg">
                  무제한으로 Discord를 이용할 수 있는 2주 체험권을 최대 3명의
                  친구들과 공유하세요!
                </div>
                <div className="h-[40px] flex justify-center items-center bg-purple-500 rounded-lg text-white cursor-pointer hover:bg-purple-500/80 active:bg-purple-500/60">
                  친구 선택하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NitroPage;
