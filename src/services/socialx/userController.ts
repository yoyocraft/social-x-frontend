// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** setPwd POST /api/user/auth/set-pwd */
export async function setPwdUsingPost(
  body: API.UserSetPwdRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/user/auth/set-pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** verifyCaptcha POST /api/user/auth/verify-captcha */
export async function verifyCaptchaUsingPost(
  body: API.UserVerifyCaptchaRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultVerifyCaptchaResponse_>('/api/user/auth/verify-captcha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getCurrentUser GET /api/user/curr */
export async function getCurrentUserUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultUserBasicInfoResponse_>('/api/user/curr', {
    method: 'GET',
    ...(options || {}),
  });
}

/** editUserInfo POST /api/user/edit */
export async function editUserInfoUsingPost(
  body: API.UserEditInfoRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/user/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** login POST /api/user/login */
export async function loginUsingPost(
  body: API.UserAuthenticateRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** logout POST /api/user/logout */
export async function logoutUsingPost(options?: { [key: string]: any }) {
  return request<API.ResultBoolean_>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
