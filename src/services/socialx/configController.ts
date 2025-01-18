// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** queryConfig GET /api/config */
export async function queryConfigUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryConfigUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultConfigInfoResponse_>('/api/config', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateConfig PUT /api/config */
export async function updateConfigUsingPut(
  body: API.ConfigUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/config', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** createConfig POST /api/config */
export async function createConfigUsingPost(
  body: API.ConfigCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteConfig DELETE /api/config */
export async function deleteConfigUsingDelete(
  body: API.ConfigDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/config', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
