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
var CARD_HOUSING_ELEMENT = document.querySelector('#card').content;
var MAP = document.querySelector('.map');
var ADS_FILTER = document.querySelector('.map__filters-container');

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

// Находим случайно число в указанных диапазонах
var getRandomInt = function (min, max) {
  var randomInteger = Math.random() * (max - min) + min;
  randomInteger = Math.floor(randomInteger);
  return randomInteger;
};

// Находим случайную длину массива преимуществ
var getRandomFeatures = function (features) {
  return features.slice(0, getRandomInt(1, features.length));
};

// Перемешиваем порядок элементов в массиве
var getShuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

// Получаем позицию по-горизонтали
var getLocationHousingX = function (left, right) {
  return getRandomInt(left, right);
};

// Получаем позицию по-вертикали
var getLocationHousingY = function (top, bottom) {
  return getRandomInt(top, bottom);
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
  var ad = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
    },
    offer: {
      title: AD_TITLES[i],
      address:
        getLocationHousingX(LEFT_SIDE_VIEWPORT, RIGHT_SIDE_VIEWPORT) +
        ' - ' +
        getLocationHousingY(TOP_SIDE_VIEWPORT, BOTTOM_SIDE_VIEWPORT),
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
      x: getLocationHousingX(LEFT_SIDE_VIEWPORT, RIGHT_SIDE_VIEWPORT),
      y: getLocationHousingY(TOP_SIDE_VIEWPORT, BOTTOM_SIDE_VIEWPORT)
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

// Создает пин
var creatingPin = function (ads, i) {
  var pinTemplate = document.querySelector('#pin').content.cloneNode(true);
  pinTemplate.querySelector('.map__pin').style.left = ads[i].location.x + 'px';
  pinTemplate.querySelector('.map__pin').style.top = ads[i].location.y + 'px';
  pinTemplate.querySelector('img').src = ads[i].author.avatar;
  pinTemplate.querySelector('img').alt = ads[i].offer.title;
  return pinTemplate;
};

// Генерация меток
var getSimilarPins = function () {
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < MAX_ADS; i++) {
    fragment.appendChild(creatingPin(generateAds(), i));
  }
  return mapPins.appendChild(fragment);
};

// Получает перевод английского названия типа жилья
var getRussianTypeHousing = function (type) {
  var englishTypesHousing = ['flat', 'bungalo', 'house', 'palace'];
  var russianTypesHousing = ['Квартира', 'Бунгало', 'Дом', 'Дворец'];
  for (var i = 0; i < englishTypesHousing.length; i++) {
    if (type === englishTypesHousing[i]) {
      return russianTypesHousing[i];
    }
  }
  return type;
};

// Генерирует список преимуществ жилья
var generateFeaturesList = function (ads, featuresList) {
  for (var i = ads[INDEX_CARD].offer.features.length - 1; i >= 0; i--) {
    featuresList.insertAdjacentHTML(
        'afterbegin',
        '<li class="popup__feature popup__feature--' +
        ads[INDEX_CARD].offer.features[i] +
        '"></li>'
    );
  }
  return featuresList;
};

// Получает фотографии жилья
var getPhotosItems = function (ads, popupPhotos) {
  for (var i = ads[INDEX_CARD].offer.photos.length - 1; i >= 0; i--) {
    popupPhotos.insertAdjacentHTML(
        'afterbegin',
        '<img src="' +
        ads[INDEX_CARD].offer.photos[i] +
        '" class="popup__photo" width="45" height="40" alt="Фотография жилья">'
    );
  }
  return popupPhotos;
};

