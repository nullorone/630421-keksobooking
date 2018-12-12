'use strict';

var LEFT_SIDE_VIEWPORT = 25; // Минимальное положение пина от левого края вьюпорта с учетом ширины пина
var RIGHT_SIDE_VIEWPORT = 1175; // Минимальное положение пина от правого края вьюпорта с учетом ширины пина
var TOP_SIDE_VIEWPORT = 130; // Минимальное положение пина от верхнего края вьюпорта с учетом высоты пина
var BOTTOM_SIDE_VIEWPORT = 630; // Минимальное положение пина от нижнего края вьюпорта с учетом высоты пина
var MAX_ADS = 8; // Максимальное количество объявлений для генерации массива объектов
var MIN_PRICE_HOUSING = 1000;
var MAX_PRICE_HOUSING = 1000000;
var MIN_ROOMS_HOUSING = 1;
var MAX_ROOMS_HOUSING = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
// var INDEX_CARD = 2;

var AD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES_HOUSING = ['palace', 'flat', 'house', 'bungalo'];

var TIMES_CHECK = ['12:00', '13:00', '14:00'];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS_HOSTEL = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var HEIGHT_TIP_MAP_PIN_MAIN = 15;
var pinTemplate = document.querySelector('#pin');
var cardTemplate = document.querySelector('#card');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var adsFilter = document.querySelector('.map__filters-container');

// Находим случайно число в указанных диапазонах
var getRandomInt = function (min, max) {
  var randomInteger = Math.floor(Math.random() * (max - min) + min);
  return randomInteger;
};

// Находим случайную длину массива преимуществ
var getRandomFeatures = function (features) {
  return features.slice(0, getRandomInt(1, features.length));
};

// Перемешиваем порядок элементов в массиве
var getShuffleArray = function (array) {
  var cloneArray = array.slice();
  for (var i = cloneArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cloneArray[j];
    cloneArray[j] = cloneArray[i];
    cloneArray[i] = temp;
  }
  return cloneArray;
};

// Генерация шаблона объявления
var generateAd = function (index) {
  // Позиция по-горизонтали
  var locationHousingX = getRandomInt(LEFT_SIDE_VIEWPORT, RIGHT_SIDE_VIEWPORT);

  // Получаем позицию по-вертикали
  var locationHousingY = getRandomInt(TOP_SIDE_VIEWPORT, BOTTOM_SIDE_VIEWPORT);

  // Рандомный прайс за жилье
  var randomPrice = getRandomInt(MIN_PRICE_HOUSING, MAX_PRICE_HOUSING);

  // Рандомный тип жилья
  var typeHousing = TYPES_HOUSING[getRandomInt(0, TYPES_HOUSING.length)];

  // Рандомное количество комнат из заданного диапазона
  var randomRoomsNumber = getRandomInt(MIN_ROOMS_HOUSING, MAX_ROOMS_HOUSING);

  // Рандомное количество гостей из заданного диапазона
  var randomGuestsNumber = getRandomInt(MIN_GUESTS, MAX_GUESTS);

  // Получаем произвольное значение времени из массива
  var timeCheckins = TIMES_CHECK[getRandomInt(0, TIMES_CHECK.length)];

  var ad = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: AD_TITLES[index],
      address: locationHousingX +
        ', ' +
        locationHousingY,
      price: randomPrice,
      type: typeHousing,
      rooms: randomRoomsNumber,
      guests: randomGuestsNumber,
      checkin: timeCheckins,
      checkout: timeCheckins,
      features: getRandomFeatures(FEATURES),
      description: '',
      photos: getShuffleArray(PHOTOS_HOSTEL)
    },
    location: {
      x: locationHousingX,
      y: locationHousingY
    }
  };
  return ad;
};

// Генерация массива объектов карточек жилья
var generateAds = function () {
  var ads = [];
  for (var i = 0; i < MAX_ADS; i++) {
    ads.push(generateAd(i));
  }
  return ads;
};

// Присваиваем переменной генерацию массива объектов с объявлениями
var ads = generateAds();

