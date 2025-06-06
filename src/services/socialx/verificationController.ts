// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** notifyEmailCaptcha POST /api/verification/email/captcha */
export async function notifyEmailCaptchaUsingPost(
  body: API.CaptchaVerifyRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/verification/email/captcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** notifyImageCaptcha GET /api/verification/image/captcha */
export async function notifyImageCaptchaUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultImageCaptchaResponse_>('/api/verification/image/captcha', {
    method: 'GET',
    ...(options || {}),
  });
}
