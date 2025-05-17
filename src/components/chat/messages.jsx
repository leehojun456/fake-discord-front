import { useState } from "react";
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

const Messages = ({ message, userChat, index }) => {
  const [reactionDialog, setReactionDialog] = useState(false);

  return (
    <div
      key={index}
      className="flex gap-2 hover:bg-zinc-700 relative"
      onMouseEnter={() => setReactionDialog(true)}
      onMouseLeave={() => setReactionDialog(false)}
    >
      <ChatProfileImage userChat={userChat.user} index={index} />
      <div className="flex flex-col w-full relative">
        <div className={`flex gap-2 items-center ${index !== 0 && "hidden"}`}>
          <ChatName userChat={userChat.user} />
          <div className={`text-xs text-zinc-400 ${index !== 0 && "hidden"}`}>
            {formatDate(userChat.date)}
          </div>
        </div>
        <Linkify text={message.content} />
      </div>
      {reactionDialog && (
        <div className="absolute bg-zinc-700 p-2 rounded-md border-1 border-zinc-600 w-fit right-4 -top-[16px] h-[40px] flex gap-2 shadow-md">
          <button
            type="button"
            className="text-zinc-400 text-md cursor-pointer hover:text-white w-[20px]"
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
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Messages;
