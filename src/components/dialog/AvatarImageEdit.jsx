import { useContext, useEffect, useRef } from "react";
import { CircleStencil, Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../axios";
import { AuthContext } from "../../contexts/AuthContext";

const AvatarImageEdit = ({ image, setImage, setClose }) => {
  const cropperRef = useRef(null);
  const { user, setUser } = useContext(AuthContext);

  const rotate = (angle) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  const reset = () => {
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  };

  const onUpload = () => {
    const canvas = cropperRef.current?.getCanvas();
    if (canvas) {
      const form = new FormData();
      canvas.toBlob(async (blob) => {
        if (blob) {
          form.append("file", blob);
          console.log(blob);
          try {
            const data = await axios.patch("/user/avatar", form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            setClose(false);
            setUser((prev) => ({
              ...prev,
              avatar: data,
            }));
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      }, "image/jpeg");
    }
  };

  return (
    <>
      <div className="text-2xl font-bold">이미지 편집하기</div>
      <Cropper
        ref={cropperRef}
        src={image}
        stencilComponent={CircleStencil}
        stencilProps={{
          aspectRatio: 1,
        }}
        style={{
          height: 400,
          width: 554,
          backgroundColor: "oklch(37% 0.013 285.805)",
        }}
      />
      <div className="flex justify-between mt-4">
        <button type="button" className="cursor-pointer" onClick={reset}>
          재설정
        </button>
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => rotate(90)}
        >
          <FontAwesomeIcon icon={faRotateRight} />
        </button>
      </div>
      <div className="flex justify-end gap-2">
        <button
          className="cursor-pointer"
          onClick={() => {
            setImage(null);
          }}
        >
          취소
        </button>
        <button className="cursor-pointer" onClick={onUpload}>
          적용하기
        </button>
      </div>
    </>
  );
};

export default AvatarImageEdit;
