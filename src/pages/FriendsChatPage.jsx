import {
  faBolt,
  faCircleUser,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { HeaderMessageContext } from "../contexts/HeaderMessageContext";
import { WebSocketContext } from "../contexts/WebSocketContext";
import axios from "../axios";
import { AuthContext } from "../contexts/AuthContext";
import { formatYYMMDate } from "../utils/dateFormat";
import DataDivider from "../components/chat/dateDivider";
import BigProfileCard from "../components/user/BigProfileCard";
import Messages from "../components/chat/messages";

const FriendsChatPage = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { setHeaderMessage, setHeaderIcon } = useContext(HeaderMessageContext);
  const socket = useContext(WebSocketContext);
  const { user } = useContext(AuthContext);
  const [chatUsers, setChatUsers] = useState([]);
  const { channelId } = useParams();
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);
  const [isScroll, setIsScroll] = useState(false);
  const chatBox = useRef(null);

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
      const response = await axios.get(
        `/personalchannels/${Number(channelId)}/messages`
      );
      setChat(response);
    };
    fetchData();
  }, [channelId]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/personalchannels/${Number(channelId)}/users`
      );
      setChatUsers(response);
    };
    fetchData();
  }, [channelId]);

  const handleMessageSubmit = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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

  useEffect(() => {
    const div = scrollRef.current;
    if (!div) return;

    let timeoutId;

    const handleScroll = () => {
      setIsScroll(true); // 스크롤 발생 시 true

      clearTimeout(timeoutId);
      // 스크롤 멈춘 후 200ms 뒤에 false로 바꿈
      timeoutId = setTimeout(() => {
        setIsScroll(false);
      }, 200);
    };

    div.addEventListener("scroll", handleScroll);

    // 초기 상태 false
    setIsScroll(false);

    return () => {
      clearTimeout(timeoutId);
      div.removeEventListener("scroll", handleScroll);
    };
  }, []);
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
        <div className="w-full flex flex-col">
          <div
            className="w-full flex flex-col justify-end flex-1 overflow-hidden"
            ref={chatBox}
          >
            <div className={`overflow-y-auto m-1`} ref={scrollRef}>
              {chat.map((userChat, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col py-2 text-white  ${
                      isScroll && "pointer-events-none"
                    }
                     `}
                  >
                    {/* 날짜가 달라지면 구분선 추가 */}
                    <DataDivider
                      previousDate={formatYYMMDate(chat[index - 1]?.date)}
                      date={formatYYMMDate(userChat.date)}
                    />

                    {userChat.messages.map((message, index) => {
                      return (
                        <Messages
                          message={message}
                          userChat={userChat}
                          key={index}
                          index={index}
                          chatBox={chatBox}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full p-4">
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-full min-h-[52px]  rounded-lg bg-zinc-700 px-4 text-white border-1 border-zinc-600 outline-none resize-none overflow-y-hidden py-[14px]"
              placeholder={`@${chatUsers[0]?.user.name}에 메시지 보내기`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onInput={(e) => {
                const textarea = e.target;
                textarea.style.height = "auto"; // 높이를 초기화
                textarea.style.height = `${textarea.scrollHeight}px`; // 새로운 높이 설정
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleMessageSubmit(e);
                }
              }}
            />
          </div>
        </div>
        {showProfile && <BigProfileCard userId={chatUsers[0]?.user.id} />}
      </div>
    </>
  );
};

export default FriendsChatPage;
