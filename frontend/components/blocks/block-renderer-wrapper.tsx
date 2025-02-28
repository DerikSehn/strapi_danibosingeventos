"use client";

import dynamic from "next/dynamic";
import React from "react";

const BlockRenderer = dynamic(
  () => import("./block-renderer"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 w-full animate-pulse bg-gray-300 rounded"
          ></div>
        ))}
      </div>
    ),
  }
);

type Props = {
  blocks: any[];
};

export default function BlockRendererWrapper({ blocks }: Props) {
  return <BlockRenderer blocks={blocks} />;
}