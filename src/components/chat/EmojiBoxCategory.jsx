import {
  faChevronCircleRight,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { drop } from "lodash";
import React, { useEffect, useState } from "react";

const EmojiBoxCategory = ({ category, emojis, onEmojiClick }) => {
  const emojiId = category.emojis[0]; // 예: "8ball"
  const emojiObj = emojis?.[emojiId];
  const currentEmojis = Object.values(emojis).filter((emoji) =>
    category.emojis.includes(emoji.id)
  );
  const [dropdown, setDropdown] = useState(false);

  console.log(category);
  console.log(currentEmojis);

  return (
    <>
      <div className="">
        <button
          type="button"
          className="flex items-center gap-4 cursor-pointer w-fit hover:text-white group"
          key={category.id}
          onClick={() => {
            setDropdown((prev) => !prev);
          }}
        >
          <div className="flex gap-2">
            <div
              className={`flex ${
                !dropdown && "grayscale"
              }  group-hover:grayscale-0 transition-all duration-200`}
            >
              {emojiObj?.skins[0].native ?? "❓"}
            </div>
            <div className="text-sm">{category.id}</div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </div>
        </button>
        {dropdown && (
          <div className="grid grid-cols-9">
            {currentEmojis.map((emoji) => {
              return (
                <React.Fragment key={emoji.id}>
                  {emoji.skins.map((skin, index) => {
                    return (
                      <button
                        key={index}
                        type="button"
                        className="flex items-center gap-4 cursor-pointer hover:text-white group aspect-square w-full justify-center text-2xl"
                        onClick={() => {
                          onEmojiClick(emoji);
                        }}
                      >
                        <div>{skin.native}</div>
                      </button>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default EmojiBoxCategory;
