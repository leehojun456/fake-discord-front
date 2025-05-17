import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ImageSelector from "./components/ImageSelector";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import BannerImageEdit from "./BannerImageEdit";

const BannerImageChange = ({ setClose }) => {
  const [image, setImage] = useState(null);

  return (
    <>
      {image ? (
        <>
          <BannerImageEdit
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
        </>
      )}
    </>
  );
};

export default BannerImageChange;
