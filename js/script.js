import colors from "../constants/colors.js";
import Editor from "./editor.js";
import Toolbar from "./toolbar.js";

/*
TODO: 
1. Make padding width dynamic. We need to dynamically adjust the handles when updating the padding of the page manually
2. Fix width on new quote!!
3. Create a notification system to notify users of errors in input
4. Create hidden input to focus mobile phones and pull up keyboard. This is the only hack I can think of
*/

let dpi;
let indent = 0;
let lastIndent = true;
let measurementUnit = "in";
let pagePaddingVert = 1.0;
let pagePaddingHor = 1.0;

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("toolbar-btn-container");
const header = document.querySelector("header");
const editor = new Editor(page);
const myToolbar = new Toolbar();
const fontSizePicker = document.getElementById("font-size");
const fontFamPicker = document.getElementById("font-fam");
const headings = document.getElementById("headings");
const navBtns = document.querySelectorAll("nav li p");
const topMeasure = document.getElementById("top-measure");
const sideMeasure = document.getElementById("side-measure");
const handleLeftTop = document.getElementById("handle-left-top");
const handleRightTop = document.getElementById("handle-right-top");
// const handleTopLeft = document.getElementById("handle-top-left");
// const handleBottomLeft = document.getElementById("handle-bottom-left");
const topRed = document.querySelector(".top-red-line");
const bottomRed = document.querySelector(".bottom-red-line");
const leftRed = document.querySelector(".left-red-line");
const rightRed = document.querySelector(".right-red-line");
const pageWidthHeightPadContainer = document.querySelector(
  ".page-width-height-padding"
);
const pageWidthInput = document.getElementById("page-width");
const pageHeightInput = document.getElementById("page-height");
const pagePaddingWidthInput = document.getElementById(
  "page-padding-left-right"
);
const pagePaddingHeightInput = document.getElementById(
  "page-padding-top-bottom"
);
const userMeasurementSelect = document.getElementById("measurement-select");

const printBtn = myToolbar.getBtn("print");
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
const imgBtn = myToolbar.getBtn("image-btn");
const imageInput = document.getElementById("image-input");
const videoBtn = myToolbar.getBtn("video-btn");
const quoteBtn = myToolbar.getBtn("quote-btn");
const codeBtn = myToolbar.getBtn("code-btn");
const linkBtn = myToolbar.getBtn("link-btn");
const restDemsBtn = myToolbar.getBtn("reset-dems");

// Initialization calls for mobile device
const initializeForMobile = () => {
  // For now update styles in js later switch to css
  pageWidthHeightPadContainer.style.display = "none";
  // const headerHeight = header.getBoundingClientRect().height;
  // page.style.height = `calc(100vh - ${headerHeight}px)`;
  page.style.height = `calc(100vh - ${125}px)`;
  page.style.minHeight = `calc(100vh - ${125}px)`;
  page.style.maxHeight = `calc(100vh - ${125}px)`;
  document.querySelector("nav").style.display = "none";
  document.querySelector(".title").style.flex = 1;
  page.style.marginTop = "0px";
  page.style.marginBottom = "0px";
  page.style.width = `100vw`;
  page.style.minWidth = `100vw`;
  page.style.maxWidth = `100vw`;
  page.style.padding = "0.25in";
  toolbar.style.overflowX = "auto";
  toolbar.style.flexWrap = "nowrap";
  toolbar.style.gap = "10px";
  toolbar.style.boxShadow = "inset 2px 2px 20px 0 rgba(0,0,0,0.1)";
  toolbar.classList.add("no-scroll-bar");
  topMeasure.style.display = "none";
  sideMeasure.style.display = "none";
  handleLeftTop.style.display = "none";
  handleRightTop.style.display = "none";
  document.querySelector(".side-measure-container").style.display = "none";
  header.style.paddingLeft = "10px";
  header.style.paddingRight = "10px";
  header.style.height = "125px";
};

// Initialization calls
const initialize = () => {
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobileDevice) {
    return initializeForMobile();
  }
  page.focus({ preventScroll: true });
  myToolbar.addBtns(["left"]);
  dpi = document.querySelector(".dpi-calc").offsetWidth;
  const height = dpi * 11;
  const width = dpi * 8.5;
  // const rect = page.getBoundingClientRect();
  // page.style.marginTop = `${toolbar.offsetHeight}px`;
  page.style.height = `${height}px`;
  page.style.minHeight = `${height}px`;
  page.style.maxHeight = `${height}px`;
  page.style.width = `${width}px`;
  page.style.minWidth = `${width}px`;
  page.style.maxWidth = `${width}px`;
  page.style.padding = `${pagePaddingVert}${measurementUnit} ${pagePaddingHor}${measurementUnit}`;
  createMeasurements(height, width);
  placeHandles();
  createRedLines();
};

