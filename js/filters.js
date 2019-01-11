'use strict';
(function () {
  var DEBOUNCE_DELAY = 500;

  var PriceFilter = {
    LOW: 10000,
    HIGH: 50000
  };

  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');

  var typeHousingChange = function (element) {
    var filterType = document.querySelector('#housing-type').value;
    return element.offer.type === filterType || filterType === 'any';
  };

  var priceHousingChange = function (element) {
    var filterPrice = document.querySelector('#housing-price').value;
    var priceToOptionsPrices = {
      'low': (element.offer.price < PriceFilter.LOW),
      'middle': (element.offer.price >= PriceFilter.LOW && element.offer.price <= PriceFilter.HIGH),
      'high': (element.offer.price > PriceFilter.HIGH)
    };
    return priceToOptionsPrices[filterPrice] || filterPrice === 'any';
  };

  var roomsHousingChange = function (element) {
    var filterRooms = document.querySelector('#housing-rooms').value;
    if (filterRooms !== 'any') {
      filterRooms = Number(filterRooms);
    }
    return element.offer.rooms === filterRooms || filterRooms === 'any';
  };

  var guestsHousingChange = function (element) {
    var filterGuests = document.querySelector('#housing-guests').value;
    if (filterGuests !== 'any') {
      filterGuests = Number(filterGuests);
    }
    return element.offer.guests === filterGuests || filterGuests === 'any';
  };

  var featuresHousingChange = function (element) {
    var filterFeatures = document.querySelectorAll('#housing-features input:checked');
    if (filterFeatures.length !== 0) {
      var compare = false;
      element.offer.features.forEach(function (currentElement) {
        filterFeatures.forEach(function (item) {
          if (currentElement === item.value) {
            compare = true;
          }
        });
      });
      return compare;
    } else {
      return true;
    }
  };

  var removePins = function () {
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
    removePins();
    mapPins.appendChild(window.pins.generateSimilarPins(filteredData));
  };

  var timeoutUpdatePins;
  var updatePins = function (data) {
    if (timeoutUpdatePins) {
      window.clearTimeout(timeoutUpdatePins);
    }
    timeoutUpdatePins = window.setTimeout(function () {
      window.card.removeCard();
      getUpdatePins(data);
    }, DEBOUNCE_DELAY);
  };

  window.filters = {
    updatePins: updatePins
  };
})();
