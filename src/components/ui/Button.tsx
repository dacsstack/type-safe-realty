import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const classes: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-700",
  ghost:
    "bg-transparent border border-slate-300 text-slate-800 hover:bg-slate-50",
};

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${classes[variant]} ${className}`.trim()}
    >
      {children}
    </button>
  );
};