const createRedLines = () => {
  // Don't forget to add most of these styles to your style sheet rather than setting them here in script
  // top
  topRed.style.width = "100%";
  topRed.style.borderTop = "1px solid rgba(255, 0, 0, 0.1)";
  topRed.style.position = "absolute";
  topRed.style.top = `${page.getBoundingClientRect().top}px`;
  topRed.style.left = 0;
  topRed.style.right = 0;
  topRed.style.zIndex = "989";
  // bottom
  bottomRed.style.width = "100%";
  bottomRed.style.borderBottom = "1px solid rgba(255, 0, 0, 0.1)";
  bottomRed.style.position = "absolute";
  bottomRed.style.top = `${page.getBoundingClientRect().bottom}px`;
  bottomRed.style.left = 0;
  bottomRed.style.right = 0;
  bottomRed.style.zIndex = "989";
  // left
  leftRed.style.height = "150vh";
  leftRed.style.borderRight = "1px solid rgba(255, 0, 0, 0.1)";
  leftRed.style.position = "absolute";
  leftRed.style.left = `${page.getBoundingClientRect().left}px`;
  leftRed.style.top = 0;
  leftRed.style.bottom = 0;
  leftRed.style.zIndex = "989";
  // right
  rightRed.style.height = "150vh";
  rightRed.style.borderLeft = "1px solid rgba(255, 0, 0, 0.1)";
  rightRed.style.position = "absolute";
  rightRed.style.left = `${page.getBoundingClientRect().right}px`;
  rightRed.style.top = 0;
  rightRed.style.bottom = 0;
  rightRed.style.zIndex = "989";
};

const createMeasurements = (height, width) => {
  topMeasure.style.width = `${width}px`;
  sideMeasure.style.height = `${height}px`;
  const inchesTop = 8;
  const inchesSide = 11;
  for (let i = 1; i <= inchesTop * 4 + 1; i++) {
    const modulo = i % 4;
    const newDiv = document.createElement("div");
    newDiv.classList.add("measure-line-top");
    newDiv.innerHTML = modulo === 0 ? `<p>${i / 4}</p>` : null;
    newDiv.style.borderLeft =
      modulo === 0
        ? "3px solid black"
        : modulo === 2
        ? "2px solid black"
        : modulo === 3
        ? "1px solid black"
        : "1px solid black";
    newDiv.style.height =
      modulo === 0
        ? "15px"
        : modulo === 2
        ? "10px"
        : modulo === 3
        ? "5px"
        : "5px";
    newDiv.style.left = `${((width / 8.5) * i) / 4}px`;
    topMeasure.appendChild(newDiv);
  }
  for (let i = 1; i <= inchesSide * 4 - 1; i++) {
    const modulo = i % 4;
    const newDiv = document.createElement("div");
    newDiv.classList.add("measure-line-left");
    newDiv.innerHTML = modulo === 0 ? `<p>${i / 4}</p>` : null;
    newDiv.style.borderTop =
      modulo === 0
        ? "3px solid black"
        : modulo === 2
        ? "2px solid black"
        : modulo === 3
        ? "1px solid black"
        : "1px solid black";
    newDiv.style.width =
      modulo === 0
        ? "15px"
        : modulo === 2
        ? "10px"
        : modulo === 3
        ? "5px"
        : "5px";
    newDiv.style.top = `${((height / 11) * i) / 4}px`;
    sideMeasure.appendChild(newDiv);
  }
};

const placeHandles = () => {
  const pageRect = page.getBoundingClientRect();
  const pageLeft = pageRect.left;
  const pageRight = pageRect.right;
  const pageTop = pageRect.top;
  // const pageBottom = pageRect.bottom;
  sideMeasure.style.top = `${pageTop}px`;
  handleLeftTop.style.left = `calc(${pageLeft}px + ${pagePaddingHor}${measurementUnit})`;
  handleRightTop.style.left = `calc(${pageRight}px - ${pagePaddingHor}${measurementUnit})`;
  // handleTopLeft.style.top = `calc(${pageTop}px + 1in)`;
  // handleBottomLeft.style.top = `calc(${pageBottom}px - 1in)`;
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
  const currentStyles = editor.getCurrentStyles();
  if (type === "p") {
    if (headings.value !== "normal") {
      headings.value = "normal";
      fontSizePicker.value = "12";
      currentStyles.fontSize = "12px";
      currentStyles.textAlign = "left";
      const leftBtnOn = myToolbar.checkBtnStyle("left");
      if (!leftBtnOn) {
        myToolbar.addBtns(["left"]);
      }
      myToolbar.removeBtns(["right", "center"]);
    }
    return currentStyles;
  }
};

