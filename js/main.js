import burgerMenuModule from './components/burgerMenu.js';
import citySelectionModule from './components/citySelection.js';
import basketModule from './components/basket.js';
import catalogModule from './components/catalog.js';
import dayProductsModule from './components/dayProducts.js';
import accordionModule from './components/accordion.js';
import filtersModule from './components/filters.js';
import sliderModule from './components/slider.js';
import tippyModule from './components/tippy.js';
import initFormValidation from './components/formValidation.js';
import { getElement, on } from './components/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Инициализируем модули
    burgerMenuModule();
    citySelectionModule();
    initFormValidation(); // Валидация формы

    const tippyInstance = tippyModule(); // Инициализация модуля Tippy
    const catalog = catalogModule(tippyInstance.init); 
    const basket = basketModule();
    const filters = filtersModule(catalog); // Передаем catalog
    const dayProducts = dayProductsModule(catalog, tippyInstance.init, basket); 
    const slider = sliderModule();
    const accordion = accordionModule(); // Создаём экземпляр модуля аккордеона

    // 2. Загружаем данные каталога
    const products = await catalog.loadProducts();
    // 3. После загрузки данных:
    if (products && products.length > 0) {
        catalog.setOriginalProducts(products); // передаем товары в catalog
        filters.setOriginalProducts(products);

        // 4. Инициализируем фильтры
        filters.init(products);

        basket.setOriginalProducts(products); // передаем оригинальные товары в корзину
        dayProducts.loadDayProducts(products); // Загружаем товары дня


        // == События для добавления и удаления товаров из корзины ==
        const productList = catalog.productList;
        if (productList) {
            productList.addEventListener('click', (event) => {
                const button = event.target.closest('.add-to-basket-btn');
                if (button) {
                    const productId = parseInt(button.getAttribute('data-product-id'), 10);
                    basket.addToBasket(productId);
                }
            });
        }
        const basketUIElements = basket.getUIElements();
        if (basketUIElements.list) {
            basketUIElements.list.addEventListener('click', (event) => {
                const button = event.target.closest('.basket__item-close');
                if (button) {
                    const productId = parseInt(button.getAttribute('data-product-id'), 10);
                    basket.removeFromBasket(productId);
                }
            });
        }
    }
    // 6. Инициализируем слайдер и аккордеон
    slider.init(); // Инициализация слайдера
    accordion.init(); // Инициализация аккордеона
    // 7.  Инициализация tippy
    const initTippyElements = () => {
        const elementsWithTooltip = document.querySelectorAll('.product-card, .day-products__item');
        elementsWithTooltip.forEach(element => {
            tippyInstance.init(element);
        });
    };
    initTippyElements();
});