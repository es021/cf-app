export function animateHide(el, finishHandler) {
  el.className = el.className += " animate-hide";
  el.style.opacity = 0;
  setTimeout(() => {
    el.parentNode.removeChild(el);
    if(finishHandler){
      finishHandler();
    }
  }, 500);
}