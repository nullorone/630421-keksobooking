'use strict';
(function () {
  var DEBOUNCE_DELAY = 500;

  var PriceFilter = {
    LOW: 10000,
    HIGH: 50000
  };

  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');
  var filterType = document.querySelector('#housing-type');
  var filterRooms = document.querySelector('#housing-rooms');
  var filterPrice = document.querySelector('#housing-price');
  var filterGuests = document.querySelector('#housing-guests');
  var filterFeaturesNodeList = document.querySelectorAll('#housing-features input');
  var filters = Array.from(filterFeaturesNodeList);

  var typeHousingChange = function (ad) {
    return ad.offer.type === filterType.value || filterType.value === 'any';
  };

  var priceHousingChange = function (ad) {
    var priceToOptionsPrices = {
      'low': (ad.offer.price < PriceFilter.LOW),
      'middle': (ad.offer.price >= PriceFilter.LOW && ad.offer.price <= PriceFilter.HIGH),
      'high': (ad.offer.price > PriceFilter.HIGH)
    };
    return priceToOptionsPrices[filterPrice.value] || filterPrice.value === 'any';
  };

  var roomsHousingChange = function (ad) {
    return ad.offer.rooms === Number(filterRooms.value) || filterRooms.value === 'any';
  };

  var guestsHousingChange = function (ad) {
    return ad.offer.guests === Number(filterGuests.value) || filterGuests.value === 'any';
  };

  var featuresHousingChange = function (ad) {
    var checkedFeatures = filters.filter(function (filter) {
      return filter.checked;
    });
    return checkedFeatures.length === 0 || checkedFeatures.every(function (checkedFeature) {
      return ad.offer.features.find(function (adFeature) {
        return checkedFeature.value === adFeature;
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
