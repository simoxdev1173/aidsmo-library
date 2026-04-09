"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/utils/cn";

interface BookProps {
  content: React.ReactNode;
  cover: React.ReactNode;
  backOfCover?: React.ReactNode;
  rotate?: number;
  coverRotate?: number;
  color?: string;
  className?: string;
  rtl?: boolean;
}

export const Book = ({
  content,
  cover,
  backOfCover,
  rotate,
  coverRotate,
  className,
  color = "#e30012",
  rtl = false,
}: BookProps) => {
  // RTL: book tilts right (+30), cover swings right (+100)
  // LTR: book tilts left (-30), cover swings left (-100)
  const defaultRotate = rtl ? 30 : -30;
  const defaultCoverRotate = rtl ? 100 : -100;

  const finalRotate = rotate ?? defaultRotate;
  const finalCoverRotate = coverRotate ?? defaultCoverRotate;

  const rotatePage = useMotionValue(0);
  const rotateSpring = useSpring(rotatePage, {
    stiffness: 100,
    damping: 40,
  });

  const handleMouseEnter = () => rotatePage.set(finalCoverRotate);
  const handleMouseLeave = () => rotatePage.set(0);

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateY: finalRotate }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={cn("relative w-52 h-80 transform-3d", className)}
      >
        {/* Cover flap — opens from right edge for RTL */}
        <motion.div
          style={{ rotateY: rotateSpring, z: 15 }}
          className={cn(
            "z-10 shadow-2xl w-full h-full absolute transform-3d",
            rtl ? "origin-right" : "origin-left"
          )}
        >
          {/* Back of cover (revealed when open) */}
          <div
            style={{ transform: rtl ? "rotateY(-180deg)" : "rotateY(180deg)" }}
            className="absolute w-full h-full top-0 left-0 overflow-hidden rounded-l-xs bg-zinc-900 backface-hidden"
          >
            {backOfCover}
          </div>

          {/* Front cover face */}
          <div className="absolute w-full h-full top-0 left-0 overflow-hidden rounded-r-xs backface-hidden">
            {cover}
          </div>
        </motion.div>

        {/* Pages / content block */}
        <motion.div
          style={{ z: 14 }}
          className="absolute z-20 top-[1%] left-0 w-[calc(100%-3%)] h-[calc(100%-2%)] bg-zinc-50 overflow-hidden"
        >
          {content}
        </motion.div>

        {/* Page-edge texture — left side for RTL (spine is on right) */}
        {rtl ? (
          <div className="absolute top-[1%] -left-[4%] h-[calc(100%-2%)] w-[29px]"
            style={{
              transform: "rotateY(-90deg)",
              background: "linear-gradient(to right, #e4e4e7, #a1a1aa, #e4e4e7)",
            }}
          />
        ) : (
          <div className="absolute top-[1%] -right-[4%] h-[calc(100%-2%)] w-[29px] transform rotate-y-90 bg-gradient-to-r from-zinc-50 via-zinc-300 to-zinc-50 bg-[length:5%_100%] bg-repeat-x shadow-2xl" />
        )}

        {/* Spine — right side for RTL */}
        {rtl ? (
          <div
            style={{
              background: color,
              transform: "rotateY(90deg) translateX(50%)",
            }}
            className="absolute top-0 right-0 h-full w-[30px]"
          />
        ) : (
          <div
            style={{ background: color }}
            className="absolute top-0 left-0 h-full w-[30px] transform -rotate-y-90 -translate-x-[50%]"
          />
        )}

        {/* Back cover */}
        <motion.div
          style={{ z: -15, background: color }}
          className={cn(
            "absolute top-0 left-0 w-full h-full shadow-lg",
            rtl ? "rounded-l-xs" : "rounded-r-xs"
          )}
        />
      </motion.div>
    </div>
  );
};