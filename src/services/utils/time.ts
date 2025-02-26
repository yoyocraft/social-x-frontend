import dayjs from 'dayjs';

const dateTimeFormat = (timestamp: number, formatter = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(timestamp).format(formatter);
};

export { dateTimeFormat };
