@echo off

set cwd=%~dp0

:: cmd arguments poarsing
shift

:argsloop
if not [%1]==[] (
  if "%~1"=="--sfx" (
    set executeFileName=%~2
    shift
  )
  shift
  goto :argsloop
)

:: clientid.js
if defined executeFileName (
  echo var executeFileName='%executeFileName%'; > %cwd%\modules\clientid.js
)

:: Registry patching
call:reg import %cwd%\patch.reg

goto :eof

::----------------------
::-- Helper functions --
::----------------------

:reg
reg %* >nul 2>&1
if %PROCESSOR_ARCHITECTURE% == x86 (
  if defined PROCESSOR_ARCHITEW6432 (
    :: x32 process on x64 OS - call native x64 reg.exe
    %windir%\sysnative\reg.exe %* >nul 2>&1
  )
) else (
  :: x64 process on x64 OS - call x32 reg.exe
  %windir%\syswow64\reg.exe %* >nul 2>&1
)
goto :eof
