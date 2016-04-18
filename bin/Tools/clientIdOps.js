(function () {

  var Reg = 'HKCU\\SOFTWARE\\drpsu\\';

  var WshShell = new ActiveXObject('WScript.Shell');
  var fso = new ActiveXObject('Scripting.FileSystemObject');

  function RegRead32(key) {
    var ret = '';
    try {
      ret = WshShell.RegRead(key);
    } catch (e) {
      ret = '';
    }
    return ret;
  }

  function RegRead(key) {
    key = key.replace('HKEY_LOCAL_MACHINE\\', 'HKLM\\');
    key = key.replace('HKEY_CURRENT_USER\\', 'HKCU\\');
    var ret = RegRead32(key);
    if (!ret && key.indexOf('\\SOFTWARE\\Microsoft\\') !== -1) {
      key = key.replace('\\SOFTWARE\\Microsoft\\', '\\SOFTWARE\\Wow6432Node\\Microsoft\\');
      ret = RegRead32(key);
    }
    return ret;
  }

  function RegWrite(key, value) {
    WshShell.RegWrite(key, value, 'REG_SZ');
  }

  var clientIdStorage = {
    clientIdKey: Reg + 'ClientID',

    init: function init() {
      if (this.clientId) {
        return this.clientId;
      }
      this.clientId = this.readClientIdFromFile();
      if (this.clientId) {
        alert("got clientId from file " + this.clientId);
        this.saveClientIdToRegistry(this.clientId);
        return this.clientId;
      }
      this.clientId = this.readClientIdFromRegistry();
      if (this.clientId) {
        alert("got clientId from registry " + this.clientId);
        return this.clientId;
      }
      this.clientId = this.generate();
      alert("generated clientId " + this.clientId);
      this.saveClientIdToRegistry(this.clientId);
      return this.clientId;
    },
    generate: function generate() {
      /* eslint-disable */
      var d = new Date().getTime();
      var uuid = 'xxxxxxxxx.xxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 10) % 10 | 0;
        return (c === 'x' ? r : r & 0x7 | 0x8).toString();
      });
      return uuid;
      /* eslint-enable */
    },
    readClientIdFromRegistry: function readClientIdFromRegistry() {
      return RegRead(this.clientIdKey);
    },
    saveClientIdToRegistry: function saveClientIdToRegistry(clientId) {
      RegWrite(this.clientIdKey, clientId);
    },
    parseClientIdJs: function parseClientIdJs(text) {
      text = text.substr(text.indexOf("'") + 1, text.indexOf("'", text.indexOf("'") + 1) - text.indexOf("'") - 1);
      var pos = text.indexOf("_");
      if (pos !== -1) {
        var lenght = text.indexOf(".exe");
        var id = text.substr(pos + 1, lenght - pos - 1);
        return id;
      } else {
        return false;
      }
      
    },
    readClientIdFromFile: function readClientIdFromFile() {
      var file = WshShell.CurrentDirectory + '\\Tools\\modules\\clientid.js';
      if (fso.FileExists(file)) {
        var text = fso.GetFile(file);
        if (text.Size > 0) {
          var contents = text.OpenAsTextStream(1).ReadAll();
          var clientId = this.parseClientIdJs(contents);
          if (clientId) {
            return clientId;
          } else {
            return false;
          }
        }
      }
    }
  };

  window.clientIdStorage = clientIdStorage;
})();