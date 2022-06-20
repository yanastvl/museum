//import {playList} from './playList.js';

let locale = 'en';

function getLocale() {
    if (localStorage.getItem('locale')) {
        return localStorage.getItem('locale');
    } else {
        return 'en';
    }
}

const time = document.querySelector('.time');
const dateplace = document.querySelector('.date');
let greeting = document.querySelector('.greeting');
let name = document.querySelector('.name');

/*Greeting*/
function getTimeOfDay(greeting) {
    let locale = getLocale();
    let timeOfDay = '';
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
        locale == 'en' ? greeting = "Good morning" : greeting = "Доброе утро";
        timeOfDay = 'morning';
    } else if (hours >= 12 && hours < 18) {
        locale == 'en' ? greeting = "Good afternoon" : greeting = "Добрый день";
        timeOfDay = 'afternoon';
    } else if (hours >= 18 && hours < 24) {
        locale == 'en' ? greeting = "Good evening" : greeting = "Добрый вечер";
        timeOfDay = 'evening';
    } else if (hours >= 0 && hours < 5) {
        locale == 'en' ? greeting = "Good night" : greeting = "Добрый вечер";
        timeOfDay = 'night';
    }
    return {
        'greeting': greeting,
        'timeOfDay': timeOfDay
    };
}
const timeOfDay = getTimeOfDay()['timeOfDay'];

function showGreeting() {
    greeting.textContent = getTimeOfDay()['greeting'];
}

/*Time and Date*/

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();
    showGreeting();
}
showTime();

function showDate() {
    const date = new Date();
    const options = {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    const currentDate = date.toLocaleDateString(getLocale(), options);
    dateplace.textContent = currentDate;
}

/*Input*/

function setLocalStorage() {
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage, setLocalStorageCity);


function getNameFromLocalStorage() {
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    } else {
        getLocale() == 'en' ? name.placeholder = '[Enter name]' : name.placeholder = '[Введите имя]'
    }
}
window.addEventListener('load', getNameFromLocalStorage, getLocalStorageCity);




/*Slider*/
let num = getRandomNum(1, 20);

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg(url) {
    const img = new Image();
    if (!url) {
        let bgNum = num.toString().padStart(2, '0');
        img.src = `https://raw.githubusercontent.com/yanastvl/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
        img.onload = () => {
            document.body.style.backgroundImage = `url(https://raw.githubusercontent.com/yanastvl/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg)`;
        };
    } else {
        img.src = url;
        console.log('url passed', url);
        img.onload = () => {
            document.body.style.backgroundImage = `url(${url})`;
        };
    }
}

setBg();


const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');

function getSlidePrev() {
    num = (parseInt(num) - 1).toString().padStart(2, '0');
    if (num < 01) {
        num = 20;
    }
    setBg();
}

function getSlideNext() {
    num = (parseInt(num) + 1).toString().padStart(2, '0');
    if (num > 20) {
        num = 01;
    }
    setBg();
}

slidePrev.addEventListener('click', getSlidePrev);
slideNext.addEventListener('click', getSlideNext);


/*Weather*/

