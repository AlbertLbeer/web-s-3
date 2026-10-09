const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cards = document.querySelectorAll(".project-card");
const root = document.documentElement;
const ambientLight = document.querySelector(".ambient-light");

const defaultGlow = "#ff775e";
let currentX = window.innerWidth / 2;
let currentY = window.innerHeight * 0.3;
let targetX = currentX;
let targetY = currentY;
let ambientFrame = null;

const updateAmbientLight = () => {
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  root.style.setProperty("--ambient-x", `${currentX}px`);
  root.style.setProperty("--ambient-y", `${currentY}px`);

  if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
    ambientFrame = window.requestAnimationFrame(updateAmbientLight);
  } else {
    ambientFrame = null;
  }
};

const moveAmbientLight = (event) => {
  if (!finePointer.matches || reducedMotion.matches) return;

  targetX = event.clientX;
  targetY = event.clientY;
  ambientLight.classList.add("is-active");

  if (ambientFrame === null) {
    ambientFrame = window.requestAnimationFrame(updateAmbientLight);
  }
};

document.addEventListener("pointermove", moveAmbientLight, { passive: true });
document.documentElement.addEventListener("pointerleave", () => {
  ambientLight.classList.remove("is-active");
  ambientLight.style.setProperty("--ambient-color", defaultGlow);
});

const resetCard = (card) => {
  card.classList.remove("is-tracking");
  card.style.setProperty("--rotate-x", "0deg");
  card.style.setProperty("--rotate-y", "0deg");
  card.style.setProperty("--shift-x", "0px");
  card.style.setProperty("--shift-y", "0px");
  card.style.setProperty("--pointer-x", "50%");
  card.style.setProperty("--pointer-y", "50%");
};

cards.forEach((card) => {
  const setCardGlow = () => {
    ambientLight.style.setProperty("--ambient-color", card.dataset.glow || defaultGlow);
  };

  card.addEventListener("pointerenter", setCardGlow);
  card.addEventListener("focus", setCardGlow);

  card.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;

    const media = card.querySelector(".project-media");
    const bounds = media.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
    const y = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height);
    const normalizedX = x / bounds.width - 0.5;
    const normalizedY = y / bounds.height - 0.5;

    card.classList.add("is-tracking");
    card.style.setProperty("--rotate-x", `${normalizedY * -7}deg`);
    card.style.setProperty("--rotate-y", `${normalizedX * 7}deg`);
    card.style.setProperty("--shift-x", `${normalizedX * 4}px`);
    card.style.setProperty("--shift-y", `${normalizedY * 4}px`);
    card.style.setProperty("--pointer-x", `${(x / bounds.width) * 100}%`);
    card.style.setProperty("--pointer-y", `${(y / bounds.height) * 100}%`);
  });

  card.addEventListener("pointerleave", () => {
    resetCard(card);
    ambientLight.style.setProperty("--ambient-color", defaultGlow);
  });
  card.addEventListener("blur", () => {
    resetCard(card);
    ambientLight.style.setProperty("--ambient-color", defaultGlow);
  });
});
