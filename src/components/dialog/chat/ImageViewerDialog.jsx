import { createPortal } from "react-dom";

const ImageViewerDialog = ({ image, setImageViewer }) => {
  const portalElement = document.getElementById("root");
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setImageViewer(false);
    }
  };
  return (
    <>
      {createPortal(
        <div
          className="image-viewer fixed top-0 left-0 w-dvw h-dvh bg-black/80 flex items-center justify-center z-50"
          onMouseDown={handleBackdropClick}
        >
          <img src={image} alt="Image" />
        </div>,
        portalElement
      )}
    </>
  );
};
export default ImageViewerDialog;
