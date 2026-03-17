import { PropsWithChildren } from "react";

interface CardProps {
  title?: string;
  className?: string;
}

export const Card = ({
  title,
  className = "",
  children,
}: PropsWithChildren<CardProps>) => {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`.trim()}
    >
      {title ? (
        <h3 className="mb-3 text-lg font-semibold text-slate-900">{title}</h3>
      ) : null}
      {children}
    </section>
  );
};
