#!/bin/bash

react-native bundle --entry-file index.ios.js --platform ios --dev true --reset-cache --bundle-output /Users/kilojam/jitsidev/debug/main.jsbundle

react-native bundle --entry-file index.ios.js --platform ios --dev false --reset-cache --bundle-output /Users/kilojam/jitsidev/release/main.jsbundle
 
