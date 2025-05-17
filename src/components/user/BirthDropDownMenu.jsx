const BirthDropDownMenu = ({ start, end, setData, reverse }) => {
  const data = [];

  for (let year = start; year <= end; year++) {
    data.push(year);
  }

  if (reverse) data.sort((a, b) => b - a);

  return (
    <div className="absolute w-full bg-zinc-800 border-1 border-zinc-900 left-0 bottom-12 rounded-md text-left max-h-60 overflow-y-auto flex flex-col ">
      {data.map((data) => (
        <div
          key={data}
          className={`px-2 py-1 cursor-pointer hover:bg-zinc-700`}
          onClick={() => setData(data)}
        >
          {data}
        </div>
      ))}
    </div>
  );
};

export default BirthDropDownMenu;
