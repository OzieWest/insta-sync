import * as util from 'util';
import { isEmpty, getOr, flow, map, join } from 'lodash/fp';

import { colorize, stringify, time } from './helpers';

const formatter = (data) => {
  delete data.logger; // eslint-disable-line no-param-reassign
  const colour = getOr('white', 'level.colour', data);

  const messages = Array.isArray(data.data) ? data.data : [data.data];

  const template = isEmpty(messages)
        ? ''
        : flow(
            map((elm) => {
              if (elm instanceof Error) {
                return `\n${util.inspect(elm, true, null, true)}`;
              }

              return stringify(elm);
            }),
            join(' '),
        )(messages);

  const prefix = `[${time(data.startTime)}][${data.level.levelStr}]`;

  return colorize(`${prefix} ${data.categoryName} - `, colour) + template;
};

export const customLayout = () => data => formatter(data);

export default { customLayout };
