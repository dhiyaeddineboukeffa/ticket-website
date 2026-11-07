import React, { useRef, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { MdRemoveRedEye } from "react-icons/md";

function Input({
  classInput = "",
  className = "",
  type = "text",
  name,
  set,
  onChange,

  icon,
  classIcon = "",
  placeholder = "",
  disabled = false,
  value,
  err = "",
  title = "",
  classContainer = "",
  wait = false,
}: Input) {
  const input = useRef<HTMLInputElement>(null);
  const [hide, sethide] = useState<boolean>(false);
  const timeoutRef = useRef<any>(null);

  const handleChange = (e: any) => {
    clearTimeout(timeoutRef.current); // Clear previous timeout
    timeoutRef.current = setTimeout(() => {
      // Perform server-side action here (e.g., API call)
      console.log("Input value:", e.target.value);
      onChange
        ? onChange
        : set((state: any) => ({ ...state, [name]: e.target.value }));
      // Clear the timeout ref after the action is completed
      timeoutRef.current = null;
    }, 500); // Adjust the delay as needed (in milliseconds)
  };

  return (
    <article className={` ${classContainer}`}>
      {title && (
        <h1 className="text-textPri  font-medium mb-2 ml-1">{title}</h1>
      )}
      <aside
        onClick={() => {
          input.current?.focus();
        }}
        className={`text-sm font-semibold py-2.5 px-3 relative items-center flex gap-3 rounded-md bg-pri  duration-200   tracking-wide
            ${err && "!border-red-600"}
            ${disabled && "pointer-events-none opacity-70"}
             ${className}`}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `${classIcon}`,
          } as React.HTMLAttributes<HTMLElement>)}
        <input
          ref={input}
          disabled={disabled}
          type={type == "password" ? (hide ? "text" : "password") : type}
          className={`outline-none placeholder:text-[#8e9db0] bg-transparent placeholder:text-sm w-full ${classInput}`}
          placeholder={placeholder}
          onChange={(e) => {
            wait
              ? handleChange(e)
              : onChange
              ? onChange(e)
              : set((state: any) => ({ ...state, [name]: e.target.value }));
          }}
          value={value}
        />
        {type === "password" && <div className="cursor-pointer"></div>}

        {type === "password" ? (
          !hide ? (
            <MdRemoveRedEye
              onClick={() => sethide(true)}
              className="text-gray-600 mx-2 text-xl scale-125 cursor-pointer"
            />
          ) : (
            <IoMdEyeOff
              onClick={() => sethide(false)}
              className="text-gray-600 mx-2 text-xl scale-125 cursor-pointer"
            />
          )
        ) : (
          <></>
        )}
      </aside>

      <aside
        className={`grid overflow-hidden transition-all duration-500 ${
          err ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <h1
          className={`text-red-600 text-xs -bottom-5 left-0 mt-1 popFade ml-1.5 overflow-hidden`}
        >
          • {err}
        </h1>
      </aside>
    </article>
  );
}

type Input = {
  classInput?: string;
  className?: string;
  classContainer?: string;
  type?: string;
  name: string;
  set?: any;
  onChange?: any;
  state?: any;
  def?: boolean;
  icon?: React.ReactElement;
  classIcon?: string;
  children?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number | readonly string[] | undefined;
  err?: string;
  title?: string;
  wait?: boolean;
};

export default Input;
