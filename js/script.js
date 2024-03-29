import Editor from "./editor.js";
import Toolbar from "./toolbar.js";

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("tool-bar");
const defaultPadding = 15;
const editor = new Editor(page);
const myToolbar = new Toolbar();
const h1Btn = myToolbar.getBtn("h1");

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

// Event listeners
page.addEventListener("click", (e) => {
  const element = e.target;
  if (element !== page) {
    const index = Array.prototype.indexOf.call(page.children, element);
    editor.setBuffer(index);
    editor.print(true);
  }
});

page.addEventListener("keydown", (e) => {
  e.preventDefault();
  const key = e.key;
  const gapBuffer = editor.getBuffer();
  const rawBuff = gapBuffer.printRaw();
  const containsNewLine = rawBuff.includes("\n");
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
      if (containsNewLine) {
        const index = rawBuff.lastIndexOf("\n", gapBuffer.getCurrentPos());
        if (index === -1) {
          break;
        }
        gapBuffer.moveGap(index);
      }
      break;
    case "ArrowDown":
      if (containsNewLine) {
        const index = rawBuff.indexOf("\n", gapBuffer.getCurrentPos() + 1);
        if (index === -1) {
          break;
        }
        gapBuffer.moveGap(index);
      }
      break;
    case "Tab":
      gapBuffer.insert(" ", gapBuffer.getCurrentPos());
      gapBuffer.insert(" ", gapBuffer.getCurrentPos());
      break;
    case "Shift":
      break;
    case "Enter":
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
  editor.setElemType("h1");
});

window.addEventListener("resize", resize);
window.addEventListener("DOMContentLoaded", initialize);
