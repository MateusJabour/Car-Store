(function ($, doc, carsJSON) {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  function app () {
    var $inputImage = $('[data-js="input-image"]');
    var $inputBrand = $('[data-js="input-brand"]');
    var $inputYear = $('[data-js="input-year"]');
    var $inputPlate = $('[data-js="input-plate"]');
    var $inputColor = $('[data-js="input-color"]');
    var $carTable = $('[data-js="car-table"]');
    var $form = $('form');

    return {
      init: function init () {
        this.initEvents();
        this.getNameAndPhone(carsJSON);
        this.makeRequest.get('http://localhost:3000/car', this.showCar.all);
      },

      initEvents: function initEvents () {
        $('[data-js="submit-form"]').on('click', this.handleSubmit);
      },

      isRequestOk: function isRequestOk (request) {
        return request.readyState === 4 && request.status === 200;
      },

      emptySubmits: function emptySubmits () {
          var inputs = $form.get().children;
          Array.prototype.forEach.call(inputs, function (item) {
            if(item.tagName === 'LABEL') {
              item.firstElementChild.value = '';
            }
          });
      },

      makeRequest: {
        get: function (url, callback) {
          var ajax = new XMLHttpRequest();
          ajax.open('GET', url);
          ajax.send();
          ajax.addEventListener('readystatechange', callback);
        },

        post: function (url, data, callback) {
          var ajax = new XMLHttpRequest();
          ajax.open('POST', url);
          ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          ajax.send(data);
          ajax.addEventListener('readystatechange', callback);
        },

        delete:  function (url, data, callback) {
          var ajax = new XMLHttpRequest();
          ajax.open('DELETE', url);
          ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          ajax.send(data);
          ajax.addEventListener('readystatechange', callback);
        }
      },

      getNameAndPhone: function getNameAndPhone (JSON) {
        $('[data-js="interprise-name"]').get().textContent = JSON.name;
        $('[data-js="interprise-number"]').get().textContent = JSON.phone;
      },

      putCarOnTable: function putCarOnTable (car) {
        var timestamp = Math.floor(Date.now());
        $carTable.get().insertAdjacentHTML('beforeend',
          '<tr id="information-row' + timestamp + '" data-js="information-row">'+
           '<td class="car-image">' + car.image + '</td>' +
           '<td class="car-brandModel">' + car.brandModel + '</td>' +
           '<td class="car-year">' + car.year + '</td>' +
           '<td class="car-plate">' + car.plate + '</td>' +
           '<td class="car-color">' + car.color + '</td>' +
           '<td><button data-tr-id="information-row' + timestamp + '" type="submit" data-js="remove-button-' + car.plate +'">Remover</button></td>' +
         '</tr>');
      },

      showCar: {
        one: function () {
          if( app().isRequestOk(this) ) {
            try {
              var data = JSON.parse(this.responseText);
              var lastCar = data[data.length - 1];
              app().putCarOnTable(lastCar);
              $('[data-js="remove-button-' + lastCar.plate + '"]').on('click', app().handleRemoveButton);
            } catch(error) {
              console.log(error);
            }
          }
        },

        all: function () {
          if( app().isRequestOk(this) ) {
            try {
              var data = JSON.parse(this.responseText);
              data.forEach(function (element) {
                app().putCarOnTable(element);
                $('[data-js="remove-button-' + element.plate + '"]').on('click', app().handleRemoveButton);
              });
            } catch(error) {
              console.log(error);
            }
          }
        }
      },

      handlePost: function handlePost () {
        if( app().isRequestOk(this) ) {
          try {
            console.log('Carro adicionado!')
          } catch(error) {
            console.log(error);
          }
        }
      },

      handleSubmit: function handleSubmit (event) {
        event.preventDefault();
        app().makeRequest.post('http://localhost:3000/car',
                                'image=' + $inputImage.get().value +
                                '&brandModel=' + $inputBrand.get().value +
                                '&year=' + $inputYear.get().value +
                                '&color=' + $inputColor.get().value +
                                '&plate=' + $inputPlate.get().value ,
                                app().handlePost);
        app().makeRequest.get('http://localhost:3000/car', app().showCar.one);
        app().emptySubmits();
      },

      handleRemoveButton: function handleRemoveButton (event) {
        event.preventDefault();
        var currentTr = document.getElementById(this.getAttribute('data-tr-id'));
        var carPlate = currentTr.children[3].innerHTML;
        app().makeRequest.delete('http://localhost:3000/car', 'plate=' + carPlate, app().handleDelete(currentTr.parentNode));
      },

      handleDelete: function handleDelete (deletedNode) {
        return function () {
          if (app().isRequestOk(this)) {
            try {
              $carTable.get().removeChild(deletedNode);
            } catch (error) {
              console.log(error);
            }
          }
        };
      }

    }
  }

  app().init();

})(window.DOM, document, carsJSON);