const handleEnter = (type, parentType, gapBuffer) => {
  if (parentType !== "ul" || parentType != "ol") {
    switch (type) {
      case "h1":
        editor.createNewText("p", generateNewStyles("p"));
        return;
      case "h2":
        editor.createNewText("p", generateNewStyles("p"));
        return;
      case "h3":
        editor.createNewText("p", generateNewStyles("p"));
        return;
      case "h4":
        editor.createNewText("p", generateNewStyles("p"));
        return;
      case "h5":
        editor.createNewText("p", generateNewStyles("p"));
        return;
      case "h6":
        editor.createNewText("p", generateNewStyles("p"));
        return;
      case "p":
        editor.createNewText("p", generateNewStyles("p"));

        return;
      case "span":
        editor.createNewText("p", generateNewStyles("p"));
      default:
        break;
    }
  }
  if (parentType === "ul" || parentType === "ol") {
    const gapBuffLen = gapBuffer.print().length;
    if (gapBuffLen > 0) {
      editor.nestListElem(type, editor.getCurrentStyles());
      return;
    } else {
      editor.eraseLastList();
      editor.createNewText("p", editor.getCurrentStyles());
      return;
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
};

const setStyles = (newStyles) => {
  const keys = Object.keys(newStyles);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    switch (key) {
      case "fontWeight": {
        if (newStyles[key] !== 500) {
          myToolbar.addBtns(["bold"]);
        } else {
          myToolbar.removeBtns(["bold"]);
        }
      }
      case "textAlign": {
        if (newStyles[key] === "center") {
          myToolbar.removeBtns(["left", "right"]);
          myToolbar.addBtns(["center"]);
        }
        if (newStyles[key] === "left") {
          myToolbar.removeBtns(["right", "center"]);
          myToolbar.addBtns(["left"]);
        }
        if (newStyles[key] === "right") {
          myToolbar.removeBtns(["left", "center"]);
          myToolbar.addBtns(["right"]);
        }
      }
      case "textDecoration": {
        if (newStyles[key] === "underline") {
          myToolbar.removeBtns(["line-through"]);
          myToolbar.addBtns(["underline"]);
        } else {
          myToolbar.addBtns(["line-through"]);
          myToolbar.removeBtns(["underline"]);
        }
      }
      default:
        break;
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
        const newBuffStyles = editor.getCurrentStyles();
        setStyles(newBuffStyles);
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
    case "Escape":
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
        if (gapBuffer.print().length < 1) {
          gapBuffer.insert("\n", gapBuffer.getCurrentPos());
        }
        handleEnter(type, parentType, gapBuffer);
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
  stylesToAdd.fontSize = `${newSize}px`;
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle(stylesToAdd);
  } else {
    editor.nestSpan(stylesToAdd);
  }
  page.focus({ preventScroll: true });
});

fontFamPicker.addEventListener("change", (e) => {
  const newFont = e.target.value;
  const stylesToAdd = editor.getCurrentStyles();
  stylesToAdd.fontFamily = newFont;
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle(stylesToAdd);
  } else {
    editor.nestSpan(stylesToAdd);
  }
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
    case "h1":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `32px`;
        fontSizePicker.value = `32`;
        editor.createNewText("h1", currentStyles);
      }
      break;
    case "h2":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `24px`;
        fontSizePicker.value = `24`;
        editor.createNewText("h2", currentStyles);
      }
      break;
    case "h3":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `20px`;
        fontSizePicker.value = `20`;
        editor.createNewText("h3", currentStyles);
      }
      break;
    case "h4":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `16px`;
        fontSizePicker.value = `16`;
        editor.createNewText("h4", currentStyles);
      }
      break;
    case "h5":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `14px`;
        fontSizePicker.value = `14`;
        editor.createNewText("h5", currentStyles);
      }
      break;
    case "h6":
      {
        const currentStyles = editor.getCurrentStyles();
        currentStyles.fontSize = `10px`;
        fontSizePicker.value = `10`;
        editor.createNewText("h6", currentStyles);
      }
      break;
    default:
      editor.createNewText([type], {});
      break;
  }
  page.focus({ preventScroll: true });
});

boldBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("bold");
  btnOn ? myToolbar.removeBtns(["bold"]) : myToolbar.addBtns(["bold"]);
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.fontWeight === 600) {
    stylesToAdd.fontWeight = "normal";
  } else {
    stylesToAdd.fontWeight = 600;
  }
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle(stylesToAdd);
  } else {
    editor.nestSpan(stylesToAdd);
  }
  page.focus({ preventScroll: true });
});

italicBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("italic");
  btnOn ? myToolbar.removeBtns(["italic"]) : myToolbar.addBtns(["italic"]);
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.fontStyle === "italic") {
    stylesToAdd.fontStyle = "normal";
  } else {
    stylesToAdd.fontStyle = "italic";
  }
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle(stylesToAdd);
  } else {
    editor.nestSpan(stylesToAdd);
  }
  page.focus({ preventScroll: true });
});

underlineBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("underline");
  btnOn
    ? myToolbar.removeBtns(["underline"])
    : [
        myToolbar.addBtns(["underline"]),
        myToolbar.removeBtns(["line-through"]),
      ];
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.textDecoration === "underline") {
    stylesToAdd.textDecoration = "normal";
  } else {
    stylesToAdd.textDecoration = "underline";
  }
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle(stylesToAdd);
  } else {
    editor.nestSpan(stylesToAdd);
  }
  page.focus({ preventScroll: true });
});

strikeThroughBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("line-through");
  btnOn
    ? myToolbar.removeBtns(["line-through"])
    : [
        myToolbar.addBtns(["line-through"]),
        myToolbar.removeBtns(["underline"]),
      ];
  const stylesToAdd = editor.getCurrentStyles();
  if (stylesToAdd.textDecoration === "line-through") {
    stylesToAdd.textDecoration = "normal";
  } else {
    stylesToAdd.textDecoration = "line-through";
  }
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle(stylesToAdd);
  } else {
    editor.nestSpan(stylesToAdd);
  }
  page.focus({ preventScroll: true });
});

leftBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("left");
  if (!btnOn) {
    myToolbar.addBtns(["left"]);
  }
  myToolbar.removeBtns(["right", "center"]);
  editor.updateBufferStyle({ textAlign: "left" });
  page.focus({ preventScroll: true });
});

centerBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("center");
  if (!btnOn) {
    myToolbar.addBtns(["center"]);
  }
  myToolbar.removeBtns(["left", "right"]);
  editor.updateBufferStyle({ textAlign: "center" });
  page.focus({ preventScroll: true });
});

rightBtn.addEventListener("click", () => {
  const btnOn = myToolbar.checkBtnStyle("right");
  if (!btnOn) {
    myToolbar.addBtns(["right"]);
  }
  myToolbar.removeBtns(["left", "center"]);
  editor.updateBufferStyle({ textAlign: "right" });
  page.focus({ preventScroll: true });
});

ulBtn.addEventListener("click", () => {
  editor.createList("ul", "p", editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

olBtn.addEventListener("click", () => {
  editor.createList("ol", "p", editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

checkListBtn.addEventListener("click", () => {
  editor.createList("ul", "input", editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

indentBtn.addEventListener("click", (e) => {
  editor.updateBufferStyle({ textIndent: `${indent + 1 * 2}em` });
  page.focus({ preventScroll: true });
  indent++;
  lastIndent = true;
});

outdentBtn.addEventListener("click", (e) => {
  if (lastIndent === true) {
    indent -= 2;
    lastIndent = false;
  }
  editor.updateBufferStyle({ textIndent: `${indent * 2}em` });
  page.focus({ preventScroll: true });
  if (indent === 0) {
    return;
  }
  indent--;
});

plusFont.addEventListener("click", () => {
  const currentIndex = fontSizePicker.selectedIndex;
  const newIndex = (currentIndex + 1) % fontSizePicker.options.length;
  fontSizePicker.selectedIndex = newIndex;
  const value = fontSizePicker.options[newIndex].value;
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle({ fontSize: `${value}px` });
  } else {
    editor.nestSpan({ ...editor.getCurrentStyles, fontSize: `${value}px` });
  }
  page.focus({ preventScroll: true });
});

minusFont.addEventListener("click", () => {
  const currentIndex = fontSizePicker.selectedIndex;
  const newIndex = (currentIndex - 1) % fontSizePicker.options.length;
  fontSizePicker.selectedIndex = newIndex;
  const value = fontSizePicker.options[newIndex].value;
  if (editor.getBuffer().print().length < 1) {
    editor.updateBufferStyle({ fontSize: `${value}px` });
  } else {
    editor.nestSpan({ ...editor.getCurrentStyles, fontSize: `${value}px` });
  }
  page.focus({ preventScroll: true });
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
      if (editor.getBuffer().print().length < 1) {
        editor.updateBufferStyle(currentStyles);
      } else {
        editor.nestSpan(currentStyles);
      }
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
      // if (editor.getBuffer().print().length < 1) {
      //   editor.updateBufferStyle(currentStyles);
      // } else {
      // }
      toolbar.removeChild(newColorSelect);
      page.focus({ preventScroll: true });
    });
    newColorSelect.appendChild(newColor);
  });
  toolbar.appendChild(newColorSelect);
});

imgBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.classList.add("image-defaults");
      img.src = e.target.result;
      img.alt = file.name;
      page.appendChild(img);
    };
    reader.readAsDataURL(file);
    console.log("Image received");
  } else {
    console.log("No image received");
  }
});

