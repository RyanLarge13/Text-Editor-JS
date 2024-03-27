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
  createNewText(type) {
    const newTextBuffer = {
      type: type,
      DOMNode: this.page.appendChild(document.createElement(type)),
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
      this.page.removeChild(this.currentTextBuffer.DOMNode);
      this.setBuffer(this.length - 1);
      this.elements.splice(this.length + 1, 1);
    }
  }
  clickHandler(e) {
    const letterWidth = 9;
    console.log(this.currentTextBuffer);
    const currentPos = this.currentTextBuffer.buffer.getCurrentPos();
    const offsetX = Math.floor(Math.round(e.offsetX / letterWidth));
    const placement = 10 - offsetX;
    if (currentPos < placement) {
      this.currentTextBuffer.buffer.movePosForward(placement);
    }
    if (currentPos > placement) {
      this.currentTextBuffer.buffer.movePosBack(placement);
    }
  }
}

export default Editor;
