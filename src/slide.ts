import Timeout from "./Timeout.js";

export default class Slide {
  container;
  elements;
  controls;
  timer;
  index;
  slide;
  timeout: Timeout | null;
  paused;
  pausedTimeout: Timeout | null;
  constructor(
    container: Element,
    elements: Element[],
    controls: Element,
    timer: number
  ) {
    this.container = container;
    this.elements = elements;
    this.controls = controls;
    this.timer = timer;

    this.timeout = null;
    this.pausedTimeout = null;
    this.index = 0;
    this.slide = this.elements[this.index];
    this.paused = false;

    this.init();
  }

  hide(element: Element) {
    element.classList.remove("active");
  }

  show(index: number) {
    this.index = index;
    this.slide = this.elements[this.index];
    this.elements.forEach((elemento) => this.hide(elemento));
    this.slide.classList.add("active");
    this.auto(this.timer);
  }

  auto(timer: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), timer);
  }

  prev() {
    if (!this.paused) {
      const prev = this.index > 0 ? this.index - 1 : this.elements.length - 1;
      this.show(prev);
    }
  }

  next() {
    if (!this.paused) {
      const next = this.index + 1 < this.elements.length ? this.index + 1 : 0;
      this.show(next);
    }
  }

  pause() {
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
    }, 300);
  }

  continue() {
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
    }
  }

  private addControls() {
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide Anterior";
    nextButton.innerText = "Próximo Slide";
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    this.controls.addEventListener("pointerdown", () => this.pause());
    this.controls.addEventListener("pointerup", () => this.continue());
    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private init() {
    this.addControls();
    this.show(this.index);
  }
}
