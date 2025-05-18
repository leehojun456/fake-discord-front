const EmojiMiniPopup = ({ setShowEmojiAdd }) => {
  return (
    <>
      <div
        className="w-[200px] flex flex-col bg-zinc-700 p-2 rounded-md border border-zinc-600 shadow-2xl text-white items-start relative z-50"
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={() => {
          setShowEmojiAdd(false);
        }}
      >
        <button
          type="button"
          className="cursor-pointer w-full flex justify-between  text-left hover:bg-zinc-600 rounded-md p-1 "
        >
          더 보기
        </button>
      </div>
    </>
  );
};
export default EmojiMiniPopup;
