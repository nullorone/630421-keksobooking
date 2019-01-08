'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  // var MAX_ADS = 5;

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
      window.card.renderCard(ad);
      window.card.closesCard();
    });

    // Отрисовывает карточку пина, на котором было сделано нажатие Enter
    mapPin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        window.card.removesCard();
        window.card.renderCard(ad);
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

  var formFilters = document.querySelector('.map__filters');
  var formFiltersItems = formFilters.querySelectorAll('select, input');
  var mapPins = document.querySelector('.map__pins');

  // Отрисовка пинов на карте
  var showSimilarPins = function (dataHousing) {

    formFilters.addEventListener('change', function () {
      window.filters.updatePins(dataHousing);
    });

    mapPins.appendChild(generateSimilarPins(dataHousing));
  };

  var getDataSuccess = function (data) {
    var dataHousing = data;
    showSimilarPins(dataHousing);
    formFiltersItems.forEach(function (element) {
      element.disabled = 0;
    });
  };

  var getDataError = function (status) {
    window.messages.generatesMessageNode(status);
  };

  var getData = function () {
    formFiltersItems.forEach(function (element) {
      element.disabled = 1;
    });
    window.backend.load(getDataSuccess, getDataError);
  };
  var renderPins = function () {
    if (!(mapPinMain.nextElementSibling)) {
      getData();
    }
  };

  window.pins = {
    renderPins: renderPins,
    generateSimilarPins: generateSimilarPins
  };
})();
