const CircleProfileWithStatus = ({ user, height, width, position, border }) => {
  return (
    <div
      style={{ width: width, height: height }}
      className={` bg-amber-300 rounded-full  ${position} left-0 top-[-40px] flex items-center justify-center overflow-hidden border-${border} border-zinc-800 `}
    >
      <img src={user?.avatar} />
    </div>
  );
};

export default CircleProfileWithStatus;
