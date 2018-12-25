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
      if (adsArray[i].offer) {
        fragment.appendChild(creatingPin(adsArray[i]));
      }
    }
    return fragment;
  };


  // Отрисовка пинов на карте
  var showSimilarPins = function (data) {
    var mapPins = document.querySelector('.map__pins');
    mapPins.appendChild(generateSimilarPins(data));
  };

  var getDataSuccess = function (data) {
    showSimilarPins(data);
  };

  var getDataError = function (status) {
    window.messages.generatesMessageNode(status);
  };

  var getData = function () {
    window.backend.load(getDataSuccess, getDataError);
  };
  var renderPins = function () {
    if (!(mapPinMain.nextElementSibling)) {
      getData();
    }
  };

  window.pins = {
    renderPins: renderPins
  };
})();
