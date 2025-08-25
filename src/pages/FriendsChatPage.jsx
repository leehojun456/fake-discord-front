import {
  faBell,
  faBolt,
  faBullhorn,
  faCircleUser,
  faClipboardList,
  faComment,
  faDisplay,
  faEllipsis,
  faGamepad,
  faPhoneVolume,
  faThumbTack,
  faUserGroup,
  faVideo,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";
import { WebSocketContext } from "../contexts/WebSocketContext";
import axios from "../axios";
import { AuthContext } from "../contexts/AuthContext";

import BigProfileCard from "../components/user/BigProfileCard";

import { format } from "date-fns";

import ChatInputBox from "../components/chat/ChatInputBox";
import { Virtuoso } from "react-virtuoso";
import Messages from "../components/chat/messages";
import { Popover } from "react-tiny-popover";
import { ModalContext } from "../contexts/ModalContext";
import CircleProfileWithStatus from "../components/user/CircleProfileWithStatus";

const FriendsChatPage = () => {
  const [showProfile, setShowProfile] = useState(
    JSON.parse(localStorage.getItem("userSettings") || "{}")?.showProfile ??
      false
  );
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { setHeaderMessage, setHeaderIcon } = useContext(HeaderMessageContext);
  const socket = useContext(WebSocketContext);
  const { user } = useContext(AuthContext);
  const [chatUsers, setChatUsers] = useState([]);
  const { channelId } = useParams();
  const scrollRef = useRef(null);
  const chatBox = useRef(null);
  const [replyId, setReplyId] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(0);
  const [callStatus, setCallStatus] = useState("idle");
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const { setUserOverlay, setUserOverlayUserId } = useContext(ModalContext);
  const audioRef = useRef(null); // 오디오 인스턴스 저장용

  const handleCallStart = () => {
    socket.emit("call:room:enter", {
      channelId: channelId,
      userId: user.id,
    });
    setCallStatus("waiting");
    playjoinSound().then(() => {
      playRingtone();
    });
  };

  const handleCallEnd = () => {
    setCallStatus("idle");
    stopSound();
  };

  useEffect(() => {
    // 헤더 메시지와 아이콘을 설정합니다.
    setHeaderMessage("다이렉트 메시지");
    setHeaderIcon(faBolt);
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, [channelId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const { userId, content, date } = data;

      setChat((prevChat) => {
        const newChat = [...prevChat];
        const lastChat = newChat[newChat.length - 1];
        const lastChatDate = new Date(
          lastChat.timeGroup.replace("T", " ").replace("Z", "")
        );

        if (
          lastChat &&
          lastChat.userId === userId &&
          format(
            date.replace("T", " ").replace("Z", ""),
            "yyyy-MM-dd HH:mm"
          ) === format(lastChatDate, "yyyy-MM-dd HH:mm")
        ) {
          lastChat.messages.push({ content });
        } else {
          newChat.push({
            userId,
            timeGroup: date,
            messages: [{ content }],
            latestMessage: date,
            avatar: user.avatar,
            name: user.name,
          });
        }

        return newChat;
      });

      setTimeout(() => {
        // 스크롤을 맨 아래로 이동
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          console.log("스크롤 이동");
        }
      }, 10);
    };

    socket.on("personalChannelResponse", handleReceiveMessage);

    return () => {
      socket.off("personalChannelResponse", handleReceiveMessage);
    };
  }, [socket]);

  const handleMessageSubmit = async (e) => {
    console.log(message);
    if (message.trim() === "") return;

    const data = {
      userId: user.id,
      content: message,
      channelId: Number(channelId),
      date: new Date().toISOString(), // ISO 문자열 날짜
    };
    // socket이 null이 아닌지 확인
    if (!socket) {
      console.error("Socket not connected");
      return; // socket이 null이면 함수를 종료합니다.
    }

    try {
      socket.emit("personalChannel", data);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = async (cursor, sort) => {
    console.log("메시지 불러오기 시작", cursor, sort);
    try {
      const response = await axios.get(
        `/personalchannels/${channelId}/messages`,
        {
          params: {
            cursor,
            limit: 40,
            sort: sort || "desc",
          },
        }
      );

      if (response.length === 0) return; // 더 이상 불러올 데이터 없음

      console.log("불러온 메시지 응답", response);

      const messages = response.messages;

      messages.reverse(); // 최신 메시지가 아래로 가도록 반전
      console.log("불러온 메시지", messages);

      setChat((prev) => [...messages, ...prev]);
      setFirstItemIndex(response.totalCount - (chat.length + messages.length));

      setIsLoading(false);
    } catch (error) {
      console.error("메시지 불러오기 실패:", error);
    }
  };

  const fetchUsers = async () => {
    const response = await axios.get(
      `/personalchannels/${Number(channelId)}/users`
    );

    // 내 사용자는 제외
    const filteredUsers = response.filter(
      (player) => player.user.id !== user.id
    );

    console.log("필터링된 사용자", filteredUsers);

    setChatUsers(filteredUsers);
  };

  const playjoinSound = () => {
    return new Promise((resolve, reject) => {
      const audio = new Audio("/assets/join.mp3");
      audio.play().catch(reject);
      audio.addEventListener("ended", resolve);
    });
  };
  const playRingtone = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/ringtone.mp3");
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch((err) => {
      console.warn("벨소리 재생 실패:", err);
    });
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    socket.on("call:room:members", ({ members }) => {
      console.log("현재 방 멤버들", members);
      if (members.length > 0) {
        stopSound();
        //setCallStatus("connected");
      }
    });
  }, []);

  useEffect(() => {
    // 소켓 연결 후 서버에 현재 상태 요청
    socket.emit("call:room:check-exist", {
      channelId: channelId,
    });

    // 서버로부터 응답 받으면 상태 갱신
    socket.on("call:room:exist-result", ({ channelId, exists }) => {
      if (exists) {
        console.log(`${channelId} 방이 열려있음`);
        setCallStatus("connected");
      } else {
        console.log(`${channelId} 방이 존재하지 않음`);
        setCallStatus("idle");
      }
    });
  }, []);

  return (
    <>
      <div className={`${callStatus !== "idle" && "bg-zinc-950"}`}>
        <div
          className={`flex h-[50px] ${
            callStatus === "idle" && "border-b-1 border-zinc-700"
          }  text-white items-center justify-between px-8 py-2 gap-6`}
        >
          <div className="flex items-center h-full">
            <div className="max-w-[24px] max-h-[24px] rounded-full bg-amber-400 mr-2 overflow-hidden">
              <img src={chatUsers[0]?.user.avatar} />
            </div>

            <button
              type="button"
              className="cursor-pointer relative group "
              onClick={() => {
                setUserOverlay(true);
                setUserOverlayUserId(chatUsers[0]?.user.id);
              }}
            >
              <div className="absolute hidden group-hover:block top-8 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-zinc-700 p-1 px-4 text-zinc-300 border-1 border-zinc-600 rounded-md shadow-md relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-700  border-l border-t border-zinc-600  rotate-45"></div>
                  {chatUsers[0]?.user.userid}
                </div>
              </div>
              {chatUsers[0]?.user.name}
            </button>
          </div>
          <div className="flex gap-6">
            {callStatus === "idle" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    handleCallStart();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPhoneVolume}
                    className="cursor-pointer"
                  />
                </button>

                <div>
                  <FontAwesomeIcon icon={faVideo} className="cursor-pointer" />
                </div>
              </>
            )}
            <div>
              <FontAwesomeIcon icon={faThumbTack} className="cursor-pointer" />
            </div>
            <div>
              <FontAwesomeIcon icon={faUserGroup} className="cursor-pointer" />
            </div>
            <button
              type="button"
              className={`${
                callStatus === "idle" && "cursor-pointer"
              } max-xl:hidden`}
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                color={showProfile && callStatus === "idle" ? "white" : "gray"}
                onClick={() => {
                  if (callStatus !== "idle") return;
                  setShowProfile(!showProfile);

                  // localStorage에 showProfile 값을 저장합니다.
                  localStorage.setItem(
                    "userSettings",
                    JSON.stringify({
                      ...JSON.parse(
                        localStorage.getItem("userSettings") || "{}"
                      ),
                      showProfile: !showProfile,
                    })
                  );
                }}
              />
            </button>
          </div>
        </div>
        {callStatus !== "idle" && (
          <div className="h-[260px] p-4 flex items-center justify-center text-white flex-col  gap-6">
            <div className="flex gap-4">
              <CircleProfileWithStatus
                user={user}
                height={"80px"}
                width={"80px"}
              />
              {chatUsers.map((user) => (
                <CircleProfileWithStatus
                  key={user.user.id}
                  user={user.user}
                  height={"80px"}
                  width={"80px"}
                />
              ))}
            </div>
            <div className="h-[50px] flex gap-4">
              <div className="bg-zinc-900 rounded-md">
                <button
                  type="button"
                  className="h-full  px-5 rounded-md cursor-pointer"
                  onClick={() => {
                    handleCallEnd();
                  }}
                >
                  <FontAwesomeIcon icon={faDisplay} />
                </button>
                <button
                  type="button"
                  className="h-full  px-5 rounded-md cursor-pointer"
                  onClick={() => {
                    handleCallEnd();
                  }}
                >
                  <FontAwesomeIcon icon={faGamepad} />
                </button>
                <button
                  type="button"
                  className="h-full  px-5 rounded-md cursor-pointer"
                  onClick={() => {
                    handleCallEnd();
                  }}
                >
                  <FontAwesomeIcon icon={faBullhorn} />
                </button>
                <button
                  type="button"
                  className="h-full px-5 rounded-md cursor-pointer"
                  onClick={() => {
                    handleCallEnd();
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
              </div>
              <button
                type="button"
                className="h-full bg-red-500 px-5 rounded-md cursor-pointer"
                onClick={() => {
                  handleCallEnd();
                }}
              >
                종료
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 채팅창 영역 */}
      <div className="flex overflow-hidden select-text flex-1">
        <div className={`w-full flex flex-col text-zinc-300`} ref={chatBox}>
          {isloading && <div className="w-full h-full" />}
          {!isloading && (
            <Virtuoso
              data={chat}
              ref={scrollRef}
              increaseViewportBy={4}
              defaultItemHeight={30}
              initialTopMostItemIndex={chat.length - 1}
              firstItemIndex={Math.max(0, firstItemIndex)}
              itemContent={(virtualIndex, item) => {
                return (
                  <Messages
                    item={item}
                    virtualIndex={virtualIndex}
                    chat={chat}
                    setChat={setChat}
                    chatBoxRef={chatBox}
                    firstItemIndex={firstItemIndex}
                    isScrolling={isScrolling}
                  />
                );
              }}
              style={{
                overflow: "auto",
                overscrollBehavior: "contain",
              }}
              startReached={() => {
                fetchMessages(chat[0].id, "desc");
              }}
              isScrolling={(scrolling) => setIsScrolling(scrolling)}
            />
          )}

          <div className="w-full p-4">
            {replyId && (
              <button
                type="button"
                className="w-full top-0 left-0  bg-zinc-700 h-[40px] rounded-t-md text-white flex items-center justify-between px-4 cursor-pointer select-none p-2"
              >
                <div>
                  <span>
                    {
                      chat.find((chat) => {
                        chat?.messages.some((msg) => {
                          msg.id === replyId;
                        });
                        return chat;
                      }).name
                    }
                  </span>
                  {" 님에게 답장하는 중"}
                </div>
                <div className="flex gap-4 h-full items-center">
                  <div>@ 켜짐</div>
                  <div className="h-full border-l-1 border-zinc-600" />
                  <button
                    type="button"
                    className="flex justify-center cursor-pointer text-zinc-400 hover:text-white"
                    onClick={() => {
                      setReplyId(false);
                      setMessage("");
                    }}
                  >
                    <FontAwesomeIcon icon={faXmarkCircle} />
                  </button>
                </div>
              </button>
            )}
            <ChatInputBox
              setMessage={setMessage}
              onSubmit={handleMessageSubmit}
              chatUsers={chatUsers}
              message={message}
              chatBox={chatBox}
            />
          </div>
        </div>
        {showProfile && callStatus === "idle" && (
          <BigProfileCard userId={chatUsers[0]?.user.id} />
        )}
      </div>
    </>
  );
};

export default FriendsChatPage;
