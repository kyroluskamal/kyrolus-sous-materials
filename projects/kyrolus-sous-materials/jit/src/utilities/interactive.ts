import type { Matcher } from "./helpers";

const CURSORS = [
  "auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed",
  "none", "context-menu", "progress", "cell", "crosshair", "vertical-text",
  "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize",
  "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize",
  "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize",
  "nwse-resize", "zoom-in", "zoom-out",
];

const USER_SELECT: Record<string, string> = {
  "select-none": "none",
  "select-text": "text",
  "select-all": "all",
  "select-auto": "auto",
};

const POINTER_EVENTS: Record<string, string> = {
  "pointer-events-none": "none",
  "pointer-events-auto": "auto",
};

const RESIZE: Record<string, string> = {
  "resize-none": "none",
  resize: "both",
  "resize-x": "horizontal",
  "resize-y": "vertical",
};

const OBJECT_FIT: Record<string, string> = {
  "object-contain": "contain",
  "object-cover": "cover",
  "object-fill": "fill",
  "object-none": "none",
  "object-scale-down": "scale-down",
};

const OBJECT_POSITION: Record<string, string> = {
  "object-bottom": "bottom",
  "object-center": "center",
  "object-left": "left",
  "object-left-bottom": "left bottom",
  "object-left-top": "left top",
  "object-right": "right",
  "object-right-bottom": "right bottom",
  "object-right-top": "right top",
  "object-top": "top",
};

const SCROLL_BEHAVIOR: Record<string, string> = {
  "scroll-auto": "auto",
  "scroll-smooth": "smooth",
};

const TOUCH_ACTION: Record<string, string> = {
  "touch-auto": "auto",
  "touch-none": "none",
  "touch-pan-x": "pan-x",
  "touch-pan-left": "pan-left",
  "touch-pan-right": "pan-right",
  "touch-pan-y": "pan-y",
  "touch-pan-up": "pan-up",
  "touch-pan-down": "pan-down",
  "touch-pinch-zoom": "pinch-zoom",
  "touch-manipulation": "manipulation",
};

const APPEARANCE: Record<string, string> = {
  "appearance-none": "none",
  "appearance-auto": "auto",
};

const WILL_CHANGE: Record<string, string> = {
  "will-change-auto": "auto",
  "will-change-scroll": "scroll-position",
  "will-change-contents": "contents",
  "will-change-transform": "transform",
};

export const interactiveMatchers: Matcher[] = [
  ({ name }) => {
    if (name.startsWith("cursor-")) {
      const v = name.slice("cursor-".length);
      if (CURSORS.includes(v)) return { cursor: v };
    }
    return null;
  },
  ({ name }) => (name in USER_SELECT ? { "user-select": USER_SELECT[name]! } : null),
  ({ name }) => (name in POINTER_EVENTS ? { "pointer-events": POINTER_EVENTS[name]! } : null),
  ({ name }) => (name in RESIZE ? { resize: RESIZE[name]! } : null),
  ({ name }) => (name in OBJECT_FIT ? { "object-fit": OBJECT_FIT[name]! } : null),
  ({ name }) => (name in OBJECT_POSITION ? { "object-position": OBJECT_POSITION[name]! } : null),
  ({ name }) => (name in SCROLL_BEHAVIOR ? { "scroll-behavior": SCROLL_BEHAVIOR[name]! } : null),
  ({ name }) => (name in TOUCH_ACTION ? { "touch-action": TOUCH_ACTION[name]! } : null),
  ({ name }) => (name in APPEARANCE ? { appearance: APPEARANCE[name]!, "-webkit-appearance": APPEARANCE[name]! } : null),
  ({ name }) => (name in WILL_CHANGE ? { "will-change": WILL_CHANGE[name]! } : null),
  // sr-only / not-sr-only
  ({ name }) => {
    if (name === "sr-only") {
      return {
        position: "absolute", width: "1px", height: "1px", padding: "0",
        margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)",
        "white-space": "nowrap", "border-width": "0",
      };
    }
    if (name === "not-sr-only") {
      return {
        position: "static", width: "auto", height: "auto", padding: "0",
        margin: "0", overflow: "visible", clip: "auto", "white-space": "normal",
      };
    }
    return null;
  },
];
