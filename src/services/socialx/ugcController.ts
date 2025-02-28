// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteUgc POST /api/ugc/delete */
export async function deleteUgcUsingPost(
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

/** listFollowUgcFeed GET /api/ugc/follow_feed */
export async function listFollowUgcFeedUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listFollowUgcFeedUsingGETParams,
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

/** listHotUgc GET /api/ugc/hot */
export async function listHotUgcUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultListUgcResponse_>('/api/ugc/hot', {
    method: 'GET',
    ...(options || {}),
  });
}

/** interactUgc POST /api/ugc/interact */
export async function interactUgcUsingPost(
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

/** listSelfUgc GET /api/ugc/me */
export async function listSelfUgcUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listSelfUgcUsingGETParams,
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

/** publishUgc POST /api/ugc/publish */
export async function publishUgcUsingPost(
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

/** listRecommendUgcFeed GET /api/ugc/recommend_feed */
export async function listRecommendUgcFeedUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRecommendUgcFeedUsingGETParams,
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

/** listTimelineUgcFeed GET /api/ugc/time_feed */
export async function listTimelineUgcFeedUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listTimelineUgcFeedUsingGETParams,
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
