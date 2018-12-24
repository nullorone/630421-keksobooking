'use strict';
(function () {
  var ENTER_KEYCODE = 13;

  var mapPinMain = document.querySelector('.map__pin--main');

  // Создает пин
  var creatingPin = function (ad) {
    var pinTemplate = document.querySelector('#pin');
    var template = pinTemplate.content.cloneNode(true);
    var mapPin = template.querySelector('.map__pin');
    var mapPinImg = mapPin.querySelector('img');
    var widthMapPin = 50;
    var heightMapPin = 70;
    mapPin.style.left = (ad.location.x - widthMapPin / 2) + 'px';
    mapPin.style.top = (ad.location.y - heightMapPin) + 'px';
    mapPinImg.src = ad.author.avatar;
    mapPinImg.alt = ad.offer.title;

    // Отрисовывает карточку пина, на который был сделан клик
    mapPin.addEventListener('click', function () {
      window.card.removesCard();
      window.card.showCardHousing(window.card.creatingCardHousing(ad));
      window.card.closesCard();
    });

    // Отрисовывает карточку пина, на котором было сделано нажатие Enter
    mapPin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        window.card.removesCard();
        window.card.showCardHousing(window.card.creatingCardHousing(ad));
        window.card.closesCard();
      }
    });
    return template;
  };

  // Генерация меток
  var generateSimilarPins = function (adsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < adsArray.length; i++) {
      fragment.appendChild(creatingPin(adsArray[i]));
    }
    return fragment;
  };

  // Отрисовка пинов на карте
  var showSimilarPins = function () {
    var mapPins = document.querySelector('.map__pins');
    mapPins.appendChild(generateSimilarPins(window.data.generateAds()));
  };

  var renderPins = function () {
    if (!(mapPinMain.nextElementSibling)) {
      showSimilarPins();
    }
  };

  window.pins = {
    renderPins: renderPins
  };
})();
