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
  inputMode,
  autoComplete,
}: Input) {
  const input = useRef<HTMLInputElement>(null);
  const [hide, sethide] = useState<boolean>(false);
  const timeoutRef = useRef<any>(null);

  const handleChange = (e: any) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange
        ? onChange(e)
        : set((state: any) => ({ ...state, [name]: e.target.value }));
      timeoutRef.current = null;
    }, 500);
  };

  const computedInputMode =
    inputMode ||
    (type === "number" || name === "phoneNumber"
      ? "tel"
      : name === "email"
      ? "email"
      : undefined);

  return (
    <article className={` ${classContainer}`}>
      {title && (
        <label className="block text-textPri font-medium text-xs sm:text-sm mb-1.5 ml-1 select-none">
          {title}
        </label>
      )}
      <aside
        onClick={() => {
          input.current?.focus();
        }}
        className={`text-sm font-semibold py-2.5 px-3 min-h-[46px] relative items-center flex gap-3 rounded-md bg-pri duration-200 tracking-wide border border-transparent
            ${err ? "!border-red-600" : "focus-within:border-sec/40"}
            ${disabled ? "pointer-events-none opacity-70" : ""}
             ${className}`}
      >
        {icon &&
          React.cloneElement(icon, {
            className: `${classIcon} text-gray-500 shrink-0`,
          } as React.HTMLAttributes<HTMLElement>)}
        <input
          ref={input}
          disabled={disabled}
          type={type === "password" ? (hide ? "text" : "password") : type}
          inputMode={computedInputMode}
          autoComplete={autoComplete}
          className={`outline-none placeholder:text-[#8e9db0] bg-transparent text-base sm:text-sm placeholder:text-sm w-full ${classInput}`}
          placeholder={placeholder}
          onChange={(e) => {
            wait
              ? handleChange(e)
              : onChange
              ? onChange(e)
              : set((state: any) => ({ ...state, [name]: e.target.value }));
          }}
          value={value ?? ""}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sethide(!hide);
            }}
            aria-label={hide ? "Hide password" : "Show password"}
            className="w-10 h-10 -mr-2 shrink-0 flex items-center justify-center text-gray-500 hover:text-gray-700 active:scale-95 transition"
          >
            {!hide ? (
              <MdRemoveRedEye className="text-xl" />
            ) : (
              <IoMdEyeOff className="text-xl" />
            )}
          </button>
        )}
      </aside>

      <aside
        className={`grid overflow-hidden transition-all duration-300 ${
          err ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <p className="text-red-600 text-xs ml-1.5 overflow-hidden">
          • {err}
        </p>
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
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  autoComplete?: string;
};

export default Input;
