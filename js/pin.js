'use strict';

(function () {
  var HEIGHT_TIP_MAP_PIN_MAIN = 15;
  var TOP_SIDE_VIEWPORT = 130; // Минимальное положение пина от верхнего края вьюпорта с учетом высоты пина
  var BOTTOM_SIDE_VIEWPORT = 630; // Минимальное положение пина от нижнего края вьюпорта с учетом высоты пина
  var mapPinMain = document.querySelector('.map__pin--main');
  var fieldInputAddress = document.querySelector('#address');
  var map = document.querySelector('.map');

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
      window.map.enabledMap();
      window.pins.renderPins();
      window.form.configuresAdForm();
    };
    document.addEventListener('mousemove', onMapPinMainMousemove);
    document.addEventListener('mouseup', onMapPinMainMouseup);

  };

  mapPinMain.addEventListener('mousedown', onPinMainClick);

  window.pin = {
    getCoordinateMapPinMain: getCoordinateMapPinMain
  };

})();
