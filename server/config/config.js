//configure app environment. 'production' is the default setting on heroku.
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test'){
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
};
