'use strict';
(function () {
// Обработка формы подачи объявления
  var MAX_PRICE_HOUSING = 1000000;
  var DEFAULT_NUMBER_GUESTS = '1';

  var LengthTitleAd = {
    MIN: 30,
    MAX: 100
  };
  // Минимальные цены для типов жилья
  var PriceHousing = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var adForm = document.querySelector('.ad-form');
  var inputTitleAdForm = adForm.querySelector('#title');
  var selectTimeinAdForm = adForm.querySelector('#timein');
  var selectTimeoutAdForm = adForm.querySelector('#timeout');
  var inputPriceAdForm = adForm.querySelector('#price');
  var selectTypeHousingAdForm = adForm.querySelector('#type');
  var selectRoomNumberAdForm = adForm.querySelector('#room_number');
  var selectCapacityAdForm = adForm.querySelector('#capacity');
  var optionsCapacityAdForm = selectCapacityAdForm.querySelectorAll('option');
  var fieldInputAddress = document.querySelector('#address');
  var fieldsetsAdForm = adForm.querySelectorAll('fieldset');
  var mapFilters = document.querySelector('.map__filters');
  var selectsMapFilters = mapFilters.querySelectorAll('select');
  var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

  var onTimeAdChange = function (evt) {
    selectTimeoutAdForm.children[evt.target.selectedIndex].selected = true;
    selectTimeinAdForm.children[evt.target.selectedIndex].selected = true;
  };

  var changeTimeAdForm = function (changeableSelect) {
    changeableSelect.addEventListener('change', onTimeAdChange);
  };

  var configureAdForm = function () {
    adForm.action = 'https://js.dump.academy/keksobooking';
    changeTimeAdForm(selectTimeinAdForm);
    changeTimeAdForm(selectTimeoutAdForm);
    configureInputTitle();
    configureInputPrice();
    configureCapacity();
  };

  var configureInputTitle = function () {
    if (inputTitleAdForm.type !== 'text') {
      inputTitleAdForm.type = 'text';
    }
    inputTitleAdForm.minLength = LengthTitleAd.MIN;
    inputTitleAdForm.maxLength = LengthTitleAd.MAX;
    inputTitleAdForm.required = true;
  };

  var configureInputPrice = function () {
    if (inputPriceAdForm.type !== 'number') {
      inputPriceAdForm.type = 'number';
    }
    inputPriceAdForm.min = PriceHousing.FLAT;
    inputPriceAdForm.placeholder = PriceHousing.FLAT;
    inputPriceAdForm.max = MAX_PRICE_HOUSING;
    inputPriceAdForm.required = true;
  };

  var configureCapacity = function () {
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
    valueTypeHousing = valueTypeHousing.toUpperCase();
    inputPriceAdForm.min = PriceHousing[valueTypeHousing];
    inputPriceAdForm.placeholder = PriceHousing[valueTypeHousing];
  };

  var onInputTypeHousingChange = function (evt) {
    changePriceNight(evt);
  };

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

  // Меняет состояние атрибута disabled у коллекции элементов
  var setStateElementsForm = function (elements, state) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = state;
    }
  };

  // Инициализация начального состояния формы
  var initializeAdForm = function () {
    var defaultCoordinatePinMain = window.pin.getCoordinateMapPinMain();
    fieldInputAddress.readOnly = true;
    fieldInputAddress.value = defaultCoordinatePinMain.defaultCentrX + ', ' + defaultCoordinatePinMain.defaultCentrY;
    setStateElementsForm(selectsMapFilters, true);
    setStateElementsForm(fieldsetsMapFilters, true);
    setStateElementsForm(fieldsetsAdForm, true);
    selectTypeHousingAdForm.removeEventListener('change', onInputTypeHousingChange);
    selectRoomNumberAdForm.removeEventListener('change', onInputRoomNumberChange);
    buttonResetAdForm.removeEventListener('click', onButtonResetClick);
    adForm.removeEventListener('submit', onButtonAdFormSubmitClick);
    selectTimeoutAdForm.removeEventListener('change', onTimeAdChange);
    selectTimeinAdForm.removeEventListener('change', onTimeAdChange);
  };

  // Устанавливает дефолтное состояние всех элементов страницы при клике на кнопку "Очистить" в форме AdForm
  var onButtonResetClick = function () {
    window.map.setDefaultStatePage();
  };

  var buttonResetAdForm = adForm.querySelector('.ad-form__reset');

  var sendDataSuccess = function (status) {
    window.messages.generatesMessageNode(status);
  };

  var sendDataError = function (status) {
    window.messages.generatesMessageNode(status);
  };

  var onButtonAdFormSubmitClick = function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), sendDataSuccess, sendDataError);
  };

  // Разблокирует форму объявления
  var enableAdForm = function () {
    adForm.classList.remove('ad-form--disabled');
    setStateElementsForm(selectsMapFilters, false);
    setStateElementsForm(fieldsetsMapFilters, false);
    setStateElementsForm(fieldsetsAdForm, false);
    selectTypeHousingAdForm.addEventListener('change', onInputTypeHousingChange);
    selectRoomNumberAdForm.addEventListener('change', onInputRoomNumberChange);
    buttonResetAdForm.addEventListener('click', onButtonResetClick);
    adForm.addEventListener('submit', onButtonAdFormSubmitClick);
  };

  window.form = {
    configureAdForm: configureAdForm,
    enableAdForm: enableAdForm,
    initializeAdForm: initializeAdForm
  };
})();
