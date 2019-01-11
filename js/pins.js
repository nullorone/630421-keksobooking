'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  var MAX_ADS = 5;

  var mapPinMain = document.querySelector('.map__pin--main');

  // Создает пин
  var createPin = function (ad) {
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
      mapPin.classList.add('map__pin--active');
      window.card.addUseCard(ad);
    });

    // Отрисовывает карточку пина, на котором было сделано нажатие Enter
    mapPin.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        window.card.addUseCard(ad);
        mapPin.classList.add('map__pin--active');
      }
    });
    return template;
  };

  // Генерация меток
  var generateSimilarPins = function (ads) {
    var fragment = document.createDocumentFragment();
    if (ads.length > MAX_ADS) {
      for (var i = 0; i < MAX_ADS; i++) {
        if (ads[i].offer) {
          fragment.appendChild(createPin(ads[i]));
        }
      }
    } else if (ads.length <= MAX_ADS) {
      ads.forEach(function (element) {
        if (element.offer) {
          fragment.appendChild(createPin(element));
        }
      });
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
