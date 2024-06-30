import Editor from "./editor.js";
import Toolbar from "./toolbar.js";

let dpi;

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("tool-bar");
const editor = new Editor(page);
const myToolbar = new Toolbar();

const h1Btn = myToolbar.getBtn("h1");
const boldBtn = myToolbar.getBtn("b");
const italicBtn = myToolbar.getBtn("i");
const underlineBtn = myToolbar.getBtn("u");
const strikeThroughBtn = myToolbar.getBtn("st");
const leftBtn = myToolbar.getBtn("left");
const centerBtn = myToolbar.getBtn("center");
const rightBtn = myToolbar.getBtn("right");
const ulBtn = myToolbar.getBtn("ul");
const olBtn = myToolbar.getBtn("ol");
const indentBtn = myToolbar.getBtn("tab-in");
const outdentBtn = myToolbar.getBtn("tab-out");
const activeBtns = [];

// Initialization calls
const initialize = () => {
  dpi = document.querySelector(".dpi-calc").offsetWidth;
  console.log(dpi);
  const height = dpi * 11;
  const width = dpi * 8.5;
  // page.style.marginTop = `${toolbar.offsetHeight}px`;
  page.style.height = `${height}px`;
  page.style.width = `${width}px`;
};

const moveArrowUp = (gapBuffer) => {
  const rawBuffer = gapBuffer.printRaw();
  const containsNewLine = rawBuffer.includes("\n");
  if (containsNewLine) {
    const index = rawBuffer.lastIndexOf("\n", gapBuffer.getCurrentPos());
    console.log(index);
    if (index === -1 || index === 0) {
      return;
    }
    gapBuffer.moveGap(index);
  }
};

const moveArrowDown = (gapBuffer) => {
  const rawBuffer = gapBuffer.printRaw();
  const containsNewLine = rawBuffer.includes("\n");
  if (containsNewLine) {
    const index = rawBuffer.indexOf("\n", gapBuffer.getCurrentPos() + 1);
    console.log(index);
    if (index === -1 || index === 0) {
      return;
    }
    gapBuffer.moveGap(index);
  }
};

page.addEventListener("keydown", (e) => {
  e.preventDefault();
  const key = e.key;
  const gapBuffer = editor.getBuffer();
  switch (key) {
    case "Backspace":
      const buffSize = gapBuffer.erase(gapBuffer.getCurrentPos());
      if (buffSize === 0) {
        editor.eraseBuff();
      }
      break;
    case "ArrowLeft":
      gapBuffer.movePosBack(1);
      break;
    case "ArrowRight":
      gapBuffer.movePosForward(1);
      break;
    case "ArrowUp":
      moveArrowUp(gapBuffer);
      break;
    case "ArrowDown":
      moveArrowDown(gapBuffer);
      break;
    case "Tab":
      gapBuffer.insert(" ", gapBuffer.getCurrentPos());
      gapBuffer.insert(" ", gapBuffer.getCurrentPos());
      break;
    case "Shift":
      break;
    case "Enter":
      const type = editor.getElemType();
      if (type === "li") {
        const gapBuffLen = gapBuffer.print().length;
        if (gapBuffLen > 0) {
          editor.createNewText(["li"]);
          break;
        } else {
          editor.eraseBuff();
          editor.createNewText(["p"]);
          break;
        }
      }
      if (gapBuffer.print().length < 1) {
        // editor.createNewText(["br"], {});
        gapBuffer.insert("\n", gapBuffer.getCurrentPos());
      } else {
        editor.createNewText(["p"], editor.getCurrentStyles());
      }
      break;
    default:
      gapBuffer.insert(e.key, gapBuffer.getCurrentPos());
      break;
  }
  editor.print(true);
  // console.log(gapBuffer.printRaw());
});

page.addEventListener("focusout", (e) => {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    cursor.classList.add("hidden");
  }
});

page.addEventListener(
  "focusin",
  (e) => {
    e.preventDefault();
    const cursor = document.querySelector(".cursor");
    if (cursor) {
      cursor.classList.remove("hidden");
    }
  },
  true
);

