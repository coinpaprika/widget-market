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
    origin_src: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.1',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd2lkZ2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIihmdW5jdGlvbigpe1xuICB2YXIgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICB2YXIgd2lkZ2V0RGVmYXVsdHMgPSB7XG4gICAgb2JqZWN0TmFtZTogJ2NwTWFya2V0V2lkZ2V0cycsXG4gICAgY2xhc3NOYW1lOiAnY29pbnBhcHJpa2EtbWFya2V0LXdpZGdldCcsXG4gICAgY3NzRmlsZU5hbWU6ICd3aWRnZXQubWluLmNzcycsXG4gICAgY3VycmVuY3lfbGlzdDogWydidGMtYml0Y29pbicsICdldGgtZXRoZXJldW0nLCAneHJwLXhycCcsICdiY2gtYml0Y29pbi1jYXNoJ10sXG4gICAgcHJpbWFyeV9jdXJyZW5jeV9saXN0OiBbICdVU0QnLCAnQlRDJywgJ0VUSCcgXSxcbiAgICBwcmltYXJ5X2N1cnJlbmN5OiAnVVNEJyxcbiAgICBkYXRhX3R5cGVfbGlzdDogWyAnUHJpY2UnLCAnVm9sdW1lJyBdLFxuICAgIGRhdGFfdHlwZTogJ3ByaWNlJyxcbiAgICB2ZXJzaW9uOiAnc3RhbmRhcmQnLFxuICAgIHVwZGF0ZV9hY3RpdmU6IGZhbHNlLFxuICAgIHVwZGF0ZV90aW1lb3V0OiAnMzBzJyxcbiAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICBzdHlsZV9zcmM6IG51bGwsXG4gICAgaW1nX3NyYzogbnVsbCxcbiAgICBsYW5nX3NyYzogbnVsbCxcbiAgICBvcmlnaW5fc3JjOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AY29pbnBhcHJpa2Evd2lkZ2V0LW1hcmtldEAxLjAuMScsXG4gICAgc2hvd19kZXRhaWxzX2N1cnJlbmN5OiB0cnVlLFxuICAgIGVtcHR5RGF0YTogJy0nLFxuICAgIGVtcHR5VmFsdWU6IDAsXG4gICAgdGlja2VyOiB7XG4gICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2w6IHVuZGVmaW5lZCxcbiAgICAgIHByaWNlOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgICByYW5rOiB1bmRlZmluZWQsXG4gICAgICBwcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGg6IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldF9jYXA6IHVuZGVmaW5lZCxcbiAgICAgIHBlcmNlbnRfZnJvbV9wcmljZV9hdGg6IHVuZGVmaW5lZCxcbiAgICAgIHZvbHVtZV8yNGhfY2hhbmdlXzI0aDogdW5kZWZpbmVkLFxuICAgICAgbWFya2V0X2NhcF9jaGFuZ2VfMjRoOiB1bmRlZmluZWQsXG4gICAgfSxcbiAgICBpbnRlcnZhbDogbnVsbCxcbiAgICBpc1dvcmRwcmVzczogZmFsc2UsXG4gICAgaXNEYXRhOiBmYWxzZSxcbiAgICBtZXNzYWdlOiAnZGF0YV9sb2FkaW5nJyxcbiAgICB0cmFuc2xhdGlvbnM6IHt9LFxuICAgIG1haW5FbGVtZW50OiBudWxsLFxuICAgIG5vVHJhbnNsYXRpb25MYWJlbHM6IFtdLFxuICB9O1xuICB2YXIgd2lkZ2V0RnVuY3Rpb25zID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIGlmICghd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KSkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignQmluZCBmYWlsZWQsIG5vIGVsZW1lbnQgd2l0aCBjbGFzcyA9IFwiJysgd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsnXCInKTtcbiAgICAgIH1cbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREZWZhdWx0cyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0T3JpZ2luTGluayhpbmRleCk7XG4gICAgfSxcbiAgICBzZXRXaWRnZXRDbGFzczogZnVuY3Rpb24oZWxlbWVudHMpe1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50c1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgdmFyIHNtYWxsQ2xhc3NOYW1lID0gd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fc21hbGwnO1xuICAgICAgICB2YXIgbWVkaXVtQ2xhc3NOYW1lID0gd2lkZ2V0RGVmYXVsdHMuY2xhc3NOYW1lICsgJ19fbWVkaXVtJztcbiAgICAgICAgdmFyIGhhc1NtYWxsQ2xhc3MgPSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoc21hbGxDbGFzc05hbWUpO1xuICAgICAgICB2YXIgaGFzTWVkaXVtQ2xhc3MgPSBlbGVtZW50c1tpXS5jbGFzc0xpc3QuY29udGFpbnMobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDMwMCAmJiAhaGFzU21hbGxDbGFzcykgZWxlbWVudHNbaV0uY2xhc3NMaXN0LmFkZChzbWFsbENsYXNzTmFtZSk7XG4gICAgICAgIGlmICh3aWR0aCA+IDMwMCAmJiBoYXNTbWFsbENsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKHNtYWxsQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoIDw9IDM2MCAmJiAhaGFzTWVkaXVtQ2xhc3MpIGVsZW1lbnRzW2ldLmNsYXNzTGlzdC5hZGQobWVkaXVtQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHdpZHRoID4gMzYwICYmIGhhc01lZGl1bUNsYXNzKSBlbGVtZW50c1tpXS5jbGFzc0xpc3QucmVtb3ZlKG1lZGl1bUNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1haW5FbGVtZW50O1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdHM6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldCl7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnZlcnNpb24pIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndmVyc2lvbicsIG1haW5FbGVtZW50LmRhdGFzZXQudmVyc2lvbik7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeUxpc3QpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAncHJpbWFyeV9jdXJyZW5jeV9saXN0JywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQucHJpbWFyeUN1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3ByaW1hcnlfY3VycmVuY3knLCBtYWluRWxlbWVudC5kYXRhc2V0LnByaW1hcnlDdXJyZW5jeSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmRhdGFUeXBlTGlzdCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdkYXRhX3R5cGVfbGlzdCcsIEpTT04ucGFyc2UobWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZUxpc3QpKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuZGF0YVR5cGUpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnZGF0YV90eXBlJywgbWFpbkVsZW1lbnQuZGF0YXNldC5kYXRhVHlwZSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5TGlzdCkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeV9saXN0JywgSlNPTi5wYXJzZShtYWluRWxlbWVudC5kYXRhc2V0LmN1cnJlbmN5TGlzdCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5jdXJyZW5jeSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdjdXJyZW5jeScsIG1haW5FbGVtZW50LmRhdGFzZXQuY3VycmVuY3kpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5zaG93RGV0YWlsc0N1cnJlbmN5KSB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgJ3Nob3dfZGV0YWlsc19jdXJyZW5jeScsIChtYWluRWxlbWVudC5kYXRhc2V0LnNob3dEZXRhaWxzQ3VycmVuY3kgPT09ICd0cnVlJykpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC51cGRhdGVBY3RpdmUpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX2FjdGl2ZScsIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZUFjdGl2ZSA9PT0gJ3RydWUnKSk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LnVwZGF0ZVRpbWVvdXQpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAndXBkYXRlX3RpbWVvdXQnLCB3aWRnZXRGdW5jdGlvbnMucGFyc2VJbnRlcnZhbFZhbHVlKG1haW5FbGVtZW50LmRhdGFzZXQudXBkYXRlVGltZW91dCkpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5sYW5ndWFnZSkgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdsYW5ndWFnZScsIG1haW5FbGVtZW50LmRhdGFzZXQubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5vcmlnaW5TcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnb3JpZ2luX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQub3JpZ2luU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbm9kZV9tb2R1bGVzX3NyYycsIG1haW5FbGVtZW50LmRhdGFzZXQubm9kZU1vZHVsZXNTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5ib3dlclNyYykgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdib3dlcl9zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmJvd2VyU3JjKTtcbiAgICAgICAgaWYgKG1haW5FbGVtZW50LmRhdGFzZXQuc3R5bGVTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnc3R5bGVfc3JjJywgbWFpbkVsZW1lbnQuZGF0YXNldC5zdHlsZVNyYyk7XG4gICAgICAgIGlmIChtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbGFuZ19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmxhbmdTcmMpO1xuICAgICAgICBpZiAobWFpbkVsZW1lbnQuZGF0YXNldC5pbWdTcmMpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnbG9nb19zcmMnLCBtYWluRWxlbWVudC5kYXRhc2V0LmltZ1NyYyk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRPcmlnaW5MaW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICBpZiAoT2JqZWN0LmtleXMod2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zKS5sZW5ndGggPT09IDApIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnMod2lkZ2V0RGVmYXVsdHMubGFuZ3VhZ2UpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnN0eWxlc2hlZXQoKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmFkZFdpZGdldEVsZW1lbnQoaW5kZXgpO1xuICAgICAgICB3aWRnZXRGdW5jdGlvbnMuaW5pdEludGVydmFsKGluZGV4KTtcbiAgICAgIH0sIDEwMCk7XG4gICAgfSxcbiAgICBhZGRXaWRnZXRFbGVtZW50OiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWFpbkVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0TWFpbkVsZW1lbnQoaW5kZXgpO1xuICAgICAgdmFyIHdpZGdldEVsZW1lbnQgPSB3aWRnZXRGdW5jdGlvbnMud2lkZ2V0TWFpbkVsZW1lbnQoaW5kZXgpICsgd2lkZ2V0RnVuY3Rpb25zLndpZGdldEZvb3RlcihpbmRleCk7XG4gICAgICBtYWluRWxlbWVudC5pbm5lckhUTUwgPSB3aWRnZXRFbGVtZW50O1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFNlbGVjdExpc3RlbmVycyhpbmRleCk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyKGluZGV4KTtcbiAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXREYXRhKGluZGV4KTtcbiAgICB9LFxuICAgIHNldFNlbGVjdExpc3RlbmVyczogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciBzZWxlY3RFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdEVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSBzZWxlY3RFbGVtZW50c1tpXS5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LXNlbGVjdF9fb3B0aW9ucyBidXR0b24nKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBidXR0b25zLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICBidXR0b25zW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFNlbGVjdE9wdGlvbihldmVudCwgaW5kZXgpO1xuICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2V0U2VsZWN0T3B0aW9uOiBmdW5jdGlvbihldmVudCwgaW5kZXgpe1xuICAgICAgdmFyIGNsYXNzTmFtZSA9ICdjcC13aWRnZXQtYWN0aXZlJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBzaWJsaW5nID0gZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUuY2hpbGROb2Rlc1tpXTtcbiAgICAgICAgaWYgKHNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgfVxuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIHZhciB0YWJsZUhlYWRDZWxsID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldC10YWJsZV9faGVhZCAuY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLXZhbHVlJyk7XG4gICAgICB0YWJsZUhlYWRDZWxsLmlubmVyVGV4dCA9IGV2ZW50LnRhcmdldC5pbm5lclRleHQ7XG4gICAgICB2YXIgcGFyZW50ID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJy5jcC13aWRnZXQtc2VsZWN0Jyk7XG4gICAgICB2YXIgdHlwZSA9IHBhcmVudC5kYXRhc2V0LnR5cGU7XG4gICAgICB2YXIgcGlja2VkVmFsdWVFbGVtZW50ID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jcC13aWRnZXQtc2VsZWN0X19vcHRpb25zID4gc3BhbicpO1xuICAgICAgdmFyIHZhbHVlID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQub3B0aW9uO1xuICAgICAgcGlja2VkVmFsdWVFbGVtZW50LmlubmVyVGV4dCA9ICgodHlwZSAhPT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgdmFsdWUudG9Mb3dlckNhc2UoKSkgOiB2YWx1ZSk7XG4gICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlRGF0YShpbmRleCwgdHlwZSwgdmFsdWUpO1xuICAgICAgaWYgKHR5cGUgPT09ICdwcmltYXJ5X2N1cnJlbmN5Jykgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9LFxuICAgIGluaXRJbnRlcnZhbDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgY2xlYXJJbnRlcnZhbCh3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCk7XG4gICAgICBpZiAod2lkZ2V0c1N0YXRlc1tpbmRleF0udXBkYXRlX2FjdGl2ZSAmJiB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCA+IDEwMDApe1xuICAgICAgICB3aWRnZXRzU3RhdGVzW2luZGV4XS5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldERhdGEoaW5kZXgpO1xuICAgICAgICB9LCB3aWRnZXRzU3RhdGVzW2luZGV4XS51cGRhdGVfdGltZW91dCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgeGhyID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldHNTdGF0ZXNbaW5kZXhdLmN1cnJlbmN5X2xpc3QubGVuZ3RoOyBpKyspe1xuICAgICAgICB4aHJbaV0gPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyW2ldLm9wZW4oJ0dFVCcsICdodHRwczovL2FwaS5jb2lucGFwcmlrYS5jb20vdjEvd2lkZ2V0Lycrd2lkZ2V0c1N0YXRlc1tpbmRleF0uY3VycmVuY3lfbGlzdFtpXSsnP3F1b3RlPScrd2lkZ2V0c1N0YXRlc1tpbmRleF0ucHJpbWFyeV9jdXJyZW5jeSk7XG4gICAgICAgIHhocltpXS5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgaWYgKCF3aWRnZXRzU3RhdGVzW2luZGV4XS5pc0RhdGEpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgdHJ1ZSk7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlVGlja2VyKGluZGV4LCBKU09OLnBhcnNlKHRoaXMucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdChpbmRleCwgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHJbaV0ub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KGluZGV4LCB0aGlzKTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyW2ldLnNlbmQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uRXJyb3JSZXF1ZXN0OiBmdW5jdGlvbihpbmRleCwgeGhyKXtcbiAgICAgIGlmICh3aWRnZXRzU3RhdGVzW2luZGV4XS5pc0RhdGEpIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCAnaXNEYXRhJywgZmFsc2UpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZURhdGEoaW5kZXgsICdtZXNzYWdlJywgJ2RhdGFfdW5hdmFpbGFibGUnKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkLiAgUmV0dXJuZWQgc3RhdHVzIG9mICcgKyB4aHIsIHdpZGdldHNTdGF0ZXNbaW5kZXhdKTtcbiAgICB9LFxuICAgIHNldEJlZm9yZUVsZW1lbnRJbkZvb3RlcjogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0RnVuY3Rpb25zLmdldE1haW5FbGVtZW50KGluZGV4KTtcbiAgICAgIGlmIChtYWluRWxlbWVudC5jaGlsZHJlblswXS5sb2NhbE5hbWUgPT09ICdzdHlsZScpe1xuICAgICAgICBtYWluRWxlbWVudC5yZW1vdmVDaGlsZChtYWluRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICAgIH1cbiAgICAgIHZhciBmb290ZXJFbGVtZW50ID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNwLXdpZGdldF9fZm9vdGVyJyk7XG4gICAgICBpZiAoZm9vdGVyRWxlbWVudCl7XG4gICAgICAgIHZhciB2YWx1ZSA9IGZvb3RlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSA0MztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb290ZXJFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIHZhbHVlIC09IGZvb3RlckVsZW1lbnQuY2hpbGROb2Rlc1tpXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSAnLmNwLXdpZGdldF9fZm9vdGVyLS0nK2luZGV4Kyc6OmJlZm9yZXt3aWR0aDonK3ZhbHVlLnRvRml4ZWQoMCkrJ3B4O30nO1xuICAgICAgICBtYWluRWxlbWVudC5pbnNlcnRCZWZvcmUoc3R5bGUsIG1haW5FbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZVdpZGdldEVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4LCBrZXksIHZhbHVlLCBjdXJyZW5jeSl7XG4gICAgICB2YXIgc3RhdGUgPSB3aWRnZXRzU3RhdGVzW2luZGV4XTtcbiAgICAgIHZhciBtYWluRWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRNYWluRWxlbWVudChpbmRleCk7XG4gICAgICBpZiAobWFpbkVsZW1lbnQpe1xuICAgICAgICB2YXIgdGlja2VyQ2xhc3MgPSAoY3VycmVuY3kpID8gJ1RpY2tlcicrY3VycmVuY3kudG9VcHBlckNhc2UoKSA6ICcnO1xuICAgICAgICBpZiAoa2V5ID09PSAnbmFtZScgfHwga2V5ID09PSAnY3VycmVuY3knKXtcbiAgICAgICAgICBpZiAoa2V5ID09PSAnY3VycmVuY3knKXtcbiAgICAgICAgICAgIHZhciBhRWxlbWVudHMgPSBtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3Atd2lkZ2V0LWZvb3RlciA+IGEnKTtcbiAgICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCBhRWxlbWVudHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgYUVsZW1lbnRzW2tdLmhyZWYgPSB3aWRnZXRGdW5jdGlvbnMuY29pbl9saW5rKHZhbHVlLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRJbWFnZShpbmRleCwgY3VycmVuY3kpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09ICdpc0RhdGEnIHx8IGtleSA9PT0gJ21lc3NhZ2UnIHx8IGtleSA9PT0gJ2RhdGFfdHlwZScpe1xuICAgICAgICAgIHZhciBoZWFkZXJFbGVtZW50cyA9IG1haW5FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jcC13aWRnZXQtdGFibGVfX2JvZHknKTtcbiAgICAgICAgICBmb3IodmFyIGwgPSAwOyBsIDwgaGVhZGVyRWxlbWVudHMubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgIGhlYWRlckVsZW1lbnRzW2xdLmlubmVySFRNTCA9ICghc3RhdGUuaXNEYXRhKSA/IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnRNZXNzYWdlKGluZGV4KSA6IHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnREYXRhKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHVwZGF0ZUVsZW1lbnRzID0gbWFpbkVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicra2V5K3RpY2tlckNsYXNzKTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHVwZGF0ZUVsZW1lbnRzLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICAgIHZhciB1cGRhdGVFbGVtZW50ID0gdXBkYXRlRWxlbWVudHNbal07XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BhcnNlTnVtYmVyJykpe1xuICAgICAgICAgICAgICB2YWx1ZSA9IHdpZGdldEZ1bmN0aW9ucy5wYXJzZU51bWJlcih2YWx1ZSwgdHJ1ZSkgfHwgc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXRfX3JhbmsnKSl7XG4gICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSAocGFyc2VGbG9hdCh2YWx1ZSkgPiAwKSA/IFwiY3Atd2lkZ2V0X19yYW5rLXVwXCIgOiAoKHBhcnNlRmxvYXQodmFsdWUpIDwgMCkgPyBcImNwLXdpZGdldF9fcmFuay1kb3duXCIgOiBcImNwLXdpZGdldF9fcmFuay1uZXV0cmFsXCIpO1xuICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NwLXdpZGdldF9fcmFuay1kb3duJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLXVwJyk7XG4gICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHZhbHVlID0gc3RhdGUuZW1wdHlEYXRhO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgPyBzdGF0ZS5lbXB0eURhdGEgOiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQodmFsdWUsIDIpKyclJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVwZGF0ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtdmFsdWUnKSAmJiBzdGF0ZS5zaG93X2RldGFpbHNfY3VycmVuY3kpe1xuICAgICAgICAgICAgICB2YWx1ZSArPSAnICcgKyBzdGF0ZS5wcmltYXJ5X2N1cnJlbmN5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXBkYXRlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3dEZXRhaWxzQ3VycmVuY3knKSAmJiAhc3RhdGUuc2hvd19kZXRhaWxzX2N1cnJlbmN5KSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXBkYXRlRWxlbWVudC5pbm5lclRleHQgPSB2YWx1ZSB8fCBzdGF0ZS5lbXB0eURhdGE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVEYXRhOiBmdW5jdGlvbihpbmRleCwga2V5LCB2YWx1ZSwgY3VycmVuY3kpe1xuICAgICAgaWYgKGN1cnJlbmN5KXtcbiAgICAgICAgaWYgKCF3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldKSB3aWRnZXRzU3RhdGVzW2luZGV4XS50aWNrZXJbY3VycmVuY3ldID0ge307XG4gICAgICAgIHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV1ba2V5XSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkZ2V0c1N0YXRlc1tpbmRleF1ba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ2xhbmd1YWdlJyl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbnModmFsdWUpO1xuICAgICAgfVxuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnVwZGF0ZVdpZGdldEVsZW1lbnQoaW5kZXgsIGtleSwgdmFsdWUsIGN1cnJlbmN5KTtcbiAgICB9LFxuICAgIHVwZGF0ZVdpZGdldFRyYW5zbGF0aW9uczogZnVuY3Rpb24obGFuZywgZGF0YSl7XG4gICAgICB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSBkYXRhO1xuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWRnZXRzU3RhdGVzLmxlbmd0aDsgeCsrKXtcbiAgICAgICAgdmFyIGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSA9IHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5sZW5ndGggPiAwICYmIGxhbmcgPT09ICdlbic7XG4gICAgICAgIGlmICh3aWRnZXRzU3RhdGVzW3hdLmxhbmd1YWdlID09PSBsYW5nIHx8IGlzTm9UcmFuc2xhdGlvbkxhYmVsc1VwZGF0ZSl7XG4gICAgICAgICAgdmFyIG1haW5FbGVtZW50ID0gd2lkZ2V0c1N0YXRlc1t4XS5tYWluRWxlbWVudDtcbiAgICAgICAgICB2YXIgdHJhbnNhbHRlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChtYWluRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY3AtdHJhbnNsYXRpb24nKSk7XG4gICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCB0cmFuc2FsdGVFbGVtZW50cy5sZW5ndGg7IHkrKyl7XG4gICAgICAgICAgICB0cmFuc2FsdGVFbGVtZW50c1t5XS5jbGFzc0xpc3QuZm9yRWFjaChmdW5jdGlvbihjbGFzc05hbWUpe1xuICAgICAgICAgICAgICBpZiAoY2xhc3NOYW1lLnNlYXJjaCgndHJhbnNsYXRpb25fJykgPiAtMSl7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zbGF0ZUtleSA9IGNsYXNzTmFtZS5yZXBsYWNlKCd0cmFuc2xhdGlvbl8nLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zbGF0ZUtleSA9PT0gJ21lc3NhZ2UnKSB0cmFuc2xhdGVLZXkgPSB3aWRnZXRzU3RhdGVzW3hdLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgdmFyIGxhYmVsSW5kZXggPSB3aWRnZXRzU3RhdGVzW3hdLm5vVHJhbnNsYXRpb25MYWJlbHMuaW5kZXhPZih0cmFuc2xhdGVLZXkpO1xuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKHgsIHRyYW5zbGF0ZUtleSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsSW5kZXggPiAtMSAmJiB0ZXh0KXtcbiAgICAgICAgICAgICAgICAgIHdpZGdldHNTdGF0ZXNbeF0ubm9UcmFuc2xhdGlvbkxhYmVscy5zcGxpY2UobGFiZWxJbmRleCwgMSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhbnNhbHRlRWxlbWVudHNbeV0uaW5uZXJUZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNhbHRlRWxlbWVudHNbeV0uY2xvc2VzdCgnLmNwLXdpZGdldF9fZm9vdGVyJykpe1xuICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCh3aWRnZXRGdW5jdGlvbnMuc2V0QmVmb3JlRWxlbWVudEluRm9vdGVyLmJpbmQobnVsbCwgeCksIDUwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVUaWNrZXI6IGZ1bmN0aW9uKGluZGV4LCBkYXRhKXtcbiAgICAgIHZhciBkYXRhS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhS2V5cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHdpZGdldEZ1bmN0aW9ucy51cGRhdGVEYXRhKGluZGV4LCBkYXRhS2V5c1tpXSwgZGF0YVtkYXRhS2V5c1tpXV0sIGRhdGEuaWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcGFyc2VJbnRlcnZhbFZhbHVlOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICB2YXIgdGltZVN5bWJvbCA9ICcnLCBtdWx0aXBsaWVyID0gMTtcbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ3MnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdzJztcbiAgICAgICAgbXVsdGlwbGllciA9IDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdtJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnbSc7XG4gICAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWUuc2VhcmNoKCdoJykgPiAtMSl7XG4gICAgICAgIHRpbWVTeW1ib2wgPSAnaCc7XG4gICAgICAgIG11bHRpcGxpZXIgPSA2MCAqIDYwICogMTAwMDtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZS5zZWFyY2goJ2QnKSA+IC0xKXtcbiAgICAgICAgdGltZVN5bWJvbCA9ICdkJztcbiAgICAgICAgbXVsdGlwbGllciA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS5yZXBsYWNlKHRpbWVTeW1ib2wsJycpKSAqIG11bHRpcGxpZXI7XG4gICAgfSxcbiAgICBwYXJzZU51bWJlcjogZnVuY3Rpb24obnVtYmVyLCBsb25nUmVzdWx0KXtcbiAgICAgIGlmICghbnVtYmVyICYmIG51bWJlciAhPT0gMCkgcmV0dXJuIG51bWJlcjtcbiAgICAgIGlmIChudW1iZXIgPT09IHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlWYWx1ZSB8fCBudW1iZXIgPT09IHdpZGdldHNTdGF0ZXNbMF0uZW1wdHlEYXRhKSByZXR1cm4gbnVtYmVyO1xuICAgICAgbnVtYmVyID0gcGFyc2VGbG9hdChudW1iZXIpO1xuICAgICAgaWYgKG51bWJlciA+IDEwMDAwMCAmJiAhbG9uZ1Jlc3VsdCl7XG4gICAgICAgIHZhciBudW1iZXJTdHIgPSBudW1iZXIudG9GaXhlZCgwKTtcbiAgICAgICAgdmFyIHBhcmFtZXRlciA9ICdLJyxcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgaWYgKG51bWJlciA+IDEwMDAwMDAwMDApe1xuICAgICAgICAgIHNwbGljZWQgPSBudW1iZXJTdHIuc2xpY2UoMCwgbnVtYmVyU3RyLmxlbmd0aCAtIDcpO1xuICAgICAgICAgIHBhcmFtZXRlciA9ICdCJztcbiAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPiAxMDAwMDAwKXtcbiAgICAgICAgICBzcGxpY2VkID0gbnVtYmVyU3RyLnNsaWNlKDAsIG51bWJlclN0ci5sZW5ndGggLSA0KTtcbiAgICAgICAgICBwYXJhbWV0ZXIgPSAnTSc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5hdHVyYWwgPSBzcGxpY2VkLnNsaWNlKDAsIHNwbGljZWQubGVuZ3RoIC0gMik7XG4gICAgICAgIHZhciBkZWNpbWFsID0gc3BsaWNlZC5zbGljZShzcGxpY2VkLmxlbmd0aCAtIDIpO1xuICAgICAgICByZXR1cm4gbmF0dXJhbCArICcuJyArIGRlY2ltYWwgKyAnICcgKyBwYXJhbWV0ZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaXNEZWNpbWFsID0gKG51bWJlciAlIDEpID4gMDtcbiAgICAgICAgaWYgKGlzRGVjaW1hbCl7XG4gICAgICAgICAgdmFyIHByZWNpc2lvbiA9IDI7XG4gICAgICAgICAgaWYgKG51bWJlciA8IDEpe1xuICAgICAgICAgICAgcHJlY2lzaW9uID0gODtcbiAgICAgICAgICB9IGVsc2UgaWYgKG51bWJlciA8IDEwKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDY7XG4gICAgICAgICAgfSBlbHNlIGlmIChudW1iZXIgPCAxMDAwKXtcbiAgICAgICAgICAgIHByZWNpc2lvbiA9IDQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMucm91bmRBbW91bnQobnVtYmVyLCBwcmVjaXNpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KG51bWJlcikudG9Mb2NhbGVTdHJpbmcoJ3J1LVJVJywgeyBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDIgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJvdW5kQW1vdW50OiBmdW5jdGlvbihhbW91bnQsIGRlY2ltYWwsIGRpcmVjdGlvbil7XG4gICAgICBhbW91bnQgPSBwYXJzZUZsb2F0KGFtb3VudCk7XG4gICAgICBpZiAoIWRlY2ltYWwpIGRlY2ltYWwgPSA4O1xuICAgICAgaWYgKCFkaXJlY3Rpb24pIGRpcmVjdGlvbiA9ICdyb3VuZCc7XG4gICAgICBkZWNpbWFsID0gTWF0aC5wb3coMTAsIGRlY2ltYWwpO1xuICAgICAgcmV0dXJuIE1hdGhbZGlyZWN0aW9uXShhbW91bnQgKiBkZWNpbWFsKSAvIGRlY2ltYWw7XG4gICAgfSxcbiAgICBzdHlsZXNoZWV0OiBmdW5jdGlvbigpe1xuICAgICAgaWYgKHdpZGdldERlZmF1bHRzLnN0eWxlX3NyYyAhPT0gZmFsc2Upe1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMuc3R5bGVfc3JjIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKycvZGlzdC8nK3dpZGdldERlZmF1bHRzLmNzc0ZpbGVOYW1lO1xuICAgICAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgbGluay5zZXRBdHRyaWJ1dGUoJ3JlbCcsICdzdHlsZXNoZWV0Jyk7XG4gICAgICAgIGxpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgdXJsKTtcbiAgICAgICAgcmV0dXJuIChkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZj1cIicrdXJsKydcIl0nKSkgPyAnJyA6IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICB9XG4gICAgfSxcbiAgICB3aWRnZXRNYWluRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgcmV0dXJuIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRIZWFkZXJFbGVtZW50KGluZGV4KSArIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRUYWJsZUVsZW1lbnQoaW5kZXgpO1xuICAgIH0sXG4gICAgd2lkZ2V0SGVhZGVyRWxlbWVudDogZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgdmFyIHRpdGxlID0gKHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzKVxuICAgICAgICA/ICcnXG4gICAgICAgIDogJzxoMSBjbGFzcz1cImNwLXdpZGdldC10aXRsZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInRpdGxlXCIpKyc8L2gxPic7XG4gICAgICByZXR1cm4gdGl0bGUgK1xuICAgICAgICAnPHNlY3Rpb24gY2xhc3M9XCJjcC13aWRnZXQtaGVhZGVyXCI+JyArXG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLndpZGdldFNlbGVjdEVsZW1lbnQoaW5kZXgsICdwcmltYXJ5X2N1cnJlbmN5JykgK1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy53aWRnZXRTZWxlY3RFbGVtZW50KGluZGV4LCAnZGF0YV90eXBlJykgK1xuICAgICAgICAnPC9zZWN0aW9uPic7XG4gICAgfSxcbiAgICB3aWRnZXRUYWJsZUVsZW1lbnQ6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICByZXR1cm4gJzxzZWN0aW9uIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2hlYWRcIj4nICtcbiAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19yb3dcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tbmFtZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl90aXRsZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcIm5hbWVcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YS12YWx1ZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9wcmljZVwiPicrd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBcInByaWNlXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLWNoYW5nZSBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9jaGFuZ2VcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJjaGFuZ2VcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2JvZHlcIj4nICtcbiAgICAgICAgICAgICAgICAgICgoZGF0YS5pc0RhdGEpXG4gICAgICAgICAgICAgICAgICAgID8gd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudERhdGEoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RnVuY3Rpb25zLndpZGdldFRhYmxlRWxlbWVudE1lc3NhZ2UoaW5kZXgpKSArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICc8L3NlY3Rpb24+JztcbiAgICB9LFxuICAgIHdpZGdldFRhYmxlRWxlbWVudERhdGE6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciByb3dzID0gJyc7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZGdldHNTdGF0ZXNbaW5kZXhdWydjdXJyZW5jeV9saXN0J10ubGVuZ3RoOyBpKyspe1xuICAgICAgICB2YXIgY3VycmVuY3kgPSB3aWRnZXRzU3RhdGVzW2luZGV4XVsnY3VycmVuY3lfbGlzdCddW2ldO1xuICAgICAgICB2YXIgZGF0YSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnRpY2tlcltjdXJyZW5jeV07XG4gICAgICAgIHZhciBkYXRhVHlwZSA9ICh3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ3ZvbHVtZScpXG4gICAgICAgICAgPyB3aWRnZXRzU3RhdGVzW2luZGV4XS5kYXRhX3R5cGUudG9Mb3dlckNhc2UoKSArICdfMjRoJ1xuICAgICAgICAgIDogd2lkZ2V0c1N0YXRlc1tpbmRleF0uZGF0YV90eXBlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJvd3MgKz0gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX3Jvd1wiPicrXG4gICAgICAgICAgICAgICAgICAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicrIHdpZGdldEZ1bmN0aW9ucy5jb2luX2xpbmsoY3VycmVuY3ksIGluZGV4KSArJ1wiPjwvYT4nICtcbiAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXdpZGdldC10YWJsZV9fY2VsbCBjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nKyBjdXJyZW5jeSArJy9sb2dvLnBuZ1wiIGFsdD1cIlwiPicgK1xuICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94XCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1uYW1lX190ZXh0LWJveC0tbmFtZSBuYW1lVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nKygoZGF0YSkgPyBkYXRhLm5hbWUgOiBcIk5vIGRhdGFcIikrJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLW5hbWVfX3RleHQtYm94LS1zeW1ib2wgc3ltYm9sVGlja2VyJytjdXJyZW5jeS50b1VwcGVyQ2FzZSgpKydcIj4nKygoZGF0YSkgPyBkYXRhLnN5bWJvbCA6IFwiXCIpKyc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsIGNwLXdpZGdldC10YWJsZV9fY2VsbC0tZGF0YVwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiY3Atd2lkZ2V0LXRhYmxlX19jZWxsLS1kYXRhLXZhbHVlIHBhcnNlTnVtYmVyICcrZGF0YVR5cGUrJ1RpY2tlcicrY3VycmVuY3kudG9VcHBlckNhc2UoKSsnXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKChkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gd2lkZ2V0RnVuY3Rpb25zLnBhcnNlTnVtYmVyKGRhdGFbZGF0YVR5cGVdLCB0cnVlKSArICcgJyArICgod2lkZ2V0c1N0YXRlc1tpbmRleF0uc2hvd19kZXRhaWxzX2N1cnJlbmN5KSA/IHdpZGdldHNTdGF0ZXNbaW5kZXhdLnByaW1hcnlfY3VycmVuY3kudG9VcHBlckNhc2UoKSA6ICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RGVmYXVsdHMuZW1wdHlEYXRhKSArXG4gICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGwtLWRhdGEtY2hhbmdlIGNwLXdpZGdldF9fcmFuaycrICgoZGF0YSAmJiBkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddID4gMCkgPyAnIGNwLXdpZGdldF9fcmFuay11cCcgOiAoZGF0YSAmJiBkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddIDwgMCkgPyAnIGNwLXdpZGdldF9fcmFuay1kb3duJyA6ICcgY3Atd2lkZ2V0X19yYW5rLW5ldXRyYWwnKSArJyAnK2RhdGFUeXBlKydfY2hhbmdlXzI0aFRpY2tlcicrY3VycmVuY3kudG9VcHBlckNhc2UoKSsnXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKChkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gKCFkYXRhW2RhdGFUeXBlKydfY2hhbmdlXzI0aCddICYmIGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10gIT09IDApID8gd2lkZ2V0RGVmYXVsdHMuZW1wdHlEYXRhIDogd2lkZ2V0RnVuY3Rpb25zLnJvdW5kQW1vdW50KGRhdGFbZGF0YVR5cGUrJ19jaGFuZ2VfMjRoJ10sIDIpKyclJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2lkZ2V0RGVmYXVsdHMuZW1wdHlEYXRhKStcbiAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJvd3M7XG4gICAgfSxcbiAgICB3aWRnZXRUYWJsZUVsZW1lbnRNZXNzYWdlOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICB2YXIgbWVzc2FnZSA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLm1lc3NhZ2U7XG4gICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX3JvdyBjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl9tZXNzYWdlXCI+JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtdGFibGVfX2NlbGxcIj4nKyAod2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCBtZXNzYWdlKSkgKyc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRTZWxlY3RFbGVtZW50OiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgdmFyIHRpdGxlID0gJyc7XG4gICAgICB2YXIgYnV0dG9ucyA9ICcnO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbCsnX2xpc3QnXS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWwrJ19saXN0J11baV07XG4gICAgICAgIGJ1dHRvbnMgKz0gJzxidXR0b24gY2xhc3M9XCInKyAoKGRhdGEudG9Mb3dlckNhc2UoKSA9PT0gd2lkZ2V0c1N0YXRlc1tpbmRleF1bbGFiZWxdLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2NwLXdpZGdldC1hY3RpdmUgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnKSArICgobGFiZWwgPT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyAnJyA6ICdjcC10cmFuc2xhdGlvbiB0cmFuc2xhdGlvbl8nICsgZGF0YS50b0xvd2VyQ2FzZSgpKSArJ1wiIGRhdGEtb3B0aW9uPVwiJytkYXRhKydcIj4nKygobGFiZWwgIT09ICdwcmltYXJ5X2N1cnJlbmN5JykgPyB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIGRhdGEudG9Mb3dlckNhc2UoKSkgOiBkYXRhKSsnPC9idXR0b24+J1xuICAgICAgfVxuICAgICAgaWYgKGxhYmVsID09PSAnZGF0YV90eXBlJykgdGl0bGUgPSB3aWRnZXRGdW5jdGlvbnMuZ2V0VHJhbnNsYXRpb24oaW5kZXgsIFwic2hvd1wiKTtcbiAgICAgIGlmIChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSB0aXRsZSA9IHdpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwcmljZV9pblwiKTtcbiAgICAgIHJldHVybiAnPGRpdiBkYXRhLXR5cGU9XCInK2xhYmVsKydcIiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RcIj4nICtcbiAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycrIGxhYmVsICsnXCI+Jyt0aXRsZSsnPC9sYWJlbD4nICtcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjcC13aWRnZXQtc2VsZWN0X19vcHRpb25zXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImFycm93LWRvd24gJysgKChsYWJlbCA9PT0gJ3ByaW1hcnlfY3VycmVuY3knKSA/ICcnIDogJ2NwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uXycgKyB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgKydcIj4nKyAoKGxhYmVsICE9PSAncHJpbWFyeV9jdXJyZW5jeScpID8gd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9uKGluZGV4LCB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0udG9Mb3dlckNhc2UoKSkgOiB3aWRnZXRzU3RhdGVzW2luZGV4XVtsYWJlbF0pICsnPC9zcGFuPicgK1xuICAgICAgICAnPGRpdiBjbGFzcz1cImNwLXdpZGdldC1zZWxlY3RfX2Ryb3Bkb3duXCI+JyArXG4gICAgICAgIGJ1dHRvbnMgK1xuICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgJzwvZGl2Pic7XG4gICAgfSxcbiAgICB3aWRnZXRGb290ZXI6IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgIHZhciBpc1dvcmRwcmVzcyA9IHdpZGdldHNTdGF0ZXNbaW5kZXhdLmlzV29yZHByZXNzO1xuICAgICAgcmV0dXJuIChpc1dvcmRwcmVzcykgPyAnJyA6ICc8cCBjbGFzcz1cImNwLXdpZGdldC1mb290ZXIgY3Atd2lkZ2V0LWZvb3Rlci0tJytpbmRleCsnXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImNwLXRyYW5zbGF0aW9uIHRyYW5zbGF0aW9uX3Bvd2VyZWRfYnlcIj4nK3dpZGdldEZ1bmN0aW9ucy5nZXRUcmFuc2xhdGlvbihpbmRleCwgXCJwb3dlcmVkX2J5XCIpICsgJyA8L3NwYW4+JyArXG4gICAgICAgICc8aW1nIHN0eWxlPVwid2lkdGg6IDE2cHhcIiBzcmM9XCInKyB3aWRnZXRGdW5jdGlvbnMubWFpbl9sb2dvX2xpbmsoKSArJ1wiIGFsdD1cIlwiLz4nICtcbiAgICAgICAgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInKyB3aWRnZXRGdW5jdGlvbnMubWFpbl9wYWdlX2xpbmsoaW5kZXgpICsnXCI+Y29pbnBhcHJpa2EuY29tPC9hPicgK1xuICAgICAgICAnPC9wPic7XG4gICAgfSxcbiAgICBnZXRJbWFnZTogZnVuY3Rpb24oaW5kZXgsIGN1cnJlbmN5KXtcbiAgICAgIHZhciBkYXRhID0gd2lkZ2V0c1N0YXRlc1tpbmRleF07XG4gICAgICB2YXIgaW1nQ29udGFpbmVycyA9IGRhdGEubWFpbkVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY3Atd2lkZ2V0X19pbWcnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW1nQ29udGFpbmVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBpbWdDb250YWluZXIgPSBpbWdDb250YWluZXJzW2ldO1xuICAgICAgICBpbWdDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY3Atd2lkZ2V0X19pbWctLWhpZGRlbicpO1xuICAgICAgICB2YXIgaW1nID0gaW1nQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgICAgICB2YXIgbmV3SW1nID0gbmV3IEltYWdlO1xuICAgICAgICBuZXdJbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaW1nLnNyYyA9IHRoaXMuc3JjO1xuICAgICAgICAgIGltZ0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjcC13aWRnZXRfX2ltZy0taGlkZGVuJyk7XG4gICAgICAgIH07XG4gICAgICAgIG5ld0ltZy5zcmMgPSB3aWRnZXRGdW5jdGlvbnMuaW1nX3NyYyhkYXRhLmN1cnJlbmN5KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGltZ19zcmM6IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHJldHVybiAnaHR0cHM6Ly9jb2lucGFwcmlrYS5jb20vY29pbi8nK2lkKycvbG9nby5wbmcnO1xuICAgIH0sXG4gICAgY29pbl9saW5rOiBmdW5jdGlvbihpZCwgaW5kZXgpe1xuICAgICAgcmV0dXJuICdodHRwczovL2NvaW5wYXByaWthLmNvbScgKyAnL2NvaW4vJyArIGlkICsgd2lkZ2V0RnVuY3Rpb25zLmdldF91dG1fbGluayhpbmRleClcbiAgICB9LFxuICAgIG1haW5fcGFnZV9saW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJ2h0dHBzOi8vY29pbnBhcHJpa2EuY29tJyArIHdpZGdldEZ1bmN0aW9ucy5nZXRfdXRtX2xpbmsoaW5kZXgpO1xuICAgIH0sXG4gICAgZ2V0X3V0bV9saW5rOiBmdW5jdGlvbihpbmRleCl7XG4gICAgICByZXR1cm4gJz91dG1fc291cmNlPXdpZGdldCZ1dG1fbWVkaXVtPScrICgod2lkZ2V0c1N0YXRlc1tpbmRleF0uaXNXb3JkcHJlc3MpID8gJ3dvcmRwcmVzcycgOiAnaW5saW5lJykgKycmdXRtX2NhbXBhaWduPXJhbmtpbmcnO1xuICAgIH0sXG4gICAgbWFpbl9sb2dvX2xpbms6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gd2lkZ2V0RGVmYXVsdHMuaW1nX3NyYyB8fCB3aWRnZXREZWZhdWx0cy5vcmlnaW5fc3JjICsnL2Rpc3QvaW1nL2xvZ29fd2lkZ2V0LnN2ZydcbiAgICB9LFxuICAgIGdldFNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc2NyaXB0W2RhdGEtY3AtbWFya2V0LXdpZGdldF0nKTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9uOiBmdW5jdGlvbihpbmRleCwgbGFiZWwpe1xuICAgICAgdmFyIHRleHQgPSAod2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW3dpZGdldHNTdGF0ZXNbaW5kZXhdLmxhbmd1YWdlXSkgPyB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbd2lkZ2V0c1N0YXRlc1tpbmRleF0ubGFuZ3VhZ2VdW2xhYmVsXSA6IG51bGw7XG4gICAgICBpZiAoIXRleHQgJiYgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zWydlbiddKSB7XG4gICAgICAgIHRleHQgPSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbJ2VuJ11bbGFiZWxdO1xuICAgICAgfVxuICAgICAgaWYgKCF0ZXh0KSB7XG4gICAgICAgIHJldHVybiB3aWRnZXRGdW5jdGlvbnMuYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb24oaW5kZXgsIGxhYmVsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuICAgIH0sXG4gICAgYWRkTGFiZWxXaXRob3V0VHJhbnNsYXRpb246IGZ1bmN0aW9uKGluZGV4LCBsYWJlbCl7XG4gICAgICBpZiAoIXdpZGdldERlZmF1bHRzLnRyYW5zbGF0aW9uc1snZW4nXSkgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgIHJldHVybiB3aWRnZXRzU3RhdGVzW2luZGV4XS5ub1RyYW5zbGF0aW9uTGFiZWxzLnB1c2gobGFiZWwpO1xuICAgIH0sXG4gICAgZ2V0VHJhbnNsYXRpb25zOiBmdW5jdGlvbihsYW5nKXtcbiAgICAgIGlmICghd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddKXtcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB2YXIgdXJsID0gd2lkZ2V0RGVmYXVsdHMubGFuZ19zcmMgIHx8IHdpZGdldERlZmF1bHRzLm9yaWdpbl9zcmMgKyAnL2Rpc3QvbGFuZyc7XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwgKyAnLycgKyBsYW5nICsgJy5qc29uJyk7XG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICB3aWRnZXRGdW5jdGlvbnMudXBkYXRlV2lkZ2V0VHJhbnNsYXRpb25zKGxhbmcsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5vbkVycm9yUmVxdWVzdCgwLCB4aHIpO1xuICAgICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICAgIGRlbGV0ZSB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ107XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLm9uRXJyb3JSZXF1ZXN0KDAsIHhocik7XG4gICAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLmdldFRyYW5zbGF0aW9ucygnZW4nKTtcbiAgICAgICAgICBkZWxldGUgd2lkZ2V0RGVmYXVsdHMudHJhbnNsYXRpb25zW2xhbmddO1xuICAgICAgICB9O1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB3aWRnZXREZWZhdWx0cy50cmFuc2xhdGlvbnNbbGFuZ10gPSB7fTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuICBcbiAgZnVuY3Rpb24gaW5pdFdpZGdldHMoKXtcbiAgICBpZiAoIXdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0KXtcbiAgICAgIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gdHJ1ZTtcbiAgICAgIHZhciBtYWluRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHdpZGdldERlZmF1bHRzLmNsYXNzTmFtZSkpO1xuICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0RnVuY3Rpb25zLnNldFdpZGdldENsYXNzKG1haW5FbGVtZW50cyk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICB2YXIgc2NyaXB0RWxlbWVudCA9IHdpZGdldEZ1bmN0aW9ucy5nZXRTY3JpcHRFbGVtZW50KCk7XG4gICAgICBpZiAoc2NyaXB0RWxlbWVudCAmJiBzY3JpcHRFbGVtZW50LmRhdGFzZXQgJiYgc2NyaXB0RWxlbWVudC5kYXRhc2V0LmNwTWFya2V0V2lkZ2V0KXtcbiAgICAgICAgdmFyIGRhdGFzZXQgPSBKU09OLnBhcnNlKHNjcmlwdEVsZW1lbnQuZGF0YXNldC5jcE1hcmtldFdpZGdldCk7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhc2V0KSl7XG4gICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0KTtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgdmFyIGtleSA9IGtleXNbal0ucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICAgICAgICB3aWRnZXREZWZhdWx0c1trZXldID0gZGF0YXNldFtrZXlzW2pdXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgd2lkZ2V0c1N0YXRlcyA9IFtdO1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbWFpbkVsZW1lbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICB2YXIgbmV3U2V0dGluZ3MgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHdpZGdldERlZmF1bHRzKSk7XG4gICAgICAgICAgbmV3U2V0dGluZ3MuaXNXb3JkcHJlc3MgPSBtYWluRWxlbWVudHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCd3b3JkcHJlc3MnKTtcbiAgICAgICAgICBuZXdTZXR0aW5ncy5tYWluRWxlbWVudCA9IG1haW5FbGVtZW50c1tpXTtcbiAgICAgICAgICB3aWRnZXRzU3RhdGVzLnB1c2gobmV3U2V0dGluZ3MpO1xuICAgICAgICAgIHdpZGdldEZ1bmN0aW9ucy5pbml0KGkpO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfVxuICB9XG4gIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXSA9IHt9O1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgaW5pdFdpZGdldHMsIGZhbHNlKTtcbiAgd2luZG93W3dpZGdldERlZmF1bHRzLm9iamVjdE5hbWVdLmJpbmRXaWRnZXQgPSBmdW5jdGlvbigpe1xuICAgIHdpbmRvd1t3aWRnZXREZWZhdWx0cy5vYmplY3ROYW1lXS5pbml0ID0gZmFsc2U7XG4gICAgaW5pdFdpZGdldHMoKTtcbiAgfTtcbn0pKCk7Il19
