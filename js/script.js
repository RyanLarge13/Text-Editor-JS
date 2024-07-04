import colors from "../constants/colors.js";
import Editor from "./editor.js";
import Toolbar from "./toolbar.js";

let dpi;

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("toolbar-btn-container");
const editor = new Editor(page);
const myToolbar = new Toolbar();
const fontSizePicker = document.getElementById("font-size");
const fontFamPicker = document.getElementById("font-fam");
const headings = document.getElementById("headings");

const boldBtn = myToolbar.getBtn("b");
const italicBtn = myToolbar.getBtn("i");
const underlineBtn = myToolbar.getBtn("u");
const strikeThroughBtn = myToolbar.getBtn("st");
const leftBtn = myToolbar.getBtn("left");
const centerBtn = myToolbar.getBtn("center");
const rightBtn = myToolbar.getBtn("right");
const ulBtn = myToolbar.getBtn("ul");
const olBtn = myToolbar.getBtn("ol");
const checkListBtn = myToolbar.getBtn("check-list");
const indentBtn = myToolbar.getBtn("tab-in");
const outdentBtn = myToolbar.getBtn("tab-out");
const plusFont = myToolbar.getBtn("plus-font");
const minusFont = myToolbar.getBtn("minus-font");
const fontColor = myToolbar.getBtn("font-color");
const highlight = myToolbar.getBtn("highlight");
const activeBtns = [];

