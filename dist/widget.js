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
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.3',
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
        if (width <= 300 && !hasSmallClass) elements[i].classList.add(smallClassName);
        if (width > 300 && hasSmallClass) elements[i].classList.remove(smallClassName);
        if (width <= 360 && !hasMediumClass) elements[i].classList.add(mediumClassName);
        if (width > 360 && hasMediumClass) elements[i].classList.remove(mediumClassName);
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
            widgetFunctions.updateTicker(index, JSON.parse(this.responseText)[widgetsStates[index].currency_list[i]]);
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
      return Math[direction](amount * decimal) / decimal;
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
                      '<span class="cp-widget-table__cell--name__text-box--symbol symbolTicker'+currency.toUpperCase()+'">'+((data) ? data.symbol : "")+'</span>' +
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
        '<span class="arrow-down '+ ((label === 'primary_currency') ? '' : 'cp-translation translation_' + widgetsStates[index][label].toLowerCase()) +'">'+ ((label !== 'primary_currency') ? widgetFunctions.getTranslation(index, widgetsStates[index][label].toLowerCase()) : widgetsStates[index][label]) +'</span>' +
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiKGZ1bmN0aW9uKCl7XG4gIHZhciB3aWRnZXRzU3RhdGVzID0gW107XG4gIHZhciB3aWRnZXREZWZhdWx0cyA9IHtcbiAgICBvYmplY3ROYW1lOiAnY3BNYXJrZXRXaWRnZXRzJyxcbiAgICBjbGFzc05hbWU6ICdjb2lucGFwcmlrYS1tYXJrZXQtd2lkZ2V0JyxcbiAgICBjc3NGaWxlTmFtZTogJ3dpZGdldC5taW4uY3NzJyxcbiAgICBjdXJyZW5jeV9saXN0OiBbJ2J0Yy1iaXRjb2luJywgJ2V0aC1ldGhlcmV1bScsICd4cnAteHJwJywgJ2JjaC1iaXRjb2luLWNhc2gnXSxcbiAgICBwcmltYXJ5X2N1cnJlbmN5X2xpc3Q6IFsgJ1VTRCcsICdCVEMnLCAnRVRIJyBdLFxuICAgIHByaW1hcnlfY3VycmVuY3k6ICdVU0QnLFxuICAgIGRhdGFfdHlwZV9saXN0OiBbICdQcmljZScsICdWb2x1bWUnIF0sXG4gICAgZGF0YV90eXBlOiAncHJpY2UnLFxuICAgIHZlcnNpb246ICdzdGFuZGFyZCcsXG4gICAgdXBkYXRlX2FjdGl2ZTogZmFsc2UsXG4gICAgdXBkYXRlX3RpbWVvdXQ6ICczMHMnLFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgIHN0eWxlX3NyYzogbnVsbCxcbiAgICBpbWdfc3JjOiBudWxsLFxuICAgIGxhbmdfc3JjOiBudWxsLFxuICAgIG9yaWdpbl9zcmM6ICdodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL0Bjb2lucGFwcmlrYS93aWRnZXQtbWFya2V0QDEuMC4zJyxcbiAgICBzaG93X2RldGFpbHNfY3VycmVuY3k6IHRydWUsXG4gICAgZW1wdHlEYXRhOiAnLScsXG4gICAgZW1wdHlWYWx1ZTogMCxcbiAgICB0aWNrZXI6IHtcbiAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgIHN5bWJvbDogdW5kZWZpbmVkLFxuICAgICAgcHJpY2U6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIHJhbms6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgdm9sdW1lXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcDogdW5kZWZpbmVkLFxuICAgICAgcGVyY2VudF9mcm9tX3ByaWNlX2F0aDogdW5kZWZpbmVkLFxuICAgICAgdm9sdW1lXzI0aF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICBtYXJrZXRfY2FwX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICB9LFxuICAgIGludGVydmFsOiBudWxsLFxuICAgIGlzV29yZHByZXNzOiBmYWxzZSxcbiAgICBpc0RhdGE6IGZhbHNlLFxuICAgIG1lc3NhZ2U6ICdkYXRhX2xvYWRpbmcnLFxuICAgIHRyYW5zbGF0aW9uczoge30sXG4gICAgbWFpbkVsZW1lbnQ6IG51bGwsXG4gICAgbm9UcmFuc2xhdGlvbkxhYmVsczogW10sXG4gIH07XG4gIHZhciB3aWRnZXRGdW5jdGlvbnMgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgaWYgKCF3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdCaW5kIGZhaWxlZCwgbm8gZWxlbWVudCB3aXRoIGNsYXNzID0gXCInKyB3aWRnZXREZWZhdWx0cy5jbGFzc05hbWUgKydcIicpO1xuICAgICAgfVxuICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERlZmF1bHRzKGluZGV4KTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRPcmlnaW5MaW5rKGluZGV4KTtcbiAgICB9LFxuICAgIHNldFdpZGdldENsYXNzOiBmdW5jdGlvbihlbGVtZW50cyl7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB2YXIgc21hbGxDbGFzc05hbWUgPSB3aWRnZXREZWZhdWx0cy5jbGFzc05hbWUgKyAnX19zbWFsbCc7XG4gICAgICAgIHZhciBtZWRpdW1DbGFzc05hbWUgPSB3aWRnZXREZWZhdWx0cy5jbGFzc05hbWUgKyAnX19tZWRpdW0nO1xuICAgICAgICB2YXIgaGFzU21hbGxDbGFzcyA9IGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5jb250YWlucyhzbWFsbENsYXNzTmFtZSk7XG4gICAgICAgIHZhciBoYXNNZWRpdW1DbGFzcyA9IGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5jb250YWlucyhtZWRpdW1DbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPD0gMzAwICYmICFoYXNTbWFsbENsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKHNtYWxsQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gMzAwICYmIGhhc1NtYWxsQ2xhc3MpIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUoc21hbGxDbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPD0gMzYwICYmICFoYXNNZWRpdW1DbGFzcykgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChtZWRpdW1DbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPiAzNjAgJiYgaGFzTWVkaXVtQ2xhc3MpIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5yZW1vdmUobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldE1haW5FbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gd2lkZ2V0c1N0YXRlc1tpbmRleF0ubWFpbkVsZW1lbnQ7XG4gICAgfSxcbiAgICBnZXREZWZhdWx0czogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0KXtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbikgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd2ZXJzaW9uJywgbWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5TGlzdCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5X2xpc3QnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5TGlzdCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuZGF0YVR5cGVMaXN0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2RhdGFfdHlwZV9saXN0JywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0LmRhdGFUeXBlTGlzdCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdkYXRhX3R5cGUnLCBtYWluRWxlbWVudC5kYXRhc2V0LmRhdGFUeXBlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3lMaXN0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5X2xpc3QnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3lMaXN0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnc2hvd19kZXRhaWxzX2N1cnJlbmN5JywgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfYWN0aXZlJywgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICd1cGRhdGVfdGltZW91dCcsIHdpZGdldEZ1bmN0aW9ucy5wYXJzZUludGVydmFsVmFsdWUobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmd1YWdlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdvcmlnaW5fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdub2RlX21vZHVsZXNfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ub2RlTW9kdWxlc1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2Jvd2VyX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdzdHlsZV9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5nX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ1NyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdsb2dvX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldE9yaWdpbkxpbms6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGlmIChPYmplY3Qua2V5cyh3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnMpLmxlbmd0aCA9PT0gMCkgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucyh3aWRnZXREZWZhdWx0cy5sYW5ndWFnZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc3R5bGVzaGVldCgpO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuYWRkV2lkZ2V0RWxlbWVudChpbmRleCk7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0SW50ZXJ2YWwoaW5kZXgpO1xuICAgICAgfSwgMTAwKTtcbiAgICB9LFxuICAgIGFkZFdpZGdldEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICB2YXIgd2lkZ2V0RWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRNYWluRWxlbWVudChpbmRleCkgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0Rm9vdGVyKGluZGV4KTtcbiAgICAgIG1haW5FbGVtZW50LmlubmVySFRNTCA9IHdpZGdldEVsZW1lbnQ7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0U2VsZWN0TGlzdGVuZXJzKGluZGV4KTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgIH0sXG4gICAgc2V0U2VsZWN0TGlzdGVuZXJzOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIHNlbGVjdEVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0RWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgYnV0dG9ucyA9IHNlbGVjdEVsZW1lbnRzW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zIGJ1dHRvbicpO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJ1dHRvbnMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgIGJ1dHRvbnNbal0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0U2VsZWN0T3B0aW9uKGV2ZW50LCBpbmRleCk7XG4gICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRTZWxlY3RPcHRpb246IGZ1bmN0aW9uKGV2ZW50LCBpbmRleCl7XG4gICAgICB2YXIgY2xhc3NOYW1lID0gJ2NwLXdpZGdldC1hY3RpdmUnO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIHNpYmxpbmcgPSBldmVudC50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzW2ldO1xuICAgICAgICBpZiAoc2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkgc2libGluZy5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIHRhYmxlSGVhZENlbGwgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0LXRhYmxlX19oZWFkIC5jcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtdmFsdWUnKTtcbiAgICAgIHZhciBwYXJlbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICAgIHZhciB0eXBlID0gcGFyZW50LmRhdGFzZXQudHlwZTtcbiAgICAgIHZhciBwaWNrZWRWYWx1ZUVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgPiBzcGFuJyk7XG4gICAgICB2YXIgdmFsdWUgPSBldmVudC50YXJnZXQuZGF0YXNldC5vcHRpb247XG4gICAgICB0YWJsZUhlYWRDZWxsLmlubmVyVGV4dCA9ICh0eXBlICE9PSAncHJpbWFyeV9jdXJyZW5jeScpXG4gICAgICAgID8gZXZlbnQudGFyZ2V0LmlubmVyVGV4dFxuICAgICAgICA6IHRhYmxlSGVhZENlbGwuaW5uZXJUZXh0O1xuICAgICAgcGlja2VkVmFsdWVFbGVtZW50LmlubmVyVGV4dCA9ICgodHlwZSAhPT0gJ3ByaW1hcnlfY3VycmVuY3knKVxuICAgICAgICA/IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdmFsdWUudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgOiB2YWx1ZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgdHlwZSwgdmFsdWUpO1xuICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9LFxuICAgIGluaXRJbnRlcnZhbDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgY2xlYXJJbnRlcnZhbCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApe1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgICAgICB9LCB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB2YXIgY3VycmVuY3lfbGlzdCA9IEpTT04uc3RyaW5naWZ5KHdpZGdldHNTdGF0ZXNbaW5kZXhdLmN1cnJlbmN5X2xpc3QpLnJlcGxhY2UoJ1snLCAnJykucmVwbGFjZSgnXScsICcnKS5zcGxpdCgnXCInKS5qb2luKCcnKTtcbiAgICAgIHhoci5vcGVuKCdHRVQnLCAnaHR0cHM6Ly9hcGkuY29pbnBhcHJpa2EuY29tL3YxL3dpZGdldF9saXN0LycrY3VycmVuY3lfbGlzdCk7XG4gICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgaWYgKCF3aWRnZXRzU3RhdGVzW2luZGV4XS5pc0RhdGEpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeV9saXN0Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVUaWNrZXIoaW5kZXgsIEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpW3dpZGdldHNTdGF0ZXNbaW5kZXhdLmN1cnJlbmN5X2xpc3RbaV1dKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB0aGlzKTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuICAgIH0sXG4gICAgb25FcnJvclJlcXVlc3Q6IGZ1bmN0aW9uKGluZGV4LCB4aHIpe1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnZGF0YV91bmF2YWlsYWJsZScpO1xuICAgICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgd2lkZ2V0c1N0YXRlc1tpbmRleF0pO1xuICAgIH0sXG4gICAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJyl7XG4gICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgfVxuICAgICAgdmFyIGZvb3RlckVsZW1lbnQgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0X19mb290ZXInKTtcbiAgICAgIGlmIChmb290ZXJFbGVtZW50KXtcbiAgICAgICAgdmFyIHZhbHVlID0gZm9vdGVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIDQzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScraW5kZXgrJzo6YmVmb3Jle3dpZHRoOicrdmFsdWUudG9GaXhlZCgwKSsncHg7fSc7XG4gICAgICAgIG1haW5FbGVtZW50Lmluc2VydEJlZm9yZShzdHlsZSwgbWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIGN1cnJlbmN5KXtcbiAgICAgIHZhciBzdGF0ZSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCl7XG4gICAgICAgIHZhciB0aWNrZXJDbGFzcyA9IChjdXJyZW5jeSkgPyAnVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpIDogJyc7XG4gICAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgICAgdmFyIGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtZm9vdGVyID4gYScpO1xuICAgICAgICAgICAgZm9yKHZhciBrID0gMDsgayA8IGFFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHdpZGdldEZ1bmN0aW9ucy5jb2luX2xpbmsodmFsdWUsIGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldEltYWdlKGluZGV4LCBjdXJyZW5jeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScgfHwga2V5ID09PSAnZGF0YV90eXBlJyB8fCBrZXkgPT09ICdwcmltYXJ5X2N1cnJlbmN5Jyl7XG4gICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC10YWJsZV9fYm9keScpO1xuICAgICAgICAgIGZvcih2YXIgbCA9IDA7IGwgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgaGVhZGVyRWxlbWVudHNbbF0uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudERhdGEoaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdXBkYXRlRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJytrZXkrdGlja2VyQ2xhc3MpO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdXBkYXRlRWxlbWVudHMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGFyc2VOdW1iZXInKSl7XG4gICAgICAgICAgICAgIHZhbHVlID0gd2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKHZhbHVlLCB0cnVlKSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKXtcbiAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSA/IHN0YXRlLmVtcHR5RGF0YSA6IHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudCh2YWx1ZSwgMikrJyUnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZScpICYmIHN0YXRlLnNob3dfZGV0YWlsc19jdXJyZW5jeSl7XG4gICAgICAgICAgICAgIHZhbHVlICs9ICcgJyArIHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlIHx8IHN0YXRlLmVtcHR5RGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVRpY2tlcjogZnVuY3Rpb24oaW5kZXgsIGRhdGEpe1xuICAgICAgdmFyIHF1b3RlS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEucXVvdGUpO1xuICAgICAgdmFyIHRlbXBsYXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICBkZWxldGUgdGVtcGxhdGUucXVvdGU7XG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgcXVvdGVLZXlzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgdmFyIHF1b3RlRGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YS5xdW90ZVtxdW90ZUtleXNbal1dKSk7XG4gICAgICAgIHF1b3RlRGF0YSA9IE9iamVjdC5hc3NpZ24ocXVvdGVEYXRhLCBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlKSkpO1xuICAgICAgICBxdW90ZURhdGEuaWQgPSBkYXRhLmlkICsgJy0nICsgcXVvdGVLZXlzW2pdO1xuICAgICAgICBxdW90ZURhdGEuY3VycmVuY3lfaWQgPSBkYXRhLmlkO1xuICAgICAgICBxdW90ZURhdGEucXVvdGVfaWQgPSBxdW90ZUtleXNbal07XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltxdW90ZURhdGEuaWRdID0gcXVvdGVEYXRhO1xuICAgICAgICB2YXIgZGF0YUtleXMgPSBPYmplY3Qua2V5cyhxdW90ZURhdGEpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICBpZiAocXVvdGVEYXRhLnF1b3RlX2lkID09PSB3aWRnZXRzU3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5LnRvTG93ZXJDYXNlKCkpd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGRhdGFLZXlzW2ldLCBxdW90ZURhdGFbZGF0YUtleXNbaV1dLCBxdW90ZURhdGEuY3VycmVuY3lfaWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVEYXRhOiBmdW5jdGlvbihpbmRleCwga2V5LCB2YWx1ZSwgY3VycmVuY3kpe1xuICAgICAgaWYgKGN1cnJlbmN5KXtcbiAgICAgICAgaWYgKCF3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldKSB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldID0ge307XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV1ba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJyl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgICAgfVxuICAgICAgdmFyIGN1cnJlbmN5X2lkID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0pID8gd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XS5jdXJyZW5jeV9pZCA6IHVuZGVmaW5lZDtcbiAgICAgIGlmICgoY3VycmVuY3lfaWQgJiYgd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XS5xdW90ZV9pZCA9PT0gd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpKSB8fCAhY3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBrZXksIHZhbHVlLCBjdXJyZW5jeV9pZCk7XG4gICAgfSxcbiAgICB1cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnM6IGZ1bmN0aW9uKGxhbmcsIGRhdGEpe1xuICAgICAgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddID0gZGF0YTtcbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgd2lkZ2V0c1N0YXRlcy5sZW5ndGg7IHgrKyl7XG4gICAgICAgIHZhciBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUgPSB3aWRnZXRzU3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMubGVuZ3RoID4gMCAmJiBsYW5nID09PSAnZW4nO1xuICAgICAgICBpZiAod2lkZ2V0c1N0YXRlc1t4XS5sYW5ndWFnZSA9PT0gbGFuZyB8fCBpc05vVHJhbnNsYXRpb25MYWJlbHNVcGRhdGUpe1xuICAgICAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldHNTdGF0ZXNbeF0ubWFpbkVsZW1lbnQ7XG4gICAgICAgICAgdmFyIHRyYW5zYWx0ZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXRyYW5zbGF0aW9uJykpO1xuICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdHJhbnNhbHRlRWxlbWVudHMubGVuZ3RoOyB5Kyspe1xuICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uY2xhc3NMaXN0LmZvckVhY2goZnVuY3Rpb24oY2xhc3NOYW1lKXtcbiAgICAgICAgICAgICAgaWYgKGNsYXNzTmFtZS5zZWFyY2goJ3RyYW5zbGF0aW9uXycpID4gLTEpe1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGVLZXkgPSBjbGFzc05hbWUucmVwbGFjZSgndHJhbnNsYXRpb25fJywgJycpO1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2xhdGVLZXkgPT09ICdtZXNzYWdlJykgdHJhbnNsYXRlS2V5ID0gd2lkZ2V0c1N0YXRlc1t4XS5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbEluZGV4ID0gd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmluZGV4T2YodHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbih4LCB0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICAgIGlmIChsYWJlbEluZGV4ID4gLTEgJiYgdGV4dCl7XG4gICAgICAgICAgICAgICAgICB3aWRnZXRzU3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuc3BsaWNlKGxhYmVsSW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsb3Nlc3QoJy5jcC13aWRnZXRfX2Zvb3RlcicpKXtcbiAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQod2lkZ2V0RnVuY3Rpb25zLnNldEJlZm9yZUVsZW1lbnRJbkZvb3Rlci5iaW5kKG51bGwsIHgpLCA1MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcGFyc2VJbnRlcnZhbFZhbHVlOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICB2YXIgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnbSc7XG4gICAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdoJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsJycpKSAqIG11bHRpcGxpZXI7XG4gICAgfSxcbiAgICBwYXJzZU51bWJlcjogZnVuY3Rpb24obnVtYmVyLCBsb25nUmVzdWx0KXtcbiAgICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICAgIGlmIChudW1iZXIgPT09IHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuICAgICAgaWYgKG51bWJlciA+IDEwMDAwMCAmJiAhbG9uZ1Jlc3VsdCl7XG4gICAgICAgIHZhciBudW1iZXJTdHIgPSBudW1iZXIudG9GaXhlZCgwKTtcbiAgICAgICAgdmFyIHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKG51bWJlciA+IDEwMDAwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdCJztcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKXtcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA0KTtcbiAgICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5hdHVyYWwgPSBzcGxpY2VkLnNsaWNlKDAsIHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHZhciBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgICAgaWYgKGlzRGVjaW1hbCl7XG4gICAgICAgICAgdmFyIHByZWNpc2lvbiA9IDI7XG4gICAgICAgICAgaWYgKG51bWJlciA8IDEpe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG51bWJlcikudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdW5kQW1vdW50OiBmdW5jdGlvbihhbW91bnQsIGRlY2ltYWwsIGRpcmVjdGlvbil7XG4gICAgICBhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG4gICAgICBpZiAoIWRlY2ltYWwpIGRlY2ltYWwgPSA4O1xuICAgICAgaWYgKCFkaXJlY3Rpb24pIGRpcmVjdGlvbiA9ICdyb3VuZCc7XG4gICAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gICAgfSxcbiAgICBzdHlsZXNoZWV0OiBmdW5jdGlvbigpe1xuICAgICAgaWYgKHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2Upe1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMuc3R5bGVfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC8nK3dpZGdldERlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgcmV0dXJuIChkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicrdXJsKydcIl0nKSkgPyAnJyA6IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICB9XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRIZWFkZXJFbGVtZW50KGluZGV4KSArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnQoaW5kZXgpO1xuICAgIH0sXG4gICAgd2lkZ2V0SGVhZGVyRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHRpdGxlID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKVxuICAgICAgICA/ICcnXG4gICAgICAgIDogJzxoMSBjbGFzcz1cImNwLXdpZGdldC10aXRsZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInRpdGxlXCIpKyc8L2gxPic7XG4gICAgICByZXR1cm4gdGl0bGUgK1xuICAgICAgICAnPHNlY3Rpb24gY2xhc3M9XCJjcC13aWRnZXQtaGVhZGVyXCI+JyArXG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JykgK1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAnZGF0YV90eXBlJykgK1xuICAgICAgICAnPC9zZWN0aW9uPic7XG4gICAgfSxcbiAgICB3aWRnZXRUYWJsZUVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxzZWN0aW9uIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2hlYWRcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19yb3dcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm5hbWVcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wcmljZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInByaWNlXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLWNoYW5nZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9jaGFuZ2VcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJjaGFuZ2VcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2JvZHlcIj4nICtcbiAgICAgICAgICAgICAgICAgICgoZGF0YS5pc0RhdGEpXG4gICAgICAgICAgICAgICAgICAgID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudERhdGEoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICc8L3NlY3Rpb24+JztcbiAgICB9LFxuICAgIHdpZGdldFRhYmxlRWxlbWVudERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciByb3dzID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldHNTdGF0ZXNbaW5kZXhdWydjdXJyZW5jeV9saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB3aWRnZXRzU3RhdGVzW2luZGV4XVsnY3VycmVuY3lfbGlzdCddW2ldO1xuICAgICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeSsnLScrd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgdmFyIGRhdGFUeXBlID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmRhdGFfdHlwZS50b0xvd2VyQ2FzZSgpID09PSAndm9sdW1lJylcbiAgICAgICAgICA/IHdpZGdldHNTdGF0ZXNbaW5kZXhdLmRhdGFfdHlwZS50b0xvd2VyQ2FzZSgpICsgJ18yNGgnXG4gICAgICAgICAgOiB3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcm93cyArPSAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fcm93XCI+JytcbiAgICAgICAgICAgICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhjdXJyZW5jeSwgaW5kZXgpICsnXCI+PC9hPicgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGltZyBzcmM9XCJodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycrIGN1cnJlbmN5ICsnL2xvZ28ucG5nXCIgYWx0PVwiXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZV9fdGV4dC1ib3hcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94LS1uYW1lIG5hbWVUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrKChkYXRhKSA/IGRhdGEubmFtZSA6IFwiTm8gZGF0YVwiKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZV9fdGV4dC1ib3gtLXN5bWJvbCBzeW1ib2xUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrKChkYXRhKSA/IGRhdGEuc3ltYm9sIDogXCJcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwgY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtdmFsdWUgcGFyc2VOdW1iZXIgJytkYXRhVHlwZSsnVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB3aWRnZXRGdW5jdGlvbnMucGFyc2VOdW1iZXIoZGF0YVtkYXRhVHlwZV0sIHRydWUpICsgJyAnICsgKCh3aWRnZXRzU3RhdGVzW2luZGV4XS5zaG93X2RldGFpbHNfY3VycmVuY3kpID8gd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeS50b1VwcGVyQ2FzZSgpIDogJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aWRnZXREZWZhdWx0cy5lbXB0eURhdGEpICtcbiAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS1jaGFuZ2UgY3Atd2lkZ2V0X19yYW5rJysgKChkYXRhICYmIGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gPiAwKSA/ICcgY3Atd2lkZ2V0X19yYW5rLXVwJyA6IChkYXRhICYmIGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gPCAwKSA/ICcgY3Atd2lkZ2V0X19yYW5rLWRvd24nIDogJyBjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpICsnICcrZGF0YVR5cGUrJ19jaGFuZ2VfMjRoVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoIWRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gJiYgZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSAhPT0gMCkgPyB3aWRnZXREZWZhdWx0cy5lbXB0eURhdGEgOiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQoZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSwgMikrJyUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aWRnZXREZWZhdWx0cy5lbXB0eURhdGEpK1xuICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICB9XG4gICAgICByZXR1cm4gcm93cztcbiAgICB9LFxuICAgIHdpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2U6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtZXNzYWdlID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0ubWVzc2FnZTtcbiAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fcm93IGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21lc3NhZ2VcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbFwiPicrICh3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIG1lc3NhZ2UpKSArJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldFNlbGVjdEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICB2YXIgdGl0bGUgPSAnJztcbiAgICAgIHZhciBidXR0b25zID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXVtpXTtcbiAgICAgICAgYnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cIicrICgoZGF0YS50b0xvd2VyQ2FzZSgpID09PSB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnY3Atd2lkZ2V0LWFjdGl2ZSAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJycpICsgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyBkYXRhLnRvTG93ZXJDYXNlKCkpICsnXCIgZGF0YS1vcHRpb249XCInK2RhdGErJ1wiPicrKChsYWJlbCAhPT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgZGF0YS50b0xvd2VyQ2FzZSgpKSA6IGRhdGEpKyc8L2J1dHRvbj4nXG4gICAgICB9XG4gICAgICBpZiAobGFiZWwgPT09ICdkYXRhX3R5cGUnKSB0aXRsZSA9IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJzaG93XCIpO1xuICAgICAgaWYgKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpIHRpdGxlID0gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInByaWNlX2luXCIpO1xuICAgICAgcmV0dXJuICc8ZGl2IGRhdGEtdHlwZT1cIicrbGFiZWwrJ1wiIGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdFwiPicgK1xuICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJysgbGFiZWwgKydcIj4nK3RpdGxlKyc8L2xhYmVsPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnNcIj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiYXJyb3ctZG93biAnKyAoKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpID8gJycgOiAnY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSArJ1wiPicrICgobGFiZWwgIT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSA6IHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXSkgKyc8L3NwYW4+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fZHJvcGRvd25cIj4nICtcbiAgICAgICAgYnV0dG9ucyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGlzV29yZHByZXNzID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3M7XG4gICAgICByZXR1cm4gKGlzV29yZHByZXNzKSA/ICcnIDogJzxwIGNsYXNzPVwiY3Atd2lkZ2V0LWZvb3RlciBjcC13aWRnZXQtZm9vdGVyLS0nK2luZGV4KydcIj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcG93ZXJlZF9ieVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInBvd2VyZWRfYnlcIikgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicrIHdpZGdldEZ1bmN0aW9ucy5tYWluX2xvZ29fbGluaygpICsnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicrIHdpZGdldEZ1bmN0aW9ucy5tYWluX3BhZ2VfbGluayhpbmRleCkgKydcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAgICc8L3A+JztcbiAgICB9LFxuICAgIGdldEltYWdlOiBmdW5jdGlvbihpbmRleCwgY3VycmVuY3kpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBpbWdDb250YWluZXJzID0gZGF0YS5tYWluRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjcC13aWRnZXRfX2ltZycpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGltZ0NvbnRhaW5lciA9IGltZ0NvbnRhaW5lcnNbaV07XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIHZhciBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICAgIHZhciBuZXdJbWcgPSBuZXcgSW1hZ2U7XG4gICAgICAgIG5ld0ltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpbWcuc3JjID0gdGhpcy5zcmM7XG4gICAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgICAgfTtcbiAgICAgICAgbmV3SW1nLnNyYyA9IHdpZGdldEZ1bmN0aW9ucy5pbWdfc3JjKGRhdGEuY3VycmVuY3kpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW1nX3NyYzogZnVuY3Rpb24oaWQpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycraWQrJy9sb2dvLnBuZyc7XG4gICAgfSxcbiAgICBjb2luX2xpbms6IGZ1bmN0aW9uKGlkLCBpbmRleCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tJyArICcvY29pbi8nICsgaWQgKyB3aWRnZXRGdW5jdGlvbnMuZ2V0X3V0bV9saW5rKGluZGV4KVxuICAgIH0sXG4gICAgbWFpbl9wYWdlX2xpbms6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20nICsgd2lkZ2V0RnVuY3Rpb25zLmdldF91dG1fbGluayhpbmRleCk7XG4gICAgfSxcbiAgICBnZXRfdXRtX2xpbms6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiAnP3V0bV9zb3VyY2U9d2lkZ2V0JnV0bV9tZWRpdW09JysgKCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcykgPyAnd29yZHByZXNzJyA6ICdpbmxpbmUnKSArJyZ1dG1fY2FtcGFpZ249cmFua2luZyc7XG4gICAgfSxcbiAgICBtYWluX2xvZ29fbGluazogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB3aWRnZXREZWZhdWx0cy5pbWdfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC9pbWcvbG9nb193aWRnZXQuc3ZnJ1xuICAgIH0sXG4gICAgZ2V0U2NyaXB0RWxlbWVudDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1tYXJrZXQtd2lkZ2V0XScpO1xuICAgIH0sXG4gICAgZ2V0VHJhbnNsYXRpb246IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICB2YXIgdGV4dCA9ICh3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1t3aWRnZXRzU3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICAgIGlmICghdGV4dCAmJiB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgICAgdGV4dCA9IHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgICB9XG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5hZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbjogZnVuY3Rpb24oaW5kZXgsIGxhYmVsKXtcbiAgICAgIGlmICghd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfSxcbiAgICBnZXRUcmFuc2xhdGlvbnM6IGZ1bmN0aW9uKGxhbmcpe1xuICAgICAgaWYgKCF3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10pe1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB1cmwgPSB3aWRnZXREZWZhdWx0cy5sYW5nX3NyYyAgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nJztcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArICcvJyArIGxhbmcgKyAnLmpzb24nKTtcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgICAgZGVsZXRlIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHt9O1xuICAgICAgfVxuICAgIH0sXG4gIH07XG4gIFxuICBmdW5jdGlvbiBpbml0V2lkZ2V0cygpe1xuICAgIGlmICghd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSB0cnVlO1xuICAgICAgdmFyIG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUod2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lKSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BNYXJrZXRXaWRnZXQpe1xuICAgICAgICB2YXIgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwTWFya2V0V2lkZ2V0KTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGFzZXQpKXtcbiAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGFzZXQpO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tqXS5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgICAgICAgIHdpZGdldERlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRzU3RhdGVzID0gW107XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhciBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkod2lkZ2V0RGVmYXVsdHMpKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5pc1dvcmRwcmVzcyA9IG1haW5FbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gbWFpbkVsZW1lbnRzW2ldO1xuICAgICAgICAgIHdpZGdldHNTdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmluaXQoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbiAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0V2lkZ2V0cywgZmFsc2UpO1xuICB3aW5kb3dbd2lkZ2V0RGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9IGZ1bmN0aW9uKCl7XG4gICAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSBmYWxzZTtcbiAgICBpbml0V2lkZ2V0cygpO1xuICB9O1xufSkoKTsiXX0=
