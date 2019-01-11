'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mapPinCurrent;

  // Получает перевод английского названия типа жилья
  var getRussianTypeHousing = function (type) {
    var TypesHousing = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };
    return TypesHousing[type];
  };

  // Генерирует список преимуществ жилья
  var generatesFeaturesList = function (ad) {
    var featuresList = [];
    ad.offer.features.forEach(function (element) {
      featuresList.push('<li class="popup__feature popup__feature--' + element + '"></li>');
    });
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
  var generatesPhotoList = function (ad) {
    var photoList = [];
    ad.offer.photos.forEach(function (element) {
      photoList.push('<img src="' + element + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');
    });
    return photoList;
  };

  // Вставляет сгенерированный массив фотографий жилья в разметку
  var includePhotoList = function (photoListArray, popupPhotos) {
    for (var i = photoListArray.length - 1; i >= 0; i--) {
      popupPhotos.insertAdjacentHTML('afterbegin', photoListArray[i]);
    }
    return popupPhotos;
  };

  // Скрывает айтемы карточки, если в них не хватает информации
  var getFilteredElement = function (element) {
    var descriptionsElement = ['avatar', 'title', 'address', 'price', 'type', 'features', 'description', 'photos'];
    descriptionsElement.forEach(function (currentElement) {
      var item = element.querySelector('[class*=' + currentElement + ']');
      if (item.children.length === 0 && item.innerText === false) {
        item.hidden = true;
      }
    });
  };

  // Создает карточку с информацией о жилье
  var createsCardHousing = function (ad) {
    var cardTemplate = document.querySelector('#card');
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
    includeFeaturesList(generatesFeaturesList(ad), popupFeatures);
    cardElement.querySelector('.popup__description').textContent =
      ad.offer.description;
    var popupPhotos = cardElement.querySelector('.popup__photos');
    popupPhotos.innerHTML = ' ';
    includePhotoList(generatesPhotoList(ad), popupPhotos);
    getFilteredElement(cardElement);
    return cardElement;
  };

  // Описание функционала карты с метками

  // Вставляет карточку объявления перед элементом фильтрации объявлений
  var showsCardHousing = function (card) {
    var adsFilter = document.querySelector('.map__filters-container');
    map.insertBefore(card, adsFilter);
  };

  // Отрисовывает карточку объявления
  var rendersCard = function (ad) {
    mapPinCurrent = document.querySelector('.map__pin--active');
    showsCardHousing(createsCardHousing(ad));
  };

  // Скрывает объявление со страницы удаляя его из DOM
  var removesCard = function () {
    var previousCard = map.querySelector('.map__card');
    if (mapPinCurrent) {
      mapPinCurrent.classList.remove('map__pin--active');
    }
    if (previousCard) {
      map.removeChild(previousCard);
    }
    document.removeEventListener('keydown', onDocumentKeydownEsc);
  };

  // Скрывает объявление по клику на кнопку-крестик
  var onButtonCloseClick = function () {
    removesCard();
  };

  // Скрывает объявление по нажатию на кнопку-крестик
  var onDocumentKeydownEsc = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removesCard();
    }
  };

  var closesCard = function () {
    document.addEventListener('keydown', onDocumentKeydownEsc);
    var buttonClosePopup = map.querySelector('.popup__close');
    buttonClosePopup.addEventListener('click', onButtonCloseClick);
  };

  var addsUseCard = function (ad) {
    removesCard();
    rendersCard(ad);
    closesCard();
  };

  window.card = {
    addsUseCard: addsUseCard,
    removesCard: removesCard
  };
})();
