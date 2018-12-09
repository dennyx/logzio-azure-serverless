const logger = require('logzio-nodejs');
const DataParser = require('./data-parser');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  context.log('Starting Logz.io Azure function.');
  const logzioShipper = logger.createLogger({
    token: '<ACCOUNT-TOKEN>',
    type: 'eventHub',
    host: '<LISTENER-URL>',
    protocol: 'https',
    internalLogger: context,
    compress: true,
    debug: true,
  });

  const dataParser = new DataParser(context);
  const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
  context.log(`About to send ${parseMessagesArray.length} logs...`);

  parseMessagesArray.forEach((log) => {
    logzioShipper.log(log);
  });

  logzioShipper.sendAndClose();
  context.done();
};