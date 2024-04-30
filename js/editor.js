import Buffer from "./buffer.js";

class Editor {
  constructor(page) {
    this.page = page;
    this.elements = [
      {
        type: "p",
        DOMNode: this.page.appendChild(document.createElement("p")),
        buffer: new Buffer(),
        styles: {},
        children: [],
        parent: this.page,
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
    // console.log(text);
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

  findElem(elem) {
    let foundElem;
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].DOMNode === elem) {
        foundElem = this.elements[i];
        break;
      }
    }
    return foundElem;
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
      styles: styles,
      children: [],
      parent: this.page,
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

  nestElem(type, styles) {
    this.print(false);
    let currentElem;
    const newElem = document.createElement(type);
    const parent = this.currentTextBuffer.parent;
    if (parent === this.page) {
      currentElem = this.currentTextBuffer.DOMNode;
    } else {
      currentElem = this.currentTextBuffer.parent;
    }
    currentElem.appendChild(newElem);
    const elemRef = this.findElem(currentElem);
    elemRef.children.push(newElem);
    const newTextBuffer = {
      type: type,
      DOMNode: newElem,
      buffer: new Buffer(),
      styles: { ...styles, ...this.currentTextBuffer.styles },
      children: [],
      parent: currentElem,
    };
    if (styles) {
      Object.assign(newTextBuffer.DOMNode.style, {
        ...styles,
        ...this.currentTextBuffer.styles,
      });
    }
    this.currentTextBuffer.DOMNode.addEventListener("click", this.clickHandler);
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
    const currentC = document.querySelector(".cursor");
    currentC.remove();
    if (this.currentTextBuffer.DOMNode !== elem) {
      for (let i = 0; i < this.elements.length; i++) {
        if (this.elements[i].DOMNode === elem) {
          this.currentTextBuffer = this.elements[i];
          break;
        }
      }
    }
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    range.setStart(elem, 0);
    let clickPos = range.endOffset;
    const c = elem.querySelector(".cursor");
    let clickPos2 = 0;
    if (c) {
      range.setStart(c, 0);
      clickPos2 = range.endOffset;
    }
    if (clickPos2 > 0) {
      this.currentTextBuffer.buffer.moveGap(
        clickPos2 + this.currentTextBuffer.buffer.getCurrentPos()
      );
    } else {
      this.currentTextBuffer.buffer.moveGap(clickPos);
    }
    this.print(true);
  }
}

export default Editor;
