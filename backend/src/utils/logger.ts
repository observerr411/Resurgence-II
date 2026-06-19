import pino from 'pino';

const level = process.env.LOG_LEVEL || 'info';

const pinoConfig = {
  level,
  transport: process.env.NODE_ENV === 'production'
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  timestamp: pino.stdTimeFunctions.isoTime,
};

export const logger = pino(pinoConfig);
