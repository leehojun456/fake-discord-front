import { forwardRef } from "react";

const Emojis = forwardRef(({ item, toggleCategory, style }, ref) => {
  if (item.type === "header") {
    const category = item.category;
    return (
      <div ref={ref} style={style}>
        <button
          type="button"
          className="flex items-center gap-4 cursor-pointer w-fit hover:text-white group"
          onClick={() => toggleCategory(category.id)}
        >
          <div className="flex gap-2">
            <div>{/* 이모지 아이콘 등 */}</div>
            <div className="text-sm">{category.id}</div>
          </div>
          <div className="flex items-center">{/* 아이콘 */}</div>
        </button>
      </div>
    );
  } else if (item.type === "grid") {
    return (
      <div ref={ref} style={style} className="grid grid-cols-9 gap-1">
        {item.chunk.map(({ emoji, skin }, i) => (
          <button key={i} className="aspect-square w-full text-2xl">
            {skin.native}
          </button>
        ))}
      </div>
    );
  }
  return null;
});

export default Emojis;