page.addEventListener("mouseup", (e) => {
  // const selection = window.getSelection();
  // const selectedText = selection.toString();
  // if (selectedText !== "") {
  //   const range = selection.getRangeAt(0);
  //   const start = range.startOffset;
  //   const end = range.endOffset;
  //   const completeStartIndex =
  //     start < gapBuffer.getCurrentPos()
  //       ? start
  //       : start + (gapBuffer.getGapEnd() - gapBuffer.getCurrentPos());
  //   const completeEndIndex =
  //     end < gapBuffer.getCurrentPos()
  //       ? end
  //       : end + (gapBuffer.getGapEnd() - gapBuffer.getCurrentPos());
  //   gapBuffer.printSelection(completeStartIndex, completeEndIndex);
  // }
});

h1Btn.addEventListener("click", () => {
  editor.createNewText(["h1"]);
  page.focus({ preventScroll: true });
});

boldBtn.addEventListener("click", () => {
  myToolbar.toggleBtns(["bold"]);
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.fontWeight === 600) {
    stylesToAdd.fontWeight = "normal";
  } else {
    stylesToAdd.fontWeight = 600;
  }
  editor.nestElem(["span"], stylesToAdd);
  page.focus({ preventScroll: true });
});

italicBtn.addEventListener("click", () => {
  myToolbar.toggleBtns(["italic"]);
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.fontStyle === "italic") {
    stylesToAdd.fontStyle = "normal";
  } else {
    stylesToAdd.fontStyle = "italic";
  }
  editor.nestElem(["span"], stylesToAdd);
  page.focus({ preventScroll: true });
});

underlineBtn.addEventListener("click", () => {
  myToolbar.toggleBtns(["underline"]);
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.textDecoration === "underline") {
    stylesToAdd.textDecoration = "normal";
  } else {
    stylesToAdd.textDecoration = "underline";
  }
  editor.nestElem(["span"], stylesToAdd);
  page.focus({ preventScroll: true });
});

strikeThroughBtn.addEventListener("click", () => {
  myToolbar.toggleBtns(["line-through"]);
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.textDecoration === "line-through") {
    stylesToAdd.textDecoration = "normal";
  } else {
    stylesToAdd.textDecoration = "line-through";
  }
  editor.nestElem(["span"], stylesToAdd);
  page.focus({ preventScroll: true });
});

leftBtn.addEventListener("click", () => {
  const btnStates = myToolbar.getBtnStates();
  if (btnStates.length > 0) {
    const isActive = btnStates.includes("left");
    if (isActive) {
      page.focus({ preventScroll: true });
      return;
    }
  }
  myToolbar.toggleBtns(["left"]);
  myToolbar.removeBtns(["right", "center"]);
  editor.updateBufferStyle({ textAlign: "left" });
  page.focus({ preventScroll: true });
});

centerBtn.addEventListener("click", () => {
  const btnStates = myToolbar.getBtnStates();
  if (btnStates.length > 0) {
    const isActive = btnStates.includes("center");
    if (isActive) {
      page.focus({ preventScroll: true });
      return;
    }
  }
  myToolbar.toggleBtns(["center"]);
  myToolbar.removeBtns(["left", "right"]);
  editor.updateBufferStyle({ textAlign: "center" });
  page.focus({ preventScroll: true });
});

rightBtn.addEventListener("click", () => {
  const btnStates = myToolbar.getBtnStates();
  if (btnStates.length > 0) {
    const isActive = btnStates.includes("right");
    if (isActive) {
      page.focus({ preventScroll: true });
      return;
    }
  }
  myToolbar.toggleBtns(["right"]);
  myToolbar.removeBtns(["center", "left"]);
  editor.updateBufferStyle({ textAlign: "right" });
  page.focus({ preventScroll: true });
});

ulBtn.addEventListener("click", () => {
  editor.createNewText(["ul", "li"], editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

window.addEventListener("DOMContentLoaded", initialize);
