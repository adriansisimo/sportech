gsap.registerPlugin(SplitText);

const split = SplitText.create(
  ".Logo", { type: "chars" }
);

gsap.timeline()
  .set(".preLoader", { autoAlpha: 1 }, 0)
  .from(".Logo", {
    scale: 0.7,
    duration: 2.5,
    ease: "none"
  }, 0
)
  .from(
    split.chars, {
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "none"
  }, 0
)
.from(
  split.chars, {
    rotationY: 360,
    duration: 0.6,
    stagger: 0.15,
    ease: "none"
}, 0.2
)
.to(".preLoader", {
  autoAlpha: 0,
  duration: 1.5,
  ease: "power1.out"
}, 3.5
)
.to("main", {
  opacity: 1,
  duration: 0.6,
}, 4.5
)
.set(document.body, { overflow: "auto" }, 5);