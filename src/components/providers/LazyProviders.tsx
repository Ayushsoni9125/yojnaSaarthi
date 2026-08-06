"use client";

import dynamic from "next/dynamic";

const ToastProvider = dynamic(() => import("@/components/providers/ToastProvider"), {
  ssr: false,
});
const CompareBar = dynamic(() => import("@/components/schemes/CompareBar"), {
  ssr: false,
});
const ScrollToTop = dynamic(() => import("@/components/common/ScrollToTop"), {
  ssr: false,
});

export default function LazyProviders() {
  return (
    <>
      <ToastProvider />
      <CompareBar />
      <ScrollToTop />
    </>
  );
}
