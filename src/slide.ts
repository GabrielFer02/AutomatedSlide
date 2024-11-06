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
  thumbItems: HTMLElement[] | null;
  thumb: HTMLElement | null;
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
    this.index = window.localStorage.getItem("activeSlide")
      ? Number(window.localStorage.getItem("activeSlide"))
      : 0;
    this.slide = this.elements[this.index];
    this.paused = false;

    this.thumbItems = null;
    this.thumb = null;

    this.init();
  }

  hide(element: Element) {
    element.classList.remove("active");
    if (element instanceof HTMLVideoElement) {
      element.currentTime = 0;
      element.pause();
    }
  }

  show(index: number) {
    this.index = index;
    this.slide = this.elements[this.index];
    window.localStorage.setItem("activeSlide", String(this.index));

    if (this.thumbItems?.length) {
      this.thumb = this.thumbItems[this.index];
      this.thumbItems.forEach((element) => this.hide(element));
      this.thumb.classList.add("active");
    }

    this.elements.forEach((elemento) => this.hide(elemento));
    this.slide.classList.add("active");
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.timer);
    }
  }

  autoVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.play();
    let firstPlay = true;
    video.addEventListener("playing", () => {
      if (firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }

  auto(timer: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), timer);
    if (this.thumb) this.thumb.style.animationDuration = `${timer}ms`;
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
    document.body.classList.add("paused");
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
      this.thumb?.classList.add("paused");
      if (this.slide instanceof HTMLVideoElement) {
        this.slide.pause();
      }
    }, 300);
  }

  continue() {
    document.body.classList.remove("paused");
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      this.thumb?.classList.remove("paused");
      if (this.slide instanceof HTMLVideoElement) {
        this.slide.play();
      }
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
    document.addEventListener("pointerup", () => this.continue());
    document.addEventListener("touchend", () => this.continue());
    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private addThumbItems() {
    const thumbContainer = document.createElement("div");
    thumbContainer.id = "slide-thumb";
    for (let index = 0; index < this.elements.length; index++) {
      thumbContainer.innerHTML += `<span><span class="thumb-item"></span></span>`;
    }
    this.controls.appendChild(thumbContainer);
    this.thumbItems = Array.from(document.querySelectorAll(".thumb-item"));
  }

  private init() {
    this.addControls();
    this.addThumbItems();
    this.show(this.index);
  }
}