// Создает пин
var creatingPin = function (ad) {
  var template = pinTemplate.content.cloneNode(true);
  var mapPin = template.querySelector('.map__pin');
  var mapPinImg = mapPin.querySelector('img');
  var widthMapPin = 50;
  var heightMapPin = 70;
  mapPin.style.left = (ad.location.x - widthMapPin / 2) + 'px';
  mapPin.style.top = (ad.location.y - heightMapPin) + 'px';
  mapPinImg.src = ad.author.avatar;
  mapPinImg.alt = ad.offer.title;
  mapPin.addEventListener('click', onMapPinClick);
  mapPin.addEventListener('keydown', onMapPinKeydownEnter);
  return template;
};

// Генерация меток
var generateSimilarPins = function (adsArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adsArray.length; i++) {
    fragment.appendChild(creatingPin(adsArray[i]));
  }
  return fragment;
};

// Отрисовка пинов на карте
var showSimilarPins = function () {
  mapPins.appendChild(generateSimilarPins(ads));
};

// Получает перевод английского названия типа жилья
var getRussianTypeHousing = function (type) {
  var typesHousing = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  return typesHousing[type];
};

// Генерирует список преимуществ жилья
var generateFeaturesList = function (ad) {
  var featuresList = [];
  for (var i = 0; i < ad.offer.features.length; i++) {
    featuresList.push('<li class="popup__feature popup__feature--' + ad.offer.features[i] + '"></li>');
  }
  return featuresList;
};

// Вставляет сгенерированный массив преимуществ в разметку
var includeFeaturesList = function (featuresListArray, popupFeatures) {
  for (var i = featuresListArray.length - 1; i >= 0; i--) {
    popupFeatures.insertAdjacentHTML('afterbegin', featuresListArray[i]);
  }
  return popupFeatures;
};

