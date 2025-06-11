"use client";

import { useEffect, useState } from "react";

export const HeroVideo = () => {
  const [videoSrc, setVideoSrc] = useState("/hero__video.mp4");

  useEffect(() => {
    const width = window.innerWidth;

    if (width <= 576) {
      setVideoSrc("/hero__576.mp4");
    } else if (width <= 1200) {
      setVideoSrc("/hero__1200.mp4");
    } else {
      setVideoSrc("/hero__video.mp4");
    }
  }, []);

  return (
    <video
      className="left-0 absolute z-10 w-full h-[50vh] sm:h-full object-cover object-[30%_bottom] sm:object-bottom"
      preload="metadata"
      muted
      loop
      playsInline
      autoPlay
      controls={false}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
};
