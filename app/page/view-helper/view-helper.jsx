export function animateHide(el) {
  el.className = el.className += " animate-hide";
  el.style.opacity = 0;
  setTimeout(() => {
    el.parentNode.removeChild(el);
  }, 500);
}