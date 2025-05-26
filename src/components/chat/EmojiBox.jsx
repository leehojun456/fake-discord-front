import {
  faHandsClapping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import data from "@emoji-mart/data";
import { useCallback, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import Emojis from "./Emojis";

const EmojiBox = ({ setEmojiBox }) => {
  const portalElement = document.getElementById("root");
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setEmojiBox(false);
    }
  };

  const parentRef = useRef(null);
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // flatItems 배열 생성
  const flatItems = [];
  data.categories.forEach((category) => {
    flatItems.push({ type: "header", category });

    if (openCategories[category.id]) {
      const skins = category.emojis.flatMap(
        (id) =>
          data.emojis[id]?.skins.map((skin) => ({
            emoji: data.emojis[id],
            skin,
          })) ?? []
      );

      for (let i = 0; i < skins.length; i += 9) {
        flatItems.push({
          type: "grid",
          category,
          chunk: skins.slice(i, i + 9),
        });
      }
    }
  });

  const rowVirtualizer = useVirtual({
    size: flatItems.length,
    parentRef,
    estimateSize: useCallback(() => 48, []),
    overscan: 10,
  });

  const handleInputEmoji = (emoji, skin) => {
    insertEmojiAtCaret(skin);
  };

  const insertEmojiAtCaret = (emoji) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents(); // 현재 선택 영역(혹시 있으면)을 지움

    const node = document.createTextNode(emoji.native); // 이모지 텍스트 노드 생성
    range.insertNode(node); // 커서 위치에 이모지 삽입

    // 커서를 이모지 뒤에 위치시키기
    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <>
      {createPortal(
        <div
          className="fixed w-dvw h-dvh top-0 left-0"
          onClick={handleBackdropClick}
        />,
        portalElement
      )}
      <div className="w-[500px] h-[496px] bg-zinc-800 rounded-md overflow-hidden text-zinc-200 flex flex-col border-1 border-zinc-600 shadow-xl select-none">
        <div className="p-4 bg-zinc-700 flex flex-col gap-2 border-b-1 border-zinc-600">
          <div className="  gap-6 flex">
            <button type="button">GIF</button>
            <button type="button">스티커</button>
            <button type="button">이모지</button>
          </div>
          <div className="flex">
            <div className="flex bg-zinc-800 rounded-md p-2 h-[38px] gap-2 w-full">
              <input className="w-full h-full" />
              <div className="content-center">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </div>
            <div className="pl-4 content-center">
              <FontAwesomeIcon icon={faHandsClapping} size="xl" />
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden h-full">
          <div className="flex flex-col w-[48px] bg-zinc-800 items-center">
            sdsd
          </div>

          <div
            ref={parentRef}
            style={{
              overflowY: "auto",
            }}
            className="w-full bg-zinc-700 p-2"
          >
            <div
              style={{
                height: rowVirtualizer.totalSize,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.virtualItems.map((virtualRow) => {
                const item = flatItems[virtualRow.index];
                return (
                  <Emojis
                    key={virtualRow.key}
                    ref={virtualRow.measureRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    item={item}
                    toggleCategory={toggleCategory}
                    data={data}
                    onHandle={handleInputEmoji}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmojiBox;
