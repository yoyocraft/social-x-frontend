import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// 扩展时区插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(dayjs.tz.guess());

const dateTimeFormat = (timestamp: number | undefined): string => {
  if (!timestamp || timestamp < 0) return 'N/A';

  const now = dayjs();
  const time = dayjs(timestamp);

  // 未来时间处理
  if (time.isAfter(now)) return '未来时间';

  const diffInSeconds = now.diff(time, 'second');
  const diffInMinutes = now.diff(time, 'minute');
  const diffInHours = now.diff(time, 'hour');
  const diffInDays = now.diff(time, 'day');

  // 逻辑判断优化（按时间跨度降序）
  if (diffInDays >= 365 * 5) {
    return time.format('YYYY年MM月DD日');
  }
  if (diffInDays >= 365) {
    const years = Math.floor(diffInDays / 365);
    return `${years}年前`;
  }
  if (diffInDays >= 30) {
    const months = Math.floor(diffInDays / 30);
    return `${months}月前`;
  }
  if (diffInDays >= 7) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}周前`;
  }
  if (diffInDays > 1) {
    return `${diffInDays}天前`;
  }
  if (diffInDays === 1) {
    return `昨天 ${time.format('HH:mm')}`;
  }
  if (diffInHours >= 12) {
    return time.format('HH:mm');
  }
  if (diffInHours >= 1) {
    return `${diffInHours}小时前`;
  }
  if (diffInMinutes >= 1) {
    return `${diffInMinutes}分钟前`;
  }
  return `${diffInSeconds}秒前`;
};

export { dateTimeFormat };
