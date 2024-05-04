class Toolbar {
  constructor() {
    this.toggles = [];
    this.allBtns = document.querySelectorAll("toolbar-btn");
  }

  getBtn(id) {
    const btn = document.getElementById(id);
    return btn;
  }

  styleActiveBtns(btn, toggle) {
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
      const newToggles = this.toggles.filter((aBtn) => aBtn !== btn);
      this.toggles = newToggles;
      this.styleActiveBtns(btn, false);
    });
  }

  addBtns(btns) {
    btns.forEach((btn) => {
      this.toggles.push(btn);
      this.styleActiveBtns(btn, true);
    });
  }

  toggleBtns(btns) {
    btns.forEach((btn) => {
      if (this.toggles.length < 1) {
        this.toggles.push(btn);
        this.styleActiveBtns(btn, true);
        return true;
      }
      const contains = this.toggles.includes(btn);
      if (contains) {
        const newToggles = this.toggles.filter((aBtn) => aBtn !== btn);
        this.toggles = newToggles;
        this.styleActiveBtns(btn, false);
        return false;
      }
      if (!contains) {
        this.toggles.push(btn);
        this.styleActiveBtns(btn, true);
        return true;
      }
    });
  }
}

export default Toolbar;
