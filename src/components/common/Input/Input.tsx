import {
  useState,
  ReactNode,
  useId,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import Searchicon from "../../../assets/search.svg";
import PasswordVisibilityFalse from "../../../assets/password-visibility-false.svg";
import PasswordVisibilityTrue from "../../../assets/password-visibility-true.svg";

/* 1. Input Size Map */
const inputSizeMap = {
  auth: { base: { height: 44 } },
  authWide: { base: { height: 44 } },
  search: { base: { height: 48 } },
  title: { base: { height: 44 } },
  content: { base: { height: 200 } },
} as const;

export type InputSize = keyof typeof inputSizeMap;

/* 2. Variant */
type InputVariant = "default" | "search";

const inputVariantClassMap: Record<InputVariant, string> = {
  default: `
    border-border-primary
    bg-background-secondary
    text-color-primary
  `,
  search: `
    border-brand-primary
    bg-background-primary
  `,
};

/* 3. Props */
/**
 * @interface InputProps
 * @extends {Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, "size">}
 */
interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> {
  label?: string;
  size?: InputSize;
  variant?: InputVariant;
  withSearchIcon?: boolean;
  rightElement?: ReactNode;
}

/**
 * Coworkers 공통 인풋 컴포넌트
 * * @description 라벨 클릭 시 인풋 포커스 연결 기능이 포함되어 있습니다.
 * @param {InputProps} props - 인풋 속성
 */
export const Input = ({
  label,
  size = "auth",
  variant = "default",
  type = "text",
  withSearchIcon = false,
  rightElement,
  className = "",
  id,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  const isPassword = type === "password";
  const isContent = size === "content";
  const Tag = isContent ? "textarea" : "input";

  return (
    <div className="flex w-full flex-col gap-3">
      {label && (
        <label
          htmlFor={inputId}
          className="text-lg-m text-color-secondary cursor-pointer truncate text-left"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {withSearchIcon && (
          <Searchicon
            className={`absolute left-2 z-10 h-8 w-8 ${
              isContent ? "top-4" : "top-1/2 -translate-y-1/2"
            }`}
          />
        )}

        <Tag
          {...props}
          id={inputId}
          type={
            !isContent
              ? isPassword && showPassword
                ? "text"
                : type
              : undefined
          }
          className={`w-full rounded-xl border px-3 ${inputVariantClassMap[variant]} ${
            withSearchIcon ? "pl-10" : ""
          } ${rightElement ? "pr-24" : "pr-3"} ${
            isContent ? "resize-none py-3" : ""
          } ${className} `}
          style={{
            height: inputSizeMap[size].base.height,
            verticalAlign: isContent ? "top" : "middle",
          }}
        />

        {isPassword && !rightElement && !isContent && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute top-1/2 right-3 z-10 -translate-y-1/2"
          >
            {showPassword ? (
              <PasswordVisibilityTrue className="h-4 w-4" />
            ) : (
              <PasswordVisibilityFalse className="h-4 w-4" />
            )}
          </button>
        )}

        {rightElement && (
          <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
