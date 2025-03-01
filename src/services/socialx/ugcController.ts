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

/** listFollowUgcFeed POST /api/ugc/follow_feed */
export async function listFollowUgcFeedUsingPost(
  body: API.UgcQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/follow_feed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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

/** listQuestions POST /api/ugc/qa */
export async function listQuestionsUsingPost(
  body: API.UgcQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/qa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listRecommendUgcFeed POST /api/ugc/recommend_feed */
export async function listRecommendUgcFeedUsingPost(
  body: API.UgcQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/recommend_feed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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

/** listTimelineUgcFeed POST /api/ugc/time_feed */
export async function listTimelineUgcFeedUsingPost(
  body: API.UgcQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcResponse_>('/api/ugc/time_feed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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
