const SubMenu = ({ menu, setSelected, selected }) => {
  return (
    <>
      <div className="flex gap-4 h-[36px] text-zinc-300 border-b-1 border-zinc-600">
        {menu.map((setting, index) => (
          <button
            className={`${
              selected === index && "text-indigo-300 border-b-2"
            } cursor-pointer text-left p-1  hover:bg-zinc-600/20 transition-all`}
            key={index}
            onClick={() => {
              setSelected(index);
              console.log(setting.title);
            }}
          >
            {setting.title}
          </button>
        ))}
      </div>
    </>
  );
};

export default SubMenu;
