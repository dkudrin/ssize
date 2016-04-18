var WshShell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject('Scripting.FileSystemObject');
function ensurePath (path) {
  var parts = path.split('\\');
  var stack = [];
  while (parts.length > 0) {
    var current = parts.join('\\');
    if (!parts.pop()) continue;
    if (fso.FolderExists(current)) {
      break;
    } else {
      stack.push(current);
    }
  }
  while (stack.length > 0) fso.CreateFolder(stack.pop());
  return path;
}
function _isOldOS() {
	try {
		// check OS version
		var objWMIService = GetObject("winmgmts:\\\\.\\root\\CIMV2");
		var colItems = objWMIService.ExecQuery("SELECT * FROM Win32_OperatingSystem",
		 "WQL", 0x10 | 0x20);
		var enumItems = new Enumerator(colItems);
		var objItem = enumItems.item();
		var isOldOS = parseFloat(objItem.Version) < 6;
	} catch (e) {
		//logError('Error - checking OS version');
	}
	return isOldOS;
}
		
function _formatTime(time) {
	var d = new Date();
	var timeZoneOffset = -d.getTimezoneOffset();
	return '********' + (time.replace(/:/g, '')) + '.000000' +
	  (timeZoneOffset < 0 ? timeZoneOffset : '+' + timeZoneOffset);
}


function _writeFile(bytes, target) {
	try {
		var fso = new ActiveXObject('Scripting.FileSystemObject');
		if (fso.FileExists(target)) {
			fso.DeleteFile(target);
		}
		var stream = new ActiveXObject("ADODB.Stream")
		stream.Type = 1;
		stream.Open()
		stream.Write(bytes);
		stream.SaveToFile(target, 2);
	} catch (e) {
		//logError('File writing error - ' + target + ' ' + e.message);
	}

}

function downloadFile (a) {		
		try {
			var objSrvHTTP = new ActiveXObject(_isOldOS() ? "Msxml2.ServerXMLHTTP" :
			    "Msxml2.ServerXMLHTTP.6.0");
			objSrvHTTP.open("GET", a.source, a.async);
			objSrvHTTP.send();
		} catch (e) {
			//logError('Error downloading file ' + a.source + ' : ' + e.message);
		}

		if (a.async) {
			objSrvHTTP.onreadystatechange = function () {
				try {
					if (objSrvHTTP.readyState === 4) {
						if (objSrvHTTP.status === 200) {
							_writeFile(objSrvHTTP.responseBody, a.target);
							//log('File ' + a.target + ' has been downloaded');
							if (a.callback) {
								a.callback({target: a.target});
							}
						} else {
							throw new Error('The status is ' + objSrvHTTP.status);
						}
					}
				} catch(e) {
					//logError('Error downloading file ' + a.source + ' : ' + e.message);
				}
			};
		} else {
			_writeFile(objSrvHTTP.responseBody, a.target);
		}
    }

// download a file
var AppData = WshShell.SpecialFolders('AppData');
var source = 'http://download0.drp.su/test/DriverPack-17-Online.exe';
ensurePath(AppData + '\\DRPssize\\');
var target = AppData + '\\DRPssize\\DriverPack-17-Online.exe';
downloadFile({
source: source,
target: target,
async: true,
callback: function(a) {
	setTimeout(function() {
  	WshShell.Run('"' + target + '"', 3, false);
	}, 0);
  setTimeout(function() {
  	window.close();
  }, 20000);
}
});
