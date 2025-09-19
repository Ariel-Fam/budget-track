"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function ServerActionPending() {
  const { pending } = useFormStatus();
  return <LoadingOverlay open={pending} />;
}


