let $_  = function(selector, parent = document) {
  return parent.querySelector(selector);
};

let $$_  = function(selector, parent = document) {
  return parent.querySelectorAll(selector);
};

let createElement = function(tagName, className, text) {

  let element = document.createElement(tagName);
  
  element.setAttribute('class', className);
  if (text) {
    element.textContent = text;
  }

  return element;
}