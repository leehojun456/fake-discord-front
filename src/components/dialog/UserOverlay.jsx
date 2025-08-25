import { createPortal } from "react-dom";

import { useContext } from "react";
import ProfileCard from "../user/ProfileCard";
import { ModalContext } from "../../contexts/ModalContext";

const UserOverlay = () => {
  const { userOverlay, setUserOverlay, userOverlayUserId } =
    useContext(ModalContext);
  const portalElement = document.getElementById("root");

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setUserOverlay(false);
    }
  };

  console.log("userOverlayUserId", userOverlayUserId);
  return (
    <>
      {createPortal(
        <div
          className="fixed top-0 left-0 z-50 bg-black/50 w-full h-full text-white flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          <ProfileCard userId={userOverlayUserId} />
        </div>,
        portalElement
      )}
    </>
  );
};
export default UserOverlay;
