'use strict';
(function () {
  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var defaultPositionPinMain = window.pin.getCoordinateMapPinMain();

  // Устанавливает дефолтное состояние всех элементов на странице
  var setDefaultStatePage = function () {
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
    window.form.initializeAdForm();
  };

  // Показывает карту с объявлениями
  var enableMap = function () {
    map.classList.remove('map--faded');
    window.form.enableAdForm();
  };

  window.form.initializeAdForm();

  window.map = {
    enableMap: enableMap,
    setDefaultStatePage: setDefaultStatePage
  };
})();
