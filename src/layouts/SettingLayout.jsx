const SettingLayout = ({ title, component }) => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="text-2xl text-white font-bold">{title}</div>
        {component}
      </div>
    </>
  );
};

export default SettingLayout;
