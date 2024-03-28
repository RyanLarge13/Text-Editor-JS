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
      const offset = index - this.gapStart;
      this.buffer.splice(
        index,
        0,
        ...this.buffer.splice(this.gapStart, this.gapEnd - this.gapStart)
      );
      this.gapStart = index;
      this.gapEnd += offset;
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
    this.moveGap(this.getCurrentPos() - amount);
    // for (let i = this.gapStart; i >= this.gapStart - amount; i--) {
    //   this.buffer[this.gapEnd - 1] = this.buffer[i];
    //   this.buffer[i] = " ";
    // }
    // this.indexState -= amount;
    // this.gapStart -= amount;
    // this.gapEnd -= amount;
  }

  movePosForward(amount) {
    if (
      this.indexState + amount >
      this.buffer.length - (this.gapEnd - this.gapStart)
    ) {
      return;
    }
    this.moveGap(this.getCurrentPos() + amount);
    // for (let i = 0; i < amount; i++) {
    //   this.buffer[this.gapStart] = this.buffer[this.gapEnd];
    //   this.buffer[this.gapEnd] = " ";
    // }
    // this.indexState += amount;
    // this.gapStart += amount;
    // this.gapEnd += amount;
  }
  getSize() {
    return this.buffer.length;
  }
}

export default Buffer;
