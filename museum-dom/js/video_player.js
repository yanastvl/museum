export function videoPlayer() {

    window.addEventListener('keydown', function (e) {
        if (e.keyCode == 32 && e.target == document.body) {
            e.preventDefault();
        }
    });

    let timerOverlay,
        timerCursor;

    // mute control
    const muteAudio = () => {
        muteBtn.classList.toggle('muted');
        video.muted ? video.muted = false : video.muted = true;
    }

    // filling in progress bars
    const fillProgressBar = (value) => `
  linear-gradient(to right, #710707 0%, #710707 ${value}%, #c4c4c4 ${value}%, #c4c4c4 100%)`;

    // overlay display control
    const displayOverlay = (inner) => {
        overlay.innerHTML = inner;
        overlay.classList.remove('hidden');
        clearTimeout(timerOverlay);
        timerOverlay = setTimeout(() => overlay.classList.add('hidden'), 1000);
    }

    // add control of the video player using the mouse
    document.addEventListener('click', (e) => {
        switch (e.target.id) {
            case 'video':
            case 'playBtnBig':
            case 'playBtn':
                video.paused ? video.play() : video.pause();
                break;
            case 'muteBtn':
                muteAudio();
                break;
            case 'fullscreenBtn':
                return document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen();
            default:
                break;
        }
    });

    // add fullscreen mode by double click
    video.addEventListener('dblclick', () => document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen());

    // add control of the video player using the keyboard (first group)
    document.addEventListener('keyup', (e) => {
        if (scrollY > 2800 && scrollY < 4200) {
            switch (e.code) {
                case 'Space':
                case 'KeyK':
                    return video.paused ? video.play() : video.pause();
                case 'KeyM':
                    muteAudio();
                    break;
                case 'KeyF':
                    return document.fullscreenElement ? document.exitFullscreen() : player.requestFullscreen();
                default:
                    break;
            }
            if (e.key >= 0 && e.code !== 'Space') video.currentTime = e.key * video.duration / 10;
            if (e.shiftKey && e.code === 'Period') {
                video.playbackRate === 2 ? video.playbackRate = 2 : video.playbackRate += 0.25;
            }
            if (e.shiftKey && e.code === 'Comma') {
                video.playbackRate === 0.25 ? video.playbackRate = 0.25 : video.playbackRate -= 0.25;
            }
        }
    });

    // add control of the video player using the keyboard (second group)
    player.addEventListener('keydown', (e) => {
        if (document.fullscreenElement) {
            player.style.cursor = 'default';
            controls.style.opacity = 1;
            clearTimeout(timerCursor);
            timerCursor = setTimeout(() => {
                player.style.cursor = 'none';
                controls.style.opacity = 0;
            }, 3000);
        }
        switch (e.code) {
            case 'Space':
                return e.preventDefault();
            case 'ArrowUp':
                if (document.activeElement.id !== 'progress') {
                    if (!video.muted) video.volume > 0.95 ? video.volume = 1 : video.volume += 0.05;
                    else {
                        video.muted = false;
                        video.volume = 0.05;
                    }
                }
                break;
            case 'ArrowDown':
                if (document.activeElement.id !== 'progress') {
                    if (!video.muted) video.volume < 0.05 ? video.volume = 0 : video.volume -= 0.05;
                }
                break;
            case 'ArrowLeft':
                if (document.activeElement.id !== 'progress') {
                    video.currentTime > 5 ? video.currentTime -= 5 : video.currentTime = 0;
                    displayOverlay('<< 5 sec');
                }
                break;
            case 'ArrowRight':
                if (document.activeElement.id !== 'progress') {
                    video.currentTime < video.duration - 5 ? video.currentTime += 5 : video.currentTime = video.duration;
                    displayOverlay('>> 5 sec');
                }
                break;
            case 'KeyJ':
                video.currentTime > 10 ? video.currentTime -= 10 : video.currentTime = 0;
                displayOverlay('<< 10 sec');
                break;
            case 'KeyL':
                video.currentTime < video.duration - 10 ? video.currentTime += 10 : video.currentTime = video.duration;
                displayOverlay('>> 10 sec');
                break;
            case 'Period':
                if (video.paused && !e.shiftKey) {
                    video.currentTime += 0.17;
                    displayOverlay('>>');
                }
                break;
            case 'Comma':
                if (video.paused && !e.shiftKey) {
                    video.currentTime -= 0.17;
                    displayOverlay('<<');
                }
                break;
            default:
                break;
        }
    });

    // change the display of play buttons
    video.addEventListener('play', () => {
        playBtn.className = 'play pause';
        playBtnBig.className = 'player__btn hidden';
    });

    video.addEventListener('pause', () => {
        playBtn.className = 'play';
        playBtnBig.className = 'player__btn';
    });

    // control the display of the video progress bar
    video.addEventListener('timeupdate', () => {
        if (!isNaN(video.duration)) {
            progress.value = video.currentTime * 100 / video.duration;
            progress.style.background = fillProgressBar(progress.value);
        }
    });

    // control overlay display when changing video playback speed
    video.addEventListener('ratechange', () => displayOverlay(`${video.playbackRate}x`));

    // control video rewind
    progress.addEventListener('input', () => {
        video.currentTime = progress.value * video.duration / 100;
    });

    // control video volume
    vol.addEventListener('input', () => {
        if (!video.muted) video.volume = vol.value / 100;
        else {
            video.muted = false;
            video.volume = 0.05;
        }
    });

    // control the video volume with the mouse wheel
    const changeVolumeByWheel = e => {
        let volume = video.volume * 100;
        if (e.deltaY < 0 && !video.muted) volume += 5;
        else if (e.deltaY < 0 && video.muted) {
            video.muted = false;
            volume = 5;
        } else if (e.deltaY > 0 && !video.muted) volume -= 5;
        if (volume < 0) video.volume = 0;
        else if (volume > 100) video.volume = 1;
        else video.volume = volume / 100;
    }

    document.addEventListener('fullscreenchange', _ => {
        if (document.fullscreenElement) player.addEventListener('wheel', changeVolumeByWheel);
        else player.removeEventListener('wheel', changeVolumeByWheel);
    });

    // control the display of video volume
    video.addEventListener('volumechange', () => {
        if (video.muted) {
            displayOverlay('muted');
            vol.style.background = fillProgressBar(0);
            vol.value = 0;
        } else {
            displayOverlay(`🔊 ${Math.floor(video.volume * 100)}%`);
            vol.style.background = fillProgressBar(video.volume * 100);
            vol.value = video.volume * 100;
            if (video.volume < 0.5 && !muteBtn.classList.contains('vol50')) muteBtn.classList.add('vol50');
            else if (video.volume >= 0.5 && muteBtn.classList.contains('vol50')) muteBtn.classList.remove('vol50');
        }
        video.volume === 0 || video.muted ? muteBtn.classList.add('muted') : muteBtn.classList.remove('muted');
    });

    // control the disappearance of the cursor and control panel
    document.addEventListener('mousemove', () => {
        if (document.fullscreenElement) {
            player.style.cursor = 'default';
            controls.style.opacity = 1;
            clearTimeout(timerCursor);
            timerCursor = setTimeout(() => {
                player.style.cursor = 'none';
                controls.style.opacity = 0;
            }, 3000);
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            clearTimeout(timerCursor);
            player.style.cursor = 'default';
            controls.style.opacity = 1;
        }
    });


    $('.video__slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        variableWidth: true,
        lazyload: true,
        mouseDrag: true,
        dots: true,
        appendDots: $('.panel__circle--nav'),
        prevArrow: $('.arrowVideo--left '),
        nextArrow: $('.arrowVideo--right'),
    });

    $('.video__slider').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        console.log(event, slick, currentSlide);
        const videoPath = "assets/video/video";
        const posterPath = "assets/img/video/poster";
        video.src = videoPath + currentSlide + ".mp4";
        video.poster = posterPath + currentSlide + ".jpg";

        // progress back to start
        progress.value = 0;
        progress.style.background = fillProgressBar(progress.value);
        playBtn.className = 'play';
        playBtnBig.className = 'player__btn';
        $('.video__youtube').each(function () {
            this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
        });
    });


}