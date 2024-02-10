const page = document.getElementById("text-editor");

class Buffer {
  constructor() {
    this.buffer = new Array(10).fill(" ");
    this.gapStart = 0;
    this.indexState = 0;
    this.gapEnd = 10;
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
    console.log("expanding");
    const newSize = this.buffer.length * 2;
    for (var i = this.buffer.length; i <= newSize; i++) {
      this.buffer[i] = " ";
    }
    this.gapEnd = newSize;
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
    this.gapStart--;
    this.indexState--;
  }

  print() {
    const beforeGap = this.buffer.slice(0, this.gapStart);
    const afterGap = this.buffer.slice(this.gapEnd);
    return beforeGap.concat(afterGap).join("");
  }

  printRaw() {
    return this.buffer;
  }

  getCurrentPos() {
    return this.indexState;
  }

  movePosBack(amount) {
    this.indexState -= amount;
    if (this.indexState <= 0) {
      this.indexState = 0;
      return;
    }
  }

  movePosForward(amount) {
    if (
      this.indexState + amount >
      this.buffer.length - (this.gapEnd - this.gapStart)
    ) {
      this.expandBuffer();
    }
    this.indexState += amount;
    for (let i = 0; i < amount; i++) {
      this.insert(" ", this.indexState);
    }
  }

  getSize() {
    return this.buffer.length;
  }
}

class Editor {
  constructor() {}
  print(gapBuffer) {
    const text = gapBuffer.print();
    page.innerText = text;
  }
}

const editor = new Editor();
const gapBuffer = new Buffer();
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
      gapBuffer.movePosForward(2);
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
  editor.print(gapBuffer);
  console.log(gapBuffer.printRaw());
});
