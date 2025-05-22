import {
  faBolt,
  faCircleUser,
  faComment,
  faHandsClapping,
  faMagnifyingGlass,
  faMartiniGlass,
  faSmile,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useCallback,
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
import { format, formatDate } from "date-fns";
import { Popover } from "react-tiny-popover";
import EmojiBox from "../components/chat/EmojiBox";
import data from "@emoji-mart/data";

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
  const [loading, setLoading] = useState(false);
  const [replyId, setReplyId] = useState(false);
  const [emojiBox, setEmojiBox] = useState(false);

  useEffect(() => {
    // 헤더 메시지와 아이콘을 설정합니다.
    setHeaderMessage("다이렉트 메시지");
    setHeaderIcon(faBolt);

    // localStorage에서 showProfile 값을 가져와서 상태를 설정합니다.
    setShowProfile(
      JSON.parse(localStorage.getItem("userSettings") || "{}")?.showProfile ??
        false
    );
    ScrollDetector();
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

  // 스크롤 감지
  const ScrollDetector = () => {
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
  };

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
    try {
      const response = await axios.get(
        `/personalchannels/${channelId}/messages`,
        {
          params: {
            cursor,
            limit: 5,
            sort: sort || "desc",
          },
        }
      );

      if (response.length === 0) return; // 더 이상 불러올 데이터 없음

      setChat((prev) => [...prev, ...response]);
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

  // IntersectionObserver 인스턴스 저장용 ref
  const observer = useRef();

  // 마지막 아이템에 ref를 붙이기 위한 콜백 함수
  // node: 마지막 아이템 DOM 요소
  const lastItemRef = useCallback(
    (node) => {
      if (loading || !node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let cursor = entries[0].target.getAttribute("data-id");
          if (cursor) {
            fetchMessages(cursor);
          }
        }
      });

      observer.current.observe(node);
    },
    [loading] // fetchMessages는 필요 없음 (async 함수는 불변)
  );

  const handleInput = (e) => {
    const editor = e.currentTarget;
    const text = editor.innerText;
    setMessage(text); // 전송용 상태에는 :emoji: 형태 유지

    const emojiRegex = /:([a-zA-Z0-9_+-]+):/g;
    let match, lastMatch;

    while ((match = emojiRegex.exec(text)) !== null) {
      lastMatch = match;
    }

    if (!lastMatch) return;

    const emojiName = lastMatch[1];
    const emoji = data.emojis[emojiName];
    if (!emoji) return;

    const fullMatch = lastMatch[0]; // 예: ":smile:"

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const focusNode = sel.focusNode;
    if (!focusNode || focusNode.nodeType !== Node.TEXT_NODE) return;

    const nodeText = focusNode.nodeValue;
    const emojiIndex = nodeText.lastIndexOf(fullMatch);
    if (emojiIndex === -1) return;

    const beforeText = nodeText.slice(0, emojiIndex);
    const afterText = nodeText.slice(emojiIndex + fullMatch.length);

    const beforeNode = document.createTextNode(beforeText);

    const emojiSpan = document.createElement("span");
    emojiSpan.innerText = emoji.skins[0].native;
    emojiSpan.className = "emoji";
    emojiSpan.setAttribute("data-key", fullMatch);
    emojiSpan.contentEditable = "false"; // 이모지는 수정 안 되게

    const afterNode = document.createTextNode(afterText || "\u00A0");

    // 기존 텍스트 노드 삭제 후 삽입
    const parent = focusNode.parentNode;
    parent.replaceChild(afterNode, focusNode);
    parent.insertBefore(emojiSpan, afterNode);
    parent.insertBefore(beforeNode, emojiSpan);

    // 커서 옮기기
    const newRange = document.createRange();
    newRange.setStart(afterNode, afterNode.length);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
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
        <div className="w-full flex flex-col">
          <div
            className="w-full flex flex-col justify-end flex-1 overflow-hidden"
            ref={chatBox}
          >
            <div className={`overflow-y-auto m-1`} ref={scrollRef}>
              {chat.map((userChat, index) => {
                const isLast = index === chat.length - 1;
                return (
                  <div
                    key={index}
                    data-id={userChat.latestMessage}
                    className={`flex flex-col py-2 text-white  ${
                      isScroll && "pointer-events-none"
                    }
                     `}
                    ref={isLast ? lastItemRef : null} // 마지막 아이템에만 ref
                  >
                    {/* 날짜가 달라지면 구분선 추가 */}
                    <DataDivider
                      previousDate={formatYYMMDate(chat[index - 1]?.timeGroup)}
                      date={formatYYMMDate(userChat.timeGroup)}
                    />

                    {userChat.messages.map((message, index) => {
                      return (
                        <Messages
                          message={message}
                          userChat={userChat}
                          key={message.id}
                          index={index}
                          chatBox={chatBox}
                          block={false}
                          setMessage={setMessage}
                          setChat={setChat}
                          setReplyId={setReplyId}
                          replyId={replyId}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
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
            <div className="flex">
              <div
                className="w-full min-h-[52px] rounded-l-lg bg-zinc-700 px-4 text-white border border-zinc-600 outline-none resize-none overflow-y-hidden py-[14px] block relative"
                placeholder={`@${chatUsers[0]?.user.name}에 메시지 보내기`}
              >
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    handleInput(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSubmit(e);
                    }
                  }}
                ></span>
                {message === "" && (
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 select-none">
                    @{chatUsers[0]?.user.name}에 메시지 보내기
                  </span>
                )}
              </div>

              <div className="bg-zinc-700 border-r-1 border-y-1 rounded-r-md border-zinc-600 py-[14px] px-4 text-zinc-400 select-none">
                <Popover
                  isOpen={emojiBox}
                  padding={10}
                  boundaryInset={10}
                  positions={["bottom", "right", "left"]}
                  boundaryElement={chatBox.current}
                  content={({ nudgedLeft, nudgedTop }) => (
                    <>
                      <EmojiBox setEmojiBox={setEmojiBox} />
                    </>
                  )}
                >
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setEmojiBox(!emojiBox)}
                  >
                    <FontAwesomeIcon icon={faSmile} />
                  </button>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        {showProfile && <BigProfileCard userId={chatUsers[0]?.user.id} />}
      </div>
    </>
  );
};

export default FriendsChatPage;