// Initialization calls
const initialize = () => {
  dpi = document.querySelector(".dpi-calc").offsetWidth;
  const height = dpi * 11;
  const width = dpi * 8.5;
  // page.style.marginTop = `${toolbar.offsetHeight}px`;
  page.style.height = `calc(${height}px - 2in)`;
  page.style.minHeight = `calc(${height}px - 2in)`;
  page.style.maxHeight = `calc(${height}px - 2in)`;
  page.style.width = `calc(${width}px - 2in)`;
  page.style.minWidth = `calc(${width}px - 2in)`;
  page.style.maxWidth = `calc(${width}px - 2in)`;
  page.style.padding = "1in";
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

const generateNewStyles = (type) => {
  if (type === p) {
    if (headings.value !== "normal") {
      const currentStyles = editor.getCurrentStyles();
      headings.value = "normal";
      fontSize.value = "12px";
      currentStyles.fontSize = "12px";
      return currentStyles;
    }
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
    case "Control":
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
      gapBuffer.insert(
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
        gapBuffer.getCurrentPos()
      );
      break;
    case "Shift":
      break;
    case "Alt":
      break;
    case "Enter":
      {
        const type = editor.getElemType();
        const parentType = editor.getParentType();
        if (parentType === "ul" || parentType === "ol") {
          const gapBuffLen = gapBuffer.print().length;
          if (gapBuffLen > 0) {
            editor.nestListElem(type, editor.getCurrentStyles());
            break;
          } else {
            editor.eraseLastList();
            editor.createNewText("p", editor.getCurrentStyles());
            break;
          }
        }
        // possibly create a new buffer here instead to optimize current editing. Needs to
        // be a balance between not having too many gap buffers and not letting gap
        // buffers get too large
        const gapBuffLen = gapBuffer.print().length;
        if (gapBuffLen < 1) {
          // Create a style reset based on the element type you want to create
          const newStyles = generateNewStyles("p");
          editor.createNewText("p", newStyles);
          gapBuffer.insert("\n", gapBuffer.getCurrentPos());
        }
        gapBuffer.insert("\n", gapBuffer.getCurrentPos());
      }
      break;
    default:
      // possibly check for buffer length here and create a new one when the buffer reaches a certain size
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

fontSizePicker.addEventListener("change", (e) => {
  const newSize = e.target.value;
  const stylesToAdd = editor.getCurrentStyles();
  stylesToAdd.fontSize = `${Number(newSize)}px`;
  editor.nestSpan(stylesToAdd);
  page.focus({ preventScroll: true });
});

fontFamPicker.addEventListener("change", (e) => {
  const newFont = e.target.value;
  const stylesToAdd = editor.getCurrentStyles();
  stylesToAdd.fontFamily = newFont;
  editor.nestSpan(stylesToAdd);
  page.focus({ preventScroll: true });
});

headings.addEventListener("change", (e) => {
  const type = e.target.value;
  switch (type) {
    case "small":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `8px`;
        fontSizePicker.value = `8`;
        editor.updateBufferStyle(currentStyles);
      }
      break;
    case "normal":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `12px`;
        fontSizePicker.value = `12`;
        editor.updateBufferStyle(currentStyles);
      }
      break;
    case "large":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `18px`;
        fontSizePicker.value = `18`;
        editor.updateBufferStyle(currentStyles);
      }
      break;
    case "title":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `26px`;
        fontSizePicker.value = `26`;
        editor.updateBufferStyle(currentStyles);
      }
      break;
    case "subtitle":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `22px`;
        fontSizePicker.value = `22`;
        editor.updateBufferStyle(currentStyles);
      }
      break;
    default:
      editor.createNewText([type], {});
      break;
  }
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
  editor.nestSpan(stylesToAdd);
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
  editor.nestSpan(stylesToAdd);
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
  editor.nestSpan(stylesToAdd);
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
  editor.nestSpan(stylesToAdd);
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
  editor.createList("ul", "p", editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

olBtn.addEventListener("click", () => {
  editor.createList("ol", "li", editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

checkListBtn.addEventListener("click", () => {
  editor.createList("ul", "input", editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

indentBtn.addEventListener("click", (e) => {
  editor.updateBufferStyle({ textIndent: "2em" });
  page.focus({ preventScroll: true });
});

outdentBtn.addEventListener("click", (e) => {
  editor.updateBufferStyle({ textIndent: 0 });
  page.focus({ preventScroll: true });
});

plusFont.addEventListener("click", (e) => {
  const currentIndex = fontSizePicker.selectedIndex;
  const newIndex = (currentIndex + 1) % fontSizePicker.options.length;
  fontSizePicker.selectedIndex = newIndex;
  const value = fontSizePicker.options[newIndex].value;
  editor.updateBufferStyle({ fontSize: `${value}px` });
});

minusFont.addEventListener("click", (e) => {
  const currentIndex = fontSizePicker.selectedIndex;
  const newIndex = (currentIndex - 1) % fontSizePicker.options.length;
  fontSizePicker.selectedIndex = newIndex;
  const value = fontSizePicker.options[newIndex].value;
  editor.updateBufferStyle({ fontSize: `${value}px` });
});

fontColor.addEventListener("click", (e) => {
  const fontIconColor = document.getElementById("font-color-color");
  fontColor.setAttribute("disabled", true);
  const rect = fontColor.getBoundingClientRect();
  const left = rect.left;
  const top = rect.top;
  const newColorSelect = document.createElement("div");
  newColorSelect.classList.add("option-select");
  newColorSelect.style.top = `${top + rect.height}px`;
  newColorSelect.style.left = `${left}px`;
  colors.forEach((color) => {
    const newColor = document.createElement("div");
    newColor.classList.add("color");
    newColor.style.backgroundColor = color;
    newColor.addEventListener("click", () => {
      const currentStyles = editor.getCurrentStyles();
      currentStyles.color = color;
      fontIconColor.style.backgroundColor = color;
      fontColor.removeAttribute("disabled");
      // handle logic if we are currently in a list
      editor.nestSpan(currentStyles);
      toolbar.removeChild(newColorSelect);
      page.focus({ preventScroll: true });
    });
    newColorSelect.appendChild(newColor);
  });
  toolbar.appendChild(newColorSelect);
});

highlight.addEventListener("click", (e) => {
  const highlightColor = document.getElementById("highlight-color-color");
  highlight.setAttribute("disabled", true);
  const rect = highlight.getBoundingClientRect();
  const left = rect.left;
  const top = rect.top;
  const newColorSelect = document.createElement("div");
  newColorSelect.classList.add("option-select");
  newColorSelect.style.top = `${top + rect.height}px`;
  newColorSelect.style.left = `${left}px`;
  console.log(newColorSelect);
  colors.forEach((color) => {
    const newColor = document.createElement("div");
    newColor.classList.add("color");
    newColor.style.backgroundColor = color;
    newColor.addEventListener("click", () => {
      const currentStyles = editor.getCurrentStyles();
      currentStyles.backgroundColor = color;
      highlightColor.style.backgroundColor = color;
      highlight.removeAttribute("disabled");
      // handle style updates if we are currently in a list
      editor.nestSpan(currentStyles);
      toolbar.removeChild(newColorSelect);
      page.focus({ preventScroll: true });
    });
    newColorSelect.appendChild(newColor);
  });
  toolbar.appendChild(newColorSelect);
});

window.addEventListener("DOMContentLoaded", initialize);
