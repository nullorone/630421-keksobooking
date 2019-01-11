'use strict';
(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var defaultPositionPinMain = window.pin.getCoordinateMapPinMain();

  // Устанавливает дефолтное состояние всех элементов на странице
  var defaultStatePage = function () {
    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    map.classList.add('map--faded');
    mapPinMain.style.left = defaultPositionPinMain.defaultX + 'px';
    mapPinMain.style.top = defaultPositionPinMain.defaultY + 'px';
    var mapCard = map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
    while (mapPinMain.nextElementSibling) {
      mapPinMain.nextElementSibling.remove();
    }
    window.form.initAdForm();
  };

  // Показывает карту с объявлениями
  var enabledMap = function () {
    map.classList.remove('map--faded');
    window.form.enabledAdForm();
  };
  document.addEventListener('DOMContentLoaded', function () {
    window.form.initAdForm();
  });

  window.map = {
    enabledMap: enabledMap,
    defaultStatePage: defaultStatePage
  };
})();
