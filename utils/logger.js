/**
 * Simple logger utility
 * Logs messages with timestamp and context
 */

const log = (level, message, data = {}, context = '') => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : '';
  const dataStr = Object.keys(data).length > 0 ? JSON.stringify(data) : '';
  
  const logMessage = `[${timestamp}] [${level}] ${contextStr} ${message} ${dataStr}`;
  
  switch (level) {
    case 'ERROR':
      console.error(logMessage);
      break;
    case 'WARN':
      console.warn(logMessage);
      break;
    case 'INFO':
      console.log(logMessage);
      break;
    default:
      console.log(logMessage);
  }
};

module.exports = {
  info: (message, data, context) => log('INFO', message, data, context),
  warn: (message, data, context) => log('WARN', message, data, context),
  error: (message, error, context) => {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    log('ERROR', message, errorData, context);
  }
};

