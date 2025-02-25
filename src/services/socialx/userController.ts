// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** verifyCaptcha POST /api/user/auth/captcha/verify */
export async function verifyCaptchaUsingPost(
  body: API.UserVerifyCaptchaRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultVerifyCaptchaResponse_>('/api/user/auth/captcha/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** setPwd POST /api/user/auth/set_pwd */
export async function setPwdUsingPost(
  body: API.UserSetPwdRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/user/auth/set_pwd', {
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

/** followUser POST /api/user/follow */
export async function followUserUsingPost(
  body: API.UserFollowRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/user/follow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryFollowers GET /api/user/follower */
export async function queryFollowersUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryFollowersUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUserBasicInfoResponse_>('/api/user/follower', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** queryFollowingUsers GET /api/user/following */
export async function queryFollowingUsersUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryFollowingUsersUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUserBasicInfoResponse_>('/api/user/following', {
    method: 'GET',
    params: {
      ...params,
    },
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
