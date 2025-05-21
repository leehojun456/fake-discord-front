import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import EmojiCategory from "./EmojiCategory";
import Emojis from "./Emojis";
import { useVirtual } from "react-virtual";

const EmojiBoxCategory = ({ data }) => {
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
    overscan: 5,
  });

  return (
    <>
      <div
        ref={parentRef}
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
            />
          );
        })}
      </div>
    </>
  );
};

export default EmojiBoxCategory;
