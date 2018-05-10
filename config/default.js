const env = process.env;
const ENV = env.NODE_ENV || 'development';

console.assert(env.PROXY_HOST !== undefined, 'PROXY_HOST should be defined');
console.assert(env.SESSION_ID !== undefined, 'SESSION_ID should be defined');
console.assert(env.USER_ID !== undefined, 'USER_ID should be defined');
console.assert(env.MONGO_URL !== undefined, 'MONGO_URL should be defined');
console.assert(env.MONGO_DB !== undefined, 'MONGO_DB should be defined');

module.exports = {
  env: ENV,
  dev: ENV === 'development',
  qa: ENV === 'qa',
  prod: ENV === 'prod',
  test: ENV === 'test',
  logs: {
    level: env.LOG_LEVEL || 'DEBUG',
    layout: env.LOG_LAYOUT || 'basic'
  },
  mongoDb: env.MONGO_DB,
  mongoUrl: env.MONGO_URL,
  proxyHost: env.PROXY_HOST,
  sessionId: env.SESSION_ID,
  userId: env.USER_ID,
};
