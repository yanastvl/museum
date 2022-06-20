import {
    imageComparison
} from "./explore.js"

import {
    shuffleGallery
} from "./gallery.js"

import {
    calcTotalPrice,
    fillTicketFormModal,
    calcTotalPriceModal
} from "./ticket_calculator.js"

import {
    initMap
} from "./map.js"

import {
    initDateModal,
    updateDateTime
} from "./date_modal.js"

import {
    videoPlayer
} from "./video_player.js"


$(document).ready(function ($) {


    // fill ticket order form from localstorage

    let bookingTickets = JSON.parse(localStorage.getItem("bookingTickets"));
    if (bookingTickets) {
        document.getElementById("totalPrice").innerHTML = bookingTickets["totalPrice"];
        document.getElementById("basicTicketsNum").value = bookingTickets["basicTicketsNum"]
        document.getElementById("seniorTicketsNum").value = bookingTickets["seniorTicketsNum"]
        let ticketType = document.getElementById(bookingTickets["ticketType"]);
        ticketType.checked = true;
    };


    // modal window

    $('#modalButton').click(function () {
        fillTicketFormModal();
        $('#modalWindow').toggleClass('form__active');
    });

    $('.booking__close').click(function () {
        $(this).parents('#modalWindow').toggleClass('form__active');
    });

    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            $('#modalWindow').removeClass('form__active');
        }
    });

    $('.booking__wrapper').click(function (e) {
        if ($(e.target).closest('.booking').length == 0) {
            $(this).toggleClass('form__active');
        }
    });


    // burger menu

    function toggleMenu() {
        $('.menu-btn').toggleClass('menu_btn_rotate');
        $('.menu__items').toggleClass('menu__toggle');
        $('.welcome__info').toggleClass('hidden')
    }

    function closeMenu() {
        $('.menu-btn').removeClass('menu_btn_rotate');
        $('.menu__items').removeClass('menu__toggle');
        $('.welcome__info').removeClass('hidden')
    }

    $('.menu-btn').click(function () {
        toggleMenu();
    });

    $('.menu__link').click(function () {
        closeMenu();
    });

    $(document).click(function (event) {
        var $target = $(event.target);
        if (!$target.closest('.menu__items').length &&
            !$target.closest('.header__row').length &&
            $('.menu__items').is(":visible")) {
            closeMenu();
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            closeMenu();
        }
    });


    // calculate ticket's cost

    $('.ticket__button').click(function () {
        calcTotalPrice();
    });

    $('.tickets__radio').click(function () {
        calcTotalPrice($(this).attr("value"));
    });


    // calculate ticket's cost modal

    $('.entry__input').click(function () {
        calcTotalPriceModal();
    });

    $('#ticketTypeSelector').change(function () {
        calcTotalPriceModal($(this).attr("value"));
    });


    // map

    initMap();


    // date

    initDateModal();

    $('#dateInput').change(function () {
        updateDateTime(this.value, null);
    });

    $('#timeInput').change(function () {
        updateDateTime(null, this.value);
    });


    // welcome slider

    $('.welcome__slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        lazyload: true,
        mouseDrag: true,
        dots: true,
        appendDots: $('#welcomeSliderControls'),
        prevArrow: $('.arr-left'),
        nextArrow: $('.arr-right'),
    });
    $('.welcome__slider').on('afterChange', function (event, slick, currentSlide) {
        $("#currentWelcomeSlide").html("0" + (currentSlide + 1));
    });


    // validation

    const inputName = document.getElementById("inputName");
    const inputNameError = document.querySelector('#inputName + span.error');
    const inputEmail = document.getElementById("inputEmail");
    const inputEmailError = document.querySelector('#inputEmail + span.error');

    function showError(input, inputError, message) {
        inputError.textContent = message;
        inputError.className = 'error active';
        input.classList.add('invalid__input');
    }

    function inputValid(input, inputError) {
        input.classList.remove('invalid__input');
        inputError.textContent = '';
        inputError.className = 'error';
    }

    inputName.addEventListener('change', () => {
        if (inputName.value.length < 3) {
            let message = `Имя должно содержать минимум ${inputName.minLength} символа, вы ввели ${inputName.value.length}.`;
            showError(inputName, inputNameError, message);
        } else {
            inputValid(inputName, inputNameError)
        };
    });

    $('#inputName').keypress(function (e) {
        let regex = new RegExp("^[a-zA-Zа-яА-ЯЁё\s\n ]");
        let str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str) || e.keyCode == 13) {
            inputValid(inputName, inputNameError)
            return true;
        } else {
            let message = `Символ "${str}" нельзя ввести в это поле`;
            showError(inputName, inputNameError, message)
            return false;
        }
    });

    inputEmail.addEventListener('change', () => {
        let user_mail = inputEmail.value.split('@');
        var message = null;

        let regex_name = /^[a-zA-Z0-9)\(._-]+$/g
        let regex_domen = /^[a-zA-Z]+$/g
        let regex_domen_2 = /^[a-zA-Z]+$/g

        if (user_mail.length != 2) {
            let message = `Email должен содержать @`;
            showError(inputEmail, inputEmailError, message);
            return false;
        } else {
            var mail_domens = user_mail[1].split('.');
        }

        if (!regex_name.test(user_mail[0])) {
            var message = `Имя содержит недопустимые символы`;
        } else if (user_mail[0].length < 3 || user_mail[0].length > 15) {
            var message = `Имя имеет недопустимую длину (от 3 до 15 символов)`;
        } else if (!regex_domen.test(mail_domens[0])) {
            var message = `Домен первого уровня должен содержать только латинские буквы`;
        } else if (mail_domens[0].length < 4) {
            var message = `Домен первого уровня должен содержать не менее 4 символов`;
        } else if (!regex_domen_2.test(mail_domens[1]) || mail_domens[1].length < 2) {
            var message = `Домен второго уровня должен состоять минимум из 2 латинских букв`;
        }

        if (!message) {
            inputValid(inputEmail, inputEmailError)
        } else {
            showError(inputEmail, inputEmailError, message)
        }
    });

    inputPhone.addEventListener('change', () => {
        let regex = /^[0-9)\( -]+$/g;
        //        var regex = /^[a-zA-Z0-9)\( -]+$/g;
        var number = inputPhone.value.replaceAll('-', '').replaceAll(' ', '');
        if (!regex.test(inputPhone.value)) {
            let message = 'Номер телефона может содержать только цифры, дефис и пробел';
            showError(inputPhone, inputPhoneError, message);
        } else if (number.length > 10) {
            let message = 'Номер телефона не должен содержать больше 10 цифр';
            showError(inputPhone, inputPhoneError, message);
        } else {
            inputValid(inputPhone, inputPhoneError)
        }
    });


    // button up

    var btn = $('#buttonUp');
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, '300');
    });

    $("#dateInput").click(function () {
        $(".date__img-before").css("display", "none");
        $(".input__modal--date").css("padding", "13px 15px 12px 19px");
    });
    // video player

    videoPlayer();

    console.log(`
Слайдер в секции Welcome +24 :

Слайдер в секции Video (в слайдах - видео с YouTube) +19:
Не полностью реализовано:
если видео с YouTube проигрывается, клик по кнопке Pause останавливает его проигрывание. Также проигрывание видео останавливается, если кликнуть по другому слайду или кнопке Play в центре другого слайда. В указанной ситуации другое видео должно запуститься, а текущее остановиться. Невозможно проигрывание нескольких YouTube видео одновременно +1б;

Кастомный видеоплеер, созданный на основе тега video +36;
Слайдер сравнения изображений в секции Explore +10;
Анимация при прокрутке изображений в секции Galery +8;
Калькулятор продажи билетов в секции Tiskets +10;
Калькулятор продажи билетов в форме продажи билетов +14;
Валидация формы +16;
Интерактивная карта в секции Contacts +12;

Добавлена кнопка прокрутки страницы вверх +3б;
Общий балл : 152б.

Уважаемые проверяющие! Работа проверяется только на разрешении 1920рх. Проверка проводилась в соответствии с видео с примером кросс-чека https://youtu.be/8bU5PTaA0WQ.
Если по работе какие-то вопросы или проблемы, прошу писать мне 
в yanastvl#9391.
`)
    
    
});
