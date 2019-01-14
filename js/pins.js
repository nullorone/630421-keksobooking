'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  var MAX_ADS = 5;

  var mapPinMain = document.querySelector('.map__pin--main');
  var formFilters = document.querySelector('.map__filters');
  var formFiltersNodeList = formFilters.querySelectorAll('select, input');
  var mapPins = document.querySelector('.map__pins');
  var formFiltersAds;

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
      ads.forEach(function (ad) {
        if (ad.offer) {
          fragment.appendChild(createPin(ad));
        }
      });
    }
    return fragment;
  };

  var onFormFiltersChange = function () {
    window.filters.updatePins(formFiltersAds);
  };

  // Отрисовка пинов на карте
  var showSimilarPins = function (ads) {
    formFiltersAds = ads.slice();
    formFilters.addEventListener('change', onFormFiltersChange);
    mapPins.appendChild(generateSimilarPins(ads));
  };

  var getAdsSuccess = function (loadedAds) {
    var ads = loadedAds;
    showSimilarPins(ads);
    formFiltersNodeList.forEach(function (node) {
      node.disabled = 0;
    });
  };

  var getAdsError = function (status) {
    window.messages.generateMessageNode(status);
  };

  var getAds = function () {
    formFiltersNodeList.forEach(function (node) {
      node.disabled = 1;
    });
    window.backend.load(getAdsSuccess, getAdsError);
  };
  var renderPins = function () {
    if (!(mapPinMain.nextElementSibling)) {
      getAds();
    }
  };

  var removeHandlerFormFilters = function () {
    formFilters.removeEventListener('change', onFormFiltersChange);
  };

  window.pins = {
    renderPins: renderPins,
    generateSimilarPins: generateSimilarPins,
    removeHandlerFormFilters: removeHandlerFormFilters
  };
})();
