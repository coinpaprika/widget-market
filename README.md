# Coinpaprika Market Widget
<img src="https://i.imgur.com/qeKsV49.png" alt="" data-canonical-src="https://i.imgur.com/qeKsV49.png"/>

## How to use

### Parameters: 

#### In div element: data-/parameter/="/value/"
example:
```html
<div class="coinpaprika-market-widget" 
     data-currency-list='["bch-bitcoin-cash", "eth-ethereum", "xrp-xrp", "bch-bitcoin-cash"]'  
     data-update-active="true" 
     data-update-timeout="30s"></div>
```

#### In script element: "data-cp-market-widget='{ "/parameter/": /value/ }'"
##### this parameters is set to all widgets on page
example:
```html
<div class="coinpaprika-market-widget"></div>
<script src="./src/widget.js"
        data-cp-market-widget='{
            "language": "pl",
            "currency-list": ["bch-bitcoin-cash", "eth-ethereum", "xrp-xrp", "bch-bitcoin-cash"],
            "origin-src": "."
        }'>
</script>
```
###
### API:
**currency-list** - Array of currency IDs that you can get from [API](https://api.coinpaprika.com/#tag/coins) ex. 'btc-bitcoin'
```text
default: ["btc-bitcoin", "eth-ethereum", "xrp-xrp", "bch-bitcoin-cash"]
```

**update-active** - bool value is live data updates active
```text
default: false
```

**update-timeout** - Update interval '30s', '1m', '5m', '10m', '30m'
```text
default: '30s'
```

**language** - text translation from files in dist/lang/
```text
default: 'en'
```

**origin-src** - custom link to `/dist` directory
```text
default: 'https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.2'
```

**style-src** - custom link to css file, if you don't want to fetch styles from js set as `false`
```text
default: null
```

**img-src** - custom link to img folder
```text
default: null
```

**lang-src** - custom link to lang folder
```text
default: null
```

### Night Mode: 

<img src="https://i.imgur.com/EWd0NEf.png" alt="" data-canonical-src="https://i.imgur.com/EWd0NEf.png" height="148" />

######

Enable styling for dark backgrounds by adding `cp-widget__night-mode` class to widget element


```html
<div class="coinpaprika-market-widget cp-widget__night-mode"></div>
```


### Copy paste this code in your HTML, replacing data parameters

```html
<div class="coinpaprika-market-widget" 
     data-currency-list='["bch-bitcoin-cash", "eth-ethereum", "xrp-xrp", "bch-bitcoin-cash"]'
     data-update-active="false" 
     data-update-timeout="30s"></div>
<script src="https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.2/dist/widget.min.js"></script>
```

### Via npm

`npm i @coinpaprika/widget-market --save`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-market-widget"></div>
<script src="../node_modules/@coinpaprika/widget-market/dist/widget.min.js" 
        data-cp-market-widget='{
            "origin-src": "../node_modules/@coinpaprika/widget-market"
        }'></script>
```

### Via bower

`bower install coinpaprika-widget-market --save`

Then add this to your HTML, replacing data parameters

```html
<div class="coinpaprika-market-widget"></div>
<script src="../bower_components/coinpaprika-widget-market/dist/widget.min.js" 
        data-cp-market-widget='{
            "origin-src": "../bower_components/coinpaprika-widget-market"
        }'></script>
```

### Using multiple widgets in same page

```html
<div class="coinpaprika-market-widget"></div>
<div class="coinpaprika-market-widget" 
     data-currency-list='["bch-bitcoin-cash", "eth-ethereum", "xrp-xrp", "bch-bitcoin-cash"]'></div>
<script src="https://cdn.jsdelivr.net/npm/@coinpaprika/widget-market@1.0.2/dist/widget.min.js"></script>
```

## Live Demo

[http://jsfiddle.net/jcrzb5ha/](http://jsfiddle.net/jcrzb5ha/8/)