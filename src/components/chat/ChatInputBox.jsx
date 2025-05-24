import { Popover } from "react-tiny-popover";
import EmojiBox from "./EmojiBox";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import data from "@emoji-mart/data";

const ChatInputBox = ({
  setMessage,
  onSubmit,
  chatUsers,
  message,
  chatBox,
}) => {
  const [emojiBox, setEmojiBox] = useState(false);
  const spanRef = useRef(null);

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

  const clickInputBox = () => {
    if (spanRef.current) {
      spanRef.current.focus();
    }
  };

  return (
    <div className="flex border border-zinc-600 rounded-md">
      <div
        className="w-full min-h-[52px]  bg-zinc-700 px-4 text-white outline-none resize-none overflow-y-hidden py-[14px] block relative cursor-text"
        onClick={clickInputBox}
      >
        <span
          className="outline-none w-full flex"
          ref={spanRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={(e) => {
            handleInput(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        ></span>
        {message === "" && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 select-none">
            @{chatUsers[0]?.user.name}에 메시지 보내기
          </span>
        )}
      </div>
      <div className="bg-zinc-700  border-zinc-600 py-[14px] px-4 text-zinc-400 select-none">
        <Popover
          isOpen={emojiBox}
          padding={10}
          boundaryInset={10}
          positions={["right", "left"]}
          boundaryElement={chatBox.current}
          content={() => <EmojiBox setEmojiBox={setEmojiBox} />}
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
  );
};

export default ChatInputBox;
