import { getElement, on } from './helpers.js';

const filtersModule = (catalogModule) => {
    let originalProducts = [];

    // Фильтрация товаров
    const filterProducts = () => {
        const selectedStatus = getElement('input[name="status"]:checked')?.value;
        const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(checkbox => checkbox.value);

        let filtered = [...originalProducts];

        if (selectedStatus !== 'all-item') {
            const filterInStock = selectedStatus === 'instock';
            filtered = filtered.filter(product => {
                const hasAvailability = Object.values(product.availability).some(count => count > 0);
                return filterInStock ? hasAvailability : true;
            });
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter(product => {
                if (Array.isArray(product.type)) {
                    return product.type.some(type => selectedTypes.includes(type));
                } else {
                    return selectedTypes.includes(product.type);
                }
            });
        }

        catalogModule.setFilteredProducts(filtered);
    };

    const sortProducts = (sortBy) => {
        let sorted = [...catalogModule.getFilteredProducts()];

        switch (sortBy) {
            case 'price-min':
                sorted.sort((a, b) => a.price.new - b.price.new);
                break;
            case 'price-max':
                sorted.sort((a, b) => b.price.new - a.price.new);
                break;
            case 'rating-max':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        catalogModule.setFilteredProducts(sorted);
    };

    // Применение фильтров и сортировки
    const applyFiltersAndSort = () => {
        const sortedBy = getElement('.catalog__sort-select')?.value;
        filterProducts();
        if (sortedBy) {
            sortProducts(sortedBy);
        }
    };

    const initTypeFilter = () => {
        const typeCheckboxes = document.querySelectorAll('input[name="type"]');
        typeCheckboxes.forEach(checkbox => {
            on(checkbox, 'change', applyFiltersAndSort);
        });
    };

    const initSortFilter = () => {
        const sortSelect = getElement('.catalog__sort-select');
        if (sortSelect) {
            on(sortSelect, 'change', applyFiltersAndSort);
        }
    };

    const initStatusFilter = () => {
        const statusRadios = document.querySelectorAll('input[name="status"]');
        statusRadios.forEach(radio => {
            on(radio, 'change', applyFiltersAndSort);
        });
    };

    const initResetFiltersButton = () => {
        const resetButton = getElement('.catalog-form__reset');
        if (!resetButton) {
            console.warn('Фильтры: Кнопка "Сбросить фильтры" не найдена.');
            return;
        }

        on(resetButton, 'click', (event) => {
            event.preventDefault();
            const typeCheckboxes = document.querySelectorAll('input[name="type"]:checked');
            typeCheckboxes.forEach(checkbox => checkbox.checked = false);

            const statusRadios = document.querySelectorAll('input[name="status"]');
            statusRadios.forEach(radio => {
                if (radio.value === 'all-item') {
                    radio.checked = true;
                }
            });

            const sortSelect = getElement('.catalog__sort-select');
            if (sortSelect) {
                sortSelect.value = 'default';
            }

            applyFiltersAndSort();
        });
    };

    const setOriginalProducts = (products) => {
        originalProducts = products;
    };

    const init = (products) => {
        originalProducts = products;
        initTypeFilter();
        initSortFilter();
        initStatusFilter();
        initResetFiltersButton();
        applyFiltersAndSort();
    };

    return {
        init,
        applyFiltersAndSort,
        setOriginalProducts
    };
};

export default filtersModule;