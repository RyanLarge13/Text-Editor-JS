import colors from "../constants/colors.js";
import Editor from "./editor.js";
import Toolbar from "./toolbar.js";

let dpi;
let indent = 0;
let lastIndent = true;

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("toolbar-btn-container");
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
const activeBtns = [];

// Initialization calls
const initialize = () => {
  page.focus({ preventScroll: true });
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
  page.style.padding = "1in";
  createMeasurements(height, width);
  placeHandles();
  createRedLines();
};

const createRedLines = () => {
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
  handleLeftTop.style.left = `calc(${pageLeft}px + 1in)`;
  handleRightTop.style.left = `calc(${pageRight}px - 1in)`;
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
  myToolbar.toggleBtns(["bold"]);
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
  myToolbar.toggleBtns(["italic"]);
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
  myToolbar.toggleBtns(["underline"]);
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
  myToolbar.toggleBtns(["line-through"]);
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
  const additionalPadding =
    (parseFloat(computedPadding.paddingLeft) + deltaX) / dpi;
  page.style.paddingLeft = `${Math.round(additionalPadding * 8) / 8}in`;
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
  const additionalPadding =
    (parseFloat(computedPadding.paddingRight) - deltaX) / dpi;
  page.style.paddingRight = `${Math.round(additionalPadding * 8) / 8}in`;
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

window.addEventListener("DOMContentLoaded", initialize);
window.addEventListener("resize", () => {
  placeHandles();
  createRedLines();
});
