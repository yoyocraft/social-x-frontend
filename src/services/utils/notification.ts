import { UgcType } from '@/constants/UgcConstant';

export const calJumpUrl = (notification: API.NotificationResponse) => {
  if (!notification.targetId) {
    return '';
  }

  if (notification.targetType === UgcType.POST) {
    return `/post/${notification.targetId}`;
  }

  if (notification.targetType === UgcType.ARTICLE) {
    return `/article/${notification.targetId}`;
  }
  if (notification.targetType === UgcType.QUESTION) {
    return `/question/${notification.targetId}`;
  }

  return '';
};
