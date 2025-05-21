const EmojiCategory = () => {
  return (
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
  );
};

export default EmojiCategory;
