// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** queryUgcArticleTag GET /api/ugc/metadata/article_tag */
export async function queryUgcArticleTagUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultUgcMetadataResponse_>('/api/ugc/metadata/article_tag', {
    method: 'GET',
    ...(options || {}),
  });
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
