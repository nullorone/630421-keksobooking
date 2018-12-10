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
var INDEX_CARD = 2;
// var CARD_HOUSING_ELEMENT = document.querySelector('#card').content;
// var MAP = document.querySelector('.map');
// var ADS_FILTER = document.querySelector('.map__filters-container');

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
var PIN_TEMPLATE = document.querySelector('#pin').content;

var cardHousingElement = document.querySelector('#card').content;
var map = document.querySelector('.map');
var adsFilter = document.querySelector('.map__filters-container');
var mapPin = PIN_TEMPLATE.querySelector('.map__pin');
var mapPinImg = PIN_TEMPLATE.querySelector('img');

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


// Получаем рандомный прайс за жилье
var getRandomPrice = function (lowPrice, highPrice) {
  return getRandomInt(lowPrice, highPrice);
};

// Получаем рандомный тип жилья
var getTypeHousing = function () {
  return TYPES_HOUSING[getRandomInt(0, TYPES_HOUSING.length)];
};

// Получаем рандомное количество комнат из заданного диапазона
var getRandomRoomsNumber = function () {
  return getRandomInt(MIN_ROOMS_HOUSING, MAX_ROOMS_HOUSING);
};

// Получаем рандомное количество гостей из заданного диапазона
var getRandomGuestsNumber = function (minGuests, maxGuests) {
  return getRandomInt(minGuests, maxGuests);
};

// Получаем произвольное значение времени из массива
var getTimeCheckins = function () {
  return TIMES_CHECK[getRandomInt(0, TIMES_CHECK.length)];
};

// Генерация шаблона объявления
var generateAd = function (i) {
  // Позиция по-горизонтали
  var locationHousingX = getRandomInt(LEFT_SIDE_VIEWPORT, RIGHT_SIDE_VIEWPORT);

  // Получаем позицию по-вертикали
  var locationHousingY = getRandomInt(TOP_SIDE_VIEWPORT, BOTTOM_SIDE_VIEWPORT);

  var ad = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      title: AD_TITLES[i],
      address: locationHousingX +
        ', ' +
        locationHousingY,
      price: getRandomPrice(MIN_PRICE_HOUSING, MAX_PRICE_HOUSING),
      type: getTypeHousing(),
      rooms: getRandomRoomsNumber(),
      guests: getRandomGuestsNumber(MIN_GUESTS, MAX_GUESTS),
      checkin: getTimeCheckins(),
      checkout: getTimeCheckins(),
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

// // Показывает карту с объявлениями
// var showMap = function () {
//   map.classList.remove('map--faded');
// };

// // Скрывает превью карты
// showMap();

// Создает пин
var creatingPin = function (ad) {
  var template = PIN_TEMPLATE.cloneNode(true);
  var widthMapPin = mapPin.offsetWidth;
  var heightMapPin = mapPin.offsetHeight;
  mapPin.style.left = (ad.location.x - widthMapPin / 2) + 'px';
  mapPin.style.top = (ad.location.y - heightMapPin) + 'px';
  mapPinImg.src = ad.author.avatar;
  mapPinImg.alt = ad.offer.title;
  return template;
};

// Генерация меток
var getSimilarPins = function () {
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < MAX_ADS; i++) {
    fragment.appendChild(creatingPin(ads[i]));
  }
  return mapPins.appendChild(fragment);
};

// Получает перевод английского названия типа жилья
var getRussianTypeHousing = function (type) {
  var typesHousing = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  for (var typeItem in typesHousing) {
    if (type === typeItem) {
      return typesHousing[typeItem];
    }
  }
  return type;
};

// Генерирует список преимуществ жилья
var generateFeaturesList = function (ad, featuresList) {
  for (var i = ad.offer.features.length - 1; i >= 0; i--) {
    featuresList.insertAdjacentHTML('afterbegin', '<li class="popup__feature popup__feature--' + ad.offer.features[i] + '"></li>');
  }
  return featuresList;
};

