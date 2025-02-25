// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

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

/** queryUgcDetail GET /api/ugc/detail */
export async function queryUgcDetailUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryUgcDetailUsingGETParams,
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

/** queryFollowPageUgc GET /api/ugc/follow_feed */
export async function queryFollowPageUgcUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryFollowPageUgcUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/follow_feed', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** queryHotUgc GET /api/ugc/hot */
export async function queryHotUgcUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultListUgcResponse_>('/api/ugc/hot', {
    method: 'GET',
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

/** queryRecommendPageUgc GET /api/ugc/recommend_feed */
export async function queryRecommendPageUgcUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryRecommendPageUgcUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/recommend_feed', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** setUgcStatus POST /api/ugc/set_status */
export async function setUgcStatusUsingPost(
  body: API.UgcSetStatusRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/ugc/set_status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryMainPageUgc GET /api/ugc/time_feed */
export async function queryMainPageUgcUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryMainPageUgcUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/time_feed', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** queryUserPageUgc GET /api/ugc/user */
export async function queryUserPageUgcUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryUserPageUgcUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
