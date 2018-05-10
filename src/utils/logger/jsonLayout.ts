import { isEmpty, join, flow, without, forEach } from 'lodash/fp';

const createDataOverlays = (items) => {
  const messages:any = [];
  const overlay:any = {};

  flow(
        without([null, undefined]),
        forEach((item) => {
          if (typeof item === 'object') {
            const result = item instanceof Error ? { stack: item.stack } : item;

            if (overlay.result) {
              overlay.result = { ...overlay.result, ...result };
            } else {
              overlay.result = result;
            }
          } else {
            messages.push(item);
          }
        }),
    )(items);

  if (messages.length) {
    overlay.msg = join(' ', messages);
  }

  return overlay;
};

export const formatter = (data) => {
  const output = {
    timestamp: data.startTime,
    level: data.level.levelStr,
    ...data.context,
  };

  output.loggerName = data.categoryName;

  const messages = data.data;

  if (!isEmpty(messages)) {
    Object.assign(output, createDataOverlays(messages));
  }

  return output;
};

export const jsonLayout = () => (data = {}) => JSON.stringify(formatter(data));

export default { jsonLayout };
