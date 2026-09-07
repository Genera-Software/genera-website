"use client";

import { ReactNode } from "react";
import { BOOK_DEMO_FORM_SLUG } from "@/lib/cta";

type Props = {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  slug?: string;
};

export default function BookDemoButton({
  className = "btn btn-forest btn-lg",
  children = "Book a Demo",
  onClick,
  slug = BOOK_DEMO_FORM_SLUG,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        window.dispatchEvent(
          new CustomEvent("book-demo:open", { detail: { slug } }),
        );
      }}
      className={className}
    >
      {children}
    </button>
  );
}