quoteBtn.addEventListener("click", () => {
  editor.createNewQuote(editor.getCurrentStyles());
  page.focus({ preventScroll: true });
});

codeBtn.addEventListener("click", () => {
  editor.createNewCode({
    ...editor.getCurrentStyles(),
    fontFamily: "'Courier New', Courier, monospace",
  });
  page.focus({ preventScroll: true });
});

linkBtn.addEventListener("click", (e) => {
  const linkInput = document.getElementById("link-input");
  const newInput = document.createElement("input");
  const rect = linkBtn.getBoundingClientRect();
  myToolbar.addBtns(["link-btn"]);
  linkInput.appendChild(newInput);
  linkInput.classList.add("show");
  linkInput.style.top = `${rect.top + rect.height}px`;
  linkInput.style.left = `${rect.left}px`;
  newInput.value = "https://";
  newInput.focus({ preventScroll: true });
  newInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      editor.createNewText("a", {
        ...editor.getCurrentStyles(),
        textDecoration: "underline",
        color: "#0000EE",
        fontStyle: "italic",
      });
      editor.currentTextBuffer.DOMNode.href = newInput.value;
      editor.currentTextBuffer.DOMNode.target = "_blank";
      linkInput.value = "";
      linkInput.classList.remove("show");
      myToolbar.removeBtns(["link-btn"]);
      page.focus({ preventScroll: true });
    }
  });
});

navBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const btnText = e.target.innerText;
    const rect = e.target.getBoundingClientRect();
    switch (btnText) {
      case "File":
        break;
      case "Edit":
        break;
      case "View":
        break;
      case "Insert":
        break;
      case "Format":
        break;
      case "Tools":
        break;
      case "help":
        break;
    }
  });
});

// Drag handlers for resizing document padding
let beginningX;
// let beginningY;
handleLeftTop.addEventListener("dragstart", (e) => {
  const x = e.pageX;
  beginningX = x;
  handleLeftTop.style.left = `${x}px`;
});

handleLeftTop.addEventListener("drag", (e) => {
  const x = e.pageX;
  handleLeftTop.style.left = `${x}px`;
});

handleLeftTop.addEventListener("dragend", (e) => {
  const x = e.pageX;
  handleLeftTop.style.left = `${x}px`;
  // find a way to snap handle to nearest 8th
  const deltaX = x - beginningX;
  const computedPadding = window.getComputedStyle(page);
  const multiplier =
    measurementUnit === "in" ? 1 : measurementUnit === "cm" ? 2.54 : 25.4;
  const additionalPadding =
    ((parseFloat(computedPadding.paddingLeft) + deltaX) / dpi) * multiplier;
  console.log(additionalPadding);
  page.style.paddingLeft = `${additionalPadding}${measurementUnit}`;
  pagePaddingWidthInput.value = additionalPadding;
  page.focus({ preventScroll: true });
});

handleRightTop.addEventListener("dragstart", (e) => {
  const x = e.pageX;
  beginningX = x;
  handleRightTop.style.left = `${x}px`;
});

handleRightTop.addEventListener("drag", (e) => {
  const x = e.pageX;
  handleRightTop.style.left = `${x}px`;
});

