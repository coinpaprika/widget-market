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
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.0',
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
        if (mainElement.dataset.currency_list) widgetFunctions.updateData(index, 'currency_list', JSON.parse(mainElement.dataset.currencyList));
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
      var parent = event.target.closest('.cp-widget-select');
      var type = parent.dataset.type;
      var pickedValueElement = parent.querySelector('.cp-widget-select__options > span');
      var value = event.target.dataset.option;
      pickedValueElement.innerText = ((type !== 'primary_currency') ? widgetFunctions.getTranslation(index, value.toLowerCase()) : value);
      widgetFunctions.updateData(index, type, value);
      if (type === 'primary_currency') widgetFunctions.getData(index);
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
      var xhr = {};
      for (var i = 0; i < widgetsStates[index].currency_list.length; i++){
        xhr[i] = new XMLHttpRequest();
        xhr[i].open('GET', 'https://api.coinpaprika.com/v1/widget/'+widgetsStates[index].currency_list[i]+'?quote='+widgetsStates[index].primary_currency);
        xhr[i].onload = function() {
          if (this.status === 200) {
            if (!widgetsStates[index].isData) widgetFunctions.updateData(index, 'isData', true);
            widgetFunctions.updateTicker(index, JSON.parse(this.responseText));
          } else {
            widgetFunctions.onErrorRequest(index, this);
          }
        };
        xhr[i].onerror = function(){
          widgetFunctions.onErrorRequest(index, this);
        };
        xhr[i].send();
      }
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
        if (key === 'isData' || key === 'message' || key === 'data_type'){
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
      widgetFunctions.updateWidgetElement(index, key, value, currency);
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
    updateTicker: function(index, data){
      var dataKeys = Object.keys(data);
      for (var i = 0; i < dataKeys.length; i++){
        widgetFunctions.updateData(index, dataKeys[i], data[dataKeys[i]], data.id);
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
      return '<h1 class="cp-widget-title cp-translation translation_title">'+widgetFunctions.getTranslation(index, "title")+'</h1>' +
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
        var data = widgetsStates[index].ticker[currency];
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
      return 'https://coinpaprika.com/coin/'+ id + '/' + widgetFunctions.get_utm_link(index)
    },
    main_page_link: function(index){
      return 'https://coinpaprika.com/' + widgetFunctions.get_utm_link(index);
    },
    get_utm_link: function(index){
      return 'utm_source=widget&utm_medium='+ ((widgetsStates[index].isWordpress) ? 'wordpress' : 'inline') +'&utm_campaign=ranking';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpe1xuICB2YXIgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICB2YXIgd2lkZ2V0RGVmYXVsdHMgPSB7XG4gICAgb2JqZWN0TmFtZTogJ2NwTWFya2V0V2lkZ2V0cycsXG4gICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtbWFya2V0LXdpZGdldCcsXG4gICAgY3NzRmlsZU5hbWU6ICd3aWRnZXQubWluLmNzcycsXG4gICAgY3VycmVuY3lfbGlzdDogWydidGMtYml0Y29pbicsICdldGgtZXRoZXJldW0nLCAneHJwLXhycCcsICdiY2gtYml0Y29pbi1jYXNoJ10sXG4gICAgcHJpbWFyeV9jdXJyZW5jeV9saXN0OiBbICdVU0QnLCAnQlRDJywgJ0VUSCcgXSxcbiAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICBkYXRhX3R5cGVfbGlzdDogWyAnUHJpY2UnLCAnVm9sdW1lJyBdLFxuICAgIGRhdGFfdHlwZTogJ3ByaWNlJyxcbiAgICB2ZXJzaW9uOiAnc3RhbmRhcmQnLFxuICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgaW1nX3NyYzogbnVsbCxcbiAgICBsYW5nX3NyYzogbnVsbCxcbiAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AY29pbnBhcHJpa2Evd2lkZ2V0LW1hcmtldEAxLjAuMCcsXG4gICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiB0cnVlLFxuICAgIGVtcHR5RGF0YTogJy0nLFxuICAgIGVtcHR5VmFsdWU6IDAsXG4gICAgdGlja2VyOiB7XG4gICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBpbnRlcnZhbDogbnVsbCxcbiAgICBpc1dvcmRwcmVzczogZmFsc2UsXG4gICAgaXNEYXRhOiBmYWxzZSxcbiAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICB9O1xuICB2YXIgd2lkZ2V0RnVuY3Rpb25zID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGlmICghd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJysgd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsnXCInKTtcbiAgICAgIH1cbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSxcbiAgICBzZXRXaWRnZXRDbGFzczogZnVuY3Rpb24oZWxlbWVudHMpe1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgdmFyIHNtYWxsQ2xhc3NOYW1lID0gd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fc21hbGwnO1xuICAgICAgICB2YXIgbWVkaXVtQ2xhc3NOYW1lID0gd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fbWVkaXVtJztcbiAgICAgICAgdmFyIGhhc1NtYWxsQ2xhc3MgPSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoc21hbGxDbGFzc05hbWUpO1xuICAgICAgICB2YXIgaGFzTWVkaXVtQ2xhc3MgPSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDMwMCAmJiAhaGFzU21hbGxDbGFzcykgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChzbWFsbENsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IDMwMCAmJiBoYXNTbWFsbENsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKHNtYWxsQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDM2MCAmJiAhaGFzTWVkaXVtQ2xhc3MpIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gMzYwICYmIGhhc01lZGl1bUNsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKG1lZGl1bUNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50O1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdHM6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldCl7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndmVyc2lvbicsIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbik7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeUxpc3QpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeV9saXN0JywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmRhdGFUeXBlTGlzdCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdkYXRhX3R5cGVfbGlzdCcsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuZGF0YVR5cGUpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnZGF0YV90eXBlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5X2xpc3QpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3lfbGlzdCcsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5KTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc2hvd0RldGFpbHNDdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdzaG93X2RldGFpbHNfY3VycmVuY3knLCAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5ID09PSAndHJ1ZScpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlQWN0aXZlKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV9hY3RpdmUnLCAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVUaW1lb3V0KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3VwZGF0ZV90aW1lb3V0Jywgd2lkZ2V0RnVuY3Rpb25zLnBhcnNlSW50ZXJ2YWxWYWx1ZShtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ3VhZ2UnLCBtYWluRWxlbWVudC5kYXRhc2V0Lmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ29yaWdpbl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm9yaWdpblNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ25vZGVfbW9kdWxlc19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0Lm5vZGVNb2R1bGVzU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuYm93ZXJTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnYm93ZXJfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnN0eWxlU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3N0eWxlX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xhbmdfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5sYW5nU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuaW1nU3JjKSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ2xvZ29fc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0T3JpZ2luTGluazogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgaWYgKE9iamVjdC5rZXlzKHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9ucykubGVuZ3RoID09PSAwKSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKHdpZGdldERlZmF1bHRzLmxhbmd1YWdlKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zdHlsZXNoZWV0KCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5hZGRXaWRnZXRFbGVtZW50KGluZGV4KTtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmluaXRJbnRlcnZhbChpbmRleCk7XG4gICAgICB9LCAxMDApO1xuICAgIH0sXG4gICAgYWRkV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciB3aWRnZXRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLndpZGdldE1haW5FbGVtZW50KGluZGV4KSArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRGb290ZXIoaW5kZXgpO1xuICAgICAgbWFpbkVsZW1lbnQuaW5uZXJIVE1MID0gd2lkZ2V0RWxlbWVudDtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRTZWxlY3RMaXN0ZW5lcnMoaW5kZXgpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcihpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0RGF0YShpbmRleCk7XG4gICAgfSxcbiAgICBzZXRTZWxlY3RMaXN0ZW5lcnM6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICB2YXIgc2VsZWN0RWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdCcpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3RFbGVtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBidXR0b25zID0gc2VsZWN0RWxlbWVudHNbaV0ucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgYnV0dG9uJyk7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYnV0dG9ucy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgYnV0dG9uc1tqXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5zZXRTZWxlY3RPcHRpb24oZXZlbnQsIGluZGV4KTtcbiAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHNldFNlbGVjdE9wdGlvbjogZnVuY3Rpb24oZXZlbnQsIGluZGV4KXtcbiAgICAgIHZhciBjbGFzc05hbWUgPSAnY3Atd2lkZ2V0LWFjdGl2ZSc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgc2libGluZyA9IGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLmNoaWxkTm9kZXNbaV07XG4gICAgICAgIGlmIChzaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSBzaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgIH1cbiAgICAgIHZhciBwYXJlbnQgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnLmNwLXdpZGdldC1zZWxlY3QnKTtcbiAgICAgIHZhciB0eXBlID0gcGFyZW50LmRhdGFzZXQudHlwZTtcbiAgICAgIHZhciBwaWNrZWRWYWx1ZUVsZW1lbnQgPSBwYXJlbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnMgPiBzcGFuJyk7XG4gICAgICB2YXIgdmFsdWUgPSBldmVudC50YXJnZXQuZGF0YXNldC5vcHRpb247XG4gICAgICBwaWNrZWRWYWx1ZUVsZW1lbnQuaW5uZXJUZXh0ID0gKCh0eXBlICE9PSAncHJpbWFyeV9jdXJyZW5jeScpID8gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCB2YWx1ZS50b0xvd2VyQ2FzZSgpKSA6IHZhbHVlKTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCB0eXBlLCB2YWx1ZSk7XG4gICAgICBpZiAodHlwZSA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSB3aWRnZXRGdW5jdGlvbnMuZ2V0RGF0YShpbmRleCk7XG4gICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0sXG4gICAgaW5pdEludGVydmFsOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBjbGVhckludGVydmFsKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmludGVydmFsKTtcbiAgICAgIGlmICh3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfYWN0aXZlICYmIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnVwZGF0ZV90aW1lb3V0ID4gMTAwMCl7XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0RGF0YShpbmRleCk7XG4gICAgICAgIH0sIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnVwZGF0ZV90aW1lb3V0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciB4aHIgPSB7fTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3lfbGlzdC5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHhocltpXSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHJbaV0ub3BlbignR0VUJywgJ2h0dHBzOi8vYXBpLmNvaW5wYXByaWthLmNvbS92MS93aWRnZXQvJyt3aWRnZXRzU3RhdGVzW2luZGV4XS5jdXJyZW5jeV9saXN0W2ldKyc/cXVvdGU9Jyt3aWRnZXRzU3RhdGVzW2luZGV4XS5wcmltYXJ5X2N1cnJlbmN5KTtcbiAgICAgICAgeGhyW2ldLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBpZiAoIXdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCB0cnVlKTtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVUaWNrZXIoaW5kZXgsIEpTT04ucGFyc2UodGhpcy5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhocltpXS5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoaW5kZXgsIHRoaXMpO1xuICAgICAgICB9O1xuICAgICAgICB4aHJbaV0uc2VuZCgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgb25FcnJvclJlcXVlc3Q6IGZ1bmN0aW9uKGluZGV4LCB4aHIpe1xuICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzRGF0YSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdpc0RhdGEnLCBmYWxzZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ21lc3NhZ2UnLCAnZGF0YV91bmF2YWlsYWJsZScpO1xuICAgICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBmYWlsZWQuICBSZXR1cm5lZCBzdGF0dXMgb2YgJyArIHhociwgd2lkZ2V0c1N0YXRlc1tpbmRleF0pO1xuICAgIH0sXG4gICAgc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgaWYgKG1haW5FbGVtZW50LmNoaWxkcmVuWzBdLmxvY2FsTmFtZSA9PT0gJ3N0eWxlJyl7XG4gICAgICAgIG1haW5FbGVtZW50LnJlbW92ZUNoaWxkKG1haW5FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgICAgfVxuICAgICAgdmFyIGZvb3RlckVsZW1lbnQgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY3Atd2lkZ2V0X19mb290ZXInKTtcbiAgICAgIGlmIChmb290ZXJFbGVtZW50KXtcbiAgICAgICAgdmFyIHZhbHVlID0gZm9vdGVyRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAtIDQzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgdmFsdWUgLT0gZm9vdGVyRWxlbWVudC5jaGlsZE5vZGVzW2ldLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9ICcuY3Atd2lkZ2V0X19mb290ZXItLScraW5kZXgrJzo6YmVmb3Jle3dpZHRoOicrdmFsdWUudG9GaXhlZCgwKSsncHg7fSc7XG4gICAgICAgIG1haW5FbGVtZW50Lmluc2VydEJlZm9yZShzdHlsZSwgbWFpbkVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0RWxlbWVudDogZnVuY3Rpb24oaW5kZXgsIGtleSwgdmFsdWUsIGN1cnJlbmN5KXtcbiAgICAgIHZhciBzdGF0ZSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdO1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudCl7XG4gICAgICAgIHZhciB0aWNrZXJDbGFzcyA9IChjdXJyZW5jeSkgPyAnVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpIDogJyc7XG4gICAgICAgIGlmIChrZXkgPT09ICduYW1lJyB8fCBrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgIGlmIChrZXkgPT09ICdjdXJyZW5jeScpe1xuICAgICAgICAgICAgdmFyIGFFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtZm9vdGVyID4gYScpO1xuICAgICAgICAgICAgZm9yKHZhciBrID0gMDsgayA8IGFFbGVtZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICBhRWxlbWVudHNba10uaHJlZiA9IHdpZGdldEZ1bmN0aW9ucy5jb2luX2xpbmsodmFsdWUsIGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldEltYWdlKGluZGV4LCBjdXJyZW5jeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gJ2lzRGF0YScgfHwga2V5ID09PSAnbWVzc2FnZScgfHwga2V5ID09PSAnZGF0YV90eXBlJyl7XG4gICAgICAgICAgdmFyIGhlYWRlckVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNwLXdpZGdldC10YWJsZV9fYm9keScpO1xuICAgICAgICAgIGZvcih2YXIgbCA9IDA7IGwgPCBoZWFkZXJFbGVtZW50cy5sZW5ndGg7IGwrKykge1xuICAgICAgICAgICAgaGVhZGVyRWxlbWVudHNbbF0uaW5uZXJIVE1MID0gKCFzdGF0ZS5pc0RhdGEpID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2UoaW5kZXgpIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudERhdGEoaW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdXBkYXRlRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJytrZXkrdGlja2VyQ2xhc3MpO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdXBkYXRlRWxlbWVudHMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIHVwZGF0ZUVsZW1lbnQgPSB1cGRhdGVFbGVtZW50c1tqXTtcbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGFyc2VOdW1iZXInKSl7XG4gICAgICAgICAgICAgIHZhbHVlID0gd2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKHZhbHVlLCB0cnVlKSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldF9fcmFuaycpKXtcbiAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IChwYXJzZUZsb2F0KHZhbHVlKSA+IDApID8gXCJjcC13aWRnZXRfX3JhbmstdXBcIiA6ICgocGFyc2VGbG9hdCh2YWx1ZSkgPCAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLWRvd25cIiA6IFwiY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWxcIik7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLWRvd24nKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstdXAnKTtcbiAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpO1xuICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSA/IHN0YXRlLmVtcHR5RGF0YSA6IHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudCh2YWx1ZSwgMikrJyUnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2NwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZScpICYmIHN0YXRlLnNob3dfZGV0YWlsc19jdXJyZW5jeSl7XG4gICAgICAgICAgICAgIHZhbHVlICs9ICcgJyArIHN0YXRlLnByaW1hcnlfY3VycmVuY3kudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc2hvd0RldGFpbHNDdXJyZW5jeScpICYmICFzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSAnICc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGVFbGVtZW50LmlubmVyVGV4dCA9IHZhbHVlIHx8IHN0YXRlLmVtcHR5RGF0YTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZURhdGE6IGZ1bmN0aW9uKGluZGV4LCBrZXksIHZhbHVlLCBjdXJyZW5jeSl7XG4gICAgICBpZiAoY3VycmVuY3kpe1xuICAgICAgICBpZiAoIXdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0pIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV0gPSB7fTtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XVtrZXldID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XVtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoa2V5ID09PSAnbGFuZ3VhZ2UnKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucyh2YWx1ZSk7XG4gICAgICB9XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0RWxlbWVudChpbmRleCwga2V5LCB2YWx1ZSwgY3VycmVuY3kpO1xuICAgIH0sXG4gICAgdXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zOiBmdW5jdGlvbihsYW5nLCBkYXRhKXtcbiAgICAgIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IGRhdGE7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZGdldHNTdGF0ZXMubGVuZ3RoOyB4Kyspe1xuICAgICAgICB2YXIgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlID0gd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLmxlbmd0aCA+IDAgJiYgbGFuZyA9PT0gJ2VuJztcbiAgICAgICAgaWYgKHdpZGdldHNTdGF0ZXNbeF0ubGFuZ3VhZ2UgPT09IGxhbmcgfHwgaXNOb1RyYW5zbGF0aW9uTGFiZWxzVXBkYXRlKXtcbiAgICAgICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRzU3RhdGVzW3hdLm1haW5FbGVtZW50O1xuICAgICAgICAgIHZhciB0cmFuc2FsdGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC10cmFuc2xhdGlvbicpKTtcbiAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRyYW5zYWx0ZUVsZW1lbnRzLmxlbmd0aDsgeSsrKXtcbiAgICAgICAgICAgIHRyYW5zYWx0ZUVsZW1lbnRzW3ldLmNsYXNzTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGNsYXNzTmFtZSl7XG4gICAgICAgICAgICAgIGlmIChjbGFzc05hbWUuc2VhcmNoKCd0cmFuc2xhdGlvbl8nKSA+IC0xKXtcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNsYXRlS2V5ID0gY2xhc3NOYW1lLnJlcGxhY2UoJ3RyYW5zbGF0aW9uXycsICcnKTtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNsYXRlS2V5ID09PSAnbWVzc2FnZScpIHRyYW5zbGF0ZUtleSA9IHdpZGdldHNTdGF0ZXNbeF0ubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxJbmRleCA9IHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5pbmRleE9mKHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oeCwgdHJhbnNsYXRlS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAobGFiZWxJbmRleCA+IC0xICYmIHRleHQpe1xuICAgICAgICAgICAgICAgICAgd2lkZ2V0c1N0YXRlc1t4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnNwbGljZShsYWJlbEluZGV4LCAxKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIGlmICh0cmFuc2FsdGVFbGVtZW50c1t5XS5jbG9zZXN0KCcuY3Atd2lkZ2V0X19mb290ZXInKSl7XG4gICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHdpZGdldEZ1bmN0aW9ucy5zZXRCZWZvcmVFbGVtZW50SW5Gb290ZXIuYmluZChudWxsLCB4KSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVRpY2tlcjogZnVuY3Rpb24oaW5kZXgsIGRhdGEpe1xuICAgICAgdmFyIGRhdGFLZXlzID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFLZXlzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsIGRhdGFLZXlzW2ldLCBkYXRhW2RhdGFLZXlzW2ldXSwgZGF0YS5pZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYXJzZUludGVydmFsVmFsdWU6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHZhciB0aW1lU3ltYm9sID0gJycsIG11bHRpcGxpZXIgPSAxO1xuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgncycpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ3MnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ20nKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdtJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2gnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdoJztcbiAgICAgICAgbXVsdGlwbGllciA9IDYwICogNjAgKiAxMDAwO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlLnNlYXJjaCgnZCcpID4gLTEpe1xuICAgICAgICB0aW1lU3ltYm9sID0gJ2QnO1xuICAgICAgICBtdWx0aXBsaWVyID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlLnJlcGxhY2UodGltZVN5bWJvbCwnJykpICogbXVsdGlwbGllcjtcbiAgICB9LFxuICAgIHBhcnNlTnVtYmVyOiBmdW5jdGlvbihudW1iZXIsIGxvbmdSZXN1bHQpe1xuICAgICAgaWYgKCFudW1iZXIgJiYgbnVtYmVyICE9PSAwKSByZXR1cm4gbnVtYmVyO1xuICAgICAgaWYgKG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eVZhbHVlIHx8IG51bWJlciA9PT0gd2lkZ2V0c1N0YXRlc1swXS5lbXB0eURhdGEpIHJldHVybiBudW1iZXI7XG4gICAgICBudW1iZXIgPSBwYXJzZUZsb2F0KG51bWJlcik7XG4gICAgICBpZiAobnVtYmVyID4gMTAwMDAwICYmICFsb25nUmVzdWx0KXtcbiAgICAgICAgdmFyIG51bWJlclN0ciA9IG51bWJlci50b0ZpeGVkKDApO1xuICAgICAgICB2YXIgcGFyYW1ldGVyID0gJ0snLFxuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICBpZiAobnVtYmVyID4gMTAwMDAwMDAwMCl7XG4gICAgICAgICAgc3BsaWNlZCA9IG51bWJlclN0ci5zbGljZSgwLCBudW1iZXJTdHIubGVuZ3RoIC0gNyk7XG4gICAgICAgICAgcGFyYW1ldGVyID0gJ0InO1xuICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA+IDEwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDQpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdNJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbmF0dXJhbCA9IHNwbGljZWQuc2xpY2UoMCwgc3BsaWNlZC5sZW5ndGggLSAyKTtcbiAgICAgICAgdmFyIGRlY2ltYWwgPSBzcGxpY2VkLnNsaWNlKHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHJldHVybiBuYXR1cmFsICsgJy4nICsgZGVjaW1hbCArICcgJyArIHBhcmFtZXRlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpc0RlY2ltYWwgPSAobnVtYmVyICUgMSkgPiAwO1xuICAgICAgICBpZiAoaXNEZWNpbWFsKXtcbiAgICAgICAgICB2YXIgcHJlY2lzaW9uID0gMjtcbiAgICAgICAgICBpZiAobnVtYmVyIDwgMSl7XG4gICAgICAgICAgICBwcmVjaXNpb24gPSA4O1xuICAgICAgICAgIH0gZWxzZSBpZiAobnVtYmVyIDwgMTApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwMDApe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gNDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5yb3VuZEFtb3VudChudW1iZXIsIHByZWNpc2lvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobnVtYmVyKS50b0xvY2FsZVN0cmluZygncnUtUlUnLCB7IG1heGltdW1GcmFjdGlvbkRpZ2l0czogMiB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcm91bmRBbW91bnQ6IGZ1bmN0aW9uKGFtb3VudCwgZGVjaW1hbCwgZGlyZWN0aW9uKXtcbiAgICAgIGFtb3VudCA9IHBhcnNlRmxvYXQoYW1vdW50KTtcbiAgICAgIGlmICghZGVjaW1hbCkgZGVjaW1hbCA9IDg7XG4gICAgICBpZiAoIWRpcmVjdGlvbikgZGlyZWN0aW9uID0gJ3JvdW5kJztcbiAgICAgIGRlY2ltYWwgPSBNYXRoLnBvdygxMCwgZGVjaW1hbCk7XG4gICAgICByZXR1cm4gTWF0aFtkaXJlY3Rpb25dKGFtb3VudCAqIGRlY2ltYWwpIC8gZGVjaW1hbDtcbiAgICB9LFxuICAgIHN0eWxlc2hlZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZiAod2lkZ2V0RGVmYXVsdHMuc3R5bGVfc3JjICE9PSBmYWxzZSl7XG4gICAgICAgIHZhciB1cmwgPSB3aWRnZXREZWZhdWx0cy5zdHlsZV9zcmMgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArJy9kaXN0Lycrd2lkZ2V0RGVmYXVsdHMuY3NzRmlsZU5hbWU7XG4gICAgICAgIHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgICAgICBsaW5rLnNldEF0dHJpYnV0ZSgncmVsJywgJ3N0eWxlc2hlZXQnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB1cmwpO1xuICAgICAgICByZXR1cm4gKGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignbGlua1tocmVmPVwiJyt1cmwrJ1wiXScpKSA/ICcnIDogZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHdpZGdldE1haW5FbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gd2lkZ2V0RnVuY3Rpb25zLndpZGdldEhlYWRlckVsZW1lbnQoaW5kZXgpICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudChpbmRleCk7XG4gICAgfSxcbiAgICB3aWRnZXRIZWFkZXJFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJzxoMSBjbGFzcz1cImNwLXdpZGdldC10aXRsZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInRpdGxlXCIpKyc8L2gxPicgK1xuICAgICAgICAnPHNlY3Rpb24gY2xhc3M9XCJjcC13aWRnZXQtaGVhZGVyXCI+JyArXG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeScpICtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsICdkYXRhX3R5cGUnKSArXG4gICAgICAgICc8L3NlY3Rpb24+JztcbiAgICB9LFxuICAgIHdpZGdldFRhYmxlRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHJldHVybiAnPHNlY3Rpb24gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9faGVhZFwiPicgK1xuICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX3Jvd1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwgY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1uYW1lIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3RpdGxlXCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwibmFtZVwiKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwgY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLXZhbHVlIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3ByaWNlXCI+Jyt3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwicHJpY2VcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtY2hhbmdlIGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX2NoYW5nZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcImNoYW5nZVwiKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fYm9keVwiPicgK1xuICAgICAgICAgICAgICAgICAgKChkYXRhLmlzRGF0YSlcbiAgICAgICAgICAgICAgICAgICAgPyB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0VGFibGVFbGVtZW50RGF0YShpbmRleClcbiAgICAgICAgICAgICAgICAgICAgOiB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0VGFibGVFbGVtZW50TWVzc2FnZShpbmRleCkpICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgJzwvc2VjdGlvbj4nO1xuICAgIH0sXG4gICAgd2lkZ2V0VGFibGVFbGVtZW50RGF0YTogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHJvd3MgPSAnJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkZ2V0c1N0YXRlc1tpbmRleF1bJ2N1cnJlbmN5X2xpc3QnXS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBjdXJyZW5jeSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdWydjdXJyZW5jeV9saXN0J11baV07XG4gICAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0udGlja2VyW2N1cnJlbmN5XTtcbiAgICAgICAgdmFyIGRhdGFUeXBlID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmRhdGFfdHlwZS50b0xvd2VyQ2FzZSgpID09PSAndm9sdW1lJylcbiAgICAgICAgICA/IHdpZGdldHNTdGF0ZXNbaW5kZXhdLmRhdGFfdHlwZS50b0xvd2VyQ2FzZSgpICsgJ18yNGgnXG4gICAgICAgICAgOiB3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcm93cyArPSAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fcm93XCI+JytcbiAgICAgICAgICAgICAgICAgICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJysgd2lkZ2V0RnVuY3Rpb25zLmNvaW5fbGluayhjdXJyZW5jeSwgaW5kZXgpICsnXCI+PC9hPicgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPGltZyBzcmM9XCJodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycrIGN1cnJlbmN5ICsnL2xvZ28ucG5nXCIgYWx0PVwiXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZV9fdGV4dC1ib3hcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94LS1uYW1lIG5hbWVUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrKChkYXRhKSA/IGRhdGEubmFtZSA6IFwiTm8gZGF0YVwiKSsnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZV9fdGV4dC1ib3gtLXN5bWJvbCBzeW1ib2xUaWNrZXInK2N1cnJlbmN5LnRvVXBwZXJDYXNlKCkrJ1wiPicrKChkYXRhKSA/IGRhdGEuc3ltYm9sIDogXCJcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwgY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtdmFsdWUgcGFyc2VOdW1iZXIgJytkYXRhVHlwZSsnVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB3aWRnZXRGdW5jdGlvbnMucGFyc2VOdW1iZXIoZGF0YVtkYXRhVHlwZV0sIHRydWUpICsgJyAnICsgKCh3aWRnZXRzU3RhdGVzW2luZGV4XS5zaG93X2RldGFpbHNfY3VycmVuY3kpID8gd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeS50b1VwcGVyQ2FzZSgpIDogJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aWRnZXREZWZhdWx0cy5lbXB0eURhdGEpICtcbiAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS1jaGFuZ2UgY3Atd2lkZ2V0X19yYW5rJysgKChkYXRhICYmIGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gPiAwKSA/ICcgY3Atd2lkZ2V0X19yYW5rLXVwJyA6IChkYXRhICYmIGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gPCAwKSA/ICcgY3Atd2lkZ2V0X19yYW5rLWRvd24nIDogJyBjcC13aWRnZXRfX3JhbmstbmV1dHJhbCcpICsnICcrZGF0YVR5cGUrJ19jaGFuZ2VfMjRoVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoIWRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gJiYgZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSAhPT0gMCkgPyB3aWRnZXREZWZhdWx0cy5lbXB0eURhdGEgOiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQoZGF0YVtkYXRhVHlwZSsnX2NoYW5nZV8yNGgnXSwgMikrJyUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aWRnZXREZWZhdWx0cy5lbXB0eURhdGEpK1xuICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICB9XG4gICAgICByZXR1cm4gcm93cztcbiAgICB9LFxuICAgIHdpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2U6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtZXNzYWdlID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0ubWVzc2FnZTtcbiAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fcm93IGNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX21lc3NhZ2VcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbFwiPicrICh3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIG1lc3NhZ2UpKSArJzwvZGl2PicgK1xuICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldFNlbGVjdEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICB2YXIgdGl0bGUgPSAnJztcbiAgICAgIHZhciBidXR0b25zID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsKydfbGlzdCddLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXVtpXTtcbiAgICAgICAgYnV0dG9ucyArPSAnPGJ1dHRvbiBjbGFzcz1cIicrICgoZGF0YS50b0xvd2VyQ2FzZSgpID09PSB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnY3Atd2lkZ2V0LWFjdGl2ZSAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogJycpICsgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyBkYXRhLnRvTG93ZXJDYXNlKCkpICsnXCIgZGF0YS1vcHRpb249XCInK2RhdGErJ1wiPicrKChsYWJlbCAhPT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgZGF0YS50b0xvd2VyQ2FzZSgpKSA6IGRhdGEpKyc8L2J1dHRvbj4nXG4gICAgICB9XG4gICAgICBpZiAobGFiZWwgPT09ICdkYXRhX3R5cGUnKSB0aXRsZSA9IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJzaG93XCIpO1xuICAgICAgaWYgKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpIHRpdGxlID0gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInByaWNlX2luXCIpO1xuICAgICAgcmV0dXJuICc8ZGl2IGRhdGEtdHlwZT1cIicrbGFiZWwrJ1wiIGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdFwiPicgK1xuICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJysgbGFiZWwgKydcIj4nK3RpdGxlKyc8L2xhYmVsPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX29wdGlvbnNcIj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiYXJyb3ctZG93biAnKyAoKGxhYmVsID09PSAncHJpbWFyeV9jdXJyZW5jeScpID8gJycgOiAnY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fJyArIHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSArJ1wiPicrICgobGFiZWwgIT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXS50b0xvd2VyQ2FzZSgpKSA6IHdpZGdldHNTdGF0ZXNbaW5kZXhdW2xhYmVsXSkgKyc8L3NwYW4+JyArXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXNlbGVjdF9fZHJvcGRvd25cIj4nICtcbiAgICAgICAgYnV0dG9ucyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAnPC9kaXY+JztcbiAgICB9LFxuICAgIHdpZGdldEZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIGlzV29yZHByZXNzID0gd2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3M7XG4gICAgICByZXR1cm4gKGlzV29yZHByZXNzKSA/ICcnIDogJzxwIGNsYXNzPVwiY3Atd2lkZ2V0LWZvb3RlciBjcC13aWRnZXQtZm9vdGVyLS0nK2luZGV4KydcIj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3AtdHJhbnNsYXRpb24gdHJhbnNsYXRpb25fcG93ZXJlZF9ieVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInBvd2VyZWRfYnlcIikgKyAnIDwvc3Bhbj4nICtcbiAgICAgICAgJzxpbWcgc3R5bGU9XCJ3aWR0aDogMTZweFwiIHNyYz1cIicrIHdpZGdldEZ1bmN0aW9ucy5tYWluX2xvZ29fbGluaygpICsnXCIgYWx0PVwiXCIvPicgK1xuICAgICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicrIHdpZGdldEZ1bmN0aW9ucy5tYWluX3BhZ2VfbGluayhpbmRleCkgKydcIj5jb2lucGFwcmlrYS5jb208L2E+JyArXG4gICAgICAgICc8L3A+JztcbiAgICB9LFxuICAgIGdldEltYWdlOiBmdW5jdGlvbihpbmRleCwgY3VycmVuY3kpe1xuICAgICAgdmFyIGRhdGEgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBpbWdDb250YWluZXJzID0gZGF0YS5tYWluRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjcC13aWRnZXRfX2ltZycpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbWdDb250YWluZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGltZ0NvbnRhaW5lciA9IGltZ0NvbnRhaW5lcnNbaV07XG4gICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIHZhciBpbWcgPSBpbWdDb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJyk7XG4gICAgICAgIHZhciBuZXdJbWcgPSBuZXcgSW1hZ2U7XG4gICAgICAgIG5ld0ltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpbWcuc3JjID0gdGhpcy5zcmM7XG4gICAgICAgICAgaW1nQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9faW1nLS1oaWRkZW4nKTtcbiAgICAgICAgfTtcbiAgICAgICAgbmV3SW1nLnNyYyA9IHdpZGdldEZ1bmN0aW9ucy5pbWdfc3JjKGRhdGEuY3VycmVuY3kpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaW1nX3NyYzogZnVuY3Rpb24oaWQpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbS9jb2luLycraWQrJy9sb2dvLnBuZyc7XG4gICAgfSxcbiAgICBjb2luX2xpbms6IGZ1bmN0aW9uKGlkLCBpbmRleCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tL2NvaW4vJysgaWQgKyAnLycgKyB3aWRnZXRGdW5jdGlvbnMuZ2V0X3V0bV9saW5rKGluZGV4KVxuICAgIH0sXG4gICAgbWFpbl9wYWdlX2xpbms6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vJyArIHdpZGdldEZ1bmN0aW9ucy5nZXRfdXRtX2xpbmsoaW5kZXgpO1xuICAgIH0sXG4gICAgZ2V0X3V0bV9saW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJ3V0bV9zb3VyY2U9d2lkZ2V0JnV0bV9tZWRpdW09JysgKCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pc1dvcmRwcmVzcykgPyAnd29yZHByZXNzJyA6ICdpbmxpbmUnKSArJyZ1dG1fY2FtcGFpZ249cmFua2luZyc7XG4gICAgfSxcbiAgICBtYWluX2xvZ29fbGluazogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB3aWRnZXREZWZhdWx0cy5pbWdfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC9pbWcvbG9nb193aWRnZXQuc3ZnJ1xuICAgIH0sXG4gICAgZ2V0U2NyaXB0RWxlbWVudDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbZGF0YS1jcC1tYXJrZXQtd2lkZ2V0XScpO1xuICAgIH0sXG4gICAgZ2V0VHJhbnNsYXRpb246IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICB2YXIgdGV4dCA9ICh3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdKSA/IHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1t3aWRnZXRzU3RhdGVzW2luZGV4XS5sYW5ndWFnZV1bbGFiZWxdIDogbnVsbDtcbiAgICAgIGlmICghdGV4dCAmJiB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ10pIHtcbiAgICAgICAgdGV4dCA9IHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXVtsYWJlbF07XG4gICAgICB9XG4gICAgICBpZiAoIXRleHQpIHtcbiAgICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy5hZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbihpbmRleCwgbGFiZWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRMYWJlbFdpdGhvdXRUcmFuc2xhdGlvbjogZnVuY3Rpb24oaW5kZXgsIGxhYmVsKXtcbiAgICAgIGlmICghd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm5vVHJhbnNsYXRpb25MYWJlbHMucHVzaChsYWJlbCk7XG4gICAgfSxcbiAgICBnZXRUcmFuc2xhdGlvbnM6IGZ1bmN0aW9uKGxhbmcpe1xuICAgICAgaWYgKCF3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10pe1xuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHZhciB1cmwgPSB3aWRnZXREZWZhdWx0cy5sYW5nX3NyYyAgfHwgd2lkZ2V0RGVmYXVsdHMub3JpZ2luX3NyYyArICcvZGlzdC9sYW5nJztcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCArICcvJyArIGxhbmcgKyAnLmpzb24nKTtcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVXaWRnZXRUcmFuc2xhdGlvbnMobGFuZywgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgICAgZGVsZXRlIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMub25FcnJvclJlcXVlc3QoMCwgeGhyKTtcbiAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb25zKCdlbicpO1xuICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIHdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1tsYW5nXSA9IHt9O1xuICAgICAgfVxuICAgIH0sXG4gIH07XG4gIFxuICBmdW5jdGlvbiBpbml0V2lkZ2V0cygpe1xuICAgIGlmICghd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQpe1xuICAgICAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSB0cnVlO1xuICAgICAgdmFyIG1haW5FbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUod2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lKSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0V2lkZ2V0Q2xhc3MobWFpbkVsZW1lbnRzKTtcbiAgICAgIH0sIGZhbHNlKTtcbiAgICAgIHZhciBzY3JpcHRFbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldFNjcmlwdEVsZW1lbnQoKTtcbiAgICAgIGlmIChzY3JpcHRFbGVtZW50ICYmIHNjcmlwdEVsZW1lbnQuZGF0YXNldCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQuY3BNYXJrZXRXaWRnZXQpe1xuICAgICAgICB2YXIgZGF0YXNldCA9IEpTT04ucGFyc2Uoc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwTWFya2V0V2lkZ2V0KTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGFzZXQpKXtcbiAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGFzZXQpO1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgICB2YXIga2V5ID0ga2V5c1tqXS5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgICAgICAgIHdpZGdldERlZmF1bHRzW2tleV0gPSBkYXRhc2V0W2tleXNbal1dO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB3aWRnZXRzU3RhdGVzID0gW107XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYWluRWxlbWVudHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhciBuZXdTZXR0aW5ncyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkod2lkZ2V0RGVmYXVsdHMpKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5pc1dvcmRwcmVzcyA9IG1haW5FbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ3dvcmRwcmVzcycpO1xuICAgICAgICAgIG5ld1NldHRpbmdzLm1haW5FbGVtZW50ID0gbWFpbkVsZW1lbnRzW2ldO1xuICAgICAgICAgIHdpZGdldHNTdGF0ZXMucHVzaChuZXdTZXR0aW5ncyk7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmluaXQoaSk7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH1cbiAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdID0ge307XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0V2lkZ2V0cywgZmFsc2UpO1xuICB3aW5kb3dbd2lkZ2V0RGVmYXVsdHMub2JqZWN0TmFtZV0uYmluZFdpZGdldCA9IGZ1bmN0aW9uKCl7XG4gICAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmluaXQgPSBmYWxzZTtcbiAgICBpbml0V2lkZ2V0cygpO1xuICB9O1xufSkoKTsiXX0=
