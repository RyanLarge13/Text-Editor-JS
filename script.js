class Buffer {
  constructor() {
    this.buffer = new Array(10).fill(" ");
    this.gapStart = 0;
    this.indexState = 0;
    this.gapEnd = 10;
    this.newLines = 0;
    this.currentLineCount = 0;
  }

  moveGap(index) {
    if (index < this.gapStart) {
      const offset = this.gapStart - index;
      this.buffer.splice(
        index,
        0,
        ...this.buffer.splice(this.gapStart, this.gapEnd - this.gapStart)
      );
      this.gapStart = index;
      this.gapEnd -= offset;
      this.indexState = index;
    } else if (index > this.gapStart) {
      const offset = this.gapStart - index;
      this.buffer.splice(
        this.gapStart,
        0,
        ...this.buffer.splice(this.gapEnd, offset)
      );
      this.gapStart += offset;
      this.gapEnd = index;
      this.indexState = index;
    }
  }

  expandBuffer() {
    const addSize = 10;
    const newBuffer = new Array(addSize).fill(" ");
    this.buffer.splice(this.gapEnd, 0, ...newBuffer);
    this.gapEnd += addSize;
  }

  insert(c, index) {
    if (index < 0 || index > this.buffer.length) {
      return;
    }
    if (this.gapStart !== this.gapEnd) {
      this.moveGap(index);
    }
    if (this.gapStart === this.gapEnd) {
      this.expandBuffer();
    }
    if (c === "\n") {
      this.currentLineCount = 0;
      this.newLines += 1;
    } else {
      this.currentLineCount += 1;
    }
    this.buffer[this.gapStart] = c;
    this.gapStart++;
    this.indexState++;
  }

  erase(index) {
    if (index <= 0 || index > this.gapEnd) {
      return 0;
    }
    if (this.gapStart != this.gapEnd) {
      this.moveGap(index);
    }
    const c = this.buffer[this.gapStart - 1];
    if (c === "\n") {
      this.newLines -= 1;
      let currentLineLength = 0;
      for (let i = this.indexState; i > 0; i--) {
        currentLineLength++;
        if (this.buffer[i] === "\n") {
          break;
        }
      }
      this.currentLineCount = currentLineLength;
    } else {
      this.currentLineCount -= 1;
    }
    this.buffer[this.gapStart - 1] = " ";
    this.gapStart--;
    this.indexState--;
    return 1;
  }

  print(withCursor) {
    const beforeGap = withCursor
      ? this.buffer.slice(0, this.gapStart).join("") +
        `<span class="cursor">|</span>`
      : this.buffer.slice(0, this.gapStart).join("");
    const afterGap = this.buffer.slice(this.gapEnd).join("");
    return beforeGap.concat(afterGap);
  }

  printRaw() {
    return this.buffer;
  }

  printSelection(start, end) {
    console.log(this.buffer.slice(start, end));
  }

  getCurrentPos() {
    return this.indexState;
  }

  getGapEnd() {
    return this.gapEnd;
  }

  movePosBack(amount) {
    if (this.indexState - 1 < 0) {
      this.indexState = 0;
      return;
    }
    for (let i = this.gapStart; i >= this.gapStart - amount; i--) {
      this.buffer[this.gapEnd - 1] = this.buffer[i];
      this.buffer[i] = " ";
    }
    this.indexState -= amount;
    this.gapStart -= amount;
    this.gapEnd -= amount;
  }

  movePosForward(amount) {
    if (
      this.indexState + amount >
      this.buffer.length - (this.gapEnd - this.gapStart)
    ) {
      return;
    }
    for (let i = 0; i < amount; i++) {
      this.buffer[this.gapStart] = this.buffer[this.gapEnd];
      this.buffer[this.gapEnd] = " ";
    }
    this.indexState += amount;
    this.gapStart += amount;
    this.gapEnd += amount;
  }

  getSize() {
    return this.buffer.length;
  }
}

class Editor {
  constructor() {
    this.elements = [
      {
        type: "p",
        DOMNode: page.appendChild(document.createElement("p")),
        buffer: new Buffer(),
        styles: [],
      },
    ];
    this.length = 0;
    this.currentTextBuffer = this.elements[this.length];
    this.print(true);
  }
  print(withCursor) {
    const text = this.currentTextBuffer.buffer.print(withCursor);
    this.currentTextBuffer.DOMNode.innerHTML = text;
  }
  getBuffer() {
    return this.currentTextBuffer.buffer;
  }
  setBuffer(index) {
    this.print(false);
    this.length = index;
    this.currentTextBuffer = this.elements[this.length];
  }
  setElemType(elem) {
    this.currentTextBuffer.type = elem;
    const newElem = document.createElement(elem);
    newElem.innerHTML = this.currentTextBuffer.buffer.print(true);
    page.replaceChild(newElem, this.currentTextBuffer.DOMNode);
    this.currentTextBuffer.DOMNode = newElem;
  }
  createNewText(type) {
    const newTextBuffer = {
      type: type,
      DOMNode: page.appendChild(document.createElement(type)),
      buffer: new Buffer(),
      styles: [],
    };
    this.print(false);
    this.elements.push(newTextBuffer);
    this.length += 1;
    this.currentTextBuffer = newTextBuffer;
  }
  eraseBuff() {
    if (this.currentTextBuffer !== null && this.length !== 0) {
      page.removeChild(this.currentTextBuffer.DOMNode);
      this.setBuffer(this.length - 1);
      this.elements.splice(this.length + 1, 1);
    }
  }
}

class Toolbar {
  constructor() {}
  getBtn(id) {
    const btn = document.getElementById(id);
    return btn;
  }
}

const page = document.getElementById("text-editor");
const toolbar = document.getElementById("tool-bar");
const defaultPadding = 15;
const editor = new Editor();
const myToolbar = new Toolbar();
const h1Btn = myToolbar.getBtn("h1");
let elemType = "p";

h1Btn.addEventListener("click", () => {
  editor.setElemType("h1");
});

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

page.addEventListener("click", (e) => {
  page.focus();
});

page.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString();
  if (selectedText !== "") {
    const range = selection.getRangeAt(0);
    const start = range.startOffset;
    const end = range.endOffset;
    const completeStartIndex =
      start < gapBuffer.getCurrentPos()
        ? start
        : start + (gapBuffer.getGapEnd() - gapBuffer.getCurrentPos());
    const completeEndIndex =
      end < gapBuffer.getCurrentPos()
        ? end
        : end + (gapBuffer.getGapEnd() - gapBuffer.getCurrentPos());
    gapBuffer.printSelection(completeStartIndex, completeEndIndex);
  }
});

window.addEventListener("resize", resize);
window.addEventListener("DOMContentLoaded", initialize);
