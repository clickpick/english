module.exports = {
  transpileDependencies: [
    '@glidejs/glide'
  ],
  devServer: {
    bonjour: true,
    disableHostCheck: true,
    public: 'dev1.ezavalishin.ru',
    sockHost: 'localhost',
    sockPort: 80,
    port: 80,
    compress: false,
    hot: true,
    transportMode: 'ws',
    injectClient: false,
    historyApiFallback: {
      disableDotRule: true
    },
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
};
