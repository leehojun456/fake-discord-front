import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { format } from "date-fns";
import DataDivider from "./dateDivider";
import { ko, vi } from "date-fns/locale";
import CircleProfileWithStatus from "../user/CircleProfileWithStatus";
import ProfileCard from "../user/ProfileCard";
import { ModalContext } from "../../contexts/ModalContext";
import UserOverlay from "../dialog/userOverlay";

const Messages = ({
  item,
  virtualIndex,
  chat,
  setChat,
  chatBoxRef,
  firstItemIndex,
  isScrolling,
}) => {
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

  const realIndex = virtualIndex - firstItemIndex;
  const prevItem = chat[realIndex - 1];

  const showDateDivider =
    !prevItem ||
    format(prevItem.createdAt, "yyyy-MM-dd") !==
      format(item.createdAt, "yyyy-MM-dd");

  const showMeta =
    !prevItem ||
    prevItem.user.id !== item.user.id ||
    format(prevItem.createdAt, "yyyy-MM-dd HH:mm") !==
      format(item.createdAt, "yyyy-MM-dd HH:mm");

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

  // 메세지 삭제
  const deleteMessage = async () => {
    try {
      await axios.delete(`/personalchannels/${channelId}/messages/${item.id}`);
      console.log("메세지 삭제 완료", item);
    } catch (error) {
      console.error("메세지 삭제 실패", error);
    }
    // 채팅에서 해당 메세지 제거
    setChat((prevChat) => {
      return prevChat.filter((msg) => msg.id !== item.id);
    });
    setIsEdit(false);
    setDeleteModal(false);
  };

  const handleShiftDelete = () => {
    deleteMessage();
  };

  const handleMessageDelete = (e) => {
    console.log("메세지 삭제 시도", item);

    if (e.shiftKey) {
      handleShiftDelete();
    } else {
      setDeleteModal(true);
    }
  };

  const handleProfileCardClose = () => {
    setShowProfileCard(false);
    setShowProfileCardName(false);
  };

  return (
    <>
      <div className={`${isScrolling && "pointer-events-none"}`}>
        {showDateDivider && <DataDivider date={item.createdAt} />}
        <div
          className="relative"
          onMouseEnter={() => {
            setReactionDialog(true);
          }}
          onMouseLeave={() => {
            setReactionDialog(false);
          }}
        >
          {showMeta && (
            <Popover
              isOpen={showProfileCard}
              content={
                <ProfileCard
                  userId={item.user.id}
                  onClose={handleProfileCardClose}
                />
              }
              positions={"right"}
              padding={10}
              boundaryInset={10}
              align="start"
            >
              <button
                type="button"
                className="cursor-pointer absolute"
                onClick={() => setShowProfileCard(true)}
              >
                <CircleProfileWithStatus
                  user={item.user}
                  height={40}
                  width={40}
                />
              </button>
            </Popover>
          )}

          {/* 이전 문자와 날짜가 다르면 이름과 날짜를 표시 */}
          <div className="pl-[50px] hover:bg-zinc-700">
            {showMeta && (
              <div className="flex items-center gap-2 mt-1">
                <Popover
                  isOpen={showProfileCardName}
                  content={
                    <ProfileCard
                      userId={item.user.id}
                      onClose={handleProfileCardClose}
                    />
                  }
                  positions={"right"}
                  padding={10}
                  boundaryInset={10}
                  align="start"
                >
                  <button
                    type="button"
                    className=" cursor-pointer hover:underline"
                    onClick={() => setShowProfileCardName(true)}
                  >
                    {item.user.name}
                  </button>
                </Popover>
                <div className="text-xs text-zinc-500 cursor-default relative group">
                  {format(item.createdAt, `yyyy-MM-dd a h:mm`, {
                    locale: ko,
                  })}
                  <div className="absolute hidden group-hover:block top-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-zinc-700 p-1 px-4 text-zinc-300 border-1 border-zinc-600 rounded-md shadow-md relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-700  border-l border-t border-zinc-600  rotate-45" />
                      <div className="whitespace-nowrap text-sm">
                        {format(
                          item.createdAt,
                          `yyyy년 MM월 dd일 EEEE a h:mm`,
                          {
                            locale: ko,
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div>{item.content}</div>
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
      {(showProfileCardName || showProfileCard) && (
        <>
          {createPortal(
            <div
              className="w-dvw h-dvh absolute top-0 left-0"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  handleProfileCardClose();
                }
              }}
            ></div>,
            portalElement
          )}
        </>
      )}
      {deleteModal &&
        createPortal(
          <DialogLayout
            children={
              <ChatDeleteDialog
                children={
                  <div>
                    <div className="flex items-center gap-2">
                      <CircleProfileWithStatus
                        user={item.user}
                        height={40}
                        width={40}
                      />
                      <div>
                        <div className="flex gap-2 items-center">
                          <div>{item.user.name}</div>
                          <div className="text-sm text-zinc-500">
                            {format(item.createdAt, `yyyy-MM-dd a h:mm`, {
                              locale: ko,
                            })}
                          </div>
                        </div>
                        <div>{item.content}</div>
                      </div>
                    </div>
                  </div>
                }
                onDelete={deleteMessage}
              />
            }
            setClose={setDeleteModal}
          />,
          portalElement
        )}
    </>
  );
};

export default Messages;
