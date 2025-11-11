const { getDefaultConfig } = require('expo/metro-config');

// Use Expo's metro config which sets up asset handling for Expo projects
module.exports = getDefaultConfig(__dirname);
