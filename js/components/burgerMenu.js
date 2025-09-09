import { getElement, on } from './helpers.js';

const burgerMenuModule = () => {
    const menu = getElement('.header__catalog.main-menu');
    const openButton = getElement('.header__catalog-btn');
    const closeButton = getElement('.main-menu__close');

    if (!menu || !openButton || !closeButton) {
        console.warn("Бургер-меню: элементы не найдены.");
        return;
    }

    on(openButton, 'click', () => menu.classList.add('main-menu--active'));
    on(closeButton, 'click', () => menu.classList.remove('main-menu--active'));
};

export default burgerMenuModule;