import { getElement, on } from './helpers.js';

const citySelectionModule = () => {
    const cityButton = getElement('.location__city');
    const cityName = getElement('.location__city-name');
    const cityList = getElement('.location__sublist');

    if (!cityButton || !cityName || !cityList) {
        console.warn("Выбор города: элементы не найдены.");
        return;
    }

    on(cityButton, 'click', (event) => {
        event.stopPropagation();
        cityButton.classList.toggle('location__city--active');
    });

    on(cityList, 'click', (event) => {
        event.stopPropagation();
        const target = event.target.closest('.location__sublink');
        if (target) {
            cityName.textContent = target.textContent;
            cityList.classList.remove('location__city--active');
        }
    });

    on(document, 'click', () => cityList.classList.remove('location__city--active'));
};

export default citySelectionModule;