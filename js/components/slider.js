import { getElement, on } from './helpers.js';

const sliderModule = () => {
    const init = () => {
        const swiper = new Swiper('.day-products__slider', {
            navigation: {
                nextEl: '.day-products__navigation-btn--next',
                prevEl: '.day-products__navigation-btn--prev',
            },
            spaceBetween: 20,
            slidesPerView: 4,
        });
    };

    return { init };
};

export default sliderModule;