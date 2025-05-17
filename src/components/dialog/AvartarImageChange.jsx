import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import AvatarImageEdit from "./AvatarImageEdit";
import ImageSelector from "./components/ImageSelector";

const AvatarImageChange = ({ setClose }) => {
  const [image, setImage] = useState(null);

  return (
    <>
      {image ? (
        <>
          <AvatarImageEdit
            image={image}
            setImage={setImage}
            setClose={setClose}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">이미지 선택</div>
              <button
                type="button"
                className="cursor-pointer text-zinc-400"
                onClick={() => setClose(false)}
              >
                <FontAwesomeIcon icon={faXmark} size="xl" />
              </button>
            </div>
            <ImageSelector setImage={setImage} />
          </div>
          <div>
            <div className="font-bold">최신 아바타</div>
            <div>최근 업로드한 아바타 6개를 이용하세요</div>
          </div>
        </>
      )}
    </>
  );
};

export default AvatarImageChange;
