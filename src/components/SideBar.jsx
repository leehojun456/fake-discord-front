import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <>
      <div className="min-w-[72px] flex flex-col items-center gap-4">
        <div className="relative w-full flex justify-center items-center">
          <div className="absolute left-0 w-[3px] h-[6px] rounded-r-full bg-white"></div>
          <NavLink
            to="channels/@me"
            className={({ isActive }) =>
              `w-[40px] h-[40px] rounded-xl transition-all flex justify-center items-center ${
                isActive || window.location.pathname.startsWith("/")
                  ? "bg-indigo-500"
                  : "bg-zinc-700 hover:bg-indigo-500"
              }`
            }
          >
            <FontAwesomeIcon icon={faCloud} color="white" />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default SideBar;
