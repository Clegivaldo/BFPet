module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // expo + react-native presets already handle JSX and modern syntax
    plugins: [],
  };
};
