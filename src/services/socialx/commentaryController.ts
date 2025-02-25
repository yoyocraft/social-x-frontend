// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** adopt POST /api/commentary/adopt */
export async function adoptUsingPost(
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

/** queryCommentaryCount GET /api/commentary/count */
export async function queryCommentaryCountUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryCommentaryCountUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultLong_>('/api/commentary/count', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** delete POST /api/commentary/delete */
export async function deleteUsingPost(
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

/** like POST /api/commentary/like */
export async function likeUsingPost(
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

/** publish POST /api/commentary/publish */
export async function publishUsingPost(
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
