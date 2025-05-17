import { useEffect, useRef, useState } from "react";
import BirthDropDownMenu from "./BirthDropDownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const BirthSelector = ({ start, end, data, setData, format, reverse }) => {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const dropDownMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownMenuRef.current &&
        !dropDownMenuRef.current.contains(event.target)
      ) {
        setDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <button
        ref={dropDownMenuRef}
        type="button"
        className="relative flex w-full bg-zinc-900 rounded-md border-1 border-zinc-950/50 justify-between items-center px-2"
        onClick={() => {
          setDropDownMenu(!dropDownMenu);
        }}
      >
        <div>
          {data}
          {format}
        </div>
        <FontAwesomeIcon icon={faAngleDown} className="cursor-pointer" />
        {/* Dropdown menu for year selection */}
        {dropDownMenu && (
          <BirthDropDownMenu
            start={start}
            end={end}
            setData={setData}
            reverse={reverse}
          />
        )}
      </button>
    </>
  );
};

export default BirthSelector;
