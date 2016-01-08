(function ($, doc) {
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
    var $inputColor = $('[data-js="input-color"]');
    var $carTable = $('[data-js="car-table"]');

    return {
      init: function init () {
        this.initEvents();
        this.makeRequest('GET', '/company.json', this.handleAjax);
      },

      initEvents: function initEvents () {
        $('[data-js="submit-form"]').on('click', this.handleSubmit);

      },

      isRequestOk: function isRequestOk (request) {
        return request.readyState === 4 && request.status === 200;
      },
    
      makeRequest: function makeRequest (method, url, callback) {
        var ajax = new XMLHttpRequest();
        ajax.open(method, url);
        ajax.send();
        ajax.addEventListener('readystatechange', callback);
      },
    
      handleAjax: function handleAjax () {
      if( app().isRequestOk(this) ) {
        try{
            var data = JSON.parse(this.responseText);
            $('[data-js="interprise-name"]').get().textContent = data.name;
            $('[data-js="interprise-number"]').get().textContent = data.phone;
          }catch(e){
            console.log(e);
          }
        }
      },

      emptySubmits: function emptySubmits () {
        $inputImage.get().value = '';
        $inputBrand.get().value = '';
        $inputYear.get().value = '';
        $inputColor.get().value = '';
      },

      handleSubmit: function handleSubmit (event) {
        event.preventDefault();
        $carTable.get().insertAdjacentHTML('beforeend', '<tr>'+ 
          '<td>' + $inputImage.get().value + '</td>' +
          '<td>' + $inputBrand.get().value + '</td>' +
          '<td>' + $inputYear.get().value + '</td>' +
          '<td>' + $inputColor.get().value + '</td>' +
          '<td><button type="submit" data-js="remove-button">Remover</button></td>' +
          '</tr>');
        $('[data-js="remove-button"]').on('click', app().handleRemoveButton);
        app().emptySubmits();
      },

      handleRemoveButton: function handleRemoveButton (event) {
          event.preventDefault();
          $carTable.get().removeChild(this.parentNode.parentNode.parentNode);
      }
    }
  }

  app().init();

})(window.DOM, document);
