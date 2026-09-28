const typedEl = document.getElementById("typed");
const words = ["Freelancer.", "Photographer.", "Designer."];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = words[wordIndex];
  typedEl.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeLoop, 110);
    return;
  }
  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeLoop, 1400);
    return;
  }
  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 60);
    return;
  }
  deleting = false;
  wordIndex = (wordIndex + 1) % words.length;
  setTimeout(typeLoop, 250);
}

typeLoop();

const header = document.querySelector(".header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
});

toggle.addEventListener("click", () => {
  nav.classList.toggle("is-open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});

const filterButtons = document.querySelectorAll(".filters button");
const works = document.querySelectorAll(".work");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-on"));
    btn.classList.add("is-on");
    const filter = btn.dataset.filter;
    works.forEach((work) => {
      const show = filter === "all" || work.dataset.cat === filter;
      work.classList.toggle("is-hidden", !show);
    });
  });
});

// document.querySelector(".form").addEventListener("submit", (event) => {
//   event.preventDefault();
//   alert("Thanks. Your message is ready to connect to a backend.");
//   event.target.reset();
// });
