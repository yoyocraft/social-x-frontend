import { UserRole } from './constants/UserConstant';

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState: { currentUser?: API.UserBasicInfoResponse } | undefined,
) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.role === UserRole.ADMIN,
  };
}
