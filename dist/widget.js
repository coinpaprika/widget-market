(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function(){
  var widgetsStates = [];
  var widgetDefaults = {
    objectName: 'cpMarketWidgets',
    className: 'coinpaprika-market-widget',
    cssFileName: 'widget.min.css',
    currency_list: ['btc-bitcoin', 'eth-ethereum', 'xrp-xrp', 'bch-bitcoin-cash'],
    primary_currency_list: [ 'USD', 'BTC', 'ETH' ],
    primary_currency: 'USD',
    data_type_list: [ 'Price', 'Volume' ],
    data_type: 'price',
    version: 'standard',
    update_active: false,
    update_timeout: '30s',
    language: 'en',
    style_src: null,
    img_src: null,
    lang_src: null,
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market',
    show_details_currency: true,
    emptyData: '-',
    emptyValue: 0,
    ticker: {
      name: undefined,
      symbol: undefined,
      price: undefined,
      price_change_24h: undefined,
      rank: undefined,
      price_ath: undefined,
      volume_24h: undefined,
      market_cap: undefined,
      percent_from_price_ath: undefined,
      volume_24h_change_24h: undefined,
      market_cap_change_24h: undefined,
    },
    interval: null,
    isWordpress: false,
    isData: false,
    message: 'data_loading',
    translations: {},
    mainElement: null,
    noTranslationLabels: [],
  };
  var widgetFunctions = {
    init: function(index){
      if (!widgetFunctions.getMainElement(index)) {
        return console.error('Bind failed, no element with class = "'+ widgetDefaults.className +'"');
      }
      widgetFunctions.getDefaults(index);
      widgetFunctions.setOriginLink(index);
    },
    setWidgetClass: function(elements){
      for (var i = 0; i < elements.length; i++) {
        var width = elements[i].getBoundingClientRect().width;
        var smallClassName = widgetDefaults.className + '__small';
        var mediumClassName = widgetDefaults.className + '__medium';
        var hasSmallClass = elements[i].classList.contains(smallClassName);
        var hasMediumClass = elements[i].classList.contains(mediumClassName);
        if (width <= 320 && !hasSmallClass) elements[i].classList.add(smallClassName);
        if (width > 320 && hasSmallClass) elements[i].classList.remove(smallClassName);
        if (width <= 370 && !hasMediumClass) elements[i].classList.add(mediumClassName);
        if (width > 370 && hasMediumClass) elements[i].classList.remove(mediumClassName);
      }
    },
    getMainElement: function(index){
      return widgetsStates[index].mainElement;
    },
    getDefaults: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement.dataset){
        if (mainElement.dataset.version) widgetFunctions.updateData(index, 'version', mainElement.dataset.version);
        if (mainElement.dataset.primaryCurrencyList) widgetFunctions.updateData(index, 'primary_currency_list', JSON.parse(mainElement.dataset.primaryCurrencyList));
        if (mainElement.dataset.primaryCurrency) widgetFunctions.updateData(index, 'primary_currency', mainElement.dataset.primaryCurrency);
        if (mainElement.dataset.dataTypeList) widgetFunctions.updateData(index, 'data_type_list', JSON.parse(mainElement.dataset.dataTypeList));
        if (mainElement.dataset.dataType) widgetFunctions.updateData(index, 'data_type', mainElement.dataset.dataType);
        if (mainElement.dataset.currencyList) widgetFunctions.updateData(index, 'currency_list', JSON.parse(mainElement.dataset.currencyList));
        if (mainElement.dataset.currency) widgetFunctions.updateData(index, 'currency', mainElement.dataset.currency);
        if (mainElement.dataset.showDetailsCurrency) widgetFunctions.updateData(index, 'show_details_currency', (mainElement.dataset.showDetailsCurrency === 'true'));
        if (mainElement.dataset.updateActive) widgetFunctions.updateData(index, 'update_active', (mainElement.dataset.updateActive === 'true'));
        if (mainElement.dataset.updateTimeout) widgetFunctions.updateData(index, 'update_timeout', widgetFunctions.parseIntervalValue(mainElement.dataset.updateTimeout));
        if (mainElement.dataset.language) widgetFunctions.updateData(index, 'language', mainElement.dataset.language);
        if (mainElement.dataset.originSrc) widgetFunctions.updateData(index, 'origin_src', mainElement.dataset.originSrc);
        if (mainElement.dataset.nodeModulesSrc) widgetFunctions.updateData(index, 'node_modules_src', mainElement.dataset.nodeModulesSrc);
        if (mainElement.dataset.bowerSrc) widgetFunctions.updateData(index, 'bower_src', mainElement.dataset.bowerSrc);
        if (mainElement.dataset.styleSrc) widgetFunctions.updateData(index, 'style_src', mainElement.dataset.styleSrc);
        if (mainElement.dataset.langSrc) widgetFunctions.updateData(index, 'lang_src', mainElement.dataset.langSrc);
        if (mainElement.dataset.imgSrc) widgetFunctions.updateData(index, 'logo_src', mainElement.dataset.imgSrc);
      }
    },
    setOriginLink: function(index){
      if (Object.keys(widgetDefaults.translations).length === 0) widgetFunctions.getTranslations(widgetDefaults.language);
      widgetFunctions.stylesheet();
      setTimeout(function(){
        widgetFunctions.addWidgetElement(index);
        widgetFunctions.initInterval(index);
      }, 100);
    },
    addWidgetElement: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      var widgetElement = widgetFunctions.widgetMainElement(index) + widgetFunctions.widgetFooter(index);
      mainElement.innerHTML = widgetElement;
      widgetFunctions.setSelectListeners(index);
      widgetFunctions.setBeforeElementInFooter(index);
      widgetFunctions.getData(index);
    },
    setSelectListeners: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      var selectElements = mainElement.querySelectorAll('.cp-widget-select');
      for (var i = 0; i < selectElements.length; i++){
        var buttons = selectElements[i].querySelectorAll('.cp-widget-select__options button');
        for (var j = 0; j < buttons.length; j++){
          buttons[j].addEventListener('click', function(event){
            widgetFunctions.setSelectOption(event, index);
          }, false);
        }
      }
    },
    setSelectOption: function(event, index){
      var className = 'cp-widget-active';
      for (var i = 0; i < event.target.parentNode.childNodes.length; i++){
        var sibling = event.target.parentNode.childNodes[i];
        if (sibling.classList.contains(className)) sibling.classList.remove(className);
      }
      var mainElement = widgetFunctions.getMainElement(index);
      var tableHeadCell = mainElement.querySelector('.cp-widget-table__head .cp-widget-table__cell--data-value');
      var parent = event.target.closest('.cp-widget-select');
      var type = parent.dataset.type;
      var pickedValueElement = parent.querySelector('.cp-widget-select__options > span');
      var value = event.target.dataset.option;
      tableHeadCell.innerText = (type !== 'primary_currency')
        ? event.target.innerText
        : tableHeadCell.innerText;
      pickedValueElement.innerText = ((type !== 'primary_currency')
        ? widgetFunctions.getTranslation(index, value.toLowerCase())
        : value);
      widgetFunctions.updateData(index, type, value);
      event.target.classList.add(className);
    },
    initInterval: function(index){
      clearInterval(widgetsStates[index].interval);
      if (widgetsStates[index].update_active && widgetsStates[index].update_timeout > 1000){
        widgetsStates[index].interval = setInterval(function(){
          widgetFunctions.getData(index);
        }, widgetsStates[index].update_timeout);
      }
    },
    getData: function(index){
      var xhr = new XMLHttpRequest();
      var currency_list = JSON.stringify(widgetsStates[index].currency_list).replace('[', '').replace(']', '').split('"').join('');
      xhr.open('GET', 'https://api.coinpaprika.com/v1/widget_list/'+currency_list);
      xhr.onload = function() {
        if (this.status === 200) {
          if (!widgetsStates[index].isData) widgetFunctions.updateData(index, 'isData', true);
          for (var i = 0; i < widgetsStates[index].currency_list.length; i++){
            var data = JSON.parse(this.responseText);
            if (data[widgetsStates[index].currency_list[i]]) widgetFunctions.updateTicker(index, data[widgetsStates[index].currency_list[i]]);
          }
        } else {
          widgetFunctions.onErrorRequest(index, this);
        }
      };
      xhr.onerror = function(){
        widgetFunctions.onErrorRequest(index, this);
      };
      xhr.send();
    },
    onErrorRequest: function(index, xhr){
      if (widgetsStates[index].isData) widgetFunctions.updateData(index, 'isData', false);
      widgetFunctions.updateData(index, 'message', 'data_unavailable');
      console.error('Request failed.  Returned status of ' + xhr, widgetsStates[index]);
    },
    setBeforeElementInFooter: function(index){
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement.children[0].localName === 'style'){
        mainElement.removeChild(mainElement.childNodes[0]);
      }
      var footerElement = mainElement.querySelector('.cp-widget__footer');
      if (footerElement){
        var value = footerElement.getBoundingClientRect().width - 43;
        for (var i = 0; i < footerElement.childNodes.length; i++){
          value -= footerElement.childNodes[i].getBoundingClientRect().width;
        }
        var style = document.createElement('style');
        style.innerHTML = '.cp-widget__footer--'+index+'::before{width:'+value.toFixed(0)+'px;}';
        mainElement.insertBefore(style, mainElement.children[0]);
      }
    },
    updateWidgetElement: function(index, key, value, currency){
      var state = widgetsStates[index];
      var mainElement = widgetFunctions.getMainElement(index);
      if (mainElement){
        var tickerClass = (currency) ? 'Ticker'+currency.toUpperCase() : '';
        if (key === 'name' || key === 'currency'){
          if (key === 'currency'){
            var aElements = mainElement.querySelectorAll('.cp-widget-footer > a');
            for(var k = 0; k < aElements.length; k++) {
              aElements[k].href = widgetFunctions.coin_link(value, index);
            }
          }
          widgetFunctions.getImage(index, currency);
        }
        if (key === 'isData' || key === 'message' || key === 'data_type' || key === 'primary_currency'){
          var headerElements = mainElement.querySelectorAll('.cp-widget-table__body');
          for(var l = 0; l < headerElements.length; l++) {
            headerElements[l].innerHTML = (!state.isData) ? widgetFunctions.widgetTableElementMessage(index) : widgetFunctions.widgetTableElementData(index);
          }
        } else {
          var updateElements = mainElement.querySelectorAll('.'+key+tickerClass);
          for (var j = 0; j < updateElements.length; j++){
            var updateElement = updateElements[j];
            if (updateElement.classList.contains('parseNumber')){
              value = widgetFunctions.parseNumber(value, true) || state.emptyData;
            }
            if (updateElement.classList.contains('cp-widget__rank')){
              var className = (parseFloat(value) > 0) ? "cp-widget__rank-up" : ((parseFloat(value) < 0) ? "cp-widget__rank-down" : "cp-widget__rank-neutral");
              updateElement.classList.remove('cp-widget__rank-down');
              updateElement.classList.remove('cp-widget__rank-up');
              updateElement.classList.remove('cp-widget__rank-neutral');
              if (value === undefined){
                value = state.emptyData;
              } else {
                updateElement.classList.add(className);
                value = (!value && value !== 0) ? state.emptyData : widgetFunctions.roundAmount(value, 2)+'%';
              }
            }
            if (updateElement.classList.contains('cp-widget-table__cell--data-value') && state.show_details_currency){
              value += ' ' + state.primary_currency.toUpperCase();
            }
            if (updateElement.classList.contains('showDetailsCurrency') && !state.show_details_currency) {
              value = ' ';
            }
            updateElement.innerText = value || state.emptyData;
          }
        }
      }
    },
    updateTicker: function(index, data){
      var quoteKeys = Object.keys(data.quote);
      var template = JSON.parse(JSON.stringify(data));
      delete template.quote;
      for(var j = 0; j < quoteKeys.length; j++){
        var quoteData = JSON.parse(JSON.stringify(data.quote[quoteKeys[j]]));
        quoteData = Object.assign(quoteData, JSON.parse(JSON.stringify(template)));
        quoteData.id = data.id + '-' + quoteKeys[j];
        quoteData.currency_id = data.id;
        quoteData.quote_id = quoteKeys[j];
        widgetsStates[index].ticker[quoteData.id] = quoteData;
        var dataKeys = Object.keys(quoteData);
        for (var i = 0; i < dataKeys.length; i++){
          if (quoteData.quote_id === widgetsStates[index].primary_currency.toLowerCase())widgetFunctions.updateWidgetElement(index, dataKeys[i], quoteData[dataKeys[i]], quoteData.currency_id);
        }
      }
    },
    updateData: function(index, key, value, currency){
      if (currency){
        if (!widgetsStates[index].ticker[currency]) widgetsStates[index].ticker[currency] = {};
        widgetsStates[index].ticker[currency][key] = value;
      } else {
        widgetsStates[index][key] = value;
      }
      if (key === 'language'){
        widgetFunctions.getTranslations(value);
      }
      var currency_id = (widgetsStates[index].ticker[currency]) ? widgetsStates[index].ticker[currency].currency_id : undefined;
      if ((currency_id && widgetsStates[index].ticker[currency].quote_id === widgetsStates[index].primary_currency.toLowerCase()) || !currency) widgetFunctions.updateWidgetElement(index, key, value, currency_id);
    },
    updateWidgetTranslations: function(lang, data){
      widgetDefaults.translations[lang] = data;
      for (var x = 0; x < widgetsStates.length; x++){
        var isNoTranslationLabelsUpdate = widgetsStates[x].noTranslationLabels.length > 0 && lang === 'en';
        if (widgetsStates[x].language === lang || isNoTranslationLabelsUpdate){
          var mainElement = widgetsStates[x].mainElement;
          var transalteElements = Array.prototype.slice.call(mainElement.querySelectorAll('.cp-translation'));
          for (var y = 0; y < transalteElements.length; y++){
            transalteElements[y].classList.forEach(function(className){
              if (className.search('translation_') > -1){
                var translateKey = className.replace('translation_', '');
                if (translateKey === 'message') translateKey = widgetsStates[x].message;
                var labelIndex = widgetsStates[x].noTranslationLabels.indexOf(translateKey);
                var text = widgetFunctions.getTranslation(x, translateKey);
                if (labelIndex > -1 && text){
                  widgetsStates[x].noTranslationLabels.splice(labelIndex, 1)
                }
                transalteElements[y].innerText = text;
                if (transalteElements[y].closest('.cp-widget__footer')){
                  setTimeout(widgetFunctions.setBeforeElementInFooter.bind(null, x), 50);
                }
              }
            })
          }
        }
      }
    },
    parseIntervalValue: function(value){
      var timeSymbol = '', multiplier = 1;
      if (value.search('s') > -1){
        timeSymbol = 's';
        multiplier = 1000;
      }
      if (value.search('m') > -1){
        timeSymbol = 'm';
        multiplier = 60 * 1000;
      }
      if (value.search('h') > -1){
        timeSymbol = 'h';
        multiplier = 60 * 60 * 1000;
      }
      if (value.search('d') > -1){
        timeSymbol = 'd';
        multiplier = 24 * 60 * 60 * 1000;
      }
      return parseFloat(value.replace(timeSymbol,'')) * multiplier;
    },
    parseNumber: function(number, longResult){
      if (!number && number !== 0) return number;
      if (number === widgetsStates[0].emptyValue || number === widgetsStates[0].emptyData) return number;
      number = parseFloat(number);
      if (number > 100000 && !longResult){
        var numberStr = number.toFixed(0);
        var parameter = 'K',
          spliced = numberStr.slice(0, numberStr.length - 1);
        if (number > 1000000000){
          spliced = numberStr.slice(0, numberStr.length - 7);
          parameter = 'B';
        } else if (number > 1000000){
          spliced = numberStr.slice(0, numberStr.length - 4);
          parameter = 'M';
        }
        var natural = spliced.slice(0, spliced.length - 2);
        var decimal = spliced.slice(spliced.length - 2);
        return natural + '.' + decimal + ' ' + parameter;
      } else {
        var isDecimal = (number % 1) > 0;
        if (isDecimal){
          var precision = 2;
          if (number < 1){
            precision = 8;
          } else if (number < 10){
            precision = 6;
          } else if (number < 1000){
            precision = 4;
          }
          return widgetFunctions.roundAmount(number, precision);
        } else {
          return parseFloat(number).toLocaleString('ru-RU', { maximumFractionDigits: 2 });
        }
      }
    },
    roundAmount: function(amount, decimal, direction){
      amount = parseFloat(amount);
      if (!decimal) decimal = 8;
      if (!direction) direction = 'round';
      decimal = Math.pow(10, decimal);
      return widgetFunctions.scientificToDecimal(Math[direction](amount * decimal) / decimal);
    },
    stylesheet: function(){
      if (widgetDefaults.style_src !== false){
        var url = widgetDefaults.style_src || widgetDefaults.origin_src +'/dist/'+widgetDefaults.cssFileName;
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', url);
        return (document.body.querySelector('link[href="'+url+'"]')) ? '' : document.body.appendChild(link);
      }
    },
    widgetMainElement: function(index){
      return widgetFunctions.widgetHeaderElement(index) + widgetFunctions.widgetTableElement(index);
    },
    widgetHeaderElement: function(index){
      var title = (widgetsStates[index].isWordpress)
        ? ''
        : '<h1 class="cp-widget-title cp-translation translation_title">'+widgetFunctions.getTranslation(index, "title")+'</h1>';
      return title +
        '<section class="cp-widget-header">' +
          widgetFunctions.widgetSelectElement(index, 'primary_currency') +
          widgetFunctions.widgetSelectElement(index, 'data_type') +
        '</section>';
    },
    widgetTableElement: function(index){
      var data = widgetsStates[index];
      return '<section class="cp-widget-table">' +
                '<div class="cp-widget-table__head">' +
                  '<div class="cp-widget-table__row">' +
                    '<span class="cp-widget-table__cell cp-widget-table__cell--name cp-translation translation_title">'+widgetFunctions.getTranslation(index, "name")+'</span>' +
                    '<span class="cp-widget-table__cell cp-widget-table__cell--data">' +
                      '<span class="cp-widget-table__cell--data-value cp-translation translation_price">'+widgetFunctions.getTranslation(index, "price")+'</span>' +
                      '<span class="cp-widget-table__cell--data-change cp-translation translation_change">'+widgetFunctions.getTranslation(index, "change")+'</span>' +
                    '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="cp-widget-table__body">' +
                  ((data.isData)
                    ? widgetFunctions.widgetTableElementData(index)
                    : widgetFunctions.widgetTableElementMessage(index)) +
                '</div>'+
              '</section>';
    },
    widgetTableElementData: function(index){
      var rows = '';
      for (var i = 0; i < widgetsStates[index]['currency_list'].length; i++){
        var currency = widgetsStates[index]['currency_list'][i];
        var data = widgetsStates[index].ticker[currency+'-'+widgetsStates[index].primary_currency.toLowerCase()];
        var dataType = (widgetsStates[index].data_type.toLowerCase() === 'volume')
          ? widgetsStates[index].data_type.toLowerCase() + '_24h'
          : widgetsStates[index].data_type.toLowerCase();
        rows += '<div class="cp-widget-table__row">'+
                  '<a target="_blank" href="'+ widgetFunctions.coin_link(currency, index) +'"></a>' +
                  '<span class="cp-widget-table__cell cp-widget-table__cell--name">' +
                    '<img src="https://coinpaprika.com/coin/'+ currency +'/logo.png" alt="">' +
                    '<span class="cp-widget-table__cell--name__text-box">' +
                      '<span class="cp-widget-table__cell--name__text-box--name nameTicker'+currency.toUpperCase()+'">'+((data) ? data.name : "No data")+'</span>' +
                      '<span class="cp-widget-table__cell--name__text-box--symbol symbolTicker'+currency.toUpperCase()+'">'+((data) ? data.symbol : currency.split('-')[0].toUpperCase())+'</span>' +
                    '</span>' +
                  '</span>' +
                  '<span class="cp-widget-table__cell cp-widget-table__cell--data">'+
                      '<span class="cp-widget-table__cell--data-value parseNumber '+dataType+'Ticker'+currency.toUpperCase()+'">'+
                          ((data)
                            ? widgetFunctions.parseNumber(data[dataType], true) + ' ' + ((widgetsStates[index].show_details_currency) ? widgetsStates[index].primary_currency.toUpperCase() : '')
                            : widgetDefaults.emptyData) +
                      '</span>' +
                      '<span class="cp-widget-table__cell--data-change cp-widget__rank'+ ((data && data[dataType+'_change_24h'] > 0) ? ' cp-widget__rank-up' : (data && data[dataType+'_change_24h'] < 0) ? ' cp-widget__rank-down' : ' cp-widget__rank-neutral') +' '+dataType+'_change_24hTicker'+currency.toUpperCase()+'">'+
                          ((data)
                            ? (!data[dataType+'_change_24h'] && data[dataType+'_change_24h'] !== 0) ? widgetDefaults.emptyData : widgetFunctions.roundAmount(data[dataType+'_change_24h'], 2)+'%'
                            : widgetDefaults.emptyData)+
                      '</span>' +
                  '</span>' +
                '</div>'
      }
      return rows;
    },
    widgetTableElementMessage: function(index){
      var message = widgetsStates[index].message;
      return '<div class="cp-widget-table__row cp-translation translation_message">' +
                '<div class="cp-widget-table__cell">'+ (widgetFunctions.getTranslation(index, message)) +'</div>' +
              '</div>';
    },
    widgetSelectElement: function(index, label){
      var title = '';
      var buttons = '';
      for (var i = 0; i < widgetsStates[index][label+'_list'].length; i++){
        var data = widgetsStates[index][label+'_list'][i];
        buttons += '<button class="'+ ((data.toLowerCase() === widgetsStates[index][label].toLowerCase())
                                ? 'cp-widget-active '
                                : '') + ((label === 'primary_currency') ? '' : 'cp-translation translation_' + data.toLowerCase()) +'" data-option="'+data+'">'+((label !== 'primary_currency') ? widgetFunctions.getTranslation(index, data.toLowerCase()) : data)+'</button>'
      }
      if (label === 'data_type') title = widgetFunctions.getTranslation(index, "show");
      if (label === 'primary_currency') title = widgetFunctions.getTranslation(index, "price_in");
      return '<div data-type="'+label+'" class="cp-widget-select">' +
        '<label class="cp-translation translation_'+ label +'">'+title+'</label>' +
        '<div class="cp-widget-select__options">' +
        '<span class="arrow-down '+ ((label === 'primary_currency') ? 'cp-widget__uppercase' : 'cp-widget__capitalize cp-translation translation_' + widgetsStates[index][label].toLowerCase()) +'">'+ ((label !== 'primary_currency') ? widgetFunctions.getTranslation(index, widgetsStates[index][label].toLowerCase()) : widgetsStates[index][label]) +'</span>' +
        '<div class="cp-widget-select__dropdown">' +
        buttons +
        '</div>' +
        '</div>' +
        '</div>';
    },
    widgetFooter: function(index){
      var isWordpress = widgetsStates[index].isWordpress;
      return (isWordpress) ? '' : '<p class="cp-widget-footer cp-widget-footer--'+index+'">' +
        '<span class="cp-translation translation_powered_by">'+widgetFunctions.getTranslation(index, "powered_by") + ' </span>' +
        '<img style="width: 16px" src="'+ widgetFunctions.main_logo_link() +'" alt=""/>' +
        '<a target="_blank" href="'+ widgetFunctions.main_page_link(index) +'">coinpaprika.com</a>' +
        '</p>';
    },
    getImage: function(index, currency){
      var data = widgetsStates[index];
      var imgContainers = data.mainElement.getElementsByClassName('cp-widget__img');
      for (var i = 0; i < imgContainers.length; i++){
        var imgContainer = imgContainers[i];
        imgContainer.classList.add('cp-widget__img--hidden');
        var img = imgContainer.querySelector('img');
        var newImg = new Image;
        newImg.onload = function() {
          img.src = this.src;
          imgContainer.classList.remove('cp-widget__img--hidden');
        };
        newImg.src = widgetFunctions.img_src(data.currency);
      }
    },
    img_src: function(id){
      return 'https://coinpaprika.com/coin/'+id+'/logo.png';
    },
    coin_link: function(id, index){
      return 'https://coinpaprika.com' + '/coin/' + id + widgetFunctions.get_utm_link(index)
    },
    main_page_link: function(index){
      return 'https://coinpaprika.com' + widgetFunctions.get_utm_link(index);
    },
    get_utm_link: function(index){
      return '?utm_source=widget&utm_medium='+ ((widgetsStates[index].isWordpress) ? 'wordpress' : 'inline') +'&utm_campaign=ranking';
    },
    main_logo_link: function(){
      return widgetDefaults.img_src || widgetDefaults.origin_src +'/dist/img/logo_widget.svg'
    },
    getScriptElement: function(){
      return document.querySelector('script[data-cp-market-widget]');
    },
    getTranslation: function(index, label){
      var text = (widgetDefaults.translations[widgetsStates[index].language]) ? widgetDefaults.translations[widgetsStates[index].language][label] : null;
      if (!text && widgetDefaults.translations['en']) {
        text = widgetDefaults.translations['en'][label];
      }
      if (!text) {
        return widgetFunctions.addLabelWithoutTranslation(index, label);
      } else {
        return text;
      }
    },
    addLabelWithoutTranslation: function(index, label){
      if (!widgetDefaults.translations['en']) widgetFunctions.getTranslations('en');
      return widgetsStates[index].noTranslationLabels.push(label);
    },
    getTranslations: function(lang){
      if (!widgetDefaults.translations[lang]){
        var xhr = new XMLHttpRequest();
        var url = widgetDefaults.lang_src  || widgetDefaults.origin_src + '/dist/lang';
        xhr.open('GET', url + '/' + lang + '.json');
        xhr.onload = function() {
          if (xhr.status === 200) {
            widgetFunctions.updateWidgetTranslations(lang, JSON.parse(xhr.responseText));
          }
          else {
            widgetFunctions.onErrorRequest(0, xhr);
            widgetFunctions.getTranslations('en');
            delete widgetDefaults.translations[lang];
          }
        };
        xhr.onerror = function(){
          widgetFunctions.onErrorRequest(0, xhr);
          widgetFunctions.getTranslations('en');
          delete widgetDefaults.translations[lang];
        };
        xhr.send();
        widgetDefaults.translations[lang] = {};
      }
    },
    scientificToDecimal: function (x) {
      if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
      } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
        }
      }
      return x;
    },
  };
  
  function initWidgets(){
    if (!window[widgetDefaults.objectName].init){
      window[widgetDefaults.objectName].init = true;
      var mainElements = Array.prototype.slice.call(document.getElementsByClassName(widgetDefaults.className));
      widgetFunctions.setWidgetClass(mainElements);
      window.addEventListener('resize', function(){
        widgetFunctions.setWidgetClass(mainElements);
      }, false);
      var scriptElement = widgetFunctions.getScriptElement();
      if (scriptElement && scriptElement.dataset && scriptElement.dataset.cpMarketWidget){
        var dataset = JSON.parse(scriptElement.dataset.cpMarketWidget);
        if (Object.keys(dataset)){
          var keys = Object.keys(dataset);
          for (var j = 0; j < keys.length; j++){
            var key = keys[j].replace('-', '_');
            widgetDefaults[key] = dataset[keys[j]];
          }
        }
      }
      setTimeout(function(){
        widgetsStates = [];
        for(var i = 0; i < mainElements.length; i++){
          var newSettings = JSON.parse(JSON.stringify(widgetDefaults));
          newSettings.isWordpress = mainElements[i].classList.contains('wordpress');
          newSettings.mainElement = mainElements[i];
          widgetsStates.push(newSettings);
          widgetFunctions.init(i);
        }
      }, 50);
    }
  }
  window[widgetDefaults.objectName] = {};
  document.addEventListener('DOMContentLoaded', initWidgets, false);
  window[widgetDefaults.objectName].bindWidget = function(){
    window[widgetDefaults.objectName].init = false;
    initWidgets();
  };
})();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpe1xuICB2YXIgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICB2YXIgd2lkZ2V0RGVmYXVsdHMgPSB7XG4gICAgb2JqZWN0TmFtZTogJ2NwTWFya2V0V2lkZ2V0cycsXG4gICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtbWFya2V0LXdpZGdldCcsXG4gICAgY3NzRmlsZU5hbWU6ICd3aWRnZXQubWluLmNzcycsXG4gICAgY3VycmVuY3lfbGlzdDogWydidGMtYml0Y29pbicsICdldGgtZXRoZXJldW0nLCAneHJwLXhycCcsICdiY2gtYml0Y29pbi1jYXNoJ10sXG4gICAgcHJpbWFyeV9jdXJyZW5jeV9saXN0OiBbICdVU0QnLCAnQlRDJywgJ0VUSCcgXSxcbiAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICBkYXRhX3R5cGVfbGlzdDogWyAnUHJpY2UnLCAnVm9sdW1lJyBdLFxuICAgIGRhdGFfdHlwZTogJ3ByaWNlJyxcbiAgICB2ZXJzaW9uOiAnc3RhbmRhcmQnLFxuICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgaW1nX3NyYzogbnVsbCxcbiAgICBsYW5nX3NyYzogbnVsbCxcbiAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AY29pbnBhcHJpa2Evd2lkZ2V0LW1hcmtldCcsXG4gICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiB0cnVlLFxuICAgIGVtcHR5RGF0YTogJy0nLFxuICAgIGVtcHR5VmFsdWU6IDAsXG4gICAgdGlja2VyOiB7XG4gICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBpbnRlcnZhbDogbnVsbCxcbiAgICBpc1dvcmRwcmVzczogZmFsc2UsXG4gICAgaXNEYXRhOiBmYWxzZSxcbiAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICB9O1xuICB2YXIgd2lkZ2V0RnVuY3Rpb25zID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGlmICghd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJysgd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsnXCInKTtcbiAgICAgIH1cbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSxcbiAgICBzZXRXaWRnZXRDbGFzczogZnVuY3Rpb24oZWxlbWVudHMpe1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgdmFyIHNtYWxsQ2xhc3NOYW1lID0gd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fc21hbGwnO1xuICAgICAgICB2YXIgbWVkaXVtQ2xhc3NOYW1lID0gd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fbWVkaXVtJztcbiAgICAgICAgdmFyIGhhc1NtYWxsQ2xhc3MgPSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoc21hbGxDbGFzc05hbWUpO1xuICAgICAgICB2YXIgaGFzTWVkaXVtQ2xhc3MgPSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDMyMCAmJiAhaGFzU21hbGxDbGFzcykgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChzbWFsbENsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IDMyMCAmJiBoYXNTbWFsbENsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKHNtYWxsQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDM3MCAmJiAhaGFzTWVkaXVtQ2xhc3MpIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gMzcwICYmIGhhc01lZGl1bUNsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKG1lZGl1bUNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50O1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdHM6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldCl7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndmVyc2lvbicsIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbik7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeUxpc3QpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeV9saXN0JywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmRhdGFUeXBlTGlzdCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdkYXRhX3R5cGVfbGlzdCcsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuZGF0YVR5cGUpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnZGF0YV90eXBlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5TGlzdCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeV9saXN0JywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5TGlzdCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dfZGV0YWlsc19jdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX2FjdGl2ZScsIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX3RpbWVvdXQnLCB3aWRnZXRGdW5jdGlvbnMucGFyc2VJbnRlcnZhbFZhbHVlKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnb3JpZ2luX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbm9kZV9tb2R1bGVzX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRPcmlnaW5MaW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBpZiAoT2JqZWN0LmtleXMod2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnMod2lkZ2V0RGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnN0eWxlc2hlZXQoKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfSxcbiAgICBhZGRXaWRnZXRFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIHdpZGdldEVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgICBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB3aWRnZXRFbGVtZW50O1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICB9LFxuICAgIHNldFNlbGVjdExpc3RlbmVyczogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciBzZWxlY3RFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBidXR0b25zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICBidXR0b25zW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0U2VsZWN0T3B0aW9uOiBmdW5jdGlvbihldmVudCwgaW5kZXgpe1xuICAgICAgdmFyIGNsYXNzTmFtZSA9ICdjcC13aWRnZXQtYWN0aXZlJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBzaWJsaW5nID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgaWYgKHNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciB0YWJsZUhlYWRDZWxsID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC10YWJsZV9faGVhZCAuY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLXZhbHVlJyk7XG4gICAgICB2YXIgcGFyZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgICB2YXIgdHlwZSA9IHBhcmVudC5kYXRhc2V0LnR5cGU7XG4gICAgICB2YXIgcGlja2VkVmFsdWVFbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zID4gc3BhbicpO1xuICAgICAgdmFyIHZhbHVlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQub3B0aW9uO1xuICAgICAgdGFibGVIZWFkQ2VsbC5pbm5lclRleHQgPSAodHlwZSAhPT0gJ3ByaW1hcnlfY3VycmVuY3knKVxuICAgICAgICA/IGV2ZW50LnRhcmdldC5pbm5lclRleHRcbiAgICAgICAgOiB0YWJsZUhlYWRDZWxsLmlubmVyVGV4dDtcbiAgICAgIHBpY2tlZFZhbHVlRWxlbWVudC5pbm5lclRleHQgPSAoKHR5cGUgIT09ICdwcmltYXJ5X2N1cnJlbmN5JylcbiAgICAgICAgPyB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHZhbHVlLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgIDogdmFsdWUpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsIHR5cGUsIHZhbHVlKTtcbiAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSxcbiAgICBpbml0SW50ZXJ2YWw6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGNsZWFySW50ZXJ2YWwod2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLnVwZGF0ZV9hY3RpdmUgJiYgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICAgICAgfSwgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgdmFyIGN1cnJlbmN5X2xpc3QgPSBKU09OLnN0cmluZ2lmeSh3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeV9saXN0KS5yZXBsYWNlKCdbJywgJycpLnJlcGxhY2UoJ10nLCAnJykuc3BsaXQoJ1wiJykuam9pbignJyk7XG4gICAgICB4aHIub3BlbignR0VUJywgJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXRfbGlzdC8nK2N1cnJlbmN5X2xpc3QpO1xuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGlmICghd2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNEYXRhKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3lfbGlzdC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgaWYgKGRhdGFbd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3lfbGlzdFtpXV0pIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVUaWNrZXIoaW5kZXgsIGRhdGFbd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3lfbGlzdFtpXV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoaW5kZXgsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoaW5kZXgsIHRoaXMpO1xuICAgICAgfTtcbiAgICAgIHhoci5zZW5kKCk7XG4gICAgfSxcbiAgICBvbkVycm9yUmVxdWVzdDogZnVuY3Rpb24oaW5kZXgsIHhocil7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNEYXRhKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIGZhbHNlKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbWVzc2FnZScsICdkYXRhX3VuYXZhaWxhYmxlJyk7XG4gICAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IGZhaWxlZC4gIFJldHVybmVkIHN0YXR1cyBvZiAnICsgeGhyLCB3aWRnZXRzU3RhdGVzW2luZGV4XSk7XG4gICAgfSxcbiAgICBzZXRCZWZvcmVFbGVtZW50SW5Gb290ZXI6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0ubG9jYWxOYW1lID09PSAnc3R5bGUnKXtcbiAgICAgICAgbWFpbkVsZW1lbnQucmVtb3ZlQ2hpbGQobWFpbkVsZW1lbnQuY2hpbGROb2Rlc1swXSk7XG4gICAgICB9XG4gICAgICB2YXIgZm9vdGVyRWxlbWVudCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXRfX2Zvb3RlcicpO1xuICAgICAgaWYgKGZvb3RlckVsZW1lbnQpe1xuICAgICAgICB2YXIgdmFsdWUgPSBmb290ZXJFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC0gNDM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YWx1ZSAtPSBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgICAgc3R5bGUuaW5uZXJIVE1MID0gJy5jcC13aWRnZXRfX2Zvb3Rlci0tJytpbmRleCsnOjpiZWZvcmV7d2lkdGg6Jyt2YWx1ZS50b0ZpeGVkKDApKydweDt9JztcbiAgICAgICAgbWFpbkVsZW1lbnQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBtYWluRWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVXaWRnZXRFbGVtZW50OiBmdW5jdGlvbihpbmRleCwga2V5LCB2YWx1ZSwgY3VycmVuY3kpe1xuICAgICAgdmFyIHN0YXRlID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50KXtcbiAgICAgICAgdmFyIHRpY2tlckNsYXNzID0gKGN1cnJlbmN5KSA/ICdUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkgOiAnJztcbiAgICAgICAgaWYgKGtleSA9PT0gJ25hbWUnIHx8IGtleSA9PT0gJ2N1cnJlbmN5Jyl7XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ2N1cnJlbmN5Jyl7XG4gICAgICAgICAgICB2YXIgYUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1mb290ZXIgPiBhJyk7XG4gICAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgYUVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIGFFbGVtZW50c1trXS5ocmVmID0gd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayh2YWx1ZSwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0SW1hZ2UoaW5kZXgsIGN1cnJlbmN5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ID09PSAnaXNEYXRhJyB8fCBrZXkgPT09ICdtZXNzYWdlJyB8fCBrZXkgPT09ICdkYXRhX3R5cGUnIHx8IGtleSA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKXtcbiAgICAgICAgICB2YXIgaGVhZGVyRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXRhYmxlX19ib2R5Jyk7XG4gICAgICAgICAgZm9yKHZhciBsID0gMDsgbCA8IGhlYWRlckVsZW1lbnRzLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICBoZWFkZXJFbGVtZW50c1tsXS5pbm5lckhUTUwgPSAoIXN0YXRlLmlzRGF0YSkgPyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0VGFibGVFbGVtZW50TWVzc2FnZShpbmRleCkgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0VGFibGVFbGVtZW50RGF0YShpbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nK2tleSt0aWNrZXJDbGFzcyk7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB1cGRhdGVFbGVtZW50cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICB2YXIgdXBkYXRlRWxlbWVudCA9IHVwZGF0ZUVsZW1lbnRzW2pdO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwYXJzZU51bWJlcicpKXtcbiAgICAgICAgICAgICAgdmFsdWUgPSB3aWRnZXRGdW5jdGlvbnMucGFyc2VOdW1iZXIodmFsdWUsIHRydWUpIHx8IHN0YXRlLmVtcHR5RGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0X19yYW5rJykpe1xuICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gKHBhcnNlRmxvYXQodmFsdWUpID4gMCkgPyBcImNwLXdpZGdldF9fcmFuay11cFwiIDogKChwYXJzZUZsb2F0KHZhbHVlKSA8IDApID8gXCJjcC13aWRnZXRfX3JhbmstZG93blwiIDogXCJjcC13aWRnZXRfX3JhbmstbmV1dHJhbFwiKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstZG93bicpO1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay11cCcpO1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1uZXV0cmFsJyk7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHN0YXRlLmVtcHR5RGF0YTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICghdmFsdWUgJiYgdmFsdWUgIT09IDApID8gc3RhdGUuZW1wdHlEYXRhIDogd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KHZhbHVlLCAyKSsnJSc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLXZhbHVlJykgJiYgc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KXtcbiAgICAgICAgICAgICAgdmFsdWUgKz0gJyAnICsgc3RhdGUucHJpbWFyeV9jdXJyZW5jeS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93RGV0YWlsc0N1cnJlbmN5JykgJiYgIXN0YXRlLnNob3dfZGV0YWlsc19jdXJyZW5jeSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9ICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuaW5uZXJUZXh0ID0gdmFsdWUgfHwgc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlVGlja2VyOiBmdW5jdGlvbihpbmRleCwgZGF0YSl7XG4gICAgICB2YXIgcXVvdGVLZXlzID0gT2JqZWN0LmtleXMoZGF0YS5xdW90ZSk7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgIGRlbGV0ZSB0ZW1wbGF0ZS5xdW90ZTtcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBxdW90ZUtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICB2YXIgcXVvdGVEYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhLnF1b3RlW3F1b3RlS2V5c1tqXV0pKTtcbiAgICAgICAgcXVvdGVEYXRhID0gT2JqZWN0LmFzc2lnbihxdW90ZURhdGEsIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKSk7XG4gICAgICAgIHF1b3RlRGF0YS5pZCA9IGRhdGEuaWQgKyAnLScgKyBxdW90ZUtleXNbal07XG4gICAgICAgIHF1b3RlRGF0YS5jdXJyZW5jeV9pZCA9IGRhdGEuaWQ7XG4gICAgICAgIHF1b3RlRGF0YS5xdW90ZV9pZCA9IHF1b3RlS2V5c1tqXTtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW3F1b3RlRGF0YS5pZF0gPSBxdW90ZURhdGE7XG4gICAgICAgIHZhciBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKHF1b3RlRGF0YSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YUtleXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGlmIChxdW90ZURhdGEucXVvdGVfaWQgPT09IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKSl3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwgZGF0YUtleXNbaV0sIHF1b3RlRGF0YVtkYXRhS2V5c1tpXV0sIHF1b3RlRGF0YS5jdXJyZW5jeV9pZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZURhdGE6IGZ1bmN0aW9uKGluZGV4LCBrZXksIHZhbHVlLCBjdXJyZW5jeSl7XG4gICAgICBpZiAoY3VycmVuY3kpe1xuICAgICAgICBpZiAoIXdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0pIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0gPSB7fTtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XVtrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnbGFuZ3VhZ2UnKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucyh2YWx1ZSk7XG4gICAgICB9XG4gICAgICB2YXIgY3VycmVuY3lfaWQgPSAod2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XSkgPyB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldLmN1cnJlbmN5X2lkIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKChjdXJyZW5jeV9pZCAmJiB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldLnF1b3RlX2lkID09PSB3aWRnZXRzU3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5LnRvTG93ZXJDYXNlKCkpIHx8ICFjdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIGN1cnJlbmN5X2lkKTtcbiAgICB9LFxuICAgIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9uczogZnVuY3Rpb24obGFuZywgZGF0YSl7XG4gICAgICB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWRnZXRzU3RhdGVzLmxlbmd0aDsgeCsrKXtcbiAgICAgICAgdmFyIGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSA9IHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5sZW5ndGggPiAwICYmIGxhbmcgPT09ICdlbic7XG4gICAgICAgIGlmICh3aWRnZXRzU3RhdGVzW3hdLmxhbmd1YWdlID09PSBsYW5nIHx8IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSl7XG4gICAgICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0c1N0YXRlc1t4XS5tYWluRWxlbWVudDtcbiAgICAgICAgICB2YXIgdHJhbnNhbHRlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3AtdHJhbnNsYXRpb24nKSk7XG4gICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKyl7XG4gICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5jbGFzc0xpc3QuZm9yRWFjaChmdW5jdGlvbihjbGFzc05hbWUpe1xuICAgICAgICAgICAgICBpZiAoY2xhc3NOYW1lLnNlYXJjaCgndHJhbnNsYXRpb25fJykgPiAtMSl7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZUtleSA9IGNsYXNzTmFtZS5yZXBsYWNlKCd0cmFuc2xhdGlvbl8nLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZUtleSA9PT0gJ21lc3NhZ2UnKSB0cmFuc2xhdGVLZXkgPSB3aWRnZXRzU3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsSW5kZXggPSB3aWRnZXRzU3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuaW5kZXhPZih0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKHgsIHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsSW5kZXggPiAtMSAmJiB0ZXh0KXtcbiAgICAgICAgICAgICAgICAgIHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5zcGxpY2UobGFiZWxJbmRleCwgMSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNhbHRlRWxlbWVudHNbeV0uY2xvc2VzdCgnLmNwLXdpZGdldF9fZm9vdGVyJykpe1xuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh3aWRnZXRGdW5jdGlvbnMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyLmJpbmQobnVsbCwgeCksIDUwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZUludGVydmFsVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHZhciB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgncycpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdoJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnZCcpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwnJykpICogbXVsdGlwbGllcjtcbiAgICB9LFxuICAgIHBhcnNlTnVtYmVyOiBmdW5jdGlvbihudW1iZXIsIGxvbmdSZXN1bHQpe1xuICAgICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgICAgaWYgKG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eVZhbHVlIHx8IG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEpIHJldHVybiBudW1iZXI7XG4gICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwICYmICFsb25nUmVzdWx0KXtcbiAgICAgICAgdmFyIG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgICB2YXIgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCl7XG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNyk7XG4gICAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgICAgdmFyIGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHJldHVybiBuYXR1cmFsICsgJy4nICsgZGVjaW1hbCArICcgJyArIHBhcmFtZXRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgICBpZiAoaXNEZWNpbWFsKXtcbiAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMDApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudChudW1iZXIsIHByZWNpc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtYmVyKS50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcm91bmRBbW91bnQ6IGZ1bmN0aW9uKGFtb3VudCwgZGVjaW1hbCwgZGlyZWN0aW9uKXtcbiAgICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICAgIGlmICghZGVjaW1hbCkgZGVjaW1hbCA9IDg7XG4gICAgICBpZiAoIWRpcmVjdGlvbikgZGlyZWN0aW9uID0gJ3JvdW5kJztcbiAgICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgICByZXR1cm4gd2lkZ2V0RnVuY3Rpb25zLnNjaWVudGlmaWNUb0RlY2ltYWwoTWF0aFtkaXJlY3Rpb25dKGFtb3VudCAqIGRlY2ltYWwpIC8gZGVjaW1hbCk7XG4gICAgfSxcbiAgICBzdHlsZXNoZWV0OiBmdW5jdGlvbigpe1xuICAgICAgaWYgKHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2Upe1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMuc3R5bGVfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC8nK3dpZGdldERlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgcmV0dXJuIChkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicrdXJsKydcIl0nKSkgPyAnJyA6IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICB9XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRIZWFkZXJFbGVtZW50KGluZGV4KSArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnQoaW5kZXgpO1xuICAgIH0sXG4gICAgd2lkZ2V0SGVhZGVyRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHRpdGxlID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKVxuICAgICAgICA/ICcnXG4gICAgICAgIDogJzxoMSBjbGFzcz1cImNwLXdpZGdldC10aXRsZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInRpdGxlXCIpKyc8L2gxPic7XG4gICAgICByZXR1cm4gdGl0bGUgK1xuICAgICAgICAnPHNlY3Rpb24gY2xhc3M9XCJjcC13aWRnZXQtaGVhZGVyXCI+JyArXG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JykgK1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAnZGF0YV90eXBlJykgK1xuICAgICAgICAnPC9zZWN0aW9uPic7XG4gICAgfSxcbiAgICB3aWRnZXRUYWJsZUVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxzZWN0aW9uIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2hlYWRcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19yb3dcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm5hbWVcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wcmljZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInByaWNlXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLWNoYW5nZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9jaGFuZ2VcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJjaGFuZ2VcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2JvZHlcIj4nICtcbiAgICAgICAgICAgICAgICAgICgoZGF0YS5pc0RhdGEpXG4gICAgICAgICAgICAgICAgICAgID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudERhdGEoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICc8L3NlY3Rpb24+JztcbiAgICB9LFxuICAgIHdpZGdldFRhYmxlRWxlbWVudERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciByb3dzID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldHNTdGF0ZXNbaW5kZXhdWydjdXJyZW5jeV9saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB3aWRnZXRzU3RhdGVzW2luZGV4XVsnY3VycmVuY3lfbGlzdCddW2ldO1xuICAgICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeSsnLScrd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgdmFyIGRhdGFUeXBlID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmRhdGFfdHlwZS50b0xvd2VyQ2FzZSgpID09PSAndm9sdW1lJylcbiAgICAgICAgICA/IHdpZGdldHNTdGF0ZXNbaW5kZXhdLmRhdGFfdHlwZS50b0xvd2VyQ2FzZSgpICsgJ18yNGgnXG4gICAgICAgICAgOiB3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcm93cyArPSAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fcm93XCI+JytcbiAgICAgICAgICAgICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhjdXJyZW5jeSwgaW5kZXgpICsnXCI+PC9hPicgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGltZyBzcmM9XCJodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycrIGN1cnJlbmN5ICsnL2xvZ28ucG5nXCIgYWx0PVwiXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZV9fdGV4dC1ib3hcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94LS1uYW1lIG5hbWVUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrKChkYXRhKSA/IGRhdGEubmFtZSA6IFwiTm8gZGF0YVwiKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZV9fdGV4dC1ib3gtLXN5bWJvbCBzeW1ib2xUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrKChkYXRhKSA/IGRhdGEuc3ltYm9sIDogY3VycmVuY3kuc3BsaXQoJy0nKVswXS50b1VwcGVyQ2FzZSgpKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbCBjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGFcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZSBwYXJzZU51bWJlciAnK2RhdGFUeXBlKydUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICgoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHdpZGdldEZ1bmN0aW9ucy5wYXJzZU51bWJlcihkYXRhW2RhdGFUeXBlXSwgdHJ1ZSkgKyAnICcgKyAoKHdpZGdldHNTdGF0ZXNbaW5kZXhdLnNob3dfZGV0YWlsc19jdXJyZW5jeSkgPyB3aWRnZXRzU3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHdpZGdldERlZmF1bHRzLmVtcHR5RGF0YSkgK1xuICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLWNoYW5nZSBjcC13aWRnZXRfX3JhbmsnKyAoKGRhdGEgJiYgZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSA+IDApID8gJyBjcC13aWRnZXRfX3JhbmstdXAnIDogKGRhdGEgJiYgZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSA8IDApID8gJyBjcC13aWRnZXRfX3JhbmstZG93bicgOiAnIGNwLXdpZGdldF9fcmFuay1uZXV0cmFsJykgKycgJytkYXRhVHlwZSsnX2NoYW5nZV8yNGhUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICgoZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICghZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSAmJiBkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddICE9PSAwKSA/IHdpZGdldERlZmF1bHRzLmVtcHR5RGF0YSA6IHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudChkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddLCAyKSsnJSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHdpZGdldERlZmF1bHRzLmVtcHR5RGF0YSkrXG4gICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgIH1cbiAgICAgIHJldHVybiByb3dzO1xuICAgIH0sXG4gICAgd2lkZ2V0VGFibGVFbGVtZW50TWVzc2FnZTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1lc3NhZ2UgPSB3aWRnZXRzU3RhdGVzW2luZGV4XS5tZXNzYWdlO1xuICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19yb3cgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fbWVzc2FnZVwiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsXCI+JysgKHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgbWVzc2FnZSkpICsnPC9kaXY+JyArXG4gICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0U2VsZWN0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgsIGxhYmVsKXtcbiAgICAgIHZhciB0aXRsZSA9ICcnO1xuICAgICAgdmFyIGJ1dHRvbnMgPSAnJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddW2ldO1xuICAgICAgICBidXR0b25zICs9ICc8YnV0dG9uIGNsYXNzPVwiJysgKChkYXRhLnRvTG93ZXJDYXNlKCkgPT09IHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICdjcC13aWRnZXQtYWN0aXZlICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJykgKyAoKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpID8gJycgOiAnY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIGRhdGEudG9Mb3dlckNhc2UoKSkgKydcIiBkYXRhLW9wdGlvbj1cIicrZGF0YSsnXCI+JysoKGxhYmVsICE9PSAncHJpbWFyeV9jdXJyZW5jeScpID8gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBkYXRhLnRvTG93ZXJDYXNlKCkpIDogZGF0YSkrJzwvYnV0dG9uPidcbiAgICAgIH1cbiAgICAgIGlmIChsYWJlbCA9PT0gJ2RhdGFfdHlwZScpIHRpdGxlID0gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInNob3dcIik7XG4gICAgICBpZiAobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgdGl0bGUgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicHJpY2VfaW5cIik7XG4gICAgICByZXR1cm4gJzxkaXYgZGF0YS10eXBlPVwiJytsYWJlbCsnXCIgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0XCI+JyArXG4gICAgICAgICc8bGFiZWwgY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nKyBsYWJlbCArJ1wiPicrdGl0bGUrJzwvbGFiZWw+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9uc1wiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJhcnJvdy1kb3duICcrICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnY3Atd2lkZ2V0X191cHBlcmNhc2UnIDogJ2NwLXdpZGdldF9fY2FwaXRhbGl6ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpICsnXCI+JysgKChsYWJlbCAhPT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpIDogd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWxdKSArJzwvc3Bhbj4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19kcm9wZG93blwiPicgK1xuICAgICAgICBidXR0b25zICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0Rm9vdGVyOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgaXNXb3JkcHJlc3MgPSB3aWRnZXRzU3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcztcbiAgICAgIHJldHVybiAoaXNXb3JkcHJlc3MpID8gJycgOiAnPHAgY2xhc3M9XCJjcC13aWRnZXQtZm9vdGVyIGNwLXdpZGdldC1mb290ZXItLScraW5kZXgrJ1wiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wb3dlcmVkX2J5XCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicG93ZXJlZF9ieVwiKSArICcgPC9zcGFuPicgK1xuICAgICAgICAnPGltZyBzdHlsZT1cIndpZHRoOiAxNnB4XCIgc3JjPVwiJysgd2lkZ2V0RnVuY3Rpb25zLm1haW5fbG9nb19saW5rKCkgKydcIiBhbHQ9XCJcIi8+JyArXG4gICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLm1haW5fcGFnZV9saW5rKGluZGV4KSArJ1wiPmNvaW5wYXByaWthLmNvbTwvYT4nICtcbiAgICAgICAgJzwvcD4nO1xuICAgIH0sXG4gICAgZ2V0SW1hZ2U6IGZ1bmN0aW9uKGluZGV4LCBjdXJyZW5jeSl7XG4gICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgdmFyIGltZ0NvbnRhaW5lcnMgPSBkYXRhLm1haW5FbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NwLXdpZGdldF9faW1nJyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGltZ0NvbnRhaW5lcnMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgaW1nQ29udGFpbmVyID0gaW1nQ29udGFpbmVyc1tpXTtcbiAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgICAgdmFyIGltZyA9IGltZ0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICAgICAgdmFyIG5ld0ltZyA9IG5ldyBJbWFnZTtcbiAgICAgICAgbmV3SW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGltZy5zcmMgPSB0aGlzLnNyYztcbiAgICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgICB9O1xuICAgICAgICBuZXdJbWcuc3JjID0gd2lkZ2V0RnVuY3Rpb25zLmltZ19zcmMoZGF0YS5jdXJyZW5jeSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbWdfc3JjOiBmdW5jdGlvbihpZCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJytpZCsnL2xvZ28ucG5nJztcbiAgICB9LFxuICAgIGNvaW5fbGluazogZnVuY3Rpb24oaWQsIGluZGV4KXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20nICsgJy9jb2luLycgKyBpZCArIHdpZGdldEZ1bmN0aW9ucy5nZXRfdXRtX2xpbmsoaW5kZXgpXG4gICAgfSxcbiAgICBtYWluX3BhZ2VfbGluazogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbScgKyB3aWRnZXRGdW5jdGlvbnMuZ2V0X3V0bV9saW5rKGluZGV4KTtcbiAgICB9LFxuICAgIGdldF91dG1fbGluazogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuICc/dXRtX3NvdXJjZT13aWRnZXQmdXRtX21lZGl1bT0nKyAoKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKSA/ICd3b3JkcHJlc3MnIDogJ2lubGluZScpICsnJnV0bV9jYW1wYWlnbj1yYW5raW5nJztcbiAgICB9LFxuICAgIG1haW5fbG9nb19saW5rOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHdpZGdldERlZmF1bHRzLmltZ19zcmMgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArJy9kaXN0L2ltZy9sb2dvX3dpZGdldC5zdmcnXG4gICAgfSxcbiAgICBnZXRTY3JpcHRFbGVtZW50OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdFtkYXRhLWNwLW1hcmtldC13aWRnZXRdJyk7XG4gICAgfSxcbiAgICBnZXRUcmFuc2xhdGlvbjogZnVuY3Rpb24oaW5kZXgsIGxhYmVsKXtcbiAgICAgIHZhciB0ZXh0ID0gKHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1t3aWRnZXRzU3RhdGVzW2luZGV4XS5sYW5ndWFnZV0pID8gd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW3dpZGdldHNTdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXVtsYWJlbF0gOiBudWxsO1xuICAgICAgaWYgKCF0ZXh0ICYmIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkge1xuICAgICAgICB0ZXh0ID0gd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddW2xhYmVsXTtcbiAgICAgIH1cbiAgICAgIGlmICghdGV4dCkge1xuICAgICAgICByZXR1cm4gd2lkZ2V0RnVuY3Rpb25zLmFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uKGluZGV4LCBsYWJlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFkZExhYmVsV2l0aG91dFRyYW5zbGF0aW9uOiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgaWYgKCF3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICByZXR1cm4gd2lkZ2V0c1N0YXRlc1tpbmRleF0ubm9UcmFuc2xhdGlvbkxhYmVscy5wdXNoKGxhYmVsKTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9uczogZnVuY3Rpb24obGFuZyl7XG4gICAgICBpZiAoIXdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSl7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdmFyIHVybCA9IHdpZGdldERlZmF1bHRzLmxhbmdfc3JjICB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsgJy9kaXN0L2xhbmcnO1xuICAgICAgICB4aHIub3BlbignR0VUJywgdXJsICsgJy8nICsgbGFuZyArICcuanNvbicpO1xuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVdpZGdldFRyYW5zbGF0aW9ucyhsYW5nLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgICBkZWxldGUgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnMoJ2VuJyk7XG4gICAgICAgICAgZGVsZXRlIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0ge307XG4gICAgICB9XG4gICAgfSxcbiAgICBzY2llbnRpZmljVG9EZWNpbWFsOiBmdW5jdGlvbiAoeCkge1xuICAgICAgaWYgKE1hdGguYWJzKHgpIDwgMS4wKSB7XG4gICAgICAgIHZhciBlID0gcGFyc2VJbnQoeC50b1N0cmluZygpLnNwbGl0KCdlLScpWzFdKTtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICB4ICo9IE1hdGgucG93KDEwLGUtMSk7XG4gICAgICAgICAgeCA9ICcwLicgKyAobmV3IEFycmF5KGUpKS5qb2luKCcwJykgKyB4LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZSA9IHBhcnNlSW50KHgudG9TdHJpbmcoKS5zcGxpdCgnKycpWzFdKTtcbiAgICAgICAgaWYgKGUgPiAyMCkge1xuICAgICAgICAgIGUgLT0gMjA7XG4gICAgICAgICAgeCAvPSBNYXRoLnBvdygxMCxlKTtcbiAgICAgICAgICB4ICs9IChuZXcgQXJyYXkoZSsxKSkuam9pbignMCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geDtcbiAgICB9LFxuICB9O1xuICBcbiAgZnVuY3Rpb24gaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0KXtcbiAgICAgIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIHZhciBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHdpZGdldERlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwTWFya2V0V2lkZ2V0KXtcbiAgICAgICAgdmFyIGRhdGFzZXQgPSBKU09OLnBhcnNlKHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcE1hcmtldFdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB3aWRnZXREZWZhdWx0c1trZXldID0gZGF0YXNldFtrZXlzW2pdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YXIgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHdpZGdldERlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBtYWluRWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd3b3JkcHJlc3MnKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5tYWluRWxlbWVudCA9IG1haW5FbGVtZW50c1tpXTtcbiAgICAgICAgICB3aWRnZXRzU3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0KGkpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICB9XG4gIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXSA9IHt9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdFdpZGdldHMsIGZhbHNlKTtcbiAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmJpbmRXaWRnZXQgPSBmdW5jdGlvbigpe1xuICAgIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgaW5pdFdpZGdldHMoKTtcbiAgfTtcbn0pKCk7Il19
