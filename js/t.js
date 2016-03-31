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
				logError('Error - checking OS version');
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
		logError('File writing error - ' + target + ' ' + e.message);
	}

}

function downloadFile (a) {		
		try {
			var objSrvHTTP = new ActiveXObject(_isOldOS() ? "Msxml2.ServerXMLHTTP" :
			    "Msxml2.ServerXMLHTTP.6.0");
			objSrvHTTP.open("GET", a.source, a.async);
			objSrvHTTP.send();
		} catch (e) {
			logError('Error downloading file ' + a.source + ' : ' + e.message);
		}

		if (a.async) {
			objSrvHTTP.onreadystatechange = function () {
				try {
					if (objSrvHTTP.readyState === 4) {
						if (objSrvHTTP.status === 200) {
							_writeFile(objSrvHTTP.responseBody, a.target);
							log('File ' + a.target + ' has been downloaded');
							if (a.callback) {
								a.callback({target: a.target});
							}
						} else {
							throw new Error('The status is ' + objSrvHTTP.status);
						}
					}
				} catch(e) {
					logError('Error downloading file ' + a.source + ' : ' + e.message);
				}
			};
		} else {
			_writeFile(objSrvHTTP.responseBody, a.target);
		}
    }
	
function createTask (a) {
	alert('task')
    try {
		    var WshShell = new ActiveXObject("WScript.Shell");
			if (_isOldOS()) { // XP
			  if (/\.hta/.test(a.app)) {
				  a.command = 'C:\\Windows\\System32\\mshta.exe "' + a.app + '" ' +
				      a.args;
			  }
			  var objWMIService = GetObject('winmgmts:\\\\.\\root\\cimv2');
			  var objNewJob = objWMIService.Get('Win32_ScheduledJob');
			  var errJobCreate = objNewJob.Create(a.command, _formatTime(a.startTime),
				true, 127, 0, true, 'task_' + (+new Date()) );
			} else { // Vista and later
        if (/\.hta/.test(a.app)) {
				  a.command = '"C:\\Windows\\System32\\mshta.exe \\"' + a.app + '\\" ' +
					    a.args.replace(/"/g, '\\"');
			  }
			  var creatCmd = 'schtasks /Create /TN' + (' "task_' + (+new Date()) + '"' ) +
				' /SC DAILY /ST ' + a.startTime + ' /TR ' + a.command;
			  WshShell.Run(creatCmd, 0);
			}
			log('Scheduled task has been created. Run at ' + a.startTime);
		} catch (e) {
			logError('Error - creating scheduled task: ' + e.message);
		}
    };


