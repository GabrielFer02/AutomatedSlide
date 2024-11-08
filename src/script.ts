import Slide from "./slide.js";

const container = document.getElementById("slide");
const elements = document.getElementById("slide-elements")?.children;
const controls = document.getElementById("slide-controls");

if (container && elements?.length && controls) {
  new Slide(container, Array.from(elements), controls, 3000);

}
