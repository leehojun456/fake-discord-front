import React, { useEffect, useState } from "react";
import axios from "../../axios";
import ImageViewerDialog from "../dialog/chat/ImageViewerDialog";

function isValidImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function Linkify({ text }) {
  const urlPattern = /(\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+)/gi;
  const [linkData, setLinkData] = useState({}); // { url: { type: 'image' | 'og' | 'link', og?: {title,desc,image} } }
  const [ImageViewer, setImageViewer] = useState(false);

  useEffect(() => {
    const matches = text.match(urlPattern);
    if (!matches) return;

    const processUrls = async () => {
      for (const url of matches) {
        const href = url.startsWith("http") ? url : "http://" + url;

        if (linkData[href] !== undefined) continue;

        const isImage = await isValidImage(href);
        if (isImage) {
          setLinkData((prev) => ({ ...prev, [href]: { type: "image" } }));
        } else {
          try {
            const res = await axios.get(
              `/og-preview?url=${encodeURIComponent(href)}`
            );
            const og = res;
            if (og?.title || og?.image) {
              setLinkData((prev) => ({ ...prev, [href]: { type: "og", og } }));
            } else {
              setLinkData((prev) => ({ ...prev, [href]: { type: "link" } }));
            }
          } catch {
            setLinkData((prev) => ({ ...prev, [href]: { type: "link" } }));
          }
        }
      }
    };

    processUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const parts = text.split(urlPattern);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.match(urlPattern)) {
          let href = part.startsWith("http") ? part : "http://" + part;
          const data = linkData[href];

          const originalLink = (
            <a
              key={`${idx}-original`}
              href={href}
              className="text-blue-300 hover:underline mr-2"
              target="_blank"
              rel="noreferrer"
            >
              {part}
            </a>
          );

          if (!data) {
            return originalLink;
          }

          if (data.type === "image") {
            return (
              <div key={idx} className="my-2">
                {originalLink}

                <img
                  src={href}
                  alt="image"
                  className="max-w-xs rounded-md inline-block mt-1"
                />
                {ImageViewer && (
                  <ImageViewerDialog
                    image={image}
                    setImageViewer={setImageViewer}
                  />
                )}
              </div>
            );
          }

          if (data.type === "og") {
            const { site, title, description, image } = data.og;
            return (
              <div key={idx} className="my-2">
                {originalLink}
                <div className="w-[432px] flex flex-col border-1 border-zinc-600 bg-zinc-700 rounded-md p-2 mt-1 gap-1">
                  <a
                    href={href}
                    target="_blank"
                    className="text-sm text-zinc-400 w-fit hover:underline hover:text-white"
                  >
                    {site}
                  </a>
                  <a
                    href={href}
                    target="_blank"
                    className="text-blue-300 hover:underline"
                  >
                    {title}
                  </a>
                  <div className="text-sm text-zinc-300">{description}</div>
                  {image && (
                    <img
                      src={image}
                      alt="preview"
                      className="w-full rounded mt-2 cursor-pointer"
                      onClick={() => {
                        setImageViewer(true);
                      }}
                    />
                  )}
                  {ImageViewer && (
                    <ImageViewerDialog
                      image={image}
                      setImageViewer={setImageViewer}
                    />
                  )}
                </div>
              </div>
            );
          }

          // fallback
          return originalLink;
        } else {
          return (
            <div key={idx} className="w-full">
              <div className="break-all">{part}</div>
            </div>
          );
        }
      })}
    </>
  );
}

export default Linkify;
