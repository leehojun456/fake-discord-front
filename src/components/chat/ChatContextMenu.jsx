import {
  faAngleRight,
  faArrowRight,
  faArrowUpRightFromSquare,
  faComment,
  faCopy,
  faMapPin,
  faPen,
  faThumbTack,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import EmojiMiniPopup from "./EmojiMiniPopup";
import { AuthContext } from "../../contexts/AuthContext";

const ChatContextMenu = ({
  setContextMenu,
  message,
  setIsEdit,
  chatBox,
  setDeleteModal,
  onDelete,
  setReplyId,
}) => {
  const [showEmojiAdd, setShowEmojiAdd] = useState(false);
  const { user } = useContext(AuthContext);

  const firstMenu = [
    {
      name: "반응 추가하기",
      fun: null,
      icon: <FontAwesomeIcon icon={faAngleRight} />,
      pop: true,
    },
  ];

  const secondMenu = [
    message.userId === user.id && {
      name: "메시지 수정하기",
      fun: () => {
        handleEdit();
      },
      icon: <FontAwesomeIcon icon={faPen} />,
    },
    {
      name: "답장",
      fun: () => {
        console.log(message.id);
        setReplyId(message.id);
      },
      icon: <FontAwesomeIcon icon={faComment} />,
    },
    {
      name: "전달",
      fun: null,
      icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} />,
    },
  ].filter(Boolean); // false 값 제거

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
      icon: <FontAwesomeIcon icon={faCopy} />,
    },
    {
      name: "메시지 고정하기",
      fun: null,
      icon: <FontAwesomeIcon icon={faThumbTack} />,
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

  const handleDelete = () => {
    setDeleteModal(true);
  };

  return (
    <>
      <div
        className="w-[220px] flex flex-col bg-zinc-700 p-2 rounded-md border border-zinc-600 shadow-2xl text-white items-start relative z-50 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {firstMenu.map((item, idx) => (
          <Popover
            key={idx}
            isOpen={showEmojiAdd}
            positions={["right", "left"]}
            align="start"
            onClickOutside={() => setShowEmojiAdd(false)}
            content={({ nudgedLeft }) => (
              <>
                <EmojiMiniPopup setShowEmojiAdd={setShowEmojiAdd} />
              </>
            )}
            padding={10}
            boundaryInset={10}
            boundaryElement={chatBox.current}
          >
            <button
              type="button"
              className="cursor-pointer w-full flex justify-between text-zinc-300  text-left hover:bg-zinc-600 rounded-md p-2 hover:text-white"
              onMouseEnter={() => {
                setShowEmojiAdd(false);
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
            onMouseEnter={() => {
              setShowEmojiAdd(false);
            }}
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
            onMouseEnter={() => {
              setShowEmojiAdd(false);
            }}
            onClick={() => {
              item.fun();
              setContextMenu(false);
            }}
          >
            <div className="text-white">{item.name}</div>
            <div>{item.icon}</div>
          </button>
        ))}

        {message.userId === user.id && (
          <>
            <div className="w-full h-[1px] bg-zinc-600 my-2" />
            <button
              type="button"
              className="cursor-pointer w-full flex justify-between text-left bg-zinc-700 hover:bg-red-800/10 rounded-md p-2 hover:text-red-200 text-red-300 "
              onClick={(e) => {
                if (e.shiftKey) {
                  onDelete();
                  return;
                }
                handleDelete();
                setContextMenu(false);
              }}
            >
              <div className="font-bold">메시지 삭제하기</div>
              <div>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ChatContextMenu;
