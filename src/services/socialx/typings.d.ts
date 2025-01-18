declare namespace API {
  type CaptchaNotifyRequest = {
    bizType?: string;
    email?: string;
    uuid?: string;
  };

  type ConfigCreateRequest = {
    configKey?: string;
    configValue?: string;
    extraData?: string;
    uuid?: string;
  };

  type ConfigDeleteRequest = {
    configKey?: string;
    uuid?: string;
  };

  type ConfigInfoResponse = {
    configId?: number;
    configKey?: string;
    configValue?: string;
    version?: number;
  };

  type ConfigUpdateRequest = {
    configKey?: string;
    currVersion?: number;
    newConfigValue?: string;
    uuid?: string;
  };

  type ImageUploadResponse = {
    url?: string;
  };

  type PermissionAddRequest = {
    permissions?: string[];
    uuid?: string;
  };

  type queryConfigUsingGETParams = {
    key?: string;
    uuid?: string;
  };

  type ResultBoolean_ = {
    bizState?: string;
    code?: string;
    data?: boolean;
    message?: string;
    timestamp?: number;
  };

  type ResultConfigInfoResponse_ = {
    bizState?: string;
    code?: string;
    data?: ConfigInfoResponse;
    message?: string;
    timestamp?: number;
  };

  type ResultImageUploadResponse_ = {
    bizState?: string;
    code?: string;
    data?: ImageUploadResponse;
    message?: string;
    timestamp?: number;
  };

  type ResultUserBasicInfoResponse_ = {
    bizState?: string;
    code?: string;
    data?: UserBasicInfoResponse;
    message?: string;
    timestamp?: number;
  };

  type ResultVerifyCaptchaResponse_ = {
    bizState?: string;
    code?: string;
    data?: VerifyCaptchaResponse;
    message?: string;
    timestamp?: number;
  };

  type RolePermissionAuthorizeRequest = {
    grantedPermissions?: string[];
    role?: string;
    uuid?: string;
  };

  type RolePermissionRevokeRequest = {
    revokePermissions?: string[];
    role?: string;
    uuid?: string;
  };

  type uploadImageUsingPOSTParams = {
    source?: string;
    uuid?: string;
  };

  type UserAuthenticateRequest = {
    credential?: string;
    extra?: Record<string, any>;
    identifier?: string;
    identityType?: string;
    uuid?: string;
  };

  type UserBasicInfoResponse = {
    avatar?: string;
    bio?: string;
    company?: string;
    desensitizedEmail?: string;
    desensitizedMobile?: string;
    jobTitle?: string;
    nickName?: string;
    personalizedTags?: string[];
    role?: string;
    userId?: string;
    workDirection?: number;
    workStartTime?: string;
  };

  type UserEditInfoRequest = {
    avatar?: string;
    bio?: string;
    company?: string;
    jobTitle?: string;
    nickName?: string;
    personalizedTags?: string[];
    userId?: string;
    uuid?: string;
    workDirection?: number;
    workStartTime?: string;
  };

  type UserSetPwdRequest = {
    confirmPassword?: string;
    newPassword?: string;
    uuid?: string;
  };

  type UserVerifyCaptchaRequest = {
    bizType?: string;
    captcha?: string;
    email?: string;
    uuid?: string;
  };

  type VerifyCaptchaResponse = {
    token?: string;
  };
}