handleRightTop.addEventListener("dragend", (e) => {
  const x = e.pageX;
  handleRightTop.style.left = `${x}px`;
  // find a way to snap handle to nearest 8th
  const deltaX = x - beginningX;
  const computedPadding = window.getComputedStyle(page);
  const multiplier =
    measurementUnit === "in" ? 1 : measurementUnit === "cm" ? 2.54 : 25.4;
  const additionalPadding =
    ((parseFloat(computedPadding.paddingRight) - deltaX) / dpi) * multiplier;
  page.style.paddingRight = `${additionalPadding}${measurementUnit}`;
  pagePaddingWidthInput.value = additionalPadding;
  page.focus({ preventScroll: true });
});

// handleTopLeft.addEventListener("dragstart", (e) => {
//   const y = e.pageY;
//   beginningY = y;
//   handleTopLeft.style.top = `${y}px`;
// });

// handleTopLeft.addEventListener("drag", (e) => {
//   const y = e.pageY;
//   handleTopLeft.style.top = `${y}px`;
// });

// handleTopLeft.addEventListener("dragend", (e) => {
//   const y = e.pageY;
//   handleTopLeft.style.top = `${y}px`;
//   // find a way to snap handle to nearest 8th
//   const deltaY = y - beginningY;
//   const computedPadding = window.getComputedStyle(page);
//   const additionalPadding =
//     (parseFloat(computedPadding.paddingTop) + deltaY) / dpi;
//   page.style.paddingTop = `${Math.round(additionalPadding * 8) / 8}in`;
//   page.focus({ preventScroll: true });
// });

// handleBottomLeft.addEventListener("dragstart", (e) => {
//   const y = e.pageY;
//   beginningY = y;
//   handleBottomLeft.style.top = `${y}px`;
// });

// handleBottomLeft.addEventListener("drag", (e) => {
//   const y = e.pageY;
//   handleBottomLeft.style.top = `${y}px`;
// });

// handleBottomLeft.addEventListener("dragend", (e) => {
//   const y = e.pageY;
//   handleBottomLeft.style.top = `${y}px`;
//   // find a way to snap handle to nearest 8th
//   const deltaY = y - beginningY;
//   const computedPadding = window.getComputedStyle(page);
//   const additionalPadding =
//     (parseFloat(computedPadding.paddingTop) - deltaY) / dpi;
//   page.style.paddingBottom = `${Math.round(additionalPadding * 8) / 8}in`;
//   page.focus({ preventScroll: true });
// });

printBtn.addEventListener("click", () => {
  window.print();
});

let prevDist = 0;
topRed.addEventListener("dragstart", (e) => {
  topRed.style.top = `${e.pageY}px`;
  prevDist = e.pageY;
});

topRed.addEventListener("drag", (e) => {
  if (e.pageY === 0) return;
  const bottomStyles = window.getComputedStyle(bottomRed);
  const pageStyles = window.getComputedStyle(page);
  const currentBottomRedTop = parseFloat(bottomStyles.top);
  const pageMarginTop = parseFloat(pageStyles.marginTop);
  const disTraveled = e.pageY - prevDist;
  topRed.style.top = `${e.pageY}px`;
  bottomRed.style.top = `${currentBottomRedTop - disTraveled}px`;
  const diffBetweenLines = Math.abs(
    e.pageY - (currentBottomRedTop - disTraveled)
  );
  page.style.marginTop = `${disTraveled + pageMarginTop}px`;
  page.style.height = `${diffBetweenLines}px`;
  page.style.minHeight = `${diffBetweenLines}px`;
  page.style.maxHeight = `${diffBetweenLines}px`;
  pageHeightInput.value = `${diffBetweenLines / dpi}`;
  prevDist = e.pageY;
});

topRed.addEventListener("dragend", (e) => {
  topRed.style.top = `${e.pageY}px`;
  prevDist = 0;
});

// bottomRed.addEventListener("dragstart", (e) => {});

// bottomRed.addEventListener("drag", (e) => {});

// bottomRed.addEventListener("dragend", (e) => {});

// rightRed.addEventListener("dragstart", (e) => {});

// rightRed.addEventListener("drag", (e) => {});

// rightRed.addEventListener("dragend", (e) => {});

leftRed.addEventListener("dragstart", (e) => {
  leftRed.style.left = `${e.pageX}px`;
  prevDist = e.pageX;
});

