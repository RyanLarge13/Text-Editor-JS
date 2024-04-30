class Toolbar {
  constructor() {
    this.toggles = [];
  }

  getBtn(id) {
    const btn = document.getElementById(id);
    return btn;
  }

  toggleBtns(btn) {
    if (this.toggles.length < 1) {
      this.toggles.push(btn);
      console.log(this.toggles);
      return;
    }
    const contains = this.toggles.includes(btn);
    if (contains) {
      const newToggles = this.toggles.filter((aBtn) => aBtn !== btn);
      this.toggles = newToggles;
      console.log(this.toggles);
      return;
    }
    if (!contains) {
      this.toggles.push(btn);
    }
    console.log(this.toggles);
  }
}

export default Toolbar;
