// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** listNotification GET /api/notification/list */
export async function listNotificationUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listNotificationUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringNotificationResponse_>('/api/notification/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** publishNotification POST /api/notification/publish */
export async function publishNotificationUsingPost(
  body: API.NotificationPublishRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/notification/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** readSingleNotification POST /api/notification/read */
export async function readSingleNotificationUsingPost(
  body: API.NotificationReadRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/notification/read', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** readAllNotification POST /api/notification/read/all */
export async function readAllNotificationUsingPost(
  body: API.NotificationReadRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/notification/read/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** readNotificationByType POST /api/notification/read/type */
export async function readNotificationByTypeUsingPost(
  body: API.NotificationReadRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/notification/read/type', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryUnreadCount GET /api/notification/unread/count */
export async function queryUnreadCountUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryUnreadCountUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultNotificationUnreadResponse_>('/api/notification/unread/count', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
