import React, { useEffect, useRef, useState } from "react";
import Portal from "../layout/Portal";

const Modal = ({
  children,
  className,
  open,
  onClose,
  closabel = true,
}: ModalType) => {
  const ref = useRef<HTMLElement>(null);

  const [animate, setanimate] = useState(false);
  const [kill, setkill] = useState(true);

  const handleClick = () => {
    if (ref.current) {
      ref.current.classList.add("shake");

      setTimeout(() => {
        ref?.current?.classList.remove("shake");
      }, 1000);
    }
  };

  useEffect(() => {
    if (open) {
      setkill(false);
      var t1 = setTimeout(() => {
        setanimate(true);
      }, 100);
    } else {
      setanimate(false);
      var t2 = setTimeout(() => {
        setkill(true);
      }, 400);
    }
    // if (open) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "auto"; // or "scroll"
    // }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  return (
    <Portal>
      {!kill && (
        <article
          onClick={() => (!closabel ? handleClick() : onClose(false))}
          className={`fixed inset-0 flex justify-center items-center z-[999] transition-colors ${
            animate ? "visible bg-black/60" : "invisible"
          }`}
        >
          <aside
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            className={` shadow  transition-all duration-500 ${className} ${
              animate ? "opacity-100" : "translate-y-7 opacity-0"
            }`}
          >
            {children}
          </aside>
        </article>
      )}
    </Portal>
  );
};

export default Modal;

interface ModalType {
  className?: string;
  children: React.ReactNode;
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  closabel?: boolean;
  stopScroll?: boolean;
}
