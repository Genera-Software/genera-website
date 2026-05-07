"use client";

import { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function BookDemoButton({
  className = "btn btn-forest btn-lg",
  children = "Book a Demo",
}: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("book-demo:open"))}
      className={className}
    >
      {children}
    </button>
  );
}
