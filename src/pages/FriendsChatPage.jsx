import {
  faBolt,
  faCircleUser,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";
import { WebSocketContext } from "../contexts/WebSocketContext";
import axios from "../axios";
import { AuthContext } from "../contexts/AuthContext";
import { formatDate, formatYYMMDate } from "../utils/dateFormat";
import DataDivider from "../components/chat/dateDivider";
import ChatProfileImage from "../components/chat/chatProfileImage";
import ChatName from "../components/chat/chatName";
import BigProfileCard from "../components/user/BigProfileCard";
import Linkify from "../components/chat/Linkify";

const FriendsChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { setHeaderMessage, setHeaderIcon } = useContext(HeaderMessageContext);
  const socket = useContext(WebSocketContext);
  const { user } = useContext(AuthContext);
  const [chatUsers, setChatUsers] = useState([]);
  const { channelId } = useParams();

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
    const fetchData = async () => {
      const data = await axios.get(
        `/personalchannels/${Number(channelId)}/messages`
      );
      console.log(data);
      setChat(data.data);
    };
    fetchData();
  }, [channelId]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(
        `/personalchannels/${Number(channelId)}/users`
      );
      setChatUsers(data.data);
    };
    fetchData();
  }, [channelId]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    console.log("메시지 전송", message);
    if (message.trim() === "") return;

    console.log("메시지 전송", user);

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
      e.target.reset();
      setMessage("");

      // setChat((prevChat) => {
      //   const newChat = [...prevChat];
      //   const today = new Date().toISOString(); // 날짜 비교를 위한 문자열

      //   const lastChat = newChat[newChat.length - 1];

      //   if (
      //     lastChat &&
      //     lastChat.userId === user.id &&
      //     lastChat.date.slice(0, 16) === today.slice(0, 16)
      //   ) {
      //     lastChat.messages.push({ content: message });
      //   } else {
      //     newChat.push({
      //       userId: user.id,
      //       messages: [{ content: message }],
      //       date: new Date().toISOString(),
      //     });
      //   }

      //   return newChat;
      // });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const { userId, content, date } = data;
      console.log("메시지 수신", data);

      setChat((prevChat) => {
        const newChat = [...prevChat];
        const today = new Date(date).toISOString().slice(0, 16);
        const lastChat = newChat[newChat.length - 1];

        if (
          lastChat &&
          lastChat.userId === userId &&
          lastChat.date.slice(0, 16) === today
        ) {
          lastChat.messages.push({ content });
        } else {
          newChat.push({
            userId,
            messages: [{ content }],
            date: date,
          });
        }

        return newChat;
      });
    };

    socket.on("personalChannelResponse", handleReceiveMessage);

    return () => {
      socket.off("personalChannelResponse", handleReceiveMessage);
    };
  }, [socket]);

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
          <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
          <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
          <FontAwesomeIcon
            icon={faCircleUser}
            className="cursor-pointer"
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
      {/* 채팅창 영역 */}
      <div className="flex flex-1 overflow-hidden select-text">
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-col justify-end basis-full grow-0 overflow-hidden">
            <div className="overflow-y-auto m-1">
              {chat.map((userChat, index) => {
                return (
                  <div key={index} className={`flex flex-col py-2 text-white `}>
                    {/* 날짜가 달라지면 구분선 추가 */}
                    <DataDivider
                      previousDate={formatYYMMDate(chat[index - 1]?.date)}
                      date={formatYYMMDate(userChat.date)}
                    />

                    {userChat.messages.map((message, index) => {
                      return (
                        <div className="flex gap-2 hover:bg-zinc-700 px-2">
                          <ChatProfileImage
                            userChat={userChat}
                            chatUsers={chatUsers}
                            index={index}
                          />
                          <div className="flex flex-col">
                            <div
                              className={`flex gap-2 items-center ${
                                index !== 0 && "hidden"
                              }`}
                            >
                              <ChatName
                                userChat={userChat}
                                chatUsers={chatUsers}
                              />
                              <div className="text-xs text-zinc-400">
                                {formatDate(userChat.date)}
                              </div>
                            </div>
                            <Linkify text={message.content} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <form onSubmit={handleMessageSubmit} className="w-full p-4">
            <input
              className="w-full h-[52px]  rounded-lg bg-zinc-700 px-4 text-white border-1 border-zinc-600 outline-none"
              placeholder={`@${chatUsers[0]?.user.name}에 메시지 보내기`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </form>
        </div>
        {showProfile && <BigProfileCard userId={chatUsers[0]?.user.id} />}
      </div>
    </>
  );
};

export default FriendsChatPage;