leftRed.addEventListener("drag", (e) => {
  if (e.pageX === 0) return;
  const rightStyles = window.getComputedStyle(rightRed);
  // const pageStyles = window.getComputedStyle(page);
  const currentRightRedLeft = parseFloat(rightStyles.left);
  // const pageMarginTop = parseFloat(pageStyles.marginTop);
  const disTraveled = e.pageX - prevDist;
  leftRed.style.left = `${e.pageX}px`;
  rightRed.style.left = `${currentRightRedLeft - disTraveled}px`;
  const diffBetweenLines = Math.abs(
    e.pageX - (currentRightRedLeft - disTraveled)
  );
  // page.style.marginTop = `${disTraveled + pageMarginTop}px`;
  page.style.width = `${diffBetweenLines}px`;
  page.style.minWidth = `${diffBetweenLines}px`;
  page.style.maxWidth = `${diffBetweenLines}px`;
  pageWidthInput.value = `${diffBetweenLines / dpi}`;
  placeHandles();
  prevDist = e.pageX;
});

leftRed.addEventListener("dragend", (e) => {
  leftRed.style.left = `${e.pageX}px`;
  prevDist = 0;
});

let pageWidthInit = 8.5;
pageWidthInput.addEventListener("focus", (e) => {
  pageWidthInit = parseFloat(e.target.value);
});
pageWidthInput.addEventListener("change", (e) => {
  const value = parseFloat(e.target.value).toFixed(2);
  if (value > 20) {
    pageWidthInput.value = pageWidthInit;
    // Notify user of invalid input
    return;
  }
  if (isNaN(value)) {
    pageWidthInput.value = pageWidthInit;
    return;
  }
  page.style.width = `${value}${measurementUnit}`;
  page.style.maxWidth = `${value}${measurementUnit}`;
  page.style.minWidth = `${value}${measurementUnit}`;
  placeHandles();
  createRedLines();
});

let pageHeightInit = 11;
pageHeightInput.addEventListener("focus", (e) => {
  pageHeightInit = parseFloat(e.target.value);
});
pageHeightInput.addEventListener("change", (e) => {
  const value = parseFloat(e.target.value).toFixed(2);
  if (value > 20) {
    pageHeightInput.value = pageHeightInit;
    // Notify user of invalid input
    return;
  }
  if (isNaN(value)) {
    pageHeightInput.value = pageHeightInit;
    return;
  }
  page.style.height = `${value}${measurementUnit}`;
  page.style.maxHeight = `${value}${measurementUnit}`;
  page.style.minHeight = `${value}${measurementUnit}`;
  // create adjustable margin to react as though you were dragging the red lines
  // const pageStyles = window.getComputedStyle(page);
  // const marginTop = parseFloat(pageStyles.marginTop);
  // page.marginTop = `calc(${marginTop}px - ${value - pageHeightInit}in)`;
  placeHandles();
  createRedLines();
});

let pagePadWidthInit = 1.0;
pagePaddingWidthInput.addEventListener("focus", (e) => {
  pagePadWidthInit = parseFloat(e.target.value);
});

pagePaddingWidthInput.addEventListener("change", (e) => {
  const value = parseFloat(e.target.value).toFixed(1);
  if (value > 3) {
    pagePaddingWidthInput.value = pagePadWidthInit;
    // Notify user of invalid input
    return;
  }
  if (isNaN(value)) {
    pagePaddingWidthInput.value = pagePadWidthInit;
    return;
  }
  page.style.paddingLeft = `${value}${measurementUnit}`;
  page.style.paddingRight = `${value}${measurementUnit}`;
  pagePaddingWidthInput.value = value;
  pagePaddingHor = value;
  placeHandles();
});

let prevDefMeasure;
userMeasurementSelect.addEventListener("focus", (e) => {
  prevDefMeasure = userMeasurementSelect.value;
});

