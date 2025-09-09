import { getElement, on } from './helpers.js';

const catalogModule = (tippyInit) => {
    let originalProducts = [];
    let filteredProducts = [];
    const productList = getElement('.catalog__list');
    if (!productList) {
        console.warn('Каталог: элемент .catalog__list не найден.');
        return {};
    }

    let currentPage = 1;
    const itemsPerPage = 6;

    // Создание разметки карточки товара
    const createProductCardMarkup = (product) => `
        <div class="product-card">
            <div class="product-card__visual">
                <img class="product-card__img" src="${product.image}" height="436" width="290" alt="${product.name}">
                <div class="product-card__more">
                    <button class="product-card__link btn btn--icon add-to-basket-btn" data-product-id="${product.id}">
                        <span class="btn__text">В корзину</span>
                        <svg width="24" height="24" aria-hidden="true">
                            <use xlink:href="images/sprite.svg#icon-basket"></use>
                        </svg>
                    </button>
                    <a href="#" class="product-card__link btn btn--secondary">
                        <span class="btn__text">Подробнее</span>
                    </a>
                </div>
            </div>
            <div class="product-card__info">
                <h2 class="product-card__title">${product.name}</h2>
                ${product.price.old ? createOldPriceMarkup(product.price.old) : ''}
                <span class="product-card__price">
                    <span class="product-card__price-number">${product.price.new}</span>
                    <span class="product-card__price-add">₽</span>
                </span>
                <div class="product-card__tooltip tooltip">
                    <button class="tooltip__btn" aria-label="Показать подсказку">
                        <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
                            <use xlink:href="images/sprite.svg#icon-i"></use>
                        </svg>
                    </button>
                    <div class="tooltip__content">
                        <span class="tooltip__text">Наличие товара по городам:</span>
                        <ul class="tooltip__list">
                            ${createAvailabilityMarkup(product.availability)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Создание разметки старой цены
    const createOldPriceMarkup = (oldPrice) => `
        <span class="product-card__old">
            <span class="product-card__old-number">${oldPrice}</span>
            <span class="product-card__old-add">₽</span>
        </span>
    `;

    // Создание разметки доступности товара
    const createAvailabilityMarkup = (availability) => {
        return Object.entries(availability)
            .map(([city, count]) => `
                <li class="tooltip__item">
                    <span class="tooltip__text">${city}: <span class="tooltip__count">${count > 0 ? count : 'Нет в наличии'}</span></span>
                </li>
            `).join('');
    };

    const renderProducts = (productsToRender) => {
        if (!Array.isArray(productsToRender)) {
            console.warn('Каталог: productsToRender не является массивом.');
            productList.innerHTML = ''; // Очищаем список, если это не массив
            return;
        }

        productList.innerHTML = '';
        const totalPages = Math.ceil(productsToRender.length / itemsPerPage);

        if (totalPages === 0) {
            productList.innerHTML = '<p>Нет товаров, соответствующих вашему запросу</p>';
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, productsToRender.length);
        const currentProducts = productsToRender.slice(startIndex, endIndex);

        currentProducts.forEach((product) => {
            if (!product) {
                console.warn('Каталог: product не определен.');
                return;
            }
            const item = document.createElement('li');
            item.classList.add('catalog__item');
            item.innerHTML = createProductCardMarkup(product);
            tippyInit(item); // Инициализация Tippy для каждого товара с использованием переданной функции
            productList.appendChild(item);
        });
        renderPagination(totalPages);
    };

    // Отрисовка пагинации
    const renderPagination = (totalPages) => {
        const paginationContainer = getElement('.catalog__pagination');
        if (!paginationContainer) {
            console.warn("Каталог: элемент пагинации не найден.");
            return;
        }

        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('catalog__pagination-link');
            on(button, 'click', () => {
                currentPage = i;
                renderProducts(filteredProducts);
            });
            if (i === currentPage) {
                button.classList.add('active');
            }
            paginationContainer.appendChild(button);
        }
    };

    const setOriginalProducts = (products) => {
        originalProducts = products;
        filteredProducts = [...originalProducts];
    };

    // Загрузка товаров
    const loadProducts = async () => {
        try {
            const response = await fetch('./data/data.json');
            if (!response.ok) {
                throw new Error("Каталог: Ошибка при загрузке данных");
            }
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Каталог: data.json не содержит массив товаров.');
            }

            setOriginalProducts(data);
            renderProducts(filteredProducts);

            return data;
        } catch (error) {
            console.error("Каталог: Ошибка при загрузке или обработке данных:", error);
            return [];
        }
    };

    const setFilteredProducts = (products) => {
        filteredProducts = products;
        renderProducts(filteredProducts);
    };

    const getOriginalProducts = () => {
        return originalProducts;
    };

    const getFilteredProducts = () => {
        return filteredProducts;
    };

    return {
        renderProducts,
        loadProducts,
        originalProducts,
        filteredProducts,
        createProductCardMarkup,
        setOriginalProducts,
        setFilteredProducts,
        getOriginalProducts,
        getFilteredProducts,
        productList
    };
};

export default catalogModule;