import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from "react";

const Emojis = forwardRef(({ item, toggleCategory, style, data }, ref) => {
  if (item.type === "header") {
    const emoji = data.emojis[item.category.emojis[0]].skins[0].native;

    const category = item.category;
    return (
      <div ref={ref} style={style}>
        <button
          type="button"
          className="flex items-center gap-4 cursor-pointer w-fit hover:text-white group text-sm"
          onClick={() => toggleCategory(category.id)}
        >
          <div className="flex gap-2">
            <div className="grayscale-100">{emoji}</div>
            <div className="text-sm">{category.id}</div>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </button>
      </div>
    );
  } else if (item.type === "grid") {
    return (
      <div ref={ref} style={style} className="grid grid-cols-9 gap-1">
        {item.chunk.map(({ emoji, skin }, i) => (
          <button
            key={i}
            className="aspect-square w-full text-2xl hover:bg-zinc-600 rounded-md flex items-center justify-center cursor-pointer"
          >
            {skin.native}
          </button>
        ))}
      </div>
    );
  }
  return null;
});

export default Emojis;
