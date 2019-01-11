'use strict';
(function () {
  var TIMEOUT = 10000;

  var UrlRequest = {
    SAVE: 'https://js.dump.academy/keksobooking',
    LOAD: 'https://js.dump.academy/keksobooking/data'
  };

  var StatusCodes = {
    SUCCESS: 200,
    ERROR: 400
  };

  var saveData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCodes.SUCCESS) {
        onLoad('success');
      } else if (xhr.status >= StatusCodes.ERROR) {
        onError('error');
      }
    });

    xhr.addEventListener('error', function () {
      onError('error');
    });

    xhr.addEventListener('timeout', function () {
      onError('error');
    });

    xhr.open('POST', UrlRequest.SAVE);
    xhr.send(data);
  };

  var loadData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCodes.SUCCESS) {
        onLoad(xhr.response);
      } else if (xhr.status >= StatusCodes.ERROR) {
        onError(xhr.status);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError('timeout');
    });

    xhr.open('GET', UrlRequest.LOAD);
    xhr.send();
  };

  window.backend = {
    save: saveData,
    load: loadData
  };
})();
