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

  toggleBtns(btns, toggle) {
    btns.forEach((btn) => {
      if (this.toggles.length < 1) {
        this.toggles.push(btn);
        this.styleActiveBtns(btn, toggle);
        return true;
      }
      const contains = this.toggles.includes(btn);
      if (contains) {
        const newToggles = this.toggles.filter((aBtn) => aBtn !== btn);
        this.toggles = newToggles;
        this.styleActiveBtns(btn, toggle);
        return false;
      }
      if (!contains) {
        this.toggles.push(btn);
        this.styleActiveBtns(btn, toggle);
        return true;
      }
    });
  }
}

export default Toolbar;
