'use strict';
(function () {
  var DEBOUNCE_DELAY = 500;

  var PriceFilter = {
    LOW: 10000,
    HIGH: 50000
  };

  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');

  var typeHousingChange = function (ad) {
    var filterType = document.querySelector('#housing-type').value;
    return ad.offer.type === filterType || filterType === 'any';
  };

  var priceHousingChange = function (ad) {
    var filterPrice = document.querySelector('#housing-price').value;
    var priceToOptionsPrices = {
      'low': (ad.offer.price < PriceFilter.LOW),
      'middle': (ad.offer.price >= PriceFilter.LOW && ad.offer.price <= PriceFilter.HIGH),
      'high': (ad.offer.price > PriceFilter.HIGH)
    };
    return priceToOptionsPrices[filterPrice] || filterPrice === 'any';
  };

  var roomsHousingChange = function (ad) {
    var filterRooms = document.querySelector('#housing-rooms').value;
    if (filterRooms !== 'any') {
      filterRooms = Number(filterRooms);
    }
    return ad.offer.rooms === filterRooms || filterRooms === 'any';
  };

  var guestsHousingChange = function (ad) {
    var filterGuests = document.querySelector('#housing-guests').value;
    if (filterGuests !== 'any') {
      filterGuests = Number(filterGuests);
    }
    return ad.offer.guests === filterGuests || filterGuests === 'any';
  };

  var featuresHousingChange = function (ad) {
    var filterFeaturesNodeList = document.querySelectorAll('#housing-features input:checked');
    var filterFeatures = Array.from(filterFeaturesNodeList);

    return filterFeatures.length === 0 || filterFeatures.every(function (item) {
      return ad.offer.features.find(function (feature) {
        return item.value === feature;
      });
    });
  };

  var removePins = function () {
    while (mapPinMain.nextElementSibling) {
      mapPinMain.nextElementSibling.remove();
    }
  };

  var getUpdatePins = function (ads) {
    var filteredAds = ads.filter(function (ad) {
      return typeHousingChange(ad)
        && priceHousingChange(ad)
        && roomsHousingChange(ad)
        && guestsHousingChange(ad)
        && featuresHousingChange(ad);
    });
    removePins();
    mapPins.appendChild(window.pins.generateSimilarPins(filteredAds));
  };

  var timeoutUpdatePins;
  var updatePins = function (ads) {
    if (timeoutUpdatePins) {
      window.clearTimeout(timeoutUpdatePins);
    }
    timeoutUpdatePins = window.setTimeout(function () {
      window.card.removeCard();
      getUpdatePins(ads);
    }, DEBOUNCE_DELAY);
  };

  window.filters = {
    updatePins: updatePins
  };
})();
