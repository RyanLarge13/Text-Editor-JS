const page = document.getElementById("text-editor");
const toolbar = document.getElementById("tool-bar");
const defaultPadding = 15;

const initialize = () => {
  resize();
};

const resize = () => {
  const toolbarHight = toolbar.getBoundingClientRect().height;
  page.style.height = `${
    window.innerHeight - toolbarHight - defaultPadding * 2
  }px`;
  page.style.width = `${(window.innerWidth - defaultPadding * 2) / 2}px`;
  page.style.padding = `${defaultPadding}px`;
};

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
      return;
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
  }

  print() {
    const beforeGap =
      this.buffer.slice(0, this.gapStart).join("") +
      `<span class="cursor">|</span>`;
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
  constructor() {}
  print(element) {
    const text = element.buffer.print();
    element.DOMNode.innerHTML = text;
  }
  createNewText(currentElement, gapBuffer) {
    const newTextBuffer = {
      type: "p",
      DOMNode: page.appendChild(document.createElement("p")),
      buffer: new Buffer(),
      styles: [],
    };
    elements.push(newTextBuffer);
    gapBuffer = newTextBuffer.buffer;
    currentElement = newTextBuffer.DOMNode;
  }
}

const editor = new Editor();
const elements = [
  {
    type: "p",
    DOMNode: page.appendChild(document.createElement("p")),
    buffer: new Buffer(),
    styles: [],
  },
];
let currentElement = elements[0];
let gapBuffer = currentElement.buffer;
page.addEventListener("keydown", (e) => {
  e.preventDefault();
  const key = e.key;
  switch (key) {
    case "Backspace":
      gapBuffer.erase(gapBuffer.getCurrentPos());
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
      editor.createNewText(currentElement, gapBuffer);
      break;
    default:
      gapBuffer.insert(e.key, gapBuffer.getCurrentPos());
      break;
  }
  editor.print(currentElement);
  console.log(gapBuffer.printRaw());
});

page.addEventListener("focusout", (e) => {
  const cursor = document.querySelector(".cursor");
  cursor.classList.add("hidden");
});

page.addEventListener("focusin", (e) => {
  const cursor = document.querySelector(".cursor");
  cursor.classList.remove("hidden");
});

page.addEventListener("mouseup", (e) => {
  // checkForSelection()
  console.log(e);
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

const checkForSelection = () => {};

window.addEventListener("resize", resize);
window.addEventListener("DOMContentLoaded", initialize);
