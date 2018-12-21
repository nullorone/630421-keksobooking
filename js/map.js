'use strict';
(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var map = document.querySelector('.map');

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

    var renderCard = function () {
      var previousCard = map.querySelector('.map__card');
      if (previousCard) {
        map.removeChild(previousCard);
      }
      showCardHousing(window.card.creatingCardHousing(ad));
    };

    // Отрисовывает карточку пина, на который был сделан клик
    mapPin.addEventListener('click', function () {
      renderCard();
      showAd();
    });

    // Отрисовывает карточку пина, на котором было сделано нажатие Enter
    mapPin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        renderCard();
        showAd();
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

  // Вставляет карточку объявления перед элементом фильтрации объявлений
  var showCardHousing = function (card) {
    var adsFilter = document.querySelector('.map__filters-container');
    map.insertBefore(card, adsFilter);
  };

  // Описание функционала карты с метками

  // Скрывает объявление со страницы удаляя его из DOM
  var removedAd = function () {
    var mapCard = document.querySelector('.map__card');
    map.removeChild(mapCard);
    document.removeEventListener('keydown', onDocumentKeydownEsc);
  };

  // Скрывает объявление по клику на кнопку-крестик
  var onButtonCloseClick = function () {
    removedAd();
  };

  // Скрывает объявление по нажатию на кнопку-крестик
  var onDocumentKeydownEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removedAd();
    }
  };

  var showAd = function () {
    document.addEventListener('keydown', onDocumentKeydownEsc);
    var buttonClosePopup = map.querySelector('.popup__close');
    buttonClosePopup.addEventListener('click', onButtonCloseClick);
  };

  window.map = {
    showSimilarPins: showSimilarPins
  };
})();
