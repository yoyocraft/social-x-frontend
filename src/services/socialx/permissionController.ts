// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addPermission POST /api/permission/add */
export async function addPermissionUsingPost(
  body: API.PermissionAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/permission/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** authorize POST /api/permission/authorize */
export async function authorizeUsingPost(
  body: API.RolePermissionAuthorizeRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/permission/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** revoke POST /api/permission/revoke */
export async function revokeUsingPost(
  body: API.RolePermissionRevokeRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResultBoolean_>('/api/permission/revoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
