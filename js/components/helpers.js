export const on = (element, event, callback) => {
    if (element) {
        element.addEventListener(event, callback);
    }
};

export const getElement = (selector) => document.querySelector(selector);