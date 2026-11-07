import React, { useEffect, useState } from "react";
import { toColor } from "../../utils/colors";

interface TAlert {
  className?: string;
  show: boolean;
  children: React.ReactNode;
  type: "success" | "warning" | "error" | "" | undefined | null;
}

function Alert({ className, show = false, children, type }: TAlert) {
  const color = toColor(type);
  const [open, setOpen] = useState<boolean>(show);

  useEffect(() => {
    setOpen(show);
  }, [show]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000); // 5000 milliseconds = 5 seconds



    // Cleanup function to clear the timeout if component unmounts
    return () => clearTimeout(timer);
  }, [show,open]); //

  return (
    <article
      className={`grid overflow-hidden transition-all rouned duration-500 ${
        open ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"
      } `}
    >
      <aside className={`overflow-hidden `}>
        <div
          style={{
            background: `${color}CC`,
            borderColor: color,
          }}
          className={`px-4 py-2 border-2 rounded-md  text-base text-white font-semibold ${className}`}
        >
          {children}
        </div>
      </aside>
    </article>
  );
}

export default Alert;
