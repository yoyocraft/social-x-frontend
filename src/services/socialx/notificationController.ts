// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** notifyEmailCaptcha POST /api/notification/email/captcha */
export async function notifyEmailCaptchaUsingPost(
  body: API.CaptchaNotifyRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/notification/email/captcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
