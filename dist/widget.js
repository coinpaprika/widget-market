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
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.2',
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
      tableHeadCell.innerText = event.target.innerText;
      var parent = event.target.closest('.cp-widget-select');
      var type = parent.dataset.type;
      var pickedValueElement = parent.querySelector('.cp-widget-select__options > span');
      var value = event.target.dataset.option;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIoZnVuY3Rpb24oKXtcbiAgdmFyIHdpZGdldHNTdGF0ZXMgPSBbXTtcbiAgdmFyIHdpZGdldERlZmF1bHRzID0ge1xuICAgIG9iamVjdE5hbWU6ICdjcE1hcmtldFdpZGdldHMnLFxuICAgIGNsYXNzTmFtZTogJ2NvaW5wYXByaWthLW1hcmtldC13aWRnZXQnLFxuICAgIGNzc0ZpbGVOYW1lOiAnd2lkZ2V0Lm1pbi5jc3MnLFxuICAgIGN1cnJlbmN5X2xpc3Q6IFsnYnRjLWJpdGNvaW4nLCAnZXRoLWV0aGVyZXVtJywgJ3hycC14cnAnLCAnYmNoLWJpdGNvaW4tY2FzaCddLFxuICAgIHByaW1hcnlfY3VycmVuY3lfbGlzdDogWyAnVVNEJywgJ0JUQycsICdFVEgnIF0sXG4gICAgcHJpbWFyeV9jdXJyZW5jeTogJ1VTRCcsXG4gICAgZGF0YV90eXBlX2xpc3Q6IFsgJ1ByaWNlJywgJ1ZvbHVtZScgXSxcbiAgICBkYXRhX3R5cGU6ICdwcmljZScsXG4gICAgdmVyc2lvbjogJ3N0YW5kYXJkJyxcbiAgICB1cGRhdGVfYWN0aXZlOiBmYWxzZSxcbiAgICB1cGRhdGVfdGltZW91dDogJzMwcycsXG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgc3R5bGVfc3JjOiBudWxsLFxuICAgIGltZ19zcmM6IG51bGwsXG4gICAgbGFuZ19zcmM6IG51bGwsXG4gICAgb3JpZ2luX3NyYzogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGNvaW5wYXByaWthL3dpZGdldC1tYXJrZXRAMS4wLjInLFxuICAgIHNob3dfZGV0YWlsc19jdXJyZW5jeTogdHJ1ZSxcbiAgICBlbXB0eURhdGE6ICctJyxcbiAgICBlbXB0eVZhbHVlOiAwLFxuICAgIHRpY2tlcjoge1xuICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgc3ltYm9sOiB1bmRlZmluZWQsXG4gICAgICBwcmljZTogdW5kZWZpbmVkLFxuICAgICAgcHJpY2VfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgcmFuazogdW5kZWZpbmVkLFxuICAgICAgcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICB2b2x1bWVfMjRoOiB1bmRlZmluZWQsXG4gICAgICBtYXJrZXRfY2FwOiB1bmRlZmluZWQsXG4gICAgICBwZXJjZW50X2Zyb21fcHJpY2VfYXRoOiB1bmRlZmluZWQsXG4gICAgICB2b2x1bWVfMjRoX2NoYW5nZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldF9jYXBfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgaW50ZXJ2YWw6IG51bGwsXG4gICAgaXNXb3JkcHJlc3M6IGZhbHNlLFxuICAgIGlzRGF0YTogZmFsc2UsXG4gICAgbWVzc2FnZTogJ2RhdGFfbG9hZGluZycsXG4gICAgdHJhbnNsYXRpb25zOiB7fSxcbiAgICBtYWluRWxlbWVudDogbnVsbCxcbiAgICBub1RyYW5zbGF0aW9uTGFiZWxzOiBbXSxcbiAgfTtcbiAgdmFyIHdpZGdldEZ1bmN0aW9ucyA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBpZiAoIXdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCkpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoJ0JpbmQgZmFpbGVkLCBubyBlbGVtZW50IHdpdGggY2xhc3MgPSBcIicrIHdpZGdldERlZmF1bHRzLmNsYXNzTmFtZSArJ1wiJyk7XG4gICAgICB9XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0RGVmYXVsdHMoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldE9yaWdpbkxpbmsoaW5kZXgpO1xuICAgIH0sXG4gICAgc2V0V2lkZ2V0Q2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnRzKXtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudHNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIHZhciBzbWFsbENsYXNzTmFtZSA9IHdpZGdldERlZmF1bHRzLmNsYXNzTmFtZSArICdfX3NtYWxsJztcbiAgICAgICAgdmFyIG1lZGl1bUNsYXNzTmFtZSA9IHdpZGdldERlZmF1bHRzLmNsYXNzTmFtZSArICdfX21lZGl1bSc7XG4gICAgICAgIHZhciBoYXNTbWFsbENsYXNzID0gZWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKHNtYWxsQ2xhc3NOYW1lKTtcbiAgICAgICAgdmFyIGhhc01lZGl1bUNsYXNzID0gZWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKG1lZGl1bUNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA8PSAzMDAgJiYgIWhhc1NtYWxsQ2xhc3MpIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQoc21hbGxDbGFzc05hbWUpO1xuICAgICAgICBpZiAod2lkdGggPiAzMDAgJiYgaGFzU21hbGxDbGFzcykgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShzbWFsbENsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA8PSAzNjAgJiYgIWhhc01lZGl1bUNsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuYWRkKG1lZGl1bUNsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IDM2MCAmJiBoYXNNZWRpdW1DbGFzcykgZWxlbWVudHNbaV0uY2xhc3NMaXN0LnJlbW92ZShtZWRpdW1DbGFzc05hbWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0TWFpbkVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiB3aWRnZXRzU3RhdGVzW2luZGV4XS5tYWluRWxlbWVudDtcbiAgICB9LFxuICAgIGdldERlZmF1bHRzOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQpe1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC52ZXJzaW9uKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ZlcnNpb24nLCBtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3lMaXN0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3lfbGlzdCcsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3lMaXN0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JywgbWFpbkVsZW1lbnQuZGF0YXNldC5wcmltYXJ5Q3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZUxpc3QpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnZGF0YV90eXBlX2xpc3QnLCBKU09OLnBhcnNlKG1haW5FbGVtZW50LmRhdGFzZXQuZGF0YVR5cGVMaXN0KSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmRhdGFUeXBlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2RhdGFfdHlwZScsIG1haW5FbGVtZW50LmRhdGFzZXQuZGF0YVR5cGUpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeUxpc3QpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3lfbGlzdCcsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0Jywgd2lkZ2V0RnVuY3Rpb25zLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmdfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0T3JpZ2luTGluazogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKHdpZGdldERlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zdHlsZXNoZWV0KCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmluaXRJbnRlcnZhbChpbmRleCk7XG4gICAgICB9LCAxMDApO1xuICAgIH0sXG4gICAgYWRkV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciB3aWRnZXRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgICAgbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gd2lkZ2V0RWxlbWVudDtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0RGF0YShpbmRleCk7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RMaXN0ZW5lcnM6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICB2YXIgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBidXR0b25zID0gc2VsZWN0RWxlbWVudHNbaV0ucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgYnV0dG9uJyk7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgYnV0dG9uc1tqXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KTtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNldFNlbGVjdE9wdGlvbjogZnVuY3Rpb24oZXZlbnQsIGluZGV4KXtcbiAgICAgIHZhciBjbGFzc05hbWUgPSAnY3Atd2lkZ2V0LWFjdGl2ZSc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgc2libGluZyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICB2YXIgdGFibGVIZWFkQ2VsbCA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtdGFibGVfX2hlYWQgLmNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZScpO1xuICAgICAgdGFibGVIZWFkQ2VsbC5pbm5lclRleHQgPSBldmVudC50YXJnZXQuaW5uZXJUZXh0O1xuICAgICAgdmFyIHBhcmVudCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgICAgdmFyIHR5cGUgPSBwYXJlbnQuZGF0YXNldC50eXBlO1xuICAgICAgdmFyIHBpY2tlZFZhbHVlRWxlbWVudCA9IHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyA+IHNwYW4nKTtcbiAgICAgIHZhciB2YWx1ZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0Lm9wdGlvbjtcbiAgICAgIHBpY2tlZFZhbHVlRWxlbWVudC5pbm5lclRleHQgPSAoKHR5cGUgIT09ICdwcmltYXJ5X2N1cnJlbmN5JylcbiAgICAgICAgPyB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHZhbHVlLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgIDogdmFsdWUpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsIHR5cGUsIHZhbHVlKTtcbiAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSxcbiAgICBpbml0SW50ZXJ2YWw6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGNsZWFySW50ZXJ2YWwod2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwpO1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLnVwZGF0ZV9hY3RpdmUgJiYgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQgPiAxMDAwKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0uaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICAgICAgfSwgd2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX3RpbWVvdXQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgdmFyIGN1cnJlbmN5X2xpc3QgPSBKU09OLnN0cmluZ2lmeSh3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeV9saXN0KS5yZXBsYWNlKCdbJywgJycpLnJlcGxhY2UoJ10nLCAnJykuc3BsaXQoJ1wiJykuam9pbignJyk7XG4gICAgICB4aHIub3BlbignR0VUJywgJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXRfbGlzdC8nK2N1cnJlbmN5X2xpc3QpO1xuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGlmICghd2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNEYXRhKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2lzRGF0YScsIHRydWUpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3lfbGlzdC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlVGlja2VyKGluZGV4LCBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KVt3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeV9saXN0W2ldXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdChpbmRleCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdChpbmRleCwgdGhpcyk7XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoKTtcbiAgICB9LFxuICAgIG9uRXJyb3JSZXF1ZXN0OiBmdW5jdGlvbihpbmRleCwgeGhyKXtcbiAgICAgIGlmICh3aWRnZXRzU3RhdGVzW2luZGV4XS5pc0RhdGEpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgZmFsc2UpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHdpZGdldHNTdGF0ZXNbaW5kZXhdKTtcbiAgICB9LFxuICAgIHNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpe1xuICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH1cbiAgICAgIHZhciBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICBpZiAoZm9vdGVyRWxlbWVudCl7XG4gICAgICAgIHZhciB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhbHVlIC09IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlc1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSAnLmNwLXdpZGdldF9fZm9vdGVyLS0nK2luZGV4Kyc6OmJlZm9yZXt3aWR0aDonK3ZhbHVlLnRvRml4ZWQoMCkrJ3B4O30nO1xuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVdpZGdldEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4LCBrZXksIHZhbHVlLCBjdXJyZW5jeSl7XG4gICAgICB2YXIgc3RhdGUgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpe1xuICAgICAgICB2YXIgdGlja2VyQ2xhc3MgPSAoY3VycmVuY3kpID8gJ1RpY2tlcicrY3VycmVuY3kudG9VcHBlckNhc2UoKSA6ICcnO1xuICAgICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKXtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnY3VycmVuY3knKXtcbiAgICAgICAgICAgIHZhciBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LWZvb3RlciA+IGEnKTtcbiAgICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB3aWRnZXRGdW5jdGlvbnMuY29pbl9saW5rKHZhbHVlLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRJbWFnZShpbmRleCwgY3VycmVuY3kpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09ICdpc0RhdGEnIHx8IGtleSA9PT0gJ21lc3NhZ2UnIHx8IGtleSA9PT0gJ2RhdGFfdHlwZScgfHwga2V5ID09PSAncHJpbWFyeV9jdXJyZW5jeScpe1xuICAgICAgICAgIHZhciBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtdGFibGVfX2JvZHknKTtcbiAgICAgICAgICBmb3IodmFyIGwgPSAwOyBsIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2xdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnRNZXNzYWdlKGluZGV4KSA6IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicra2V5K3RpY2tlckNsYXNzKTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpe1xuICAgICAgICAgICAgICB2YWx1ZSA9IHdpZGdldEZ1bmN0aW9ucy5wYXJzZU51bWJlcih2YWx1ZSwgdHJ1ZSkgfHwgc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSl7XG4gICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlID0gc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgPyBzdGF0ZS5lbXB0eURhdGEgOiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQodmFsdWUsIDIpKyclJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtdmFsdWUnKSAmJiBzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpe1xuICAgICAgICAgICAgICB2YWx1ZSArPSAnICcgKyBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVUaWNrZXI6IGZ1bmN0aW9uKGluZGV4LCBkYXRhKXtcbiAgICAgIHZhciBxdW90ZUtleXMgPSBPYmplY3Qua2V5cyhkYXRhLnF1b3RlKTtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgZGVsZXRlIHRlbXBsYXRlLnF1b3RlO1xuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHF1b3RlS2V5cy5sZW5ndGg7IGorKyl7XG4gICAgICAgIHZhciBxdW90ZURhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEucXVvdGVbcXVvdGVLZXlzW2pdXSkpO1xuICAgICAgICBxdW90ZURhdGEgPSBPYmplY3QuYXNzaWduKHF1b3RlRGF0YSwgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZSkpKTtcbiAgICAgICAgcXVvdGVEYXRhLmlkID0gZGF0YS5pZCArICctJyArIHF1b3RlS2V5c1tqXTtcbiAgICAgICAgcXVvdGVEYXRhLmN1cnJlbmN5X2lkID0gZGF0YS5pZDtcbiAgICAgICAgcXVvdGVEYXRhLnF1b3RlX2lkID0gcXVvdGVLZXlzW2pdO1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbcXVvdGVEYXRhLmlkXSA9IHF1b3RlRGF0YTtcbiAgICAgICAgdmFyIGRhdGFLZXlzID0gT2JqZWN0LmtleXMocXVvdGVEYXRhKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhS2V5cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgaWYgKHF1b3RlRGF0YS5xdW90ZV9pZCA9PT0gd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeS50b0xvd2VyQ2FzZSgpKXdpZGdldEZ1bmN0aW9ucy51cGRhdGVXaWRnZXRFbGVtZW50KGluZGV4LCBkYXRhS2V5c1tpXSwgcXVvdGVEYXRhW2RhdGFLZXlzW2ldXSwgcXVvdGVEYXRhLmN1cnJlbmN5X2lkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlRGF0YTogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIGN1cnJlbmN5KXtcbiAgICAgIGlmIChjdXJyZW5jeSl7XG4gICAgICAgIGlmICghd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XSkgd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XSA9IHt9O1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldW2tleV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXkgPT09ICdsYW5ndWFnZScpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHZhciBjdXJyZW5jeV9pZCA9ICh3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldKSA/IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0uY3VycmVuY3lfaWQgOiB1bmRlZmluZWQ7XG4gICAgICBpZiAoKGN1cnJlbmN5X2lkICYmIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0ucXVvdGVfaWQgPT09IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKSkgfHwgIWN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgY3VycmVuY3lfaWQpO1xuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zOiBmdW5jdGlvbihsYW5nLCBkYXRhKXtcbiAgICAgIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IGRhdGE7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZGdldHNTdGF0ZXMubGVuZ3RoOyB4Kyspe1xuICAgICAgICB2YXIgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKXtcbiAgICAgICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRzU3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICAgIHZhciB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRyYW5zYWx0ZUVsZW1lbnRzLmxlbmd0aDsgeSsrKXtcbiAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGNsYXNzTmFtZSl7XG4gICAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKXtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHdpZGdldHNTdGF0ZXNbeF0ubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxJbmRleCA9IHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpe1xuICAgICAgICAgICAgICAgICAgd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSl7XG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHdpZGdldEZ1bmN0aW9ucy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIuYmluZChudWxsLCB4KSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHBhcnNlSW50ZXJ2YWxWYWx1ZTogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgdmFyIHRpbWVTeW1ib2wgPSAnJywgbXVsdGlwbGllciA9IDE7XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdzJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAncyc7XG4gICAgICAgIG11bHRpcGxpZXIgPSAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnbScpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ20nO1xuICAgICAgICBtdWx0aXBsaWVyID0gNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnaCcpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ2gnO1xuICAgICAgICBtdWx0aXBsaWVyID0gNjAgKiA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdkJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnZCc7XG4gICAgICAgIG11bHRpcGxpZXIgPSAyNCAqIDYwICogNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUucmVwbGFjZSh0aW1lU3ltYm9sLCcnKSkgKiBtdWx0aXBsaWVyO1xuICAgIH0sXG4gICAgcGFyc2VOdW1iZXI6IGZ1bmN0aW9uKG51bWJlciwgbG9uZ1Jlc3VsdCl7XG4gICAgICBpZiAoIW51bWJlciAmJiBudW1iZXIgIT09IDApIHJldHVybiBudW1iZXI7XG4gICAgICBpZiAobnVtYmVyID09PSB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5VmFsdWUgfHwgbnVtYmVyID09PSB3aWRnZXRzU3RhdGVzWzBdLmVtcHR5RGF0YSkgcmV0dXJuIG51bWJlcjtcbiAgICAgIG51bWJlciA9IHBhcnNlRmxvYXQobnVtYmVyKTtcbiAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAgJiYgIWxvbmdSZXN1bHQpe1xuICAgICAgICB2YXIgbnVtYmVyU3RyID0gbnVtYmVyLnRvRml4ZWQoMCk7XG4gICAgICAgIHZhciBwYXJhbWV0ZXIgPSAnSycsXG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICAgIGlmIChudW1iZXIgPiAxMDAwMDAwMDAwKXtcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA3KTtcbiAgICAgICAgICBwYXJhbWV0ZXIgPSAnQic7XG4gICAgICAgIH0gZWxzZSBpZiAobnVtYmVyID4gMTAwMDAwMCl7XG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNCk7XG4gICAgICAgICAgcGFyYW1ldGVyID0gJ00nO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuYXR1cmFsID0gc3BsaWNlZC5zbGljZSgwLCBzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgICB2YXIgZGVjaW1hbCA9IHNwbGljZWQuc2xpY2Uoc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgICAgcmV0dXJuIG5hdHVyYWwgKyAnLicgKyBkZWNpbWFsICsgJyAnICsgcGFyYW1ldGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGlzRGVjaW1hbCA9IChudW1iZXIgJSAxKSA+IDA7XG4gICAgICAgIGlmIChpc0RlY2ltYWwpe1xuICAgICAgICAgIHZhciBwcmVjaXNpb24gPSAyO1xuICAgICAgICAgIGlmIChudW1iZXIgPCAxKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDg7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMCl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA2O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTAwMCl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA0O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KG51bWJlciwgcHJlY2lzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChudW1iZXIpLnRvTG9jYWxlU3RyaW5nKCdydS1SVScsIHsgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAyIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByb3VuZEFtb3VudDogZnVuY3Rpb24oYW1vdW50LCBkZWNpbWFsLCBkaXJlY3Rpb24pe1xuICAgICAgYW1vdW50ID0gcGFyc2VGbG9hdChhbW91bnQpO1xuICAgICAgaWYgKCFkZWNpbWFsKSBkZWNpbWFsID0gODtcbiAgICAgIGlmICghZGlyZWN0aW9uKSBkaXJlY3Rpb24gPSAncm91bmQnO1xuICAgICAgZGVjaW1hbCA9IE1hdGgucG93KDEwLCBkZWNpbWFsKTtcbiAgICAgIHJldHVybiBNYXRoW2RpcmVjdGlvbl0oYW1vdW50ICogZGVjaW1hbCkgLyBkZWNpbWFsO1xuICAgIH0sXG4gICAgc3R5bGVzaGVldDogZnVuY3Rpb24oKXtcbiAgICAgIGlmICh3aWRnZXREZWZhdWx0cy5zdHlsZV9zcmMgIT09IGZhbHNlKXtcbiAgICAgICAgdmFyIHVybCA9IHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsnL2Rpc3QvJyt3aWRnZXREZWZhdWx0cy5jc3NGaWxlTmFtZTtcbiAgICAgICAgdmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdyZWwnLCAnc3R5bGVzaGVldCcpO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgnaHJlZicsIHVybCk7XG4gICAgICAgIHJldHVybiAoZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWY9XCInK3VybCsnXCJdJykpID8gJycgOiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgfVxuICAgIH0sXG4gICAgd2lkZ2V0TWFpbkVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0SGVhZGVyRWxlbWVudChpbmRleCkgKyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0VGFibGVFbGVtZW50KGluZGV4KTtcbiAgICB9LFxuICAgIHdpZGdldEhlYWRlckVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciB0aXRsZSA9ICh3aWRnZXRzU3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcylcbiAgICAgICAgPyAnJ1xuICAgICAgICA6ICc8aDEgY2xhc3M9XCJjcC13aWRnZXQtdGl0bGUgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdGl0bGVcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJ0aXRsZVwiKSsnPC9oMT4nO1xuICAgICAgcmV0dXJuIHRpdGxlICtcbiAgICAgICAgJzxzZWN0aW9uIGNsYXNzPVwiY3Atd2lkZ2V0LWhlYWRlclwiPicgK1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScpICtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0U2VsZWN0RWxlbWVudChpbmRleCwgJ2RhdGFfdHlwZScpICtcbiAgICAgICAgJzwvc2VjdGlvbj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0VGFibGVFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgcmV0dXJuICc8c2VjdGlvbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZVwiPicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19oZWFkXCI+JyArXG4gICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fcm93XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbCBjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWUgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fdGl0bGVcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJuYW1lXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbCBjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGFcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtdmFsdWUgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcHJpY2VcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwcmljZVwiKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS1jaGFuZ2UgY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fY2hhbmdlXCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwiY2hhbmdlXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19ib2R5XCI+JyArXG4gICAgICAgICAgICAgICAgICAoKGRhdGEuaXNEYXRhKVxuICAgICAgICAgICAgICAgICAgICA/IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnREYXRhKGluZGV4KVxuICAgICAgICAgICAgICAgICAgICA6IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnRNZXNzYWdlKGluZGV4KSkgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAnPC9zZWN0aW9uPic7XG4gICAgfSxcbiAgICB3aWRnZXRUYWJsZUVsZW1lbnREYXRhOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXRzU3RhdGVzW2luZGV4XVsnY3VycmVuY3lfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGN1cnJlbmN5ID0gd2lkZ2V0c1N0YXRlc1tpbmRleF1bJ2N1cnJlbmN5X2xpc3QnXVtpXTtcbiAgICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3krJy0nK3dpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIHZhciBkYXRhVHlwZSA9ICh3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3ZvbHVtZScpXG4gICAgICAgICAgPyB3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKSArICdfMjRoJ1xuICAgICAgICAgIDogd2lkZ2V0c1N0YXRlc1tpbmRleF0uZGF0YV90eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJvd3MgKz0gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX3Jvd1wiPicrXG4gICAgICAgICAgICAgICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicrIHdpZGdldEZ1bmN0aW9ucy5jb2luX2xpbmsoY3VycmVuY3ksIGluZGV4KSArJ1wiPjwvYT4nICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbCBjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nKyBjdXJyZW5jeSArJy9sb2dvLnBuZ1wiIGFsdD1cIlwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1uYW1lX190ZXh0LWJveC0tbmFtZSBuYW1lVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nKygoZGF0YSkgPyBkYXRhLm5hbWUgOiBcIk5vIGRhdGFcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94LS1zeW1ib2wgc3ltYm9sVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nKygoZGF0YSkgPyBkYXRhLnN5bWJvbCA6IFwiXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YVwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLXZhbHVlIHBhcnNlTnVtYmVyICcrZGF0YVR5cGUrJ1RpY2tlcicrY3VycmVuY3kudG9VcHBlckNhc2UoKSsnXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKChkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gd2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKGRhdGFbZGF0YVR5cGVdLCB0cnVlKSArICcgJyArICgod2lkZ2V0c1N0YXRlc1tpbmRleF0uc2hvd19kZXRhaWxzX2N1cnJlbmN5KSA/IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kudG9VcHBlckNhc2UoKSA6ICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RGVmYXVsdHMuZW1wdHlEYXRhKSArXG4gICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtY2hhbmdlIGNwLXdpZGdldF9fcmFuaycrICgoZGF0YSAmJiBkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddID4gMCkgPyAnIGNwLXdpZGdldF9fcmFuay11cCcgOiAoZGF0YSAmJiBkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddIDwgMCkgPyAnIGNwLXdpZGdldF9fcmFuay1kb3duJyA6ICcgY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKSArJyAnK2RhdGFUeXBlKydfY2hhbmdlXzI0aFRpY2tlcicrY3VycmVuY3kudG9VcHBlckNhc2UoKSsnXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKChkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKCFkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddICYmIGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gIT09IDApID8gd2lkZ2V0RGVmYXVsdHMuZW1wdHlEYXRhIDogd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10sIDIpKyclJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RGVmYXVsdHMuZW1wdHlEYXRhKStcbiAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfSxcbiAgICB3aWRnZXRUYWJsZUVsZW1lbnRNZXNzYWdlOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWVzc2FnZSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX3JvdyBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGxcIj4nKyAod2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBtZXNzYWdlKSkgKyc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRTZWxlY3RFbGVtZW50OiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgdmFyIHRpdGxlID0gJyc7XG4gICAgICB2YXIgYnV0dG9ucyA9ICcnO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J11baV07XG4gICAgICAgIGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCInKyAoKGRhdGEudG9Mb3dlckNhc2UoKSA9PT0gd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2NwLXdpZGdldC1hY3RpdmUgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnKSArICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnJyA6ICdjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgZGF0YS50b0xvd2VyQ2FzZSgpKSArJ1wiIGRhdGEtb3B0aW9uPVwiJytkYXRhKydcIj4nKygobGFiZWwgIT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGRhdGEudG9Mb3dlckNhc2UoKSkgOiBkYXRhKSsnPC9idXR0b24+J1xuICAgICAgfVxuICAgICAgaWYgKGxhYmVsID09PSAnZGF0YV90eXBlJykgdGl0bGUgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwic2hvd1wiKTtcbiAgICAgIGlmIChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSB0aXRsZSA9IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwcmljZV9pblwiKTtcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLXR5cGU9XCInK2xhYmVsKydcIiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RcIj4nICtcbiAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycrIGxhYmVsICsnXCI+Jyt0aXRsZSsnPC9sYWJlbD4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19vcHRpb25zXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImFycm93LWRvd24gJysgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgKydcIj4nKyAoKGxhYmVsICE9PSAncHJpbWFyeV9jdXJyZW5jeScpID8gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgOiB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0pICsnPC9zcGFuPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX2Ryb3Bkb3duXCI+JyArXG4gICAgICAgIGJ1dHRvbnMgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRGb290ZXI6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBpc1dvcmRwcmVzcyA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzO1xuICAgICAgcmV0dXJuIChpc1dvcmRwcmVzcykgPyAnJyA6ICc8cCBjbGFzcz1cImNwLXdpZGdldC1mb290ZXIgY3Atd2lkZ2V0LWZvb3Rlci0tJytpbmRleCsnXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3Bvd2VyZWRfYnlcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwb3dlcmVkX2J5XCIpICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8aW1nIHN0eWxlPVwid2lkdGg6IDE2cHhcIiBzcmM9XCInKyB3aWRnZXRGdW5jdGlvbnMubWFpbl9sb2dvX2xpbmsoKSArJ1wiIGFsdD1cIlwiLz4nICtcbiAgICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInKyB3aWRnZXRGdW5jdGlvbnMubWFpbl9wYWdlX2xpbmsoaW5kZXgpICsnXCI+Y29pbnBhcHJpa2EuY29tPC9hPicgK1xuICAgICAgICAnPC9wPic7XG4gICAgfSxcbiAgICBnZXRJbWFnZTogZnVuY3Rpb24oaW5kZXgsIGN1cnJlbmN5KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICB2YXIgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgICB2YXIgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgICB2YXIgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgICBuZXdJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaW1nLnNyYyA9IHRoaXMuc3JjO1xuICAgICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIH07XG4gICAgICAgIG5ld0ltZy5zcmMgPSB3aWRnZXRGdW5jdGlvbnMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGltZ19zcmM6IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nK2lkKycvbG9nby5wbmcnO1xuICAgIH0sXG4gICAgY29pbl9saW5rOiBmdW5jdGlvbihpZCwgaW5kZXgpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbScgKyAnL2NvaW4vJyArIGlkICsgd2lkZ2V0RnVuY3Rpb25zLmdldF91dG1fbGluayhpbmRleClcbiAgICB9LFxuICAgIG1haW5fcGFnZV9saW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tJyArIHdpZGdldEZ1bmN0aW9ucy5nZXRfdXRtX2xpbmsoaW5kZXgpO1xuICAgIH0sXG4gICAgZ2V0X3V0bV9saW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJz91dG1fc291cmNlPXdpZGdldCZ1dG1fbWVkaXVtPScrICgod2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpID8gJ3dvcmRwcmVzcycgOiAnaW5saW5lJykgKycmdXRtX2NhbXBhaWduPXJhbmtpbmcnO1xuICAgIH0sXG4gICAgbWFpbl9sb2dvX2xpbms6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gd2lkZ2V0RGVmYXVsdHMuaW1nX3NyYyB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgICB9LFxuICAgIGdldFNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtbWFya2V0LXdpZGdldF0nKTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9uOiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgdmFyIHRleHQgPSAod2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW3dpZGdldHNTdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXSkgPyB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXSA6IG51bGw7XG4gICAgICBpZiAoIXRleHQgJiYgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB7XG4gICAgICAgIHRleHQgPSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ11bbGFiZWxdO1xuICAgICAgfVxuICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb246IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICBpZiAoIXdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgIHJldHVybiB3aWRnZXRzU3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH0sXG4gICAgZ2V0VHJhbnNsYXRpb25zOiBmdW5jdGlvbihsYW5nKXtcbiAgICAgIGlmICghd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKXtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMubGFuZ19zcmMgIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvbGFuZyc7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnLycgKyBsYW5nICsgJy5qc29uJyk7XG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICBkZWxldGUgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9O1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuICBcbiAgZnVuY3Rpb24gaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0KXtcbiAgICAgIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIHZhciBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHdpZGdldERlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwTWFya2V0V2lkZ2V0KXtcbiAgICAgICAgdmFyIGRhdGFzZXQgPSBKU09OLnBhcnNlKHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcE1hcmtldFdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB3aWRnZXREZWZhdWx0c1trZXldID0gZGF0YXNldFtrZXlzW2pdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YXIgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHdpZGdldERlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBtYWluRWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd3b3JkcHJlc3MnKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5tYWluRWxlbWVudCA9IG1haW5FbGVtZW50c1tpXTtcbiAgICAgICAgICB3aWRnZXRzU3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0KGkpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICB9XG4gIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXSA9IHt9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdFdpZGdldHMsIGZhbHNlKTtcbiAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmJpbmRXaWRnZXQgPSBmdW5jdGlvbigpe1xuICAgIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgaW5pdFdpZGdldHMoKTtcbiAgfTtcbn0pKCk7Il19
