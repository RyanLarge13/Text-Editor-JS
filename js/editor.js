import Buffer from "./buffer.js";

class Editor {
  constructor(page) {
    this.page = page;
    this.elements = [
      {
        type: "p",
        DOMNode: this.page.appendChild(document.createElement("p")),
        buffer: new Buffer(),
        styles: [],
      },
    ];
    this.length = 0;
    this.currentTextBuffer = this.elements[this.length];
    this.clickHandler = this.clickHandler.bind(this);
    this.currentTextBuffer.DOMNode.addEventListener("click", this.clickHandler);
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
    this.page.replaceChild(newElem, this.currentTextBuffer.DOMNode);
    this.currentTextBuffer.DOMNode = newElem;
  }
  getElemType() {
    const element = this.currentTextBuffer.DOMNode.tagName.toLowerCase();
    return element;
  }
  createNewText(types, styles) {
    const newElem = document.createElement(types[0]);
    let lastElem = newElem;
    for (let i = 0; i < types.length; i++) {
      const nextElemExists = types[i + 1];
      if (nextElemExists) {
        const nextElem = document.createElement(nextElemExists);
        newElem.appendChild(nextElem);
        lastElem = nextElem;
      }
    }
    this.page.appendChild(newElem);
    const newTextBuffer = {
      type: lastElem.tagName.toLowerCase(),
      DOMNode: lastElem,
      buffer: new Buffer(),
      styles: [],
    };
    if (styles) {
      Object.assign(newTextBuffer.DOMNode.style, styles);
    }
    newTextBuffer.DOMNode.addEventListener("click", this.clickHandler);
    console.log(newTextBuffer);
    this.print(false);
    this.elements.push(newTextBuffer);
    this.length += 1;
    this.currentTextBuffer = newTextBuffer;
    this.print(true);
  }
  eraseBuff() {
    if (this.currentTextBuffer !== null && this.length !== 0) {
      this.page.removeChild(this.currentTextBuffer.DOMNode);
      this.setBuffer(this.length - 1);
      this.elements.splice(this.length + 1, 1);
    }
  }
  updateBufferStyle(styles) {
    Object.assign(this.currentTextBuffer.DOMNode.style, styles);
  }
  clickHandler(e) {
    const elem = e.target;
    const c = elem.querySelector(".cursor");
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    range.setStart(elem, 0);
    let clickPos = range.endOffset;
    range.setStart(c, 0);
    let clickPos2 = range.endOffset;
    const currentPos = this.currentTextBuffer.buffer.getCurrentPos();
    if (clickPos2 <= 0) {
      this.currentTextBuffer.buffer.moveGap(clickPos);
    } else {
      const index = currentPos + clickPos;
      this.currentTextBuffer.buffer.moveGap(index);
    }
  }
}

export default Editor;