userMeasurementSelect.addEventListener("change", (e) => {
  const value = e.target.value;
  const pageStyles = window.getComputedStyle(page);
  const currentWidth = parseFloat(pageStyles.width).toFixed(1);
  const currentHeight = parseFloat(pageStyles.height).toFixed(1);
  const currentPaddingHeight = parseFloat(pageStyles.paddingTop).toFixed(1);
  const currentPaddingWidth = parseFloat(pageStyles.paddingLeft).toFixed(1);
  const wInInch = currentWidth / dpi;
  const wInMm = (currentWidth / dpi) * 25.4;
  const wInCm = (currentWidth / dpi) * 2.54;
  const hInInch = currentHeight / dpi;
  const hInMm = (currentHeight / dpi) * 25.4;
  const hInCm = (currentHeight / dpi) * 2.54;
  const pHInInch = currentPaddingHeight / dpi;
  const pHInMm = (currentPaddingHeight / dpi) * 25.4;
  const pHInCm = (currentPaddingHeight / dpi) * 2.54;
  const pWInInch = currentPaddingWidth / dpi;
  const pWInMm = (currentPaddingWidth / dpi) * 25.4;
  const pWInCm = (currentPaddingWidth / dpi) * 2.54;
  let newWidth;
  let newHeight;
  let newPadWidth;
  let newPadHeight;
  measurementUnit = value;
  switch (value) {
    case "mm":
      {
        console.log("to mm");
        switch (prevDefMeasure) {
          case "in":
            console.log("from in");
            newWidth = wInInch * 25.4;
            newHeight = hInInch * 25.4;
            newPadWidth = pWInInch * 25.4;
            newPadHeight = pHInInch * 25.4;
            break;
          case "cm":
            console.log("from cm");
            newWidth = wInCm / 0.1;
            newHeight = hInCm / 0.1;
            newPadWidth = pWInCm / 0.1;
            newPadHeight = pHInCm / 0.1;
            break;
        }
      }
      break;
    case "in":
      {
        console.log("to in");
        switch (prevDefMeasure) {
          case "mm":
            console.log("from mm");
            newWidth = wInMm / 25.4;
            newHeight = hInMm / 25.4;
            newPadWidth = pWInMm / 25.4;
            newPadHeight = pHInMm / 25.4;
            break;
          case "cm":
            console.log("from cm");
            newWidth = wInCm / 2.54;
            newHeight = hInCm / 2.54;
            newPadWidth = pWInCm / 2.54;
            newPadHeight = pHInCm / 2.54;
            break;
        }
      }
      break;
    case "cm":
      {
        console.log("to cm");
        switch (prevDefMeasure) {
          case "in":
            console.log("from in");
            newWidth = wInInch * 2.54;
            newHeight = hInInch * 2.54;
            newPadWidth = pWInInch * 2.54;
            newPadHeight = pHInInch * 2.54;
            break;
          case "mm":
            console.log("from mm");
            newWidth = wInMm * 0.1;
            newHeight = hInMm * 0.1;
            newPadWidth = pWInMm * 0.1;
            newPadHeight = pHInMm * 0.1;
            break;
        }
      }
      break;
    default:
      console.log("def");
      newWidth = 8.5;
      newHeight = 11;
      newPadWidth = 1;
      newPadHeight = 1;
      measurementUnit = "in";
      break;
  }
  console.log(newWidth, value);
  pageWidthInput.value = newWidth;
  pageHeightInput.value = newHeight;
  pagePaddingHeightInput.value = newPadHeight;
  pagePaddingWidthInput.value = newPadWidth;
  page.style.height = `${newHeight}${value}`;
  page.style.minHeight = `${newHeight}${value}`;
  page.style.maxHeight = `${newHeight}${value}`;
  page.style.width = `${newWidth}${value}`;
  page.style.minWidth = `${newWidth}${value}`;
  page.style.maxWidth = `${newWidth}${value}`;
  page.style.padding = `${newPadHeight}${value} ${newPadWidth}${value}`;
  pagePaddingHor = newWidth;
  pagePaddingVert = newHeight;
  prevDefMeasure = value;
  // Create new measurement side bar and top bar when adjusting measurement values???????
  // createMeasurements(newHeight, newWidth);
  // Why does this not seem to work properly when i regenerate the handle styles? HMMMMMMMMMMMMMMMMMMMMMMM
  // placeHandles();
  // createRedLines();
});

restDemsBtn.addEventListener("click", () => {
  measurementUnit = "in";
  userMeasurementSelect.value = "in";
  pagePaddingHeightInput.value = 1.0;
  pagePaddingWidthInput.value = 1.0;
  pageWidthInput.value = 8.5;
  pageHeightInput.value = 11.0;
  pagePaddingHor = 1.0;
  pagePaddingVert = 1.0;
  // Everything below this line should not be repeated and instead placed into it's own function to be
  // called here and at script initialization
  const height = dpi * 11;
  const width = dpi * 8.5;
  // const rect = page.getBoundingClientRect();
  // page.style.marginTop = `${toolbar.offsetHeight}px`;
  page.style.height = `${height}px`;
  page.style.minHeight = `${height}px`;
  page.style.maxHeight = `${height}px`;
  page.style.width = `${width}px`;
  page.style.minWidth = `${width}px`;
  page.style.maxWidth = `${width}px`;
  page.style.padding = `${pagePaddingVert}${measurementUnit} ${pagePaddingHor}${measurementUnit}`;
  createMeasurements(height, width);
  placeHandles();
  createRedLines();
});

window.addEventListener("DOMContentLoaded", initialize);
window.addEventListener("resize", () => {
  placeHandles();
  createRedLines();
});
