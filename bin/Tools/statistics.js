var statistics = {
  // prod GA
  //_statisticUrl: 'http://www.google-analytics.com/collect?v=1&tid=UA-58593486-1&aip=1',

  // test GA
  //_statisticUrl: 'http://www.google-analytics.com/collect?v=1&tid=UA-63223833-1&aip=1',
  _statisticUrl: 'http://www.google-analytics.com/collect?v=1&tid=UA-69093127-6&aip=1',

  clientId: '',

  init: function init() {
    var clientIdStorage = window.clientIdStorage;
    this.clientId = clientIdStorage.init();
    window.clientId = this.clientId;
  },


  _sendImg: function _sendImg(url) {
    var img = document.createElement('img');
    img.src = url;
    return true;
  },

  compileUrl: function compileUrl(event, dimention) {
    var ec = encodeURIComponent(event.category);
    var ea = encodeURIComponent(event.action);
    var el = encodeURIComponent(event.label);
    var url = this._statisticUrl + '&cid=' + this.clientId + '&t=event' + '&ec=' + ec + '&ea=' + ea + '&el=' + el;
    return url;
  },

  event: function event(_ref) {
    var _ref$category = _ref.category;
    var category = _ref$category === undefined ? 'desktop' : _ref$category;
    var action = _ref.action;
    var _ref$label = _ref.label;
    var label = _ref$label === undefined ? '' : _ref$label;

    // alert("event: " + category + " " + action + " " + label);
    var url = this.compileUrl({ category: category, action: action, label: label });
    this._sendImg(url);
  }
};

statistics.init();
statistics.event({ action: 'Minimal size app opened', label: 's' , category: 'driverpack online'});