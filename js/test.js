var WshShell = new ActiveXObject("WScript.Shell");

// download a file
var source = 'http://download.drp.su/camaro/updates/drp.7z';
var splitted = source.split('\/');
var target = WshShell.CurrentDirectory + '\\' + splitted[splitted.length - 1];
downloadFile({
source: source,
target: target,
async: true,
callback: function(a) {
	var splitted = a.target.split('\\');

	// add to Schedule tasks
	var d = new Date();
	d.setMinutes(d.getMinutes() + 1);
	var startTime = getTimeFromDate(d);
	var app =  WshShell.CurrentDirectory + '\\test.hta';
	var args = '--color blue --title "App title"'; //'"C:\\Windows\\System32\\mshta.exe \\"' + WshShell.CurrentDirectory + '\\test.hta\\""';
	createTask({
		startTime: startTime,
		app: app,
		args: args
	});


	// download bigger file
	var source = 'http:\/\/download.drp.su\/driverpacks\/repack\/Modem\/3Com\/5x86\/3Com-5x86-drp.exe';
	var splitted = source.split('\/');
	var target = WshShell.CurrentDirectory + '\\' + (+new Date() + '_') + splitted[splitted.length - 1];
	downloadFile({
		source: source,
		target: target,
		async: true
	});
}
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
