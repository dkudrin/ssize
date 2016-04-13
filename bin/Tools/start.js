var src = WScript.Arguments.Item(0);

try {
  new ActiveXObject('WScript.Shell').run(src, 0, true);
} catch (err) {
  WScript.Quit(0);
}
