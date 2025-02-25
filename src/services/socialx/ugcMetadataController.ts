// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** queryUgcArticleTagWithCursor GET /api/ugc/metadata/article_tag */
export async function queryUgcArticleTagWithCursorUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryUgcArticleTagWithCursorUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageCursorResultStringUgcTagInfoResponse_>(
    '/api/ugc/metadata/article_tag',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** queryUgcCategory GET /api/ugc/metadata/category */
export async function queryUgcCategoryUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultUgcMetadataResponse_>('/api/ugc/metadata/category', {
    method: 'GET',
    ...(options || {}),
  });
}

/** queryUgcInterestTag GET /api/ugc/metadata/interest_tag */
export async function queryUgcInterestTagUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultUgcMetadataResponse_>('/api/ugc/metadata/interest_tag', {
    method: 'GET',
    ...(options || {}),
  });
}
