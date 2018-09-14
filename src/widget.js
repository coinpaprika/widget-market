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