// Получает фотографии жилья
var getPhotosItems = function (ad, popupPhotos) {
  for (var i = ad.offer.photos.length - 1; i >= 0; i--) {
    popupPhotos.insertAdjacentHTML('afterbegin', '<img src="' + ad.offer.photos[i] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
  }
  return popupPhotos;
};

// Создает карточку с информацией о жилье
var creatingCardHousing = function (ad) {
  var cardElement = cardHousingElement.cloneNode(true);
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
  generateFeaturesList(ad, popupFeatures);
  cardElement.querySelector('.popup__description').textContent =
    ad.offer.description;
  var popupPhotos = cardElement.querySelector('.popup__photos');
  popupPhotos.innerHTML = ' ';
  getPhotosItems(ad, popupPhotos);
  return cardElement;
};

// Вставляет карточку объявления перед элементом фильтрации объявлений
var showCardHousing = function (card) {
  return map.insertBefore(card, adsFilter);
};

// Описание функционала карты с метками

var mapPinMain = document.querySelector('.map__pin--main');

var adForm = document.querySelector('.ad-form');

var fieldsetsAdForm = adForm.querySelectorAll('fieldset');

var fieldInputAddress = adForm.querySelector('#address');

var mapFilters = document.querySelector('.map__filters');

var selectsMapFilters = mapFilters.querySelectorAll('select');

var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

// Добавляет атрибут disabled всем select в форме mapFilters
var setSelectsMapFiltersState = function (state) {
  for (var i = 0; i < selectsMapFilters.length; i++) {
    selectsMapFilters[i].disabled = state;
  }
};

// Добавляет атрибут disabled всем fieldset в форме mapFilters
var setFieldsetsMapFiltersState = function (state) {
  for (var i = 0; i < fieldsetsMapFilters.length; i++) {
    fieldsetsMapFilters[i].disabled = state;
  }
};

// Добавляет атрибут disabled всем fieldset в форме adForm
var setFieldsetsAdFormState = function (state) {
  for (var i = 0; i < fieldsetsAdForm.length; i++) {
    fieldsetsAdForm[i].disabled = state;
  }
};

// Разблокирует форму объявления
var activeAdForm = function () {
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
var showMap = function () {
  map.classList.remove('map--faded');
  activeAdForm();
};

var renderPins = function () {
  if (!(mapPinMain.classList.contains('map--faded'))) {
    // Отрисовка пинов
    getSimilarPins();
    mapPinMain.removeEventListener('mouseup', activationPage);
  }
};

// Скрывает объявление со страницы удаляя его из DOM
var hideAd = function () {
  var mapCard = document.querySelector('.map__card');
  map.removeChild(mapCard);
  document.removeEventListener('keydown', onEscKeydownCloseCardAd);
};

// Скрывает объявление по нажатию на кнопку-крестик
var onBtnCloseCardAd = function () {
  hideAd();
};

// Скрывает объявление по нажатию на кнопку-крестик
var onEscKeydownCloseCardAd = function (evt) {
  if (evt.keyCode === 27) {
    hideAd();
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
  INDEX_CARD = indexAvatarPin - 1;
};

var showAd = function (evt) {
  var previousCard = map.querySelector('.map__card');
  if (previousCard) {
    map.removeChild(previousCard);
  }
  getIndexAvatarPin(evt);
  // Рендерит карточку объявления
  showCardHousing(creatingCardHousing(ads[INDEX_CARD]));
  document.addEventListener('keydown', onEscKeydownCloseCardAd);
  var btnClosePopup = map.querySelector('.popup__close');
  btnClosePopup.addEventListener('click', onBtnCloseCardAd);
};


var onEnterKeyDownMapPin = function (evt) {
  if (evt.keyCode === 13) {
    showAd(evt);
  }
};

var onMapPinsClick = function () {
  var createdMapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < createdMapPins.length; i++) {
    createdMapPins[i].addEventListener('click', showAd);
    createdMapPins[i].addEventListener('keydown', onEnterKeyDownMapPin);
  }
};

var activationPage = function () {
  showMap();
  renderPins();
  onMapPinsClick();
  setSelectsMapFiltersState(false);
  setFieldsetsMapFiltersState(false);
  setFieldsetsAdFormState(false);
  fieldInputAddress.value = coordinateMapPinMain.x + ', ' + coordinateMapPinMain.y;
};

// Инициализация начального состояния
var init = function () {
  fieldInputAddress.value = coordinateMapPinMain.default;
  setSelectsMapFiltersState(true);
  setFieldsetsMapFiltersState(true);
  setFieldsetsAdFormState(true);
};

init();

mapPinMain.addEventListener('mouseup', activationPage);
