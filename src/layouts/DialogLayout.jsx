import { cloneElement } from "react";
import { createPortal } from "react-dom";
import "animate.css";

const DialogLayout = ({ children, setClose }) => {
  const portalElement = document.getElementById("root");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setClose(false);
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="w-full h-full bg-black/50 absolute top-0 left-0 flex justify-center items-center select-none"
          onMouseDown={handleBackdropClick}
        >
          <div className="bg-zinc-700 rounded-md p-6 text-white gap-6 flex flex-col border-1 border-zinc-600">
            {cloneElement(children, {
              setClose: setClose,
            })}
          </div>
        </div>,
        portalElement
      )}
    </>
  );
};
export default DialogLayout;
