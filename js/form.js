'use strict';
(function () {
// Обработка формы подачи объявления
  var MIN_PRICE_FOR_FLAT = 1000;
  var MIN_PRICE_FOR_HOUSE = 5000;
  var MIN_PRICE_FOR_PALACE = 10000;
  var MIN_LENGTH_TITLE_AD = 30;
  var MAX_LENGTH_TITLE_AD = 30;
  var MAX_PRICE_HOUSING = 1000000;
  var DEFAULT_NUMBER_GUESTS = '1';

  // Минимальные цены для типов жилья
  var priceHousing = {
    bungalo: 0,
    flat: MIN_PRICE_FOR_FLAT,
    house: MIN_PRICE_FOR_HOUSE,
    palace: MIN_PRICE_FOR_PALACE
  };

  var mapPinMain = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var inputTitleAdForm = adForm.querySelector('#title');
  var selectTimeinAdForm = adForm.querySelector('#timein');
  var selectTimeoutAdForm = adForm.querySelector('#timeout');
  var inputPriceAdForm = adForm.querySelector('#price');
  var selectTypeHousingAdForm = adForm.querySelector('#type');
  var selectRoomNumberAdForm = adForm.querySelector('#room_number');
  var selectCapacityAdForm = adForm.querySelector('#capacity');
  var optionsCapacityAdForm = selectCapacityAdForm.querySelectorAll('option');

  // Синхронизирует изменение времени заезда с временем выезда
  selectTimeinAdForm.addEventListener('change', function (evt) {
    selectTimeoutAdForm.children[evt.target.selectedIndex].selected = true;
  });

  // Синхронизирует изменение времени выезда с временем заезда
  selectTimeoutAdForm.addEventListener('change', function (evt) {
    selectTimeinAdForm.children[evt.target.selectedIndex].selected = true;
  });

  var configuresAdForm = function () {
    adForm.action = 'https://js.dump.academy/keksobooking';

    configuresInputTitle();
    configuresInputPrice();
    configuresCapacity();
  };

  var configuresInputTitle = function () {
    if (inputTitleAdForm.type !== 'text') {
      inputTitleAdForm.type = 'text';
    }
    inputTitleAdForm.minLength = MIN_LENGTH_TITLE_AD;
    inputTitleAdForm.maxLength = MAX_LENGTH_TITLE_AD;
    inputTitleAdForm.required = true;
  };

  var configuresInputPrice = function () {
    if (inputPriceAdForm.type !== 'number') {
      inputPriceAdForm.type = 'number';
    }
    inputPriceAdForm.min = priceHousing.flat;
    inputPriceAdForm.placeholder = priceHousing.flat;
    inputPriceAdForm.max = MAX_PRICE_HOUSING;
    inputPriceAdForm.required = true;
  };

  var configuresCapacity = function () {
    for (var i = 0; i < optionsCapacityAdForm.length; i++) {
      optionsCapacityAdForm[i].disabled = true;

      if (optionsCapacityAdForm[i].value === DEFAULT_NUMBER_GUESTS) {
        optionsCapacityAdForm[i].selected = true;
        optionsCapacityAdForm[i].disabled = false;
      }
    }
  };

  // Изменяет минимальное значение и placeholder у инпута "Цена за ночь"
  var changePriceNight = function (evt) {
    var valueTypeHousing = evt.target.value;
    inputPriceAdForm.min = priceHousing[valueTypeHousing];
    inputPriceAdForm.placeholder = priceHousing[valueTypeHousing];
  };

  var onInputTypeHousingChange = function (evt) {
    changePriceNight(evt);
  };

  selectTypeHousingAdForm.addEventListener('change', onInputTypeHousingChange);

  // Получает объект с элементами сортированными в порядке возрастания по их соотношению со значениями в атрибутах
  var getObjectOptionsCapacity = function () {
    var objectCapacity = {};
    for (var i = 0; i < optionsCapacityAdForm.length; i++) {
      var currentValue = optionsCapacityAdForm[i];
      var currentKey = currentValue.value;
      objectCapacity[currentKey] = currentValue;
    }
    return objectCapacity;
  };
  var optionsCapacity = getObjectOptionsCapacity();

  // Соотношение кол-во комнат и кол-во мест
  var compareRoomsPlaces = {
    1: [optionsCapacity[1]], // 1 комната - для 1 гостя
    2: [optionsCapacity[2], optionsCapacity[1]], // 2 комнаты - для 2 гостей и 1 гостя
    3: [optionsCapacity[3], optionsCapacity[2], optionsCapacity[1]], // 3 комнаты для 3 гостей, для 2 гостей, для 1 гостя
    100: [optionsCapacity[0]] // 100 комнат - не для гостей
  };

  // Добавляет состояние disabled пунктам, которые не соответствуют выбранному количеству комнат
  var setStateInputNumberPlaces = function (evt) {
    for (var i = 0; i < optionsCapacityAdForm.length; i++) {
      optionsCapacityAdForm[i].disabled = true;
    }

    var valueCapacity = evt.target.value;

    compareRoomsPlaces[valueCapacity].forEach(function (place) {
      place.selected = true;
      place.disabled = false;
    });
  };

  var onInputRoomNumberChange = function (evt) {
    setStateInputNumberPlaces(evt);
  };

  selectRoomNumberAdForm.addEventListener('change', onInputRoomNumberChange);

  var buttonResetAdForm = adForm.querySelector('.ad-form__reset');

  // Устанавливает дефолтное состояние всех элементов на странице
  var defaultStatePage = function () {
    adForm.reset();
    adForm.classList.add('ad-form--disabled');
    map.classList.add('map--faded');
    var mapCard = map.querySelector('.map__card');
    if (mapCard) {
      mapCard.remove();
    }
    while (mapPinMain.nextElementSibling) {
      mapPinMain.nextElementSibling.remove();
    }
    window.pin.init();
  };

  // Устанавливает дефолтное состояние всех элементов страницы при клике на кнопку "Очистить" в форме AdForm
  var onButtonResetClick = function () {
    defaultStatePage();
  };

  buttonResetAdForm.addEventListener('click', onButtonResetClick);

  window.form = {
    configuresAdForm: configuresAdForm
  };
})();
