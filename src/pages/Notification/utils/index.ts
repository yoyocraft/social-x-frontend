export const calJumpUrl = (notification: API.NotificationResponse) => {
  if (!notification.targetId) {
    return '';
  }

  if (notification.targetType === 'POST') {
    return `/post/${notification.targetId}`;
  }

  if (notification.targetType === 'ARTICLE') {
    return `/article/${notification.targetId}`;
  }
  if (notification.targetType === 'QUESTION') {
    return `/question/${notification.targetId}`;
  }

  return '';
};
