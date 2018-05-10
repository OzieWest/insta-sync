import { execSync } from 'child_process';
import { logger, getLogger } from './logger';

const stringify = (data: any): string => {
  if (typeof data === 'string') {
    return data;
  }
  if (data instanceof Error) {
    return JSON.stringify(data, Object.getOwnPropertyNames(data));
  }
  return JSON.stringify(data);
};

const onExit = (err: Error): void => {
  logger.fatal(stringify(err));
  process.exit(1);
};

process.on('uncaughtException', onExit);
process.on('unhandledRejection', onExit);

const syncSleep = (numberOfSeconds = 1) => {
  logger.debug(`wait ${numberOfSeconds} seconds...`);
  execSync(`sleep ${numberOfSeconds}`);
};

export { syncSleep, logger, getLogger, stringify };
