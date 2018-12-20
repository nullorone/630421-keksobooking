'use strict';

(function () {
  var HEIGHT_TIP_MAP_PIN_MAIN = 15;
  var TOP_SIDE_VIEWPORT = 130; // Минимальное положение пина от верхнего края вьюпорта с учетом высоты пина
  var BOTTOM_SIDE_VIEWPORT = 630; // Минимальное положение пина от нижнего края вьюпорта с учетом высоты пина
  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var fieldInputAddress = document.querySelector('#address');
  var fieldsetsAdForm = adForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

  // Высчитывает координаты наконечника главного пина
  var getCoordinateMapPinMain = function () {
    var coordinateX = Math.floor(mapPinMain.offsetWidth / 2 + mapPinMain.offsetLeft);
    var coordinateY = mapPinMain.offsetTop + mapPinMain.offsetHeight + HEIGHT_TIP_MAP_PIN_MAIN;
    var defaultX = coordinateX;
    var defaultY = Math.floor(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2);
    var coordinate = {
      x: coordinateX,
      y: coordinateY,
      defaultX: defaultX,
      defaultY: defaultY
    };

    return coordinate;
  };

  var coordinateMapPinMain = getCoordinateMapPinMain();

  // Меняет состояние атрибута disabled у коллекции элементов
  var setStateElementsForm = function (elements, state) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = state;
    }
  };


  var onPinMainClick = function (evt) {
    evt.preventDefault();
    var dragged = false;
    var defaultPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMapPinMainMousemove = function (mousemoveEvt) {
      mousemoveEvt.preventDefault();
      dragged = true;
      var newPosition = {
        x: mousemoveEvt.clientX - defaultPosition.x,
        y: mousemoveEvt.clientY - defaultPosition.y
      };

      defaultPosition = {
        x: mousemoveEvt.clientX,
        y: mousemoveEvt.clientY
      };

      var coordinatePin = getCoordinateMapPinMain();
      var mapParameters = {
        top: map.clientTop,
        right: map.clientWidth,
        bottom: map.clientHeight,
        left: map.clientLeft
      };

      var limitsShift = {
        top: mapParameters.top + TOP_SIDE_VIEWPORT - mapPinMain.offsetHeight - HEIGHT_TIP_MAP_PIN_MAIN + 1,
        right: mapParameters.right - mapPinMain.offsetWidth,
        bottom: mapParameters.top + BOTTOM_SIDE_VIEWPORT - HEIGHT_TIP_MAP_PIN_MAIN - mapPinMain.offsetHeight - 1,
        left: mapParameters.left
      };


      if (mapPinMain.offsetLeft > limitsShift.right) {
        mapPinMain.style.left = limitsShift.right + 'px';
      } else if (mapPinMain.offsetLeft < limitsShift.left) {
        mapPinMain.style.left = limitsShift.left + 'px';
      }


      if (mapPinMain.offsetTop > limitsShift.bottom) {
        mapPinMain.style.top = limitsShift.bottom + 'px';
      } else if (mapPinMain.offsetTop < limitsShift.top) {
        mapPinMain.style.top = limitsShift.top + 'px';
      }

      mapPinMain.style.left = mapPinMain.offsetLeft + newPosition.x + 'px';
      mapPinMain.style.top = mapPinMain.offsetTop + newPosition.y + 'px';
      fieldInputAddress.value = coordinatePin.x + ', ' + coordinatePin.y;
    };


    var onMapPinMainMouseup = function (mouseupEvt) {
      mouseupEvt.preventDefault();
      if (!dragged) {
        fieldInputAddress.value = coordinateMapPinMain.defaultX + ', ' + (coordinateMapPinMain.defaultY + Math.floor(mapPinMain.offsetHeight / 2));
      }
      document.removeEventListener('mousemove', onMapPinMainMousemove);
      document.removeEventListener('mouseup', onMapPinMainMouseup);
      enabledMap();
      renderPins();
      setStateElementsForm(selectsMapFilters, false);
      setStateElementsForm(fieldsetsMapFilters, false);
      setStateElementsForm(fieldsetsAdForm, false);
      window.form.configuresAdForm();
    };
    document.addEventListener('mousemove', onMapPinMainMousemove);
    document.addEventListener('mouseup', onMapPinMainMouseup);

  };
    // Разблокирует форму объявления
  var enabledAdForm = function () {
    adForm.classList.remove('ad-form--disabled');
  };
    // Показывает карту с объявлениями
  var enabledMap = function () {
    map.classList.remove('map--faded');
    enabledAdForm();
  };

  var renderPins = function () {
    if (!(mapPinMain.classList.contains('map--faded'))) {
      // Отрисовка пинов
      window.map.showSimilarPins();
    }
  };
  mapPinMain.addEventListener('mousedown', onPinMainClick);
  // Инициализация начального состояния
  var init = function () {
    fieldInputAddress.readOnly = true;
    fieldInputAddress.value = coordinateMapPinMain.defaultX + ', ' + coordinateMapPinMain.defaultY;
    setStateElementsForm(selectsMapFilters, true);
    setStateElementsForm(fieldsetsMapFilters, true);
    setStateElementsForm(fieldsetsAdForm, true);
  };

  init();

  window.pin = {
    init: init
  };

})();
