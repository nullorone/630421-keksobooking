'use strict';
(function () {
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var DEBOUNCE_DELAY = 500;
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');

  var typeHousingChange = function (data) {
    var filterType = document.querySelector('#housing-type').value;
    return data.offer.type === filterType || filterType === 'any';
  };

  var priceHousingChange = function (data) {
    var filterPrice = document.querySelector('#housing-price').value;
    var priceToOptionsPrices = {
      'low': (data.offer.price < LOW_PRICE),
      'middle': (data.offer.price >= LOW_PRICE && data.offer.price <= HIGH_PRICE),
      'high': (data.offer.price > HIGH_PRICE)
    };
    return priceToOptionsPrices[filterPrice] || filterPrice === 'any';
  };

  var roomsHousingChange = function (data) {
    var filterRooms = document.querySelector('#housing-rooms').value;
    if (filterRooms !== 'any') {
      filterRooms = Number(filterRooms);
    }
    return data.offer.rooms === filterRooms || filterRooms === 'any';
  };

  var guestsHousingChange = function (data) {
    var filterGuests = document.querySelector('#housing-guests').value;
    if (filterGuests !== 'any') {
      filterGuests = Number(filterGuests);
    }
    return data.offer.guests === filterGuests || filterGuests === 'any';
  };

  var featuresHousingChange = function (data) {
    var filterFeatures = document.querySelectorAll('#housing-features input:checked');
    if (filterFeatures.length !== 0) {
      var compare = false;
      data.offer.features.forEach(function (element) {
        filterFeatures.forEach(function (item) {
          if (element === item.value) {
            compare = true;
          }
        });
      });
      return compare;
    } else {
      return true;
    }
  };

  var removedPins = function () {
    while (mapPinMain.nextElementSibling) {
      mapPinMain.nextElementSibling.remove();
    }
  };

  var getUpdatePins = function (data) {
    var filteredData = data.filter(function (element) {
      return typeHousingChange(element)
        && priceHousingChange(element)
        && roomsHousingChange(element)
        && guestsHousingChange(element)
        && featuresHousingChange(element);
    });
    removedPins();
    mapPins.appendChild(window.pins.generatesSimilarPins(filteredData));
  };

  var timeoutUpdatePins;
  var updatePins = function (data) {
    if (timeoutUpdatePins) {
      window.clearTimeout(timeoutUpdatePins);
    }
    timeoutUpdatePins = window.setTimeout(function () {
      window.card.removesCard();
      getUpdatePins(data);
    }, DEBOUNCE_DELAY);
  };

  window.filters = {
    updatePins: updatePins
  };
})();
