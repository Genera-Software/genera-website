"use client";

export default function FeaturesClient() {
  return (
    <iframe
      src="/features.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 9999,
      }}
      title="Genera Features"
    />
  );
}
