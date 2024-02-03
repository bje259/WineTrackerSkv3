import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const serializeNonPOJOs = <T>(obj: T): T => {
  return structuredClone(obj);
};

type FlyAndScaleParams = {
  y?: number;
  x?: number;
  start?: number;
  duration?: number;
};

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number]
  ) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (
    style: Record<string, number | string | undefined>
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};

const p = function (...args: any[]) {
  args.forEach((arg) => {
    if (arg instanceof Array) {
      // console.table(arg);
      console.log(arg);
    } else if (typeof arg === "object") {
      if (typeof console.table == "function") {
        console.log(arg);
        // if (arg.length > 4) {
        // 	console.log("");
        // 	console.log("");
        // 	console.log("");
        // 	console.log("");
        // }
      } else {
        console.log(arg);
      }
    } else {
      console.log(arg);
    }
  });
};

export { p };

const pt = function (...args: any[]) {
  args.forEach((arg) => {
    if (arg instanceof Array) {
      console.table(arg);
      // console.log(arg);
    } else if (typeof arg === "object") {
      if (typeof console.table == "function") {
        console.table(arg);
        // if (arg.length > 4) {
        // 	console.log("");
        // 	console.log("");
        // 	console.log("");
        // 	console.log("");
        // }
      } else {
        console.table(arg);
      }
    } else {
      console.log(arg);
    }
  });
};

export { pt };

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
};

export const lazyLoad = (image, src) => {
  const loaded = () => {
    image.classList.add("visible"); // doesn't work in REPL
    image.style.opacity = "1"; // REPL hack to apply loading animation
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      console.log("an image has loaded"); // console log for REPL
      image.src = src; // replace placeholder src with the image src on observe
      if (image.complete) {
        // check if instantly loaded
        loaded();
      } else {
        image.addEventListener("load", loaded); // if the image isn't loaded yet, add an event listener
      }
    }
  }, options);
  observer.observe(image); // intersection observer

  return {
    destroy() {
      image.removeEventListener("load", loaded); // clean up the event listener
    },
  };
};
