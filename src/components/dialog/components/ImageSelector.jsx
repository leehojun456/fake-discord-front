import { useRef } from "react";

const ImageSelector = ({ setImage }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      console.log("선택된 파일:", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("업로드된 이미지:", reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex gap-4 text-zinc-200">
      <button
        type="button"
        className="w-[192px] h-[192px] bg-zinc-800 rounded-md cursor-pointer"
        onClick={handleUploadClick}
      >
        이미지 업로드
      </button>
      <button
        type="button"
        className="w-[192px] h-[192px] bg-zinc-800 rounded-md cursor-pointer"
      >
        GIF 고르기
      </button>
      {/* 숨겨진 파일 업로드 input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageSelector;
