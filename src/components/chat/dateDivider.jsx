import { format } from "date-fns";

const DataDivider = ({ date }) => {
  return (
    <>
      <div className="my-2 flex items-center justify-center select-none">
        <hr className="flex-grow border-t-1 border-zinc-700" />
        <div className="mx-4 text-center text-zinc-300 text-xs">
          <div>{format(date, "yyyy년 MM월 dd일")}</div>
        </div>
        <hr className="flex-grow border-t-1 border-zinc-700" />
      </div>
    </>
  );
};

export default DataDivider;