const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${getLocale()}&appid=af0f2b602c0de5272b7b36836b44122b&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${parseInt(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    getLocale() == 'en' ? windText = 'Wind speed' : windText = 'Скорость ветра';
    getLocale() == 'en' ? humidityText = 'Humidity' : humidityText = 'Влажность';
    wind.textContent = `${windText}: ${parseInt(data.wind.speed)} m/s`;
    humidity.textContent = `${humidityText}: ${parseInt(data.main.humidity)}%`
}

function setLocalStorageCity() {
    localStorage.setItem('city', city.value);
}

window.addEventListener('beforeunload', setLocalStorageCity);

function getLocalStorageCity() {
    if (localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        if (city.value == 'Minsk' || city.value == 'Минск') {
            getLocale() == 'en' ? city.value = 'Minsk' : city.value = 'Минск';
        }
    } else {
        getLocale() == 'en' ? city.value = 'Minsk' : city.value = 'Минск';
    }
}

window.addEventListener('load', getLocalStorageCity);

city.addEventListener('change', getWeather, false);

document.addEventListener('DOMContentLoaded', function (event) {
    getLocalStorageCity();
    getWeather();
});

// document.addEventListener('keypress', (e) => {
//     let regex = new RegExp("^[a-zA-Zа-яА-ЯЁё\s\n ]");
//     let str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
//     if (regex.test(str) || e.keyCode == 13) {
//         inputValid(city);
//         return true;
//     console.log(city);
//     }
//     });


/*Quotes*/

const button = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
let currentQuoteIndex = 0;

async function getQuotes(e, index) {
    const quotes = './js/data.json';
    const res = await fetch(quotes);
    const data = await res.json();

    if (!index) {
        currentQuoteIndex = Math.floor(Math.random() * data[getLocale()].length);
    }

    let item = data[getLocale()][currentQuoteIndex];
    quote.textContent = `"${Object.values(item)[0]}"`
    author.textContent = Object.values(item)[1]
}

button.addEventListener('click', getQuotes);

getQuotes();

//function translateQuote() {
//    let item = data[getLocale()][currentQuoteIndex];
//    quote.textContent = `"${Object.values(item)[0]}"`
//    author.textContent = Object.values(item)[1]
//}


/*Audio*/

let isPlay = false;
let playNum = 0;

const playPrevButton = document.querySelector('.play-prev');
const play = document.querySelector('.play');
const playNextButton = document.querySelector('.play-next');
const playListUl = document.querySelector('.play-list');
const audio = document.querySelector('audio');
const songName = document.querySelector('.song-name');


const playList = [{
        title: 'Bring Me The Horizon — Sleepwalking',
        src: 'assets/sounds/Bring Me The Horizon — Sleepwalking.mp3',
        duration: '03:56'
    },
    {
        title: 'Muse — Hysteria',
        src: 'assets/sounds/Muse — Hysteria.mp3',
        duration: '03:47'
    },
    {
        title: 'Rammstein — Mein Herz brennt',
        src: 'assets/sounds/Rammstein — Mein Herz brennt.mp3',
        duration: '04:39'
    },
    {
        title: 'Three Days Grace — Animal I Have Become',
        src: 'assets/sounds/Three Days Grace — Animal I Have Become.mp3',
        duration: '03:51'
    }
];

function addTracks() {
    for (let i = 0; i < playList.length; i++) {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = playList[i].title;
        li.id = "track-" + i;
        playListUl.appendChild(li);
    }
    songName.textContent = playList[0].title;
}
addTracks();

const playItems = document.querySelectorAll('.play-item');

playItems.forEach(el => el.addEventListener('click', e => {
    let trackId = parseInt(e.target.getAttribute("id").split('-')[1]);
    audio.src = playList[trackId].src;
    songName.textContent = playList[trackId].title;
    if (trackId == playNum) {
        document.getElementById('track-' + playNum).classList.toggle('mute');
        playPauseAudio();
    } else {
        document.getElementById('track-' + playNum).classList.remove('mute');
        document.getElementById('track-' + trackId).classList.add('mute');
        playAudio();
    }
    playNum = trackId;
}));


function playAudio() {
    audio.play();
    isPlay = true;
    play.classList.add('pause');
}

function playPauseAudio() {
    let currentSong = document.getElementById("track-" + playNum);
    if (!isPlay) {
        playAudio();
        currentSong.classList.add('mute');
    } else {
        audio.pause();
        isPlay = false;
        currentSong.classList.remove('mute');
        play.classList.remove('pause');
    }
}


function playPrev() {
    document.getElementById('track-' + playNum).classList.remove('mute');
    playNum = playNum - 1;
    if (playNum < 0) {
        playNum = 3;
    }
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    document.getElementById('track-' + playNum).classList.add('mute');
    songName.textContent = playList[playNum].title;
    playAudio();
}

function playNext() {
    document.getElementById('track-' + playNum).classList.remove('mute');
    playNum = playNum + 1;
    if (playNum > 3) {
        playNum = 0;
    }
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    document.getElementById('track-' + playNum).classList.add('mute');
    songName.textContent = playList[playNum].title;
    playAudio();
}

audio.addEventListener("ended", function () {
    playNext();
});

play.addEventListener('click', playPauseAudio);
playPrevButton.addEventListener('click', playPrev);
playNextButton.addEventListener('click', playNext);


let muted = false;
let volumeValue = 0;

let volume = document.querySelector('.volume-bar');
let volumeButton = document.querySelector('.volume-button');
let currentTime = document.querySelector('.current-time');
let durationTime = document.querySelector('.duration-time');

volume.addEventListener("input", (e) => {
    volumeValue = volume.value;
    audio.volume = e.target.value / 100;
    muted = false;
});

volumeButton.addEventListener('click', () => {
    if (!muted) {
        volumeValue = volume.value;
        volume.value = 0;
        audio.volume = 0;
        muted = true;
    } else {
        volume.value = volumeValue;
        audio.volume = volumeValue / 100;
        muted = false;
    }
});


/*AdvancedAudioPlayer*/
const progressBar = document.querySelector('.progress-bar');

function updateProgressValue() {
    progressBar.max = audio.duration;
    progressBar.value = audio.currentTime;
    currentTime.innerHTML = (formatTime(Math.floor(audio.currentTime)));
    if (durationTime.innerHTML === "NaN:NaN") {
        durationTime.innerHTML = "0:00";
    } else {
        durationTime.innerHTML = (formatTime(Math.floor(audio.duration)));
    }
};

function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10) {
        sec = `0${sec}`;
    };
    return `${min}:${sec}`;
};

setInterval(updateProgressValue, 500);

function changeProgressBar() {
    audio.currentTime = progressBar.value;
};


/*Modal window*/

const modalButton = document.querySelector('.settings');
const modalWindow = document.querySelector('#modalWindow');
const modalClose = document.querySelector('.modal-close');
const locales = document.querySelectorAll('.locale');

modalButton.addEventListener('click', () => {
    modalWindow.classList.toggle('form__active');
});

