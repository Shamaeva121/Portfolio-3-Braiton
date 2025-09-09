import { getElement, on } from './helpers.js';

const dayProductsModule = (catalogModule, tippyInit, basket) => { 
    const slideList = getElement('.day-products__list');

    if (!slideList) {
        console.warn("Товары дня: элемент .day-products__list не найден");
        return;
    }

    const createSlidesForDayProducts = (products) => {
        if (!products || products.length === 0) {
            slideList.innerHTML = '';
            return;
        }

        slideList.innerHTML = '';
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.classList.add('day-products__item', 'swiper-slide');
            listItem.innerHTML = catalogModule.createProductCardMarkup(product);
            tippyInit(listItem);
            slideList.appendChild(listItem);
        });
    };

    const loadDayProducts = (data) => {
        if (!data || !Array.isArray(data)) {
            console.warn("Товары дня: Данные отсутствуют или имеют неверный формат.");
            return;
        }

        const dayProducts = data.filter(product => product.goodsOfDay);
        createSlidesForDayProducts(dayProducts);
    };

    // Добавим обработчик событий для кнопок "В корзину" на слайдах
    on(slideList, 'click', (event) => {
        const button = event.target.closest('.add-to-basket-btn');
        if (button) {
            const productId = parseInt(button.getAttribute('data-product-id'), 10);
            basket.addToBasket(productId); 
        }
    });


    return { loadDayProducts };
};

export default dayProductsModule;