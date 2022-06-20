export {
    shuffleGallery
};

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function shuffleGallery() {
    const pictureInnerContainer = document.querySelector('.picture-inner-container');


    let src_arr = [
        "assets/img/gallery/galery1.jpg",
        "assets/img/gallery/galery2.jpg",
        "assets/img/gallery/galery3.jpg",
        "assets/img/gallery/galery4.jpg",
        "assets/img/gallery/galery5.jpg",
        "assets/img/gallery/galery6.jpg",
        "assets/img/gallery/galery7.jpg",
        "assets/img/gallery/galery8.jpg",
        "assets/img/gallery/galery9.jpg",
        "assets/img/gallery/galery10.jpg",
        "assets/img/gallery/galery11.jpg",
        "assets/img/gallery/galery12.jpg",
        "assets/img/gallery/galery13.jpg",
        "assets/img/gallery/galery14.jpg",
        "assets/img/gallery/galery15.jpg"
    ]

    shuffle(src_arr);

    src_arr.map(function (src) {
        const img = document.createElement('img');
        img.classList.add('gallery-img');
        img.src = src;
        img.alt = `galery1`;
        pictureInnerContainer.append(img);
    });
    
    var controller = new ScrollMagic.Controller();
    $('.gallery-img').each(function() {

      var tween = TweenMax.from($(this), 0.7, {autoAlpha: 0, y: '+=200', x: '0', ease:Linear.easeNone, scale: 0.8});

      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: 1,
        offset: 50,
        reverse: true
      })
      .setTween(tween)
      .addTo(controller);
    });
}

shuffleGallery();