// Получает фотографии жилья
var generatePhotoList = function (ad) {
  var photoList = [];
  for (var i = 0; i < ad.offer.photos.length; i++) {
    photoList.push('<img src="' + ad.offer.photos[i] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  return photoList;
};

// Вставляет сгенерированный массив фотографий жилья в разметку
var includePhotoList = function (photoListArray, popupPhotos) {
  for (var i = photoListArray.length - 1; i >= 0; i--) {
    popupPhotos.insertAdjacentHTML('afterbegin', photoListArray[i]);
  }
  return popupPhotos;
};

// Создает карточку с информацией о жилье
var creatingCardHousing = function (ad) {
  var cardElement = cardTemplate.content.cloneNode(true);
  cardElement.querySelector('.popup__avatar').src =
  ad.author.avatar;
  cardElement.querySelector('.popup__title').textContent =
  ad.offer.title;
  cardElement.querySelector('.popup__text--address').textContent =
  ad.offer.address;
  cardElement.querySelector('.popup__text--price').innerHTML =
  ad.offer.price + '&#x20bd;<span>/ночь</span>';
  cardElement.querySelector('.popup__type').textContent = getRussianTypeHousing(ad.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent =
    ad.offer.rooms +
    ' комнаты для ' +
    ad.offer.guests +
    ' гостей';
  cardElement.querySelector('.popup__text--time').textContent =
    'Заезд после ' +
    ad.offer.checkin +
    ', выезд до ' +
    ad.offer.checkout;
  var popupFeatures = cardElement.querySelector('.popup__features');
  popupFeatures.innerHTML = ' ';
  includeFeaturesList(generateFeaturesList(ad), popupFeatures);
  cardElement.querySelector('.popup__description').textContent =
    ad.offer.description;
  var popupPhotos = cardElement.querySelector('.popup__photos');
  popupPhotos.innerHTML = ' ';
  includePhotoList(generatePhotoList(ad), popupPhotos);
  return cardElement;
};

// Вставляет карточку объявления перед элементом фильтрации объявлений
var showCardHousing = function (card) {
  map.insertBefore(card, adsFilter);
};

// Описание функционала карты с метками

var mapPinMain = document.querySelector('.map__pin--main');

var adForm = document.querySelector('.ad-form');

var fieldsetsAdForm = adForm.querySelectorAll('fieldset');

var fieldInputAddress = adForm.querySelector('#address');

var mapFilters = document.querySelector('.map__filters');

var selectsMapFilters = mapFilters.querySelectorAll('select');

var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

// Меняет состояние атрибута disabled у коллекции элементов
var setStateElementsForm = function (elements, state) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = state;
  }
};

// Разблокирует форму объявления
var enabledAdForm = function () {
  adForm.classList.remove('ad-form--disabled');
};

// Высчитывает координаты наконечника главного пина
var getCoordinateMapPinMain = function () {
  var coordinateX = Math.floor(mapPinMain.offsetWidth / 2 + mapPinMain.offsetLeft);
  var coordinateY = mapPinMain.offsetTop + mapPinMain.offsetHeight + HEIGHT_TIP_MAP_PIN_MAIN;
  var defaultX = Math.floor(mapPinMain.offsetWidth / 2 + mapPinMain.offsetLeft);
  var defaultY = Math.floor(mapPinMain.offsetTop + mapPinMain.offsetHeight / 2);
  var coordinate = {
    x: coordinateX,
    y: coordinateY,
    default: defaultX + ', ' + defaultY
  };

  return coordinate;
};

var coordinateMapPinMain = getCoordinateMapPinMain();

// Показывает карту с объявлениями
var enabledMap = function () {
  map.classList.remove('map--faded');
  enabledAdForm();
};

var renderPins = function () {
  if (!(mapPinMain.classList.contains('map--faded'))) {
    // Отрисовка пинов
    showSimilarPins();
    mapPinMain.removeEventListener('mouseup', onPinMainClick);
  }
};

// Скрывает объявление со страницы удаляя его из DOM
var removedAd = function () {
  var mapCard = document.querySelector('.map__card');
  map.removeChild(mapCard);
  document.removeEventListener('keydown', onDocumentKeydownEsc);
};

// Скрывает объявление по клику на кнопку-крестик
var onButtonCloseClick = function () {
  removedAd();
};

// Скрывает объявление по нажатию на кнопку-крестик
var onDocumentKeydownEsc = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removedAd();
  }
};

// Получает индекс аватарки автора объявления
var getIndexAvatarPin = function (evt) {
  var indexAvatarPin;
  if (evt.target.className === 'map__pin') {
    indexAvatarPin = evt.target.firstElementChild.src.slice(-5, -4);
  } else {
    indexAvatarPin = evt.srcElement.src.slice(-5, -4);
  }
  indexAvatarPin -= 1;
  return indexAvatarPin;
};

var showAd = function (evt) {
  var previousCard = map.querySelector('.map__card');
  if (previousCard) {
    map.removeChild(previousCard);
  }
  // Рендерит карточку объявления
  showCardHousing(creatingCardHousing(ads[getIndexAvatarPin(evt)]));
  document.addEventListener('keydown', onDocumentKeydownEsc);
  var buttonClosePopup = map.querySelector('.popup__close');
  buttonClosePopup.addEventListener('click', onButtonCloseClick);
};


var onMapPinKeydownEnter = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    showAd(evt);
  }
};

var onMapPinClick = function (evt) {
  showAd(evt);
};

var onPinMainClick = function () {
  enabledMap();
  renderPins();
  setStateElementsForm(selectsMapFilters, false);
  setStateElementsForm(fieldsetsMapFilters, false);
  setStateElementsForm(fieldsetsAdForm, false);
  fieldInputAddress.value = coordinateMapPinMain.x + ', ' + coordinateMapPinMain.y;
};

// Инициализация начального состояния
var init = function () {
  mapPinMain.addEventListener('mouseup', onPinMainClick);
  fieldInputAddress.value = coordinateMapPinMain.default;
  setStateElementsForm(selectsMapFilters, true);
  setStateElementsForm(fieldsetsMapFilters, true);
  setStateElementsForm(fieldsetsAdForm, true);
};

init();
