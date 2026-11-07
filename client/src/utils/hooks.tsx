import { toPng } from "html-to-image";
import { useCallback, useRef, useState } from "react";

export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
        setIsCopied(false);
      });
  };

  return {
    isCopied,
    copyToClipboard,
  };
};

export const useDownloadPng = (title: string) => {
  const ref = useRef(null);
  const [err, setErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const onClick = useCallback(() => {
    // 1. Check if the ref is attached to an element
    if (ref.current === null) {
      return;
    }
    setLoading(true);
    // 2. Use the 'toPng' function from the library to convert the div to a Data URL
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        // 3. Create a temporary link element to trigger the download
        const link = document.createElement("a");
        link.download = title; // Set the desired file name
        link.href = dataUrl; // Set the Data URL as the href
        link.click(); // Programmatically click the link to start the download
      })
      .catch((err) => {
        console.error("oops, something went wrong!", err);
        setErr(true);
      })
      .finally(() => setLoading(false));
  }, [ref]);
  return { ref, onClick, loading, err };
};
