import {
  faBolt,
  faCircleUser,
  faComment,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";
import { WebSocketContext } from "../contexts/WebSocketContext";
import axios from "../axios";
import { AuthContext } from "../contexts/AuthContext";
import { formatYYMMDate } from "../utils/dateFormat";
import DataDivider from "../components/chat/dateDivider";
import BigProfileCard from "../components/user/BigProfileCard";
import Messages from "../components/chat/messages";
import { format } from "date-fns";

import ChatInputBox from "../components/chat/ChatInputBox";
import { Virtuoso } from "react-virtuoso";

const FriendsChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
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

  useEffect(() => {
    // 헤더 메시지와 아이콘을 설정합니다.
    setHeaderMessage("다이렉트 메시지");
    setHeaderIcon(faBolt);

    // localStorage에서 showProfile 값을 가져와서 상태를 설정합니다.
    setShowProfile(
      JSON.parse(localStorage.getItem("userSettings") || "{}")?.showProfile ??
        false
    );
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
    console.log("fetchMessages", cursor, sort);
    try {
      const response = await axios.get(
        `/personalchannels/${channelId}/messages`,
        {
          params: {
            cursor,
            limit: 10,
            sort: sort || "desc",
          },
        }
      );

      if (response.length === 0) return; // 더 이상 불러올 데이터 없음

      response.reverse(); // 최신 메시지가 아래로 가도록 반전

      setChat((prev) => [...response, ...prev]);
      setIsLoading(false);
      setTimeout(() => {
        // 스크롤을 맨 아래로 이동
        if (scrollRef.current) {
          scrollRef.current.scrollToIndex({
            index: 0,
            align,
            behavior,
          });
        }
      }, 100);
    } catch (error) {
      console.error("메시지 불러오기 실패:", error);
    }
  };

  const fetchUsers = async () => {
    const response = await axios.get(
      `/personalchannels/${Number(channelId)}/users`
    );
    setChatUsers(response);
  };

  return (
    <>
      <div className="flex h-full max-h-[50px] border-b-1 border-zinc-700 text-white items-center justify-between px-8 py-2 gap-6">
        <div className="flex items-center h-full">
          <div className="max-w-[24px] max-h-[24px] rounded-full bg-amber-400 mr-2 cursor-pointer overflow-hidden">
            <img src={chatUsers[0]?.user.avatar} />
          </div>
          <div>{chatUsers[0]?.user.name}</div>
        </div>
        <div className="flex gap-6">
          <div>
            <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
          </div>
          <div>
            <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
          </div>
          <div className="cursor-pointer max-xl:hidden">
            <FontAwesomeIcon
              icon={faCircleUser}
              color={showProfile ? "white" : "gray"}
              onClick={() => {
                setShowProfile(!showProfile);

                // localStorage에 showProfile 값을 저장합니다.
                localStorage.setItem(
                  "userSettings",
                  JSON.stringify({
                    ...JSON.parse(localStorage.getItem("userSettings") || "{}"),
                    showProfile: !showProfile,
                  })
                );
              }}
            />
          </div>
        </div>
      </div>
      {/* 채팅창 영역 */}
      <div className="flex flex-1 overflow-hidden select-text">
        <div className="w-full flex flex-col" ref={chatBox}>
          {isloading && <div className="w-full h-full" />}

          <Virtuoso
            data={chat}
            ref={scrollRef}
            increaseViewportBy={5}
            itemContent={(index, userChat) => {
              return (
                <div
                  key={index}
                  data-id={userChat.latestMessage}
                  className={`flex flex-col py-2 text-white ${
                    isScrolling && "pointer-events-none"
                  }`}
                >
                  {/* 날짜가 달라지면 구분선 추가 */}
                  <DataDivider
                    previousDate={formatYYMMDate(chat[index - 1]?.timeGroup)}
                    date={formatYYMMDate(userChat.timeGroup)}
                  />

                  {userChat.messages.map((message, idx) => (
                    <Messages
                      message={message}
                      userChat={userChat}
                      key={message.id || idx}
                      index={idx}
                      chatBox={chatBox}
                      block={false}
                      setMessage={setMessage}
                      setChat={setChat}
                      setReplyId={setReplyId}
                      replyId={replyId}
                    />
                  ))}
                </div>
              );
            }}
            style={{ height: "100%", overflow: "auto", margin: "4px" }}
            alignToBottom
            followOutput={true}
            isScrolling={(scrolling) => setIsScrolling(scrolling)}
          />

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
        {showProfile && <BigProfileCard userId={chatUsers[0]?.user.id} />}
      </div>
    </>
  );
};

export default FriendsChatPage;