// Создает карточку с информацией о жилье
var creatingCardHousing = function (ads) {
  CARD_HOUSING_ELEMENT.cloneNode(true);
  CARD_HOUSING_ELEMENT.querySelector('.popup__avatar').src =
    ads[INDEX_CARD].author.avatar;
  CARD_HOUSING_ELEMENT.querySelector('.popup__title').textContent =
    ads[INDEX_CARD].offer.title;
  CARD_HOUSING_ELEMENT.querySelector('.popup__text--address').textContent =
    ads[INDEX_CARD].offer.address + ' Tōkyō-to, Chiyoda-ku, Ichibanchō, 14−3';
  CARD_HOUSING_ELEMENT.querySelector('.popup__text--price').innerHTML =
    '&#x20bd;<span>/ночь</span>';
  CARD_HOUSING_ELEMENT
    .querySelector('.popup__text--price')
    .insertAdjacentText('afterbegin', ads[INDEX_CARD].offer.price);
  CARD_HOUSING_ELEMENT.querySelector(
      '.popup__type'
  ).textContent = getRussianTypeHousing(ads[INDEX_CARD].offer.type);
  CARD_HOUSING_ELEMENT.querySelector('.popup__text--capacity').textContent =
    ads[INDEX_CARD].offer.rooms +
    ' комнаты для ' +
    ads[INDEX_CARD].offer.guests +
    ' гостей';
  CARD_HOUSING_ELEMENT.querySelector('.popup__text--time').textContent =
    'Заезд после ' +
    ads[INDEX_CARD].offer.checkin +
    ', выезд до ' +
    ads[INDEX_CARD].offer.checkout;
  var popupFeatures = CARD_HOUSING_ELEMENT.querySelector('.popup__features');
  popupFeatures.innerHTML = ' ';
  generateFeaturesList(ads, popupFeatures);
  CARD_HOUSING_ELEMENT.querySelector('.popup__description').textContent =
    ads[INDEX_CARD].offer.description;
  var popupPhotos = CARD_HOUSING_ELEMENT.querySelector('.popup__photos');
  popupPhotos.innerHTML = ' ';
  getPhotosItems(ads, popupPhotos);
  return CARD_HOUSING_ELEMENT;
};

// Вставляет карточку объявления перед элементом фильтрации объявлений
var showCardHousing = function (card) {
  return MAP.insertBefore(
      card,
      ADS_FILTER);
};

showCardHousing(creatingCardHousing(generateAds()));
INDEX_CARD = 1;
showCardHousing(creatingCardHousing(generateAds()));
INDEX_CARD = 2;
showCardHousing(creatingCardHousing(generateAds()));
INDEX_CARD = 3;
showCardHousing(creatingCardHousing(generateAds()));

// Описание функционала карты с метками

var mapPinMain = document.querySelector('.map__pin--main');

var adForm = document.querySelector('.ad-form');

var fieldsetsAdForm = adForm.querySelectorAll('fieldset');

var fieldInputAddress = adForm.querySelector('#address');

var mapFilters = document.querySelector('.map__filters');

var selectsMapFilters = mapFilters.querySelectorAll('select');

var fieldsetsMapFilters = mapFilters.querySelectorAll('fieldset');

// Добавляет атрибут disabled всем select в форме mapFilters
var setSelectsMapFiltersDisabled = function (state) {
  for (var i = 0; i < selectsMapFilters.length; i++) {
    selectsMapFilters[i].disabled = state;
  }
};

// Добавляет атрибут disabled всем fieldset в форме mapFilters
var setFieldsetsMapFiltersDisabled = function (state) {
  for (var i = 0; i < fieldsetsMapFilters.length; i++) {
    fieldsetsMapFilters[i].disabled = state;
  }
};

// Добавляет атрибут disabled всем fieldset в форме adForm
var setFieldsetsAdFormDisabled = function (state) {
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
  MAP.classList.remove('map--faded');
  activeAdForm();
};

var renderPins = function () {
  if (!(mapPinMain.classList.contains('map--faded'))) {

    // Отрисовка пинов
    getSimilarPins();
    mapPinMain.removeEventListener('mouseup', activationPage);
  }
};

var cli = function () {
  // INDEX_CARD = evt.srcElement.src.slice(-5, -4);
  // showCardHousing(creatingCardHousing(generateAds()));

  // Рендерит карточку объявления
  // var btnClosePopup = document.querySelector('.popup__close');
  // var mapCard = document.querySelector('.map__card');
  // btnClosePopup.addEventListener('click', function () {
  //   MAP.removeChild(mapCard);
  // });
};

var onPinClick = function () {
  var mapPin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  for (var i = 0; i < mapPin.length; i++) {
    mapPin[i].addEventListener('click', cli);
  }
};

// var onButtonCloseCard = function () {

// }

var activationPage = function () {
  showMap();
  renderPins();
  onPinClick();
  setSelectsMapFiltersDisabled(false);
  setFieldsetsMapFiltersDisabled(false);
  setFieldsetsAdFormDisabled(false);
  fieldInputAddress.value = coordinateMapPinMain.x + ', ' + coordinateMapPinMain.y;
};

// Инициализация начального состояния
var init = function () {
  fieldInputAddress.value = coordinateMapPinMain.default;
  setSelectsMapFiltersDisabled(true);
  setFieldsetsMapFiltersDisabled(true);
  setFieldsetsAdFormDisabled(true);
};

init();

mapPinMain.addEventListener('mouseup', activationPage);
