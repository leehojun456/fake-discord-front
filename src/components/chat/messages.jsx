import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { formatDate } from "../../utils/dateFormat";
import ChatName from "./chatName";
import ChatProfileImage from "./chatProfileImage";
import Linkify from "./Linkify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faComments,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import ChatContextMenu from "./ChatContextMenu";
import { Popover } from "react-tiny-popover";
import { createPortal } from "react-dom";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import { set } from "lodash";
import ChatDeleteDialog from "../dialog/chat/ChatDeleteDialog";
import DialogLayout from "../../layouts/DialogLayout";
import { differenceInDays, format } from "date-fns";
import DataDivider from "./dateDivider";
import { ko } from "date-fns/locale";

const Messages = ({ item, index, chat, chatBoxRef }) => {
  const [reactionDialog, setReactionDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showProfileCardName, setShowProfileCardName] = useState(false);
  const parentRef = useRef(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const portalElement = document.getElementById("root");
  const [isEdit, setIsEdit] = useState(false);
  const [editMessage, setEditMessage] = useState(item.content);
  const textareaRef = useRef(null);
  const { channelId } = useParams();
  const [deleteModal, setDeleteModal] = useState(false);
  const [replyId, setReplyId] = useState(false);

  const currentDate = format(item.createdAt, "yyyyMMdd");
  const prevDate =
    index > 0 ? format(chat[index - 1].createdAt, "yyyyMMdd") : null;

  const currentDateTime = format(item.createdAt, "yyyyMMddHHmm");
  const prevDateTime =
    index > 0 ? format(chat[index - 1].createdAt, "yyyyMMddHHmm") : null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setContextMenu(false);
    }
  };

  const handleContextMenuClick = (e) => {
    if (!contextMenu) {
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setContextMenu(true);
    } else {
      setContextMenu(false);
    }
  };

  useEffect(() => {
    if (!contextMenu && !showProfileCard && !showProfileCardName && !isEdit) {
      setReactionDialog(false);
    }
  }, [contextMenu, showProfileCard, showProfileCardName, isEdit]);

  // // 메세지 수정
  const handleMessageSubmit = async (e) => {
    if (editMessage.trim() === "") {
      setDeleteModal(true);
      return;
    }

    console.log("메세지 수정", message);
    const body = {
      content: editMessage,
    };
    // Handle message submission logic here
    await axios.patch(
      `/personalchannels/${channelId}/messages/${message.id}`,
      body
    );
    setIsEdit(false);
  };

  // // 메세지 삭제
  const handleMessageDelete = () => {
    try {
      axios.delete(`/personalchannels/${channelId}/messages/${message.id}`);

      setChat((prevChats) =>
        prevChats.map((userChat) => ({
          ...userChat,
          messages: userChat.messages.filter((msg) => msg.id !== message.id),
        }))
      );

      setDeleteModal(false);
    } catch (error) {
      console.error("메세지 삭제 실패", error);
    }
    // Handle message deletion logic here
    setIsEdit(false);
  };

  // // 메세지 줄 수 계산
  // const getLineCount = (text) => {
  //   return text.split("\n").length;
  // };

  // useLayoutEffect(() => {
  //   if (textareaRef.current === null) return;
  //   const textarea = textareaRef.current;
  //   textarea.style.height = "auto"; // 높이를 초기화
  //   textarea.style.height = `${textarea.scrollHeight}px`; // 새로운 높이 설정
  // }, [editMessage]);

  return (
    <>
      <div className={`${currentDateTime !== prevDateTime && "mt-4"} `}>
        {/*메시지의 날짜가 이전 메시지와 다를 때 날짜 구분선을 표시합니다.*/}
        {currentDate !== prevDate && <DataDivider date={item.createdAt} />}
        <div className="hover:bg-zinc-700">
          {currentDateTime !== prevDateTime && (
            <div className="relative left- top-0 mx-4">
              <ChatProfileImage userChat={item} />
            </div>
          )}
          <div
            className="px-16 relative"
            onMouseEnter={() => setReactionDialog(true)}
            onMouseLeave={() => {
              setReactionDialog(false);
              setContextMenu(false);
            }}
          >
            {/* 메시지의 시간대가 이전 메시지와 다를 때 표시하는 부분 */}
            {currentDateTime !== prevDateTime && (
              <div className="flex">
                <div>{item.name}</div>
                <div className="flex text-xs text-zinc-400">
                  {differenceInDays(new Date(), new Date(item.createdAt)) >=
                  1 ? (
                    <div>
                      {format(item.createdAt, `yyyy-MM-dd a h:mm`, {
                        locale: ko,
                      })}
                    </div>
                  ) : (
                    <div>
                      {format(item.createdAt, `a h:mm`, {
                        locale: ko,
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div>{item.content}</div>
            {reactionDialog && !isEdit && (
              <div className="absolute bg-zinc-700 p-2 rounded-md border-1 border-zinc-600 w-fit right-4 -top-[16px] h-[40px] flex gap-2 shadow-md select-none">
                <button
                  type="button"
                  className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
                  onClick={() => {
                    setReplyId(message.id);
                  }}
                >
                  <FontAwesomeIcon icon={faComments} />
                </button>
                <button
                  type="button"
                  className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </button>
                <button
                  type="button"
                  className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
                  onClick={(e) => {
                    handleContextMenuClick(e);
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
                {contextMenu && (
                  <Popover
                    isOpen={contextMenu}
                    content={({ nudgedLeft, nudgedTop }) => (
                      <>
                        {createPortal(
                          <div
                            className="fixed w-dvw h-dvh top-0 left-0"
                            onClick={handleBackdropClick}
                          />,
                          portalElement
                        )}

                        <ChatContextMenu
                          setContextMenu={setContextMenu}
                          message={item}
                          setIsEdit={setIsEdit}
                          setReplyId={setReplyId}
                          chatBox={chatBoxRef}
                          onDelete={handleMessageDelete}
                          setDeleteModal={setDeleteModal}
                        />
                      </>
                    )}
                    padding={10}
                    boundaryInset={10}
                    positions={["bottom", "right", "left"]}
                    boundaryElement={chatBoxRef.current}
                  >
                    <div
                      className="fixed"
                      style={{
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                      }}
                    />
                  </Popover>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div
        data-id={message.id}
        ref={parentRef}
        className={`flex gap-2 ${
          replyId === message.id
            ? "bg-blue-500/20 border-l-2 border-blue-500"
            : (reactionDialog || isEdit) && "bg-zinc-700"
        } relative ${block && "pointer-events-none"}`}
        onMouseEnter={() => {
          setReactionDialog(true);
        }}
        onMouseLeave={() => {
          setReactionDialog(false);
          setContextMenu(false);
        }}
        onContextMenu={(e) => {
          handleContextMenuClick(e);
        }}
      >
        <div
          className={`w-[40px]  min-w-[40px]  rounded-full bg-amber-400 mx-2 cursor-pointer overflow-hidden ${
            index !== 0 && block === false
              ? "invisible h-[0px]"
              : "visible h-[40px]"
          }`}
        >
          <ChatProfileImage
            userChat={userChat}
            setShowProfileCard={setShowProfileCard}
            showProfileCard={showProfileCard}
          />
        </div>
        <div className="flex flex-col w-full relative">
          <div
            className={`flex gap-2 items-center ${
              index !== 0 && block === false && "hidden"
            }`}
          >
            <ChatName
              userChat={userChat}
              setShowProfileCardName={setShowProfileCardName}
              showProfileCardName={showProfileCardName}
            />
            <div
              className={`text-xs text-zinc-400 ${
                index !== 0 && block === false && "hidden"
              }`}
            >
              {formatDate(userChat.timeGroup)}
            </div>
          </div>
          {!isEdit && <Linkify text={editMessage} id={message.id} />}
          {isEdit && (
            <div className="w-full p-2 flex justify-center flex-col gap-2 h-full">
              <textarea
                ref={textareaRef}
                className="w-full min-h-[52px] h-full rounded-lg bg-zinc-700 px-4 text-white border-1 border-zinc-600 outline-none resize-none py-[14px]"
                value={editMessage}
                rows={getLineCount(editMessage)}
                onChange={(e) => {
                  setEditMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleMessageSubmit(e);
                  }
                }}
              />
              <div className="text-xs">
                {"ESC 키로 "}
                <button
                  type="button"
                  className="text-blue-300 cursor-pointer hover:underline"
                  onClick={() => {
                    setIsEdit(false);
                    setEditMessage(message.content);
                  }}
                >
                  취소
                </button>
                {" • Enter 키로 "}
                <button
                  type="button"
                  className="text-blue-300 cursor-pointer hover:underline"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleMessageSubmit();
                    }
                  }}
                  onClick={() => {
                    handleMessageSubmit();
                  }}
                >
                  전송
                </button>
              </div>
            </div>
          )}
        </div>
        {reactionDialog && !isEdit && (
          <div className="absolute bg-zinc-700 p-2 rounded-md border-1 border-zinc-600 w-fit right-4 -top-[16px] h-[40px] flex gap-2 shadow-md select-none">
            <button
              type="button"
              className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
              onClick={() => {
                setReplyId(message.id);
              }}
            >
              <FontAwesomeIcon icon={faComments} />
            </button>
            <button
              type="button"
              className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </button>
            <button
              type="button"
              className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
              onClick={(e) => {
                handleContextMenuClick(e);
              }}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {contextMenu && (
              <Popover
                isOpen={contextMenu}
                content={({ nudgedLeft, nudgedTop }) => (
                  <>
                    {createPortal(
                      <div
                        className="fixed w-dvw h-dvh top-0 left-0"
                        onClick={handleBackdropClick}
                      />,
                      portalElement
                    )}

                    <ChatContextMenu
                      setContextMenu={setContextMenu}
                      message={message}
                      setIsEdit={setIsEdit}
                      setReplyId={setReplyId}
                      chatBox={chatBox}
                      onDelete={handleMessageDelete}
                      setDeleteModal={setDeleteModal}
                    />
                  </>
                )}
                padding={10}
                boundaryInset={10}
                positions={["bottom", "right", "left"]}
                boundaryElement={chatBox.current}
              >
                <div
                  className="fixed"
                  style={{
                    top: contextMenuPosition.y,
                    left: contextMenuPosition.x,
                  }}
                />
              </Popover>
            )}
          </div>
        )}
      </div>

      {deleteModal &&
        createPortal(
          <DialogLayout
            children={
              <ChatDeleteDialog
                children={
                  <Messages
                    message={message}
                    userChat={userChat}
                    index={index}
                    block={true}
                  />
                }
                onDelete={handleMessageDelete}
              />
            }
            setClose={setDeleteModal}
          />,
          portalElement
        )} */}
    </>
  );
};

export default Messages;