modalClose.addEventListener('click', () => {
    modalWindow.classList.remove('form__active');
})

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 27) {
        modalWindow.classList.remove('form__active');
    }
});

modalWindow.addEventListener('click', (e) => {
    if (!e.target.closest('.booking')) {
        modalWindow.classList.remove('form__active');
    }
})


/*Lang*/

const settingsTranslations = {
    'en': ['Application setup', 'Application language', 'Displaying items', 'Time', 'Date', 'Greeting', 'Quotes', 'Weather', 'Audio player', 'ToDo List', 'Background IMG', 'Photo tag'],
    'ru': ['Настройки приложения', 'Язык приложения', 'Отображаемые элементы', 'Время', 'Дата', 'Приветствие', 'Цитаты', 'Погода', 'Аудиоплеер', 'Список дел', 'Фоновое изображение', 'Тэг для фото']
}

const settingsTexts = document.querySelectorAll('.translate');
const onTexts = document.querySelectorAll('.on');
const offTexts = document.querySelectorAll('.off');
const enLocaleText = document.querySelector('#en');
const ruLocaleText = document.querySelector('#ru');

locales.forEach(el => el.addEventListener('click', e => {
    let settingCounter = 0;
    let localeButton = e.target.getAttribute('id');
    locale = localeButton;
    localStorage.setItem('locale', locale);
    getWeather();
    showDate();
    getTimeOfDay();
    showGreeting();
    getNameFromLocalStorage();
    getLocalStorageCity();
    getQuotes(null, index = currentQuoteIndex);

    settingsTexts.forEach(el => {
        el.textContent = settingsTranslations[getLocale()][settingCounter];
        settingCounter += 1;
    });
    onTexts.forEach(el => {
        getLocale() == 'en' ? el.textContent = 'ON' : el.textContent = 'ВКЛ';
    });
    offTexts.forEach(el => {
        getLocale() == 'en' ? el.textContent = 'OFF' : el.textContent = 'ВЫКЛ';
    });

    getLocale() == 'en' ? enLocaleText.textContent = 'EN' : enLocaleText.textContent = 'АНГЛ';
    getLocale() == 'en' ? ruLocaleText.textContent = 'RU' : ruLocaleText.textContent = 'РУС';
}));


//  $('#modalButton').click(function () {
//        fillTicketFormModal();
//        $('#modalWindow').toggleClass('form__active');
//    });

/*Pictures API*/

const unsplashApi = document.querySelector('#unsplashApi');
const flickrApi = document.querySelector('#flickrApi');

async function getLinkToImageUnsplash() {
    let tag = document.getElementById('photoTag').value;
    if (!tag) {
        tag = timeOfDay;
    }
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=Va4QjO0oypTgorK_yCrTl_ej8jLPN8xekynQHQvscSg`;
    const res = await fetch(url);
    const data = await res.json();
    const imageUrl = data.urls.regular;
    setBg(imageUrl);
}


async function getLinkToImageFlickr() {
    let tag = document.getElementById('photoTag').value;
    if (!tag) {
        tag = timeOfDay;
    }
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=02e0cd616ff4f48a280f4d980f28d114&tags=${tag}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const urls = data.photos.photo.map(el => el.url_l).filter(function (e) {
        return e
    });
    let randomUrl = urls[getRandomNum(0, 90)];
    setBg(randomUrl);
}

unsplashApi.addEventListener('click',  getLinkToImageUnsplash);
flickrApi.addEventListener('click',  getLinkToImageFlickr);


// getLinkToImageUnsplash();
// getLinkToImageFlickr();

/*ToDoList*/

const toDoform = document.querySelector(".js-toDoForm"),
    toDoinput = toDoform.querySelector(".toDoInput"),
    toDolist = document.querySelector(".js-toDoList");

const TODOS_LS = "toDos";
let toDos = [];

function filterFn(toDo) {
    return toDo.id === 1;
}

function loadToDos() {
    const loaded_todos = localStorage.getItem(TODOS_LS);
    if (loaded_todos !== null) {
        const parsedToDos = JSON.parse(loaded_todos);
        parsedToDos.forEach(function (toDo) {
            showToDos(toDo.name);
        });
    }
}

function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
}

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDolist.removeChild(li);
    const cleanToDos = toDos.filter(function (toDo) {
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
}

function showToDos(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const todo = document.createElement("todo");
    const newId = toDos.length + 1;
    delBtn.innerHTML = "✔";
    delBtn.classList.add("todo");
    delBtn.addEventListener("click", deleteToDo)
    span.innerHTML = text;
    li.appendChild(delBtn);
    delBtn.appendChild(todo);
    li.appendChild(span);
    li.id = newId;
    toDolist.appendChild(li);
    const toDoObject = {
        name: text,
        id: newId
    }
    toDos.push(toDoObject);
    saveToDos();
}

function submitHandler(event) {
    event.preventDefault();
    const currentValue = toDoinput.value;
    showToDos(currentValue);
    toDoinput.value = "";
}

function init() {
    loadToDos();
    toDoform.addEventListener("submit", submitHandler);
}

init();