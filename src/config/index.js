export default {
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
    externalUrl: process.env.EXTERNAL_URL || '',
    port: process.env.PORT || 443,
    host: '0.0.0.0'
  },
  logLevel: 'verbose'
};
