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
            let message = `?????? ???????????? ?????????????????? ?????????????? ${inputName.minLength} ??????????????, ???? ?????????? ${inputName.value.length}.`;
            showError(inputName, inputNameError, message);
        } else {
            inputValid(inputName, inputNameError)
        };
    });

    $('#inputName').keypress(function (e) {
        let regex = new RegExp("^[a-zA-Z??-????-??????\s\n ]");
        let str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str) || e.keyCode == 13) {
            inputValid(inputName, inputNameError)
            return true;
        } else {
            let message = `???????????? "${str}" ???????????? ???????????? ?? ?????? ????????`;
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
            let message = `Email ???????????? ?????????????????? @`;
            showError(inputEmail, inputEmailError, message);
            return false;
        } else {
            var mail_domens = user_mail[1].split('.');
        }

        if (!regex_name.test(user_mail[0])) {
            var message = `?????? ???????????????? ???????????????????????? ??????????????`;
        } else if (user_mail[0].length < 3 || user_mail[0].length > 15) {
            var message = `?????? ?????????? ???????????????????????? ?????????? (???? 3 ???? 15 ????????????????)`;
        } else if (!regex_domen.test(mail_domens[0])) {
            var message = `?????????? ?????????????? ???????????? ???????????? ?????????????????? ???????????? ?????????????????? ??????????`;
        } else if (mail_domens[0].length < 4) {
            var message = `?????????? ?????????????? ???????????? ???????????? ?????????????????? ???? ?????????? 4 ????????????????`;
        } else if (!regex_domen_2.test(mail_domens[1]) || mail_domens[1].length < 2) {
            var message = `?????????? ?????????????? ???????????? ???????????? ???????????????? ?????????????? ???? 2 ?????????????????? ????????`;
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
            let message = '?????????? ???????????????? ?????????? ?????????????????? ???????????? ??????????, ?????????? ?? ????????????';
            showError(inputPhone, inputPhoneError, message);
        } else if (number.length > 10) {
            let message = '?????????? ???????????????? ???? ???????????? ?????????????????? ???????????? 10 ????????';
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
?????????????? ?? ???????????? Welcome +24 :

?????????????? ?? ???????????? Video (?? ?????????????? - ?????????? ?? YouTube) +19:
???? ?????????????????? ??????????????????????:
???????? ?????????? ?? YouTube ??????????????????????????, ???????? ???? ???????????? Pause ?????????????????????????? ?????? ????????????????????????. ?????????? ???????????????????????? ?????????? ??????????????????????????????, ???????? ???????????????? ???? ?????????????? ???????????? ?????? ???????????? Play ?? ???????????? ?????????????? ????????????. ?? ?????????????????? ???????????????? ???????????? ?????????? ???????????? ??????????????????????, ?? ?????????????? ????????????????????????. ???????????????????? ???????????????????????? ???????????????????? YouTube ?????????? ???????????????????????? +1??;

?????????????????? ????????????????????, ?????????????????? ???? ???????????? ???????? video +36;
?????????????? ?????????????????? ?????????????????????? ?? ???????????? Explore +10;
???????????????? ?????? ?????????????????? ?????????????????????? ?? ???????????? Galery +8;
?????????????????????? ?????????????? ?????????????? ?? ???????????? Tiskets +10;
?????????????????????? ?????????????? ?????????????? ?? ?????????? ?????????????? ?????????????? +14;
?????????????????? ?????????? +16;
?????????????????????????? ?????????? ?? ???????????? Contacts +12;

?????????????????? ???????????? ?????????????????? ???????????????? ?????????? +3??;
?????????? ???????? : 152??.

?????????????????? ??????????????????????! ???????????? ?????????????????????? ???????????? ???? ???????????????????? 1920????. ???????????????? ?????????????????????? ?? ???????????????????????? ?? ?????????? ?? ???????????????? ??????????-???????? https://youtu.be/8bU5PTaA0WQ.
???????? ???? ???????????? ??????????-???? ?????????????? ?????? ????????????????, ?????????? ???????????? ?????? 
?? yanastvl#9391.
`)
    
    
});