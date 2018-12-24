'use strict';

(function () {
  var LEFT_SIDE_VIEWPORT = 25; // Минимальное положение пина от левого края вьюпорта с учетом ширины пина
  var RIGHT_SIDE_VIEWPORT = 1175; // Минимальное положение пина от правого края вьюпорта с учетом ширины пина
  var TOP_SIDE_VIEWPORT = 130; // Минимальное положение пина от верхнего края вьюпорта с учетом высоты пина
  var BOTTOM_SIDE_VIEWPORT = 630; // Минимальное положение пина от нижнего края вьюпорта с учетом высоты пина
  var MAX_ADS = 8; // Максимальное количество объявлений для генерации массива объектов
  var MIN_PRICE_HOUSING = 1000;
  var MIN_ROOMS_HOUSING = 1;
  var MAX_ROOMS_HOUSING = 5;
  var MIN_GUESTS = 1;
  var MAX_GUESTS = 10;
  var MAX_PRICE_HOUSING = 1000000;

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

  window.data = {
    generateAds: generateAds
  };
})();
