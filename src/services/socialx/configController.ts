// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** createConfig POST /api/config/create */
export async function createConfigUsingPost(
  body: API.ConfigCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/config/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryConfigForMainPage GET /api/config/cursor */
export async function queryConfigForMainPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryConfigForMainPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultLongConfigInfoResponse_>('/api/config/cursor', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** deleteConfig POST /api/config/delete */
export async function deleteConfigUsingPost(
  body: API.ConfigDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/config/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryConfig GET /api/config/query */
export async function queryConfigUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryConfigUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultConfigInfoResponse_>('/api/config/query', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateConfig POST /api/config/update */
export async function updateConfigUsingPost(
  body: API.ConfigUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/config/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
