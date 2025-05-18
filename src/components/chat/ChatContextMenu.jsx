import { faAngleRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { set } from "lodash";
import { useState } from "react";
import { Popover } from "react-tiny-popover";
import EmojiMiniPopup from "./EmojiMiniPopup";

const ChatContextMenu = ({ setContextMenu, message, setIsEdit }) => {
  const [showEmojiAdd, setShowEmojiAdd] = useState(false);

  const firstMenu = [
    {
      name: "반응 추가하기",
      fun: null,
      icon: <FontAwesomeIcon icon={faAngleRight} />,
      pop: true,
    },
  ];

  const secondMenu = [
    {
      name: "메시지 수정하기",
      fun: () => {
        handleEdit();
      },
      icon: <FontAwesomeIcon icon={faAngleRight} />,
    },
    {
      name: "답장",
      fun: null,
      icon: <FontAwesomeIcon icon={faAngleRight} />,
    },
    {
      name: "전달",
      fun: null,
      icon: <FontAwesomeIcon icon={faAngleRight} />,
    },
  ];

  const thirdMenu = [
    {
      name: "텍스트 복사하기",
      fun: () => {
        navigator.clipboard
          .writeText(message.content)
          .then(() => {})
          .catch((err) => {
            alert("복사에 실패했습니다: " + err);
          });
      },
      icon: <FontAwesomeIcon icon={faAngleRight} />,
    },
    {
      name: "메시지 고정하기",
      fun: null,
      icon: <FontAwesomeIcon icon={faAngleRight} />,
    },
    {
      name: "앱",
      fun: null,
      icon: <FontAwesomeIcon icon={faAngleRight} />,
    },
  ];

  const handleEdit = () => {
    console.log("메시지 수정하기 클릭");
    setIsEdit(true);
  };

  return (
    <>
      <div
        className="w-[220px] flex flex-col bg-zinc-700 p-2 rounded-md border border-zinc-600 shadow-2xl text-white items-start relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {firstMenu.map((item, idx) => (
          <Popover
            isOpen={showEmojiAdd}
            positions={["right"]}
            align="start"
            onClickOutside={() => setShowEmojiAdd(false)}
            content={<EmojiMiniPopup />}
            padding={10}
            boundaryInset={10}
          >
            <button
              key={idx}
              type="button"
              className="cursor-pointer w-full flex justify-between text-zinc-300  text-left hover:bg-zinc-600 rounded-md p-2 hover:text-white"
              onMouseEnter={() => {
                if (item.pop) {
                  setShowEmojiAdd(true);
                }
              }}
              onClick={() => {
                item.fun();
                setContextMenu(false);
              }}
            >
              <div className="text-white">{item.name}</div>
              <div>{item.icon}</div>
            </button>
          </Popover>
        ))}
        <div className="w-full h-[1px] bg-zinc-600 my-2" />
        {secondMenu.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="cursor-pointer w-full flex justify-between text-zinc-300  text-left hover:bg-zinc-600 rounded-md p-2 hover:text-white"
            onClick={() => {
              item.fun();
              setContextMenu(false);
            }}
          >
            <div className="text-white">{item.name}</div>
            <div>{item.icon}</div>
          </button>
        ))}
        <div className="w-full h-[1px] bg-zinc-600 my-2" />
        {thirdMenu.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="cursor-pointer w-full flex justify-between text-zinc-300  text-left hover:bg-zinc-600 rounded-md p-2 hover:text-white"
            onClick={() => {
              item.fun();
              setContextMenu(false);
            }}
          >
            <div className="text-white">{item.name}</div>
            <div>{item.icon}</div>
          </button>
        ))}
      </div>
    </>
  );
};

export default ChatContextMenu;
