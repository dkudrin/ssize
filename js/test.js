var WshShell = new ActiveXObject("WScript.Shell");

// download a file
var source = 'http://download.drp.su/camaro/updates/drp.7z';
var splitted = source.split('\/');
var target = WshShell.CurrentDirectory + '\\' + splitted[splitted.length - 1];
downloadFile({
source: source,
target: target,
async: true,
callback: function(a) {}
});


function log(message) {
	var el = document.createElement('div');
	el.className = 'message';
	el.innerHTML = message;
	document.getElementById('container').appendChild(el);
}

function logError(errorMessage) {
	var el = document.createElement('div');
	el.className = 'error';
	el.innerHTML = errorMessage;
	document.getElementById('container').appendChild(el);
}

function getTimeFromDate(d) {
     return ((d.getHours() < 10)?"0":"") + d.getHours() +":"+ ((d.getMinutes() < 10)?"0":"") + d.getMinutes() +":"+ ((d.getSeconds() < 10)?"0":"") + d.getSeconds();
}
