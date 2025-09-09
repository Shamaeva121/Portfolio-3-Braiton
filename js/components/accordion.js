import { on } from './helpers.js'; 

const accordionModule = () => {
    const accordionButtons = document.querySelectorAll('.accordion__btn');

    if (!accordionButtons || accordionButtons.length === 0) {
        console.warn("Аккордеон: кнопки аккордеона не найдены.");
        return;
    }

    const init = () => {
        accordionButtons.forEach(button => {
            const content = button.nextElementSibling;

            content.style.maxHeight = '0'; 
            content.style.overflow = 'hidden'; 

            on(button, 'click', () => {
                const isActive = button.classList.contains('accordion__btn--active');
                const currentlyActiveButton = document.querySelector('.accordion__btn--active');

                if (currentlyActiveButton && currentlyActiveButton !== button) {
                    currentlyActiveButton.classList.remove('accordion__btn--active');
                    const currentlyActiveContent = currentlyActiveButton.nextElementSibling;
                    collapseContent(currentlyActiveContent);
                }

                if (isActive) {
                    button.classList.remove('accordion__btn--active');
                    collapseContent(content);
                } else {
                    button.classList.add('accordion__btn--active');
                    expandContent(content);
                }
            });
        });
    };

    const collapseContent = (content) => {
        content.style.transition = 'max-height 0.5s ease-out'; 
        content.style.maxHeight = content.scrollHeight + 'px';
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                content.style.maxHeight = '0'; 
            });
        });
    };

    const expandContent = (content) => {
        content.style.transition = 'max-height 0.5s ease-in'; 
        content.style.maxHeight = content.scrollHeight + 'px'; 
    };

    return { init };
};

export default accordionModule;
