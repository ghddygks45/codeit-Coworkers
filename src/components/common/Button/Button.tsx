import React, { ReactNode } from "react";

type ButtonVariant = "default" | "outline_blue" | "danger" | "close";

const fontClassMap: Record<string, string> = {
  "lg-m": "text-lg-m",
  "md-m": "text-md-m",
};

/**
 * 디자인 가이드에 따른 버튼 사이즈별 상세 수치 맵
 * @property {number} width - 버튼 너비 (px)
 * @property {number} height - 버튼 높이 (px)
 * @property {string} fontSize - fontClassMap에 정의된 키값
 * @property {number} radius - 테두리 둥글기 (px)
 */
const buttonSizeMap = {
  landing: { width: 160, height: 48, fontSize: "lg-m", radius: 12 },
  authWide: { width: "100%", height: 48, fontSize: "lg-m", radius: 12 },
  teamMedium: { width: 186, height: 48, fontSize: "lg-m", radius: 12 },
  teamAdd: { width: 172, height: 33, fontSize: "md-m", radius: 8 },
  todoAdd: { width: 112, height: 40, fontSize: "md-m", radius: 40 },
  todoAction: { width: 132, height: 40, fontSize: "md-m", radius: 40 },
  smallAction: { width: 73, height: 33, fontSize: "md-m", radius: 8 },
  todoCreate: { width: 336, height: 48, fontSize: "lg-m", radius: 12 },
  normal: { width: 136, height: 48, fontSize: "lg-m", radius: 12 },
  wide: { width: 280, height: 48, fontSize: "lg-m", radius: 12 },
  save: { width: 141, height: 33, fontSize: "md-m", radius: 8 },
  post: { width: 300, height: 48, fontSize: "lg-m", radius: 12 },
} as const;

export type ButtonSize = keyof typeof buttonSizeMap;

const variantClassMap: Record<ButtonVariant, string> = {
  default: `
    bg-brand-primary
    text-color-inverse
    hover:bg-interaction-hover
    active:bg-interaction-pressed
  `,
  outline_blue: `
    border
    border-brand-primary
    text-brand-primary
    bg-background-primary
    hover:bg-brand-primary/10
  `,
  danger: `
    bg-status-danger
    text-color-inverse
    hover:bg-status-danger/90
  `,
  close: `
    border
    border-color-secondary
    text-color-default
    bg-background-primary
    hover:bg-background-secondary
    active:bg-background-tertiary
  `,
};

/**
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

/**
 * Coworkers 프로젝트 공통 버튼 컴포넌트입니다.
 * @param {ButtonSize} size - 버튼의 크기 (기본값: "normal")
 * @param {ButtonVariant} variant - 버튼의 스타일 (기본값: "default")
 * @param {ReactNode} icon - 버튼 내부에 들어갈 아이콘 컴포넌트
 * @param {string} className - 커스텀 스타일 확장을 위한 클래스명
 * @param {React.ReactNode} children - 버튼 내부 텍스트 및 요소
 * * @example
 * <Button size="landing" variant="outline_blue" onClick={handleStart}>
 * 시작하기
 * </Button>
 * * @returns {JSX.Element} 스타일이 적용된 button 요소
 */
export const Button = ({
  size = "normal",
  variant = "default",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const s = buttonSizeMap[size];

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${variantClassMap[variant]} ${fontClassMap[s.fontSize]} ${className}`}
      style={{
        width: s.width,
        height: s.height,
        borderRadius: s.radius,
      }}
    >
      {/* 아이콘이 있을 경우 렌더링 */}
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
