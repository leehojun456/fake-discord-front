import { useRef, useState } from "react";
import Wumpus from "../../assets/wumpus1.svg";
import axios from "../../axios";

const FriendsAdd = () => {
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const divRef = useRef(null);
  const divMessageRef = useRef(null);

  const AddFriend = async (e) => {
    e.preventDefault();
    if (inputValue.length === 0) {
      return;
    }
    const id = "2001";

    const body = {
      userId: Number(id),
      friendId: String(inputValue),
    };

    console.log("친구 추가하기 버튼 클릭");
    try {
      await axios.post("http://localhost:3000/friends", body);

      divRef.current.className =
        "focus:outline-none border-1 w-full flex rounded-lg border-green-500";
      divMessageRef.current.className = "text-green-400";
      divMessageRef.current.textContent =
        inputValue + "에게 성공적으로 친구 추가 완료!";
      //   divMessageRef.current.textContent =
      //     inputValue + "에게 성공적으로 친구 요청을 보냈어요.";
    } catch (error) {
      divRef.current.className =
        "focus:outline-none border-1 w-full flex rounded-lg border-red-500";
      divMessageRef.current.className = "text-red-400";
      divMessageRef.current.textContent = error.response.data.message;
    }
  };

  return (
    <>
      <div className="w-full flex relative p-7 flex-col gap-4">
        <div>
          <div className="text-white text-2xl">친구 추가하기</div>
          <div className="text-white text-lg">
            Discord 사용자명을 사용하여 친구를 추가할 수 있어요.
          </div>
        </div>
        <div className="flex text-white relative flex-col gap-2">
          <img src={Wumpus} alt="Wumpus" className="absolute -top-18 right-5" />
          <form
            onSubmit={AddFriend}
            ref={divRef}
            className={`focus:outline-none border-1 w-full flex rounded-lg ${
              focus ? "border-indigo-500" : "border-zinc-900"
            }`}
          >
            <input
              className=" bg-zinc-800 p-4   rounded-l-lg flex items-center gap-2 w-full focus:outline-none"
              placeholder="Discord 사용자명을 사용하여 친구를 추가할 수 있어요."
              autoFocus={true}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="w-fit bg-zinc-800 flex items-center px-2 select-none border-y-1 border-zinc-900 rounded-r-lg border-r-1">
              <button
                type="button"
                className={
                  inputValue.length === 0
                    ? "w-fit bg-indigo-500 rounded-lg whitespace-nowrap p-2 px-4 transition-all select-none saturate-50"
                    : "w-fit bg-indigo-500 rounded-lg whitespace-nowrap p-2 px-4 cursor-pointer hover:saturate-50 transition-all select-none"
                }
                onClick={AddFriend}
                disabled={inputValue.length === 0}
              >
                친구 요청 보내기
              </button>
            </div>
          </form>
          <div ref={divMessageRef} />
        </div>
      </div>
    </>
  );
};

export default FriendsAdd;
