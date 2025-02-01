// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** queryByCursorForUserPage GET /api/ugc/cursor */
export async function queryByCursorForUserPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryByCursorForUserPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/cursor', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** delete POST /api/ugc/delete */
export async function deleteUsingPost1(
  body: API.UgcDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/ugc/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryByUgcId GET /api/ugc/detail */
export async function queryByUgcIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryByUgcIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultUgcResponse_>('/api/ugc/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** interact POST /api/ugc/interact */
export async function interactUsingPost(
  body: API.UgcInteractionRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/ugc/interact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryByCursorForMainPage GET /api/ugc/main */
export async function queryByCursorForMainPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryByCursorForMainPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/main', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** querySelfUgc GET /api/ugc/me */
export async function querySelfUgcUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.querySelfUgcUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/me', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** publish POST /api/ugc/publish */
export async function publishUsingPost1(
  body: API.UgcPublishRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/ugc/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** setStatus POST /api/ugc/set-status */
export async function setStatusUsingPost(
  body: API.UgcSetStatusRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/ugc/set-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
