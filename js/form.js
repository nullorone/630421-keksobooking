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
  var PriceHousing = {
    bungalo: 0,
    flat: MIN_PRICE_FOR_FLAT,
    house: MIN_PRICE_FOR_HOUSE,
    palace: MIN_PRICE_FOR_PALACE
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

  var changesTimeAdForm = function (changeableSelect, changedSelect) {
    changeableSelect.addEventListener('change', function (evt) {
      changedSelect.children[evt.target.selectedIndex].selected = true;
    });
  };

  var configuresAdForm = function () {
    adForm.action = 'https://js.dump.academy/keksobooking';
    changesTimeAdForm(selectTimeinAdForm, selectTimeoutAdForm);
    changesTimeAdForm(selectTimeoutAdForm, selectTimeinAdForm);
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
    inputPriceAdForm.min = PriceHousing.flat;
    inputPriceAdForm.placeholder = PriceHousing.flat;
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
  var changesPriceNight = function (evt) {
    var valueTypeHousing = evt.target.value;
    inputPriceAdForm.min = PriceHousing[valueTypeHousing];
    inputPriceAdForm.placeholder = PriceHousing[valueTypeHousing];
  };

  var onInputTypeHousingChange = function (evt) {
    changesPriceNight(evt);
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

  // Меняет состояние атрибута disabled у коллекции элементов
  var setStateElementsForm = function (elements, state) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = state;
    }
  };

  // Разблокирует форму объявления
  var enabledAdForm = function () {
    adForm.classList.remove('ad-form--disabled');
    setStateElementsForm(selectsMapFilters, false);
    setStateElementsForm(fieldsetsMapFilters, false);
    setStateElementsForm(fieldsetsAdForm, false);
  };

  // Инициализация начального состояния формы
  var initAdForm = function () {
    var defaultCoordinatePinMain = window.pin.getCoordinateMapPinMain();
    fieldInputAddress.readOnly = true;
    fieldInputAddress.value = defaultCoordinatePinMain.defaultCentrX + ', ' + defaultCoordinatePinMain.defaultCentrY;
    setStateElementsForm(selectsMapFilters, true);
    setStateElementsForm(fieldsetsMapFilters, true);
    setStateElementsForm(fieldsetsAdForm, true);
  };

  // Устанавливает дефолтное состояние всех элементов страницы при клике на кнопку "Очистить" в форме AdForm
  var onButtonResetClick = function () {
    window.map.defaultStatePage();
  };

  var buttonResetAdForm = adForm.querySelector('.ad-form__reset');
  buttonResetAdForm.addEventListener('click', onButtonResetClick);

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

  adForm.addEventListener('submit', onButtonAdFormSubmitClick);


  window.form = {
    configuresAdForm: configuresAdForm,
    enabledAdForm: enabledAdForm,
    initAdForm: initAdForm
  };
})();
