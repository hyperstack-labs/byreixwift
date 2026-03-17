"use client";

import Image from "next/image";

import React from "react";

export enum BannerAdSize {
  LEADERBOARD = "leaderboard",
  MEDIUM_RECTANGLE = "medium_rectangle",
  MOBILE_BANNER = "mobile_banner",
}

interface BannerAdProps {
  imageURL: string;
  linkURL: string;
  altText: string;
  size: BannerAdSize;
  position?: "top" | "bottom" | "inline";
  mediaType?: "image" | "video";
}

const sizeClasses: Record<BannerAdSize, string> = {
  [BannerAdSize.LEADERBOARD]: "w-[728px] h-[90px]",
  [BannerAdSize.MEDIUM_RECTANGLE]: "w-[300px] h-[250px]",
  [BannerAdSize.MOBILE_BANNER]: "w-[320px] h-[50px]",
};

export const BannerAd: React.FC<BannerAdProps> = ({
  imageURL,
  linkURL,
  altText = "Advertisemen",
  size,
  position = "inline",
  mediaType = "image",
}) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      className={`relative mx-auto my-4 ${sizeClasses[size]} max-w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 ${
        position === "top" ? "mt-0" : position === "bottom" ? "mb-0" : ""
      }`}
    >
      <span className="absolute top-1 left-1 z-10 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
        Ad
      </span>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-300" />}
      <a href={linkURL} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        {mediaType === "video" ? (
          <video
            src={imageURL}
            autoPlay
            muted
            loop
            playsInline
            className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoadedData={() => setLoaded(true)}
          />
        ) : (
          <Image
            src={imageURL}
            alt={altText}
            fill
            onLoad={() => setLoaded(true)}
            className={`object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </a>
    </div>
  );
};
