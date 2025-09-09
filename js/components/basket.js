import { getElement, on } from './helpers.js';

const basketModule = () => {
    let basket = [];
    let originalProducts = []; 

    const basketUIElements = {
        toggleButton: getElement('.header__user-btn'),
        element: getElement('.header__basket.basket'),
        list: getElement('.basket__list'),
        emptyBlock: getElement('.basket__empty-block'),
        counter: getElement('.header__user-count'),
    };

    // Загрузка корзины из LocalStorage
    const loadBasketFromLocalStorage = () => {
        const storedBasket = localStorage.getItem('basket');
        if (storedBasket) {
            try {
                basket = JSON.parse(storedBasket);
                updateBasketUI();
            } catch (error) {
                console.error("Корзина: Ошибка при разборе данных из LocalStorage", error);
                // Если данные повреждены, очищаем корзину
                basket = [];
                localStorage.removeItem('basket');
                updateBasketUI();
            }
        }
    };

    // Сохранение корзины в LocalStorage
    const saveBasketToLocalStorage = () => {
        localStorage.setItem('basket', JSON.stringify(basket));
    };

    // Обновление интерфейса корзины
    const updateBasketUI = () => {
        if (!basketUIElements.list || !basketUIElements.emptyBlock || !basketUIElements.counter) {
            console.warn("Корзина: элементы UI не найдены.");
            return;
        }

        basketUIElements.list.innerHTML = '';
        basketUIElements.counter.textContent = basket.length;
        basketUIElements.emptyBlock.style.display = basket.length ? 'none' : 'block';

        basket.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.className = 'basket__item';
            listItem.innerHTML = createBasketItemMarkup(item);
            basketUIElements.list.appendChild(listItem);
        });
    };

    // Создание разметки элемента корзины
    const createBasketItemMarkup = (item) => `
        <div class="basket__img">
            <img src="${item.image}" alt="${item.name}" height="60" width="60">
        </div>
        <span class="basket__name">${item.name}</span>
        <span class="basket__price">${item.price.new} руб</span>
        <button class="basket__item-close" style="background: transparent !important; border: none !important;" type="button" data-product-id="${item.id}">
            <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
                <use xlink:href="images/sprite.svg#icon-close"></use>
            </svg>
        </button>
    `;

    // Добавление товара в корзину
    const addToBasket = (productId) => {
        const product = originalProducts.find(item => item.id === productId);
        if (!product) {
            console.warn(`Корзина: Товар с ID ${productId} не найден.`);
            return;
        }

        basket.push(product);
        updateBasketUI();
        saveBasketToLocalStorage();
    };

    // Удаление товара из корзины
    const removeFromBasket = (productId) => {
        basket = basket.filter(item => item.id !== productId);
        updateBasketUI();
        saveBasketToLocalStorage();
    };

    // Функция для установки originalProducts
    const setOriginalProducts = (products) => {
        originalProducts = products;
    };

    on(basketUIElements.toggleButton, 'click', () => {
        basketUIElements.element.classList.toggle('basket--active');
    });

    on(basketUIElements.list, 'click', (event) => {
        const button = event.target.closest('.basket__item-close');
        if (button) {
            const productId = parseInt(button.dataset.productId, 10);
            removeFromBasket(productId);
        }
    });

    loadBasketFromLocalStorage();

    return { addToBasket, setOriginalProducts, getUIElements: () => basketUIElements, removeFromBasket };
};

export default basketModule; 

