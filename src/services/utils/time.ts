import dayjs from 'dayjs';

const dateTimeFormat = (
  timestamp: number | undefined,
  formatter = 'YYYY-MM-DD HH:mm:ss',
): string => {
  if (!timestamp) return 'N/A';

  const now = dayjs();
  const time = dayjs(timestamp);
  const diffInSeconds = now.diff(time, 'second');
  const diffInMinutes = now.diff(time, 'minute');
  const diffInHours = now.diff(time, 'hour');
  const diffInDays = now.diff(time, 'day');
  const diffInWeeks = now.diff(time, 'week');
  const diffInMonths = now.diff(time, 'month');
  const diffInYears = now.diff(time, 'year');

  // 小于一分钟显示为 “x秒前”
  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  }

  // 小于一小时显示为 “x分钟前”
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }

  // 小于半天显示为 “x小时前”
  if (diffInHours < 12) {
    return `${diffInHours}小时前`;
  }

  // 今天的时间显示，只显示时间
  if (diffInDays === 0) {
    return time.format('HH:mm');
  }

  // 昨天显示 “昨天 HH:mm”
  if (diffInDays === 1) {
    return `昨天 ${time.format('HH:mm')}`;
  }

  // 1周以内显示为 “x天前”
  if (diffInDays <= 7) {
    return `${diffInDays}天前`;
  }

  // 超过1周但在1月内，显示为 “x周前”
  if (diffInWeeks <= 4) {
    return `${diffInWeeks}周前`;
  }

  // 超过1月但在1年内，显示为 “x月前”
  if (diffInMonths <= 12) {
    return `${diffInMonths}月前`;
  }

  // 超过1年，显示为 “x年前”
  if (diffInYears <= 5) {
    return `${diffInYears}年前`;
  }

  // 超过5年，显示完整日期（带年份）
  if (diffInYears > 5) {
    return time.format('YYYY年MM月DD日');
  }

  // 超过一年，则显示为 “YYYY年MM月DD日”
  return time.format(formatter);
};

export { dateTimeFormat };
