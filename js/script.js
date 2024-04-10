import Editor from "./editor.js";
import Toolbar from "./toolbar.js";

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("tool-bar");
const defaultPadding = 15;
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

// Initialization calls
const initialize = () => {
  resize();
};

const resize = () => {
  const toolbarHight = toolbar.getBoundingClientRect().height;
  const docHeight = window.innerHeight - toolbarHight - defaultPadding * 2;
  const checkWidth = window.innerWidth - defaultPadding * 2;
  const docWidth = checkWidth < 400 ? 400 : checkWidth / 2;
  page.style.height = `${docHeight}px`;
  page.style.width = `${docWidth}px`;
  page.style.padding = `${defaultPadding}px`;
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
      gapBuffer.insert("\n", gapBuffer.getCurrentPos());
      break;
    default:
      gapBuffer.insert(e.key, gapBuffer.getCurrentPos());
      break;
  }
  editor.print(true);
  console.log(gapBuffer.printRaw());
});

page.addEventListener("focusout", (e) => {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    cursor.classList.add("hidden");
  }
});

page.addEventListener("focusin", (e) => {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    cursor.classList.remove("hidden");
  }
});

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
  page.focus();
});

boldBtn.addEventListener("click", () => {
  editor.createNewText(["p"], { fontWeight: 600 });
  page.focus();
});

italicBtn.addEventListener("click", () => {
  editor.createNewText(["p"], { fontStyle: "italic" });
  page.focus();
});

underlineBtn.addEventListener("click", () => {
  editor.createNewText(["p"], { textDecoration: "underline" });
  page.focus();
});

strikeThroughBtn.addEventListener("click", () => {
  editor.createNewText(["p"], { textDecoration: "line-through" });
  page.focus();
});

leftBtn.addEventListener("click", () => {
  editor.updateBufferStyle({ textAlign: "left" });
  page.focus();
});

centerBtn.addEventListener("click", () => {
  editor.updateBufferStyle({ textAlign: "center" });
  page.focus();
});

rightBtn.addEventListener("click", () => {
  editor.updateBufferStyle({ textAlign: "right" });
  page.focus();
});

ulBtn.addEventListener("click", () => {
  editor.createNewText(["ul", "li"]);
  page.focus();
});

window.addEventListener("resize", resize);
window.addEventListener("DOMContentLoaded", initialize);
