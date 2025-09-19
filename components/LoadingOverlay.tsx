"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Image from "next/image";

type LoadingOverlayProps = {
  open: boolean;
};

export function LoadingOverlay({ open }: LoadingOverlayProps) {
  if (!open) return null;
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm">
      <div className="bg-white rounded-full p-6 shadow-xl">
        <div className="spinner-rotate">
          <Image src="/space_pointer.png" alt="Loading" width={80} height={80} />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LoadingOverlay;


