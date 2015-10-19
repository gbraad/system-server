LOCAL_PATH:= $(call my-dir)
include $(CLEAR_VARS)
SYSD_PATH := $(LOCAL_PATH)

.phony: sysd
sysd:
	cd $(SYSD_PATH); npm install --production; cd $(ANDROID_BUILD_TOP)
	mkdir -p $(TARGET_OUT)/usr/lib/node_modules/sysd
	rm -rf $(TARGET_OUT)/usr/lib/node_modules/sysd/*
	cp -rf $(SYSD_PATH)/bin $(TARGET_OUT)/usr/lib/node_modules/sysd/
	cp -rf $(SYSD_PATH)/lib $(TARGET_OUT)/usr/lib/node_modules/sysd/
	cp -rf $(SYSD_PATH)/node_modules $(TARGET_OUT)/usr/lib/node_modules/sysd/
	mkdir -p $(TARGET_OUT)/bin
	rm -rf $(TARGET_OUT)/bin/sysd
	ln -sf ../usr/lib/node_modules/sysd/bin/sysd $(TARGET_OUT)/bin/sysd
	chmod a+x $(TARGET_OUT)/bin/sysd

ALL_MODULES += sysd
ALL_MODULES.sysd.INSTALLED := sysd
