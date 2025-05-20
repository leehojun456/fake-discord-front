import {
  faAngleRight,
  faChevronRight,
  faHandsClapping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import EmojiBoxCategory from "./EmojiBoxCategory";

const EmojiBox = ({ setEmojiBox }) => {
  const portalElement = document.getElementById("root");
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setEmojiBox(false);
    }
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

          <div className="w-full h-full bg-zinc-700 flex flex-col gap-2 p-2 overflow-y-scroll">
            {data.categories.map((category, index) => {
              return (
                <EmojiBoxCategory
                  key={index}
                  category={category}
                  emojis={data.emojis}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmojiBox;
