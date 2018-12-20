'use strict';

(function () {
  var cardTemplate = document.querySelector('#card');
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

  // Генерирует фотографии жилья
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

  window.card = {
    creatingCardHousing: creatingCardHousing
  };
})();
