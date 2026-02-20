/**
 * Logger utility for consistent logging across the application
 */
import config from '../config/env.js';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class Logger {
  constructor() {
    this.isDevelopment = config.isDevelopment();
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data && this.isDevelopment) {
      logMessage += '\n' + JSON.stringify(data, null, 2);
    }
    
    return logMessage;
  }

  info(message, data = null) {
    const formatted = this._formatMessage('INFO', message, data);
    console.log(`${colors.blue}${formatted}${colors.reset}`);
  }

  success(message, data = null) {
    const formatted = this._formatMessage('SUCCESS', message, data);
    console.log(`${colors.green}${formatted}${colors.reset}`);
  }

  warn(message, data = null) {
    const formatted = this._formatMessage('WARN', message, data);
    console.warn(`${colors.yellow}${formatted}${colors.reset}`);
  }

  error(message, error = null) {
    const formatted = this._formatMessage('ERROR', message, error);
    console.error(`${colors.red}${formatted}${colors.reset}`);
    
    if (error && this.isDevelopment) {
      console.error(error);
    }
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      const formatted = this._formatMessage('DEBUG', message, data);
      console.log(`${colors.magenta}${formatted}${colors.reset}`);
    }
  }
}

export default new Logger();
