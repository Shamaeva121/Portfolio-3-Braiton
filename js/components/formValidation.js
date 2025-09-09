import { getElement, on } from './helpers.js';

const initFormValidation = () => {
    const form = document.querySelector('.questions__form');
    if (!form) {
        console.warn('Форма не найдена.');
        return;
    }

    const validation = new JustValidate('.questions__form', {
        errorLabelStyle: {
            color: 'red',
        },
        focusInvalidField: true,
    });

    validation.addField('#name', [
        {
            rule: 'required',
            errorMessage: 'Как вас зовут?',
        },
        {
            rule: 'minLength',
            value: 3,
            errorMessage: 'Не короче 3 символов',
        },
        {
            rule: 'maxLength',
            value: 30,
            errorMessage: 'Слишком длинное имя',
        },
    ])
        .addField('#email', [
            {
                rule: 'required',
                errorMessage: 'Укажите ваш e-mail',
            },
            {
                rule: 'email',
                errorMessage: 'Email не корректный!',
            }
        ])
        .addField('#agree', [
            {
                rule: 'required',
                errorMessage: 'Согласие обязательно',
            },
        ]);

    const createMessage = (text) => {
        const message = document.createElement('div');
        message.classList.add('message');
        const content = document.createElement('div');
        content.classList.add('message__content');
        content.textContent = text;
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('message__close');
        content.append(closeBtn);
        message.append(content);
        return message;
    };

    const renderMessage = (text) => {
        const message = createMessage(text);
        document.body.append(message);
        const contentElement = message.querySelector('.message__content');
        const closeBtn = message.querySelector('.message__close');
        closeBtn.addEventListener('click', () => {
            message.remove();
        });
    };

    validation.onSuccess((event) => {
        event.preventDefault();
        onSendDataSuccess();
    });

    const onSendDataSuccess = () => {
        renderMessage('Благодарим за обращение!', true);
    };

    const onSendDataError = () => {
        renderMessage('Не удалось отправить обращение');
    };
};

export default initFormValidation;