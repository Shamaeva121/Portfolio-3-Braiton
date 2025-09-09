import { getElement, on } from './helpers.js';

const tippyModule = () => {
    // Инициализация Tippy.js
    const init = (element) => {
        if(!element){
            return;
        }

        const tooltipButton = element.querySelector('.tooltip__btn');
        if (tooltipButton) {
            const tooltipContent = element.querySelector('.tooltip__content');
            if (tooltipContent) {
                tippy(tooltipButton, {
                    content: tooltipContent.innerHTML,
                    allowHTML: true,
                    placement: 'top',
                    arrow: true,
                    duration: 300,
                    animation: 'scale',
                });
            }
        }
    };

    return { init };
};

export default tippyModule;