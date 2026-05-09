"use client";

import { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
  slug?: string;
};

export default function BookDemoButton({
  className = "btn btn-forest btn-lg",
  children = "Book a Demo",
  slug,
}: Props) {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("book-demo:open", { detail: { slug } }),
        )
      }
      className={className}
    >
      {children}
    </button>
  );
}
