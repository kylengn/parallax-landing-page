import "./style.css";

// IMAGE SLIDER

const slideBtns = document.querySelectorAll("[data-slideBtn]");
const slideContainer = document.querySelector("[data-slideContainer]");
const slides = [...document.querySelectorAll("[data-slide]")];
let currentIndex = 0;
let isMoving = false;

// Handle Button Click
const handleSlideBtnClick = (e) => {
  // TODO: see if slider is already moving
  if (isMoving) return;
  isMoving = true;
  e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;
  slideContainer.dispatchEvent(new Event("sliderMove"));
};

// Remove/Add attribute function
const removeDisabledAttribute = (els) =>
  els.forEach((el) => el.removeAttribute("disabled"));
const addDisabledAttribute = (els) =>
  els.forEach((el) => el.setAttribute("disabled", "true"));

// EVENT LISTENERS
slideBtns.forEach((btn) => btn.addEventListener("click", handleSlideBtnClick));

slideContainer.addEventListener("sliderMove", () => {
  // 1. Translate the container to the right/left
  slideContainer.style.transform = `translateX(-${
    currentIndex * slides[0].clientWidth
  }px)`;
  // 2. Remove disabled attributes
  removeDisabledAttribute(slideBtns);
  // 3. Renable disabled attribute if needed
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
});

// Transition end event
slideContainer.addEventListener("transitionend", () => (isMoving = false));

// Disable image drag events
document
  .querySelectorAll("[data-slide] img")
  .forEach((img) => (img.ondragstart = () => false));

// Intersection observer for slider
const slideObserver = new IntersectionObserver(
  (slide) => {
    if (slide[0].isIntersecting) addDisabledAttribute([slideBtns[1]]);
  },
  { threshold: 0.75 }
);

slideObserver.observe(slides[slides.length - 1]);

// FORM HANDLE
const contactForm = document.querySelector("#contact-form");
const contactBtn = document.querySelector("#contact-btn");
const contactInput = document.querySelector("#email");

// Fake sending email to api endpoint
const postEmailToDatabase = (email) => {
  console.info(`Your email is ${email}`);
  return new Promise((resolve) => setTimeout(resolve, 2000));
};

// Options for submit button
const contactBtnOptions = {
  pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">
      Sending...
    </span>
  `,
  success: `
    <span class="uppercase tracking-wide">
      Thank you!
    </span>
    <span class="uppercase tracking-wide">
      ??????
    </span>
  `,
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]);
  contactBtn.innerHTML = contactBtnOptions.pending;
  const userEmail = contactInput.value;
  contactInput.style.display = "none";
  await postEmailToDatabase(userEmail);
  contactBtn.innerHTML = contactBtnOptions.success;
};

// Event listener form submit
contactForm.addEventListener("submit", handleFormSubmit);

// FADE UP OBSERVER
const fadeUpObserverCallback = (elsToWatch) => {
  elsToWatch.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add("faded");
      fadeUpObserver.unobserve(el.target);
      el.target.addEventListener(
        "transitionend",
        () => {
          el.target.classList.remove("fade-up", "faded");
        },
        { once: true }
      );
    }
  });
};

const fadeUpObserverOptions = {
  threshold: 0.6,
};

const fadeUpObserver = new IntersectionObserver(
  fadeUpObserverCallback,
  fadeUpObserverOptions
);

document.querySelectorAll(".fade-up").forEach((item) => {
  fadeUpObserver.observe(item);
});
