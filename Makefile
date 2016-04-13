SHA = $(shell git rev-parse --short HEAD)

FILENAME ?= $(shell echo DriverPack-Online-${SHA})
NODE_ENV ?= production
MODE ?= online

ifeq ($(shell [ -d ${HOME}/.signcode ]; echo $$?), 0)
	SIGNCODE = ${HOME}/.signcode
endif

.PHONY: build build-test-soft install

build:
	find . -name "*:Zone.Identifier" -exec rm -rf {} \;
	7z a "${FILENAME}.7z" bin DriverPack.exe
	cat 7zsd.sfx sfxconfig "${FILENAME}.7z" > "${FILENAME}.exe"
	rm "${FILENAME}.7z"
ifdef SIGNCODE
	signcode  -spc "${SIGNCODE}/authenticode.spc" \
	          -v "${SIGNCODE}/authenticode.pvk" \
	          -a sha1 \
	          -$ commercial \
	          -n DriverPack\ Solution \
	          -i http://drp.su/ \
	          -t http://timestamp.verisign.com/scripts/timstamp.dll \
	          -tr 10 "${FILENAME}.exe" \
	          < "${SIGNCODE}/authenticode_pass.txt"
	rm -f "${FILENAME}.exe.bak"
endif

build-test-soft:
	$(MAKE) SOFT_ENDPOINT=test build