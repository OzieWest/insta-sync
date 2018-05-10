import * as log4js from 'log4js';

import { jsonLayout } from './jsonLayout';
import { customLayout } from './customLayout';

const CUSTOM_LAYOUT_TYPE = 'custom';
const JSON_LAYOUT_TYPE = 'json';

log4js.addLayout(JSON_LAYOUT_TYPE, jsonLayout);
log4js.addLayout(CUSTOM_LAYOUT_TYPE, customLayout);

const appenders = {
  [JSON_LAYOUT_TYPE]: {
    type: 'stdout',
    layout: { type: JSON_LAYOUT_TYPE },
  },
  [CUSTOM_LAYOUT_TYPE]: {
    type: 'stdout',
    layout: { type: CUSTOM_LAYOUT_TYPE },
  },
};

const createLogger = log4js.getLogger.bind(log4js);

export const getLogger = (params: any = {}) => {
  let context;
  let category;
  let level = 'debug';

  if (typeof params === 'string') {
    category = params;
  } else {
    category = params.category;
    context = params.context;
    level = params.level || level;
  }

  const logger = createLogger(category);

  if (context) {
    Object.keys(context).forEach(key => logger.addContext(key, context[key]));
  }

  logger.level = level;

  return logger;
};

export const logger = getLogger('main');
