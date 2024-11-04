export default class Slide {
  container;
  elements;
  controls;
  timer;
  index;
  slide;
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

    this.index = 0;
    this.slide = this.elements[this.index];

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
  }

  prev() {
    const prev = this.index > 0 ? this.index - 1 : this.elements.length - 1;
    this.show(prev);
  }

  next() {
    const next = this.index + 1 < this.elements.length ? this.index + 1 : 0;
    this.show(next);
  }

  private addControls() {
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide Anterior";
    nextButton.innerText = "Próximo Slide";
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private init() {
    this.addControls();
    this.show(this.index);
  }
}
