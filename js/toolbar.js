class Toolbar {
  constructor() {
    this.allBtns = document.querySelectorAll("toolbar-btn");
  }

  getBtn(id) {
    const btn = document.getElementById(id);
    return btn;
  }

  styleBtn(btn, toggle) {
    const theBtn = document.querySelector(`.${btn}`);
    if (!theBtn) {
      return;
    }
    if (toggle) {
      theBtn.classList.add("active-btn");
    }
    if (!toggle) {
      theBtn.classList.remove("active-btn");
    }
  }

  removeBtns(btns) {
    btns.forEach((btn) => {
      this.styleBtn(btn, false);
    });
  }

  addBtns(btns) {
    btns.forEach((btn) => {
      this.styleBtn(btn, true);
    });
  }

  checkBtnStyle(btn) {
    const theBtn = document.querySelector(`.${btn}`);
    if (theBtn.classList.contains("active-btn")) {
      return true;
    } else {
      return false;
    }
  }
}

export default Toolbar;
