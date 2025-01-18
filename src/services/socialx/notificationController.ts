// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** notifyCaptcha POST /api/notification/captcha */
export async function notifyCaptchaUsingPost(
  body: API.CaptchaNotifyRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/notification/captcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
