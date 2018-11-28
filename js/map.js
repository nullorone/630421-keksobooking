'use strict';

var LEFT_SIDE_VIEWPORT = 20; // Минимальное положение пина от левого края вьюпорта с учетом ширины пина
var RIGHT_SIDE_VIEWPORT = 1180; // Минимальное положение пина от правого края вьюпорта с учетом ширины пина
var TOP_SIDE_VIEWPORT = 130; // Минимальное положение пина от верхнего края вьюпорта с учетом высоты пина
var BOTTOM_SIDE_VIEWPORT = 630; // Минимальное положение пина от нижнего края вьюпорта с учетом высоты пина
var MAX_ADS = 8; // Максимальное количество объявлений для генерации массива объектов
var MIN_PRICE_HOUSING = 1000;
var MAX_PRICE_HOUSING = 1000000;
var MIN_ROOMS_HOUSING = 1;
var MAX_ROOMS_HOUSING = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;

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

// Находим случайно число в указанных диапазонах
var getRandomInt = function (min, max) {
  var randomInteger = Math.random() * (max - min) + min;
  randomInteger = Math.floor(randomInteger);
  return randomInteger;
};

// Находим случайную длину массива преимуществ
var getRandomFeatures = function (features) {
  var featureNumber = getRandomInt(1, features.length);
  var randomFeatures = [];
  for (var j = 0; j < featureNumber; j++) {
    randomFeatures.push(features[j]);
  }
  return randomFeatures;
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
      address: getLocationHousingX(LEFT_SIDE_VIEWPORT, RIGHT_SIDE_VIEWPORT) + ' - ' + getLocationHousingY(TOP_SIDE_VIEWPORT, BOTTOM_SIDE_VIEWPORT),
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

// Записываем в переменную массив с объектами из функции generateAds
var adsData = generateAds(generateAd());

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Генерация меток
var getSimilarPins = function (ads) {
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < ads.length; i++) {
    var pinTemplate = document.querySelector('#pin').content.cloneNode(true);
    pinTemplate.querySelector('.map__pin').style.left =
      adsData[i].location.x + 'px';
    pinTemplate.querySelector('.map__pin').style.top =
      adsData[i].location.y + 'px';
    pinTemplate.querySelector('img').src = adsData[i].author.avatar;
    pinTemplate.querySelector('img').alt = adsData[i].offer.title;
    fragment.appendChild(pinTemplate);
  }
  return mapPins.appendChild(fragment);
};

getSimilarPins(generateAds()); // Отрисовка пинов на карте

var getCardHousing = function (indexCard) {
  var fragment = document.createDocumentFragment();
  var compareTypesHousing = function (type) {
    var typesHousingOnEnglish = ['flat', 'bungalo', 'house', 'palace'];
    var typesHousingOnRussian = ['Квартира', 'Бунгало', 'Дом', 'Дворец'];
    for (var i = 0; i < typesHousingOnEnglish.length; i++) {
      if (type === typesHousingOnEnglish[i]) {
        var compare = typesHousingOnRussian[i];
      }
    }
    return compare;
  };
  var cardHousingTemplate = document
    .querySelector('#card')
    .content.cloneNode(true);
  cardHousingTemplate.querySelector('.popup__avatar').src =
    adsData[indexCard].author.avatar;
  cardHousingTemplate.querySelector('.popup__title').textContent =
    adsData[indexCard].offer.title;
  cardHousingTemplate.querySelector('.popup__text--address').textContent =
    adsData[indexCard].offer.address +
    ' Tōkyō-to, Chiyoda-ku, Ichibanchō, 14−3';
  cardHousingTemplate.querySelector('.popup__text--price').innerHTML =
    '&#x20bd;<span>/ночь</span>';
  cardHousingTemplate
    .querySelector('.popup__text--price')
    .insertAdjacentText('afterbegin', adsData[indexCard].offer.price);
  cardHousingTemplate.querySelector(
      '.popup__type'
  ).textContent = compareTypesHousing(adsData[indexCard].offer.type);
  cardHousingTemplate.querySelector('.popup__text--capacity').textContent =
    adsData[indexCard].offer.rooms +
    ' комнаты для ' +
    adsData[indexCard].offer.guests +
    ' гостей';
  cardHousingTemplate.querySelector('.popup__text--time').textContent =
    'Заезд после ' +
    adsData[indexCard].offer.checkin +
    ', выезд до ' +
    adsData[indexCard].offer.checkout;
  var popupFeatures = cardHousingTemplate.querySelector('.popup__features');
  popupFeatures.innerHTML = ' ';
  for (var j = adsData[indexCard].offer.features.length - 1; j >= 0; j--) {
    popupFeatures.insertAdjacentHTML(
        'afterbegin',
        '<li class="popup__feature popup__feature--' +
        adsData[indexCard].offer.features[j] +
        '"></li>'
    );
  }
  cardHousingTemplate.querySelector('.popup__description').textContent =
    adsData[indexCard].offer.description;
  var popupPhotos = cardHousingTemplate.querySelector('.popup__photos');
  popupPhotos.innerHTML = ' ';
  for (var k = adsData[indexCard].offer.photos.length - 1; k >= 0; k--) {
    popupPhotos.insertAdjacentHTML(
        'afterbegin',
        '<img src="' +
        adsData[indexCard].offer.photos[k] +
        '" class="popup__photo" width="45" height="40" alt="Фотография жилья">'
    );
  }
  fragment.appendChild(cardHousingTemplate);
  return map.insertBefore(
      fragment,
      document.querySelector('.map__filters-container')
  );
};

getCardHousing(0); // Вывод карточки с определенным индексом
