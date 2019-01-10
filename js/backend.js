'use strict';
(function () {
  var TIMEOUT = 10000;
  var URL_SAVE = 'https://js.dump.academy/keksobooking';
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';

  var StatusCodes = {
    success: 200,
    error: 400
  };

  var savesData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCodes.success) {


        onLoad('success');
      } else if (xhr.status >= StatusCodes.error) {
        onError('error');
      }
    });

    xhr.addEventListener('error', function () {
      onError('error');
    });

    xhr.addEventListener('timeout', function () {
      onError('error');
    });

    xhr.open('POST', URL_SAVE);
    xhr.send(data);
  };

  var loadingData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCodes.success) {
        onLoad(xhr.response);
      } else if (xhr.status >= StatusCodes.error) {
        onError(xhr.status);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError('timeout');
    });

    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  window.backend = {
    save: savesData,
    load: loadingData
  };
})();
