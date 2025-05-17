const CircleProfileWithStatus = ({
  user,
  height,
  width,
  position,
  border,
  left,
  top,
}) => {
  return (
    <div
      style={{ width: width, height: height, top: top, left: left }}
      className={` bg-amber-300 rounded-full  ${position} flex items-center justify-center overflow-hidden border-${border} border-zinc-800 `}
    >
      <img src={user?.avatar} />
    </div>
  );
};

export default CircleProfileWithStatus;
