// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** adoptCommentary POST /api/commentary/adopt */
export async function adoptCommentaryUsingPost(
  body: API.UgcInteractionRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/commentary/adopt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteCommentary POST /api/commentary/delete */
export async function deleteCommentaryUsingPost(
  body: API.CommentaryDeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/commentary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** featuredCommentary POST /api/commentary/featured */
export async function featuredCommentaryUsingPost(
  body: API.UgcInteractionRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/commentary/featured', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** likeCommentary POST /api/commentary/like */
export async function likeCommentaryUsingPost(
  body: API.UgcInteractionRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/commentary/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** publishCommentary POST /api/commentary/publish */
export async function publishCommentaryUsingPost(
  body: API.CommentaryPublishRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/commentary/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryUgcCommentary GET /api/commentary/query */
export async function queryUgcCommentaryUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryUgcCommentaryUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringCommentaryResponse_>('/api/commentary/query', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
