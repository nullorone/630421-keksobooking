'use strict';
(function () {
  var inputAvatar = document.querySelector('.ad-form__field input[type=file]');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');
  var inputPhotoHousing = document.querySelector('.ad-form__upload input[type=file]');
  var photoHousingPreview = document.querySelector('.ad-form__photo');

  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'svg', 'bmp', 'gif'];

  var getCompareFileType = function (input) {
    var file = input.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });

    var compareFile = {
      file: file,
      matches: matches
    };

    return compareFile;
  };

  var onInputAvatarChange = function () {
    var compareFile = getCompareFileType(inputAvatar);

    if (compareFile.matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        previewAvatar.src = reader.result;
      });

      reader.readAsDataURL(compareFile.file);
    }
  };

  var includePhotoHousing = function (photo) {
    var image = document.createElement('img');
    image.src = photo;
    image.alt = 'Фотография жилья';
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.marginRight = '5px';

    photoHousingPreview.style.display = 'flex';

    photoHousingPreview.appendChild(image);
  };

  var onInputPhotoHousingChange = function () {
    var compareFile = getCompareFileType(inputPhotoHousing);

    if (compareFile.matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        includePhotoHousing(reader.result);
      });

      reader.readAsDataURL(compareFile.file);
    }
  };

  var addUploadFilesHandler = function () {
    inputAvatar.addEventListener('change', onInputAvatarChange);
    inputPhotoHousing.addEventListener('change', onInputPhotoHousingChange);
  };


  var removeUploadFilesHandler = function () {
    inputAvatar.removeEventListener('change', onInputAvatarChange);
    inputPhotoHousing.removeEventListener('change', onInputPhotoHousingChange);
  };

  var removeUploadFiles = function () {
    var defaultAvatarImage = 'img/muffin-grey.svg';
    if (previewAvatar.src !== defaultAvatarImage) {
      previewAvatar.src = defaultAvatarImage;
    }
    while (photoHousingPreview.firstElementChild) {
      photoHousingPreview.firstElementChild.remove();
    }
    photoHousingPreview.style.display = 'block';
  };

  window.previewFiles = {
    addUploadFilesHandler: addUploadFilesHandler,
    removeUploadFilesHandler: removeUploadFilesHandler,
    removeUploadFiles: removeUploadFiles
  };

})();
