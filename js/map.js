'use strict';

// Находим случайно число в указанных диапазонах
var getRandomValue = function (min, max) {
  var randomInteger = Math.random() * (max + 1 - min) + min;
  randomInteger = Math.floor(randomInteger);
  return randomInteger;
};

// Находим случайную длину массива преимуществ
var getRandomFeatures = function (features) {
  var featureNumber = getRandomValue(1, features.length - 1);
  var randomFeatures = [];
  for (var j = 0; j < featureNumber; j++) {
    randomFeatures.push(features[j]);
  }
  return randomFeatures;
};

// Перемешиваем порядок элементов в массиве
var getSortArr = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

// Генерация массива объектов с описанием карточек жилья
var getAds = function (
    avatarNumbers,
    titles,
    typesHousing,
    timesCheck,
    features,
    photosHotel
) {
  var ads = [];
  var LEFT_SIDE_VIEWPORT = 20; // Минимальное положение пина от левого края вьюпорта с учетом ширины пина
  var RIGHT_SIDE_VIEWPORT = 1180; // Минимальное положение пина от правого края вьюпорта с учетом ширины пина
  var TOP_SIDE_VIEWPORT = 130; // Минимальное положение пина от верхнего края вьюпорта с учетом высоты пина
  var BOTTOM_SIDE_VIEWPORT = 630; // Минимальное положение пина от нижнего края вьюпорта с учетом высоты пина
  var LOCATION_HOUSING_X = getRandomValue(
      LEFT_SIDE_VIEWPORT,
      RIGHT_SIDE_VIEWPORT
  );
  var LOCATION_HOUSING_Y = getRandomValue(
      TOP_SIDE_VIEWPORT,
      BOTTOM_SIDE_VIEWPORT
  );
  for (var i = 0; i < 8; i++) {
    var adTemplate = {
      'author': {
        'avatar': 'img/avatars/user0' + avatarNumbers[i] + '.png'
      },
      'offer': {
        'title': titles[i],
        'address': LOCATION_HOUSING_X + ' - ' + LOCATION_HOUSING_Y,
        'price': getRandomValue(1000, 1000000),
        'type': typesHousing[getRandomValue(0, 3)],
        'rooms': getRandomValue(1, 5),
        'guests': getRandomValue(1, 10),
        'checkin': timesCheck[getRandomValue(0, 2)],
        'checkout': timesCheck[getRandomValue(0, 2)],
        'features': getRandomFeatures(features),
        'description': '',
        'photos': getSortArr(photosHotel)
      },
      'location': {
        'x': LOCATION_HOUSING_X,
        'y': LOCATION_HOUSING_Y
      }
    };
    ads.push(adTemplate);
  }
  return ads;
};

// Записываем в переменную массив с объектами из функции getAds
var adsData = getAds(
    [1, 2, 3, 4, 5, 6, 7, 8], // avatarNumber
    [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ], // titles
    ['palace', 'flat', 'house', 'bungalo'], // typesHousing
    ['12:00', '13:00', '14:00'], // timesCheck
    ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'], // features
    [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ] // photosHotel
);

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Генерация меток
var getSimilarPins = function () {
  var fragment = document.createDocumentFragment();
  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < adsData.length; i++) {
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

getSimilarPins(); // Отрисовка пинов на карте

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
