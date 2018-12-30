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
      // fragment.appendChild(creatingPin(adsArray[i]));
      if (adsArray[i].offer) {
        fragment.appendChild(creatingPin(adsArray[i]));
      }
    }
    return fragment;
  };

  var onTypeHousingChange = function (evt, data) {
    removedPins();
    if (evt.target.value !== 'any') {
      var filterType = evt.target.value;
      var newData = data.filter(function (item) {
        return item.offer.type === filterType;
      });
      mapPins.appendChild(generateSimilarPins(newData));
    } else {
      mapPins.appendChild(generateSimilarPins(data));
    }
  };

  var onPriceHousingChange = function (evt, data) {
    removedPins();
    if (evt.target.value !== 'any') {
      var filterPrice = evt.target.value;
      var newData = data.filter(function (item) {
        var priceToOptionsPrices = {
          'low': (item.offer.price < 10000),
          'middle': (item.offer.price >= 10000 && item.offer.price <= 50000),
          'high': (item.offer.price > 50000)
        };
        return priceToOptionsPrices[filterPrice];
      });
      mapPins.appendChild(generateSimilarPins(newData));
    } else {
      mapPins.appendChild(generateSimilarPins(data));
    }
  };

  var onRoomsHousingChange = function (evt, data) {
    removedPins();
    if (evt.target.value !== 'any') {
      var filterType = evt.target.value;
      filterType = Number(filterType);
      var newData = data.filter(function (item) {
        return item.offer.rooms === filterType;
      });
      mapPins.appendChild(generateSimilarPins(newData));
    } else {
      mapPins.appendChild(generateSimilarPins(data));
    }
  };

  var onGuestsHousingChange = function (evt, data) {
    removedPins();
    if (evt.target.value !== 'any') {
      var filterType = evt.target.value;
      filterType = Number(filterType);
      var newData = data.filter(function (item) {
        return item.offer.guests === filterType;
      });
      mapPins.appendChild(generateSimilarPins(newData));
    } else {
      mapPins.appendChild(generateSimilarPins(data));
    }
  };

  var onFeaturesHousingChange = function (evt, data) {
    removedPins();
    if (evt.target.checked) {
      var filterType = evt.target.value;
      var newData = data.filter(function (item) {
        var compare = false;
        item.offer.features.forEach(function (element) {
          if (element === filterType) {
            compare = true;
          }
          return compare;
        });
        return compare;
      });
      mapPins.appendChild(generateSimilarPins(newData));
    } else {
      mapPins.appendChild(generateSimilarPins(data));
    }
  };
  var typeHousing = document.querySelector('#housing-type');
  var priceHousing = document.querySelector('#housing-price');
  var roomsHousing = document.querySelector('#housing-rooms');
  var guestsHousing = document.querySelector('#housing-guests');
  var featuresHousing = document.querySelector('#housing-features');
  var formFilters = document.querySelector('.map__filters');
  var formFiltersItems = formFilters.querySelectorAll('select, input');
  var mapPins = document.querySelector('.map__pins');

  // Отрисовка пинов на карте
  var showSimilarPins = function (data) {
    formFilters.addEventListener('click', function () {
      typeHousing.addEventListener('change', function (evt) {
        onTypeHousingChange(evt, data);
      });

      priceHousing.addEventListener('change', function (evt) {
        onPriceHousingChange(evt, data);
      });

      roomsHousing.addEventListener('change', function (evt) {
        onRoomsHousingChange(evt, data);
      });

      guestsHousing.addEventListener('change', function (evt) {
        onGuestsHousingChange(evt, data);
      });

      featuresHousing.addEventListener('change', function (evt) {
        onFeaturesHousingChange(evt, data);
      });
    });

    mapPins.appendChild(generateSimilarPins(data));
  };

  var getDataSuccess = function (data) {
    showSimilarPins(data);
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

  var removedPins = function () {
    while (mapPinMain.nextElementSibling) {
      mapPinMain.nextElementSibling.remove();
    }
  };

  window.pins = {
    renderPins: renderPins
  };
})();
