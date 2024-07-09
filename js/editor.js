import Buffer from "./buffer.js";

class Editor {
  constructor(page) {
    this.page = page;
    this.elements = [
      {
        type: "p",
        DOMNode: this.page.appendChild(document.createElement("p")),
        buffer: new Buffer(),
        styles: {
          fontSize: "12px",
          fontStyle: "normal",
          fontFamily: "Arial",
          fontWeight: 400,
          textDecoration: "normal",
          textAlign: "left",
          lineHeight: "1em",
          color: "#000000",
          backgroundColor: "transparent",
        },
        children: [],
        parent: this.page,
      },
    ];
    this.length = 0;
    this.currentTextBuffer = this.elements[this.length];
    this.clickHandler = this.clickHandler.bind(this);
    this.currentTextBuffer.DOMNode.addEventListener("click", this.clickHandler);
    Object.assign(this.currentTextBuffer.DOMNode.style, {
      fontSize: "12px",
      fontStyle: "normal",
      fontFamily: "Arial",
      fontWeight: 400,
      textDecoration: "normal",
      textAlign: "left",
      lineHeight: "1em",
      color: "#000000",
      backgroundColor: "transparent",
    });
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
    const type = this.currentTextBuffer.DOMNode.tagName.toLowerCase();
    return type;
  }

  getParentType() {
    const type = this.currentTextBuffer.parent.tagName.toLowerCase();
    return type;
  }

  getCurrentStyles() {
    return this.currentTextBuffer.styles;
  }

  updateBufferStyle(styles) {
    Object.assign(this.currentTextBuffer.DOMNode.style, styles);
    this.currentTextBuffer.styles = {
      ...this.currentTextBuffer.style,
      ...styles,
    };
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

  createSpan() {}

  createNewQuote(styles) {
    const newQuote = document.createElement("blockquote");
    this.page.appendChild(newQuote);
    const newTextBuffer = {
      type: "blockquote",
      DOMNode: newQuote,
      buffer: new Buffer(),
      styles: styles,
      children: [],
      parent: this.page,
    };
    if (styles) {
      Object.assign(newQuote.style, styles);
    }
    newQuote.addEventListener("click", this.clickHandler);
    this.print(false);
    this.elements.push(newTextBuffer);
    this.length += 1;
    this.currentTextBuffer = newTextBuffer;
    this.print(true);
  }

  createList(type, inputType, styles) {
    const newList = document.createElement(type);
    const newLi = document.createElement("li");
    const input = document.createElement(inputType);
    newLi.appendChild(input);
    newList.appendChild(newLi);
    if (inputType === "input") {
      input.type = "checkbox";
    }
    this.page.appendChild(newList);
    const newTextBuffer = {
      type: inputType,
      DOMNode: input,
      buffer: new Buffer(),
      styles: styles,
      children: [],
      parent: newList,
    };
    if (styles) {
      Object.assign(input.style, styles);
    }
    input.addEventListener("click", this.clickHandler);
    this.print(false);
    this.elements.push(newTextBuffer);
    this.length += 1;
    this.currentTextBuffer = newTextBuffer;
    this.print(true);
  }

  createNewText(type, styles) {
    this.print(false);
    const newElem = document.createElement(type);
    this.page.appendChild(newElem);
    const newTextBuffer = {
      type: type,
      DOMNode: newElem,
      buffer: new Buffer(),
      styles: styles,
      children: [],
      parent: this.page,
    };
    if (styles) {
      Object.assign(newElem.style, styles);
    }
    newElem.addEventListener("click", this.clickHandler);
    this.print(false);
    this.elements.push(newTextBuffer);
    this.length += 1;
    this.currentTextBuffer = newTextBuffer;
    this.print(true);
  }

  nestListElem(type, styles) {
    this.print(false);
    const parent = this.currentTextBuffer.parent;
    const newLi = document.createElement("li");
    const newElem = document.createElement(type);
    newLi.appendChild(newElem);
    parent.appendChild(newLi);
    const newTextBuffer = {
      type: type,
      DOMNode: newElem,
      buffer: new Buffer(),
      styles: styles,
      children: [],
      parent: parent,
    };
    if (styles) {
      Object.assign(newElem.style, styles);
    }
    this.elements.push(newTextBuffer);
    this.length += 1;
    newElem.addEventListener("click", this.clickHandler);
    this.currentTextBuffer = newTextBuffer;
    this.print(true);
  }

  nestSpan(styles) {
    this.print(false);
    let parent = this.currentTextBuffer.DOMNode;
    if (parent === this.page) {
      this.createNewText("p", this.getCurrentStyles());
      return;
    }
    if (parent.tagName.toLowerCase() === "span") {
      parent = this.currentTextBuffer.parent;
    }
    const newElem = document.createElement("span");
    parent.appendChild(newElem);
    const newTextBuffer = {
      type: "span",
      DOMNode: newElem,
      buffer: new Buffer(),
      styles: styles,
      children: [],
      parent: parent,
    };
    if (styles) {
      Object.assign(newElem.style, styles);
    }
    this.elements.push(newTextBuffer);
    this.length += 1;
    newElem.addEventListener("click", this.clickHandler);
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

  eraseLastList() {
    const parent = this.currentTextBuffer.parent;
    parent.removeChild(parent.lastChild);
    // this.setBuffer(this.length - 1);
    this.elements.splice(this.length + 1, 1);
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
