'use strict';

(function () {
  var ESC_KEYCODE = 27;
  // Генерация сообщения об успешной или ошибочной отправки данных формы объявления

  var mainNodeElement = document.querySelector('main');

  var messageTemplate = {
    'success': document.querySelector('#success'),
    'error': document.querySelector('#error')
  };

  var generateMessageNode = function (status) {
    var messageElement = messageTemplate[status].content.cloneNode(true);
    mainNodeElement.appendChild(messageElement);

    var removeMessageNode = function () {
      if (mainNodeElement.lastElementChild.className === 'success') {
        mainNodeElement.removeChild(mainNodeElement.lastElementChild);
        window.map.setDefaultStatePage();
      } else if (mainNodeElement.lastElementChild.className === 'error') {
        mainNodeElement.removeChild(mainNodeElement.lastElementChild);
      }
      mainNodeElement.removeEventListener('click', onMainNodeElementClick);
      mainNodeElement.removeEventListener('keydown', onMessageNodeKeydownEsc);
    };

    var onMainNodeElementClick = function () {
      removeMessageNode();
    };

    var onMessageNodeKeydownEsc = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        removeMessageNode();
      }
    };

    mainNodeElement.addEventListener('click', onMainNodeElementClick);
    mainNodeElement.addEventListener('keydown', onMessageNodeKeydownEsc);
  };

  window.messages = {
    generateMessageNode: generateMessageNode
  };
})();

