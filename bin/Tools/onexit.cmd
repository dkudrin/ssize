@echo off

:: register all relevant dll files
for %%G in (
      atl.dll,
      corpol.dll,
      dispex.dll,
      jscript.dll,
      Mshtml.dll,
      mshta.dll,
      scrrun.dll,
      scrobj.dll,
      vbscript.dll,
      wshext.dll,
      wshom.ocx,
      msxml3.dll,
      ole32.dll,
      oleaut32.dll
    ) do (
  regsvr32 /s %%G :: register
)

:: reinitialize wscript
wscript /regserver

:: restart services
call:startService RpcSs
call:startService wmiApSrv
call:startService RpcLocator
call:startService DcomLaunch

goto :eof


::----------------------
::-- Helper functions --
::----------------------

:startService
net start %1 >null 2>&1
if errorlevel 2 goto :eof
net stop %1
sc config %1 start=auto
net start %1
goto :eof
