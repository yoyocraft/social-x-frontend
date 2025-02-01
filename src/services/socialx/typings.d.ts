declare namespace API {
  type CaptchaNotifyRequest = {
    bizType?: string;
    email?: string;
    reqId?: string;
  };

  type CommentaryDeleteRequest = {
    commentaryId?: string;
    reqId?: string;
  };

  type CommentaryInfo = {
    commentary?: string;
    commentaryId?: string;
    commentatorAvatar?: string;
    commentatorId?: string;
    commentatorNickName?: string;
    gmtCreate?: number;
    gmtModified?: number;
    likeCount?: number;
    parentId?: string;
    status?: string;
    ugcId?: string;
  };

  type CommentaryPublishRequest = {
    commentary?: string;
    parentId?: string;
    reqId?: string;
    ugcId?: string;
  };

  type CommentaryResponse = {
    replyList?: CommentaryInfo[];
    topCommentary?: CommentaryInfo;
  };

  type ConfigCreateRequest = {
    configKey?: string;
    configValue?: string;
    extraData?: string;
    reqId?: string;
  };

  type ConfigDeleteRequest = {
    configKey?: string;
    reqId?: string;
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
    reqId?: string;
  };

  type ImageUploadResponse = {
    url?: string;
  };

  type PageCursorResultStringCommentaryResponse_ = {
    cursor?: string;
    list?: CommentaryResponse[];
  };

  type PageCursorResultStringUgcResponse_ = {
    cursor?: string;
    list?: UgcResponse[];
  };

  type PageCursorResultStringUgcTagInfoResponse_ = {
    cursor?: string;
    list?: UgcTagInfoResponse[];
  };

  type PageCursorResultStringUserBasicInfoResponse_ = {
    cursor?: string;
    list?: UserBasicInfoResponse[];
  };

  type PermissionAddRequest = {
    permissions?: string[];
    reqId?: string;
  };

  type queryByCursorForMainPageUsingGETParams = {
    authorId?: string;
    categoryId?: string;
    cursor?: string;
    keyword?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
    ugcStatus?: string;
    ugcType?: string;
  };

  type queryByCursorForUserPageUsingGETParams = {
    authorId?: string;
    categoryId?: string;
    cursor?: string;
    keyword?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
    ugcStatus?: string;
    ugcType?: string;
  };

  type queryByUgcIdUsingGETParams = {
    authorId?: string;
    categoryId?: string;
    cursor?: string;
    keyword?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
    ugcStatus?: string;
    ugcType?: string;
  };

  type queryConfigUsingGETParams = {
    key?: string;
    reqId?: string;
  };

  type queryFollowersUsingGETParams = {
    cursor?: string;
    page?: number;
    reqId?: string;
    size?: number;
    userId?: string;
  };

  type queryFollowingUsersUsingGETParams = {
    cursor?: string;
    page?: number;
    reqId?: string;
    size?: number;
    userId?: string;
  };

  type querySelfUgcUsingGETParams = {
    authorId?: string;
    categoryId?: string;
    cursor?: string;
    keyword?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
    ugcStatus?: string;
    ugcType?: string;
  };

  type queryUgcArticleTagWithCursorUsingGETParams = {
    cursor?: string;
    page?: number;
    reqId?: string;
    size?: number;
  };

  type queryUgcCommentaryUsingGETParams = {
    cursor?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
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

  type ResultPageCursorResultStringCommentaryResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultStringCommentaryResponse_;
    message?: string;
    timestamp?: number;
  };

  type ResultPageCursorResultStringUgcResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultStringUgcResponse_;
    message?: string;
    timestamp?: number;
  };

  type ResultPageCursorResultStringUgcTagInfoResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultStringUgcTagInfoResponse_;
    message?: string;
    timestamp?: number;
  };

  type ResultPageCursorResultStringUserBasicInfoResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultStringUserBasicInfoResponse_;
    message?: string;
    timestamp?: number;
  };

  type ResultUgcMetadataResponse_ = {
    bizState?: string;
    code?: string;
    data?: UgcMetadataResponse;
    message?: string;
    timestamp?: number;
  };

  type ResultUgcResponse_ = {
    bizState?: string;
    code?: string;
    data?: UgcResponse;
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
    reqId?: string;
    role?: string;
  };

  type RolePermissionRevokeRequest = {
    reqId?: string;
    revokePermissions?: string[];
    role?: string;
  };

  type UgcCategoryInfoResponse = {
    categoryId?: string;
    categoryName?: string;
    priority?: number;
  };

  type UgcDeleteRequest = {
    reqId?: string;
    ugcId?: string;
  };

  type UgcInteractionRequest = {
    interact?: boolean;
    interactionType?: string;
    reqId?: string;
    targetId?: string;
  };

  type UgcMetadataResponse = {
    ugcCategoryList?: UgcCategoryInfoResponse[];
    ugcTagList?: UgcTagInfoResponse[];
  };

  type UgcPublishRequest = {
    attachmentUrls?: string[];
    categoryId?: string;
    categoryName?: string;
    content?: string;
    cover?: string;
    drafting?: boolean;
    reqId?: string;
    summary?: string;
    tags?: string[];
    title?: string;
    ugcId?: string;
    ugcType?: string;
  };

  type UgcResponse = {
    attachmentUrls?: string[];
    authorAvatar?: string;
    authorId?: string;
    authorName?: string;
    categoryId?: string;
    categoryName?: string;
    collectCount?: number;
    content?: string;
    cover?: string;
    gmtCreate?: number;
    gmtModified?: number;
    likeCount?: number;
    status?: string;
    summary?: string;
    tags?: string[];
    title?: string;
    type?: string;
    ugcId?: string;
    viewCount?: number;
  };

  type UgcSetStatusRequest = {
    reqId?: string;
    status?: string;
    ugcId?: string;
  };

  type UgcTagInfoResponse = {
    priority?: number;
    selected?: boolean;
    tagId?: string;
    tagName?: string;
  };

  type uploadImageUsingPOSTParams = {
    reqId?: string;
    source?: string;
  };

  type UserAuthenticateRequest = {
    credential?: string;
    extra?: Record<string, any>;
    identifier?: string;
    identityType?: string;
    reqId?: string;
  };

  type UserBasicInfoResponse = {
    avatar?: string;
    bio?: string;
    company?: string;
    desensitizedEmail?: string;
    desensitizedMobile?: string;
    followerCount?: number;
    followingCount?: number;
    hasFollowed?: boolean;
    jobTitle?: string;
    joinTime?: number;
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
    reqId?: string;
    userId?: string;
    workDirection?: number;
    workStartTime?: string;
  };

  type UserFollowRequest = {
    follow?: boolean;
    followingUserId?: string;
    reqId?: string;
  };

  type UserSetPwdRequest = {
    confirmPassword?: string;
    newPassword?: string;
    reqId?: string;
  };

  type UserVerifyCaptchaRequest = {
    bizType?: string;
    captcha?: string;
    email?: string;
    reqId?: string;
  };

  type VerifyCaptchaResponse = {
    token?: string;
  };
}
