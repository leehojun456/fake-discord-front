const DataDivider = ({ previousDate, date }) => {
  return (
    <>
      {previousDate !== date && (
        <div className="my-2 flex items-center justify-center select-none">
          <hr className="flex-grow border-t-1 border-zinc-700" />
          <div className="mx-4 text-center text-zinc-300 text-xs">{date}</div>
          <hr className="flex-grow border-t-1 border-zinc-700" />
        </div>
      )}
    </>
  );
};

export default DataDivider;
