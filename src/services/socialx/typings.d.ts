declare namespace API {
  type CaptchaVerifyRequest = {
    bizType?: string;
    email?: string;
    reqId?: string;
  };

  type CommentaryDeleteRequest = {
    commentaryId?: string;
    reqId?: string;
  };

  type CommentaryInfo = {
    adopted?: boolean;
    attachmentUrls?: string[];
    commentary?: string;
    commentaryId?: string;
    commentatorAvatar?: string;
    commentatorId?: string;
    commentatorNickname?: string;
    gmtCreate?: number;
    gmtModified?: number;
    likeCount?: number;
    liked?: boolean;
    parentId?: string;
    status?: string;
    ugcId?: string;
  };

  type CommentaryPublishRequest = {
    attachmentUrls?: string[];
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
    configDesc?: string;
    configKey?: string;
    configType?: string;
    configValue?: string;
    reqId?: string;
  };

  type ConfigDeleteRequest = {
    configKey?: string;
    reqId?: string;
  };

  type ConfigInfoResponse = {
    configDesc?: string;
    configId?: number;
    configKey?: string;
    configType?: string;
    configValue?: string;
    deleted?: boolean;
    lastModified?: number;
    version?: number;
  };

  type ConfigUpdateRequest = {
    configDesc?: string;
    configKey?: string;
    currVersion?: number;
    newConfigValue?: string;
    reqId?: string;
  };

  type ImageUploadResponse = {
    url?: string;
  };

  type NotificationPublishRequest = {
    content?: string;
    notificationType?: string;
    reqId?: string;
    title?: string;
  };

  type NotificationReadRequest = {
    notificationId?: string;
    notificationType?: string;
    reqId?: string;
  };

  type NotificationResponse = {
    content?: string;
    followed?: boolean;
    gmtCreate?: number;
    notificationId?: string;
    notificationType?: string;
    read?: boolean;
    senderAvatar?: string;
    senderId?: string;
    senderName?: string;
    summary?: string;
    targetId?: string;
    targetType?: string;
  };

  type NotificationUnreadInfo = {
    notificationType?: string;
    unreadCount?: number;
  };

  type NotificationUnreadResponse = {
    unreadInfoList?: NotificationUnreadInfo[];
  };

  type PageCursorResultLongConfigInfoResponse_ = {
    cursor?: number;
    data?: ConfigInfoResponse[];
    hasMore?: boolean;
  };

  type PageCursorResultLongUgcResponse_ = {
    cursor?: number;
    data?: UgcResponse[];
    hasMore?: boolean;
  };

  type PageCursorResultLongUserBasicInfoResponse_ = {
    cursor?: number;
    data?: UserBasicInfoResponse[];
    hasMore?: boolean;
  };

  type PageCursorResultStringCommentaryResponse_ = {
    cursor?: string;
    data?: CommentaryResponse[];
    hasMore?: boolean;
  };

  type PageCursorResultStringNotificationResponse_ = {
    cursor?: string;
    data?: NotificationResponse[];
    hasMore?: boolean;
  };

  type PageCursorResultStringUgcResponse_ = {
    cursor?: string;
    data?: UgcResponse[];
    hasMore?: boolean;
  };

  type PermissionAddRequest = {
    permissions?: string[];
    reqId?: string;
  };

  type queryCommentaryCountUsingGETParams = {
    cursor?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
  };

  type queryConfigForMainPageUsingGETParams = {
    cursor?: number;
    key?: string;
    page?: number;
    reqId?: string;
    size?: number;
  };

  type queryConfigUsingGETParams = {
    cursor?: number;
    key?: string;
    page?: number;
    reqId?: string;
    size?: number;
  };

  type queryNotificationUsingGETParams = {
    cursor?: string;
    notificationType?: string;
    page?: number;
    reqId?: string;
    size?: number;
  };

  type querySelfFollowersUsingGETParams = {
    cursor?: number;
    page?: number;
    reqId?: string;
    size?: number;
    userId?: string;
  };

  type querySelfFollowingUsersUsingGETParams = {
    cursor?: number;
    page?: number;
    reqId?: string;
    size?: number;
    userId?: string;
  };

  type queryUgcCommentaryUsingGETParams = {
    cursor?: string;
    page?: number;
    reqId?: string;
    size?: number;
    ugcId?: string;
  };

  type queryUnreadCountUsingGETParams = {
    queryAll?: boolean;
    reqId?: string;
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

  type ResultListUgcResponse_ = {
    bizState?: string;
    code?: string;
    data?: UgcResponse[];
    message?: string;
    timestamp?: number;
  };

  type ResultLong_ = {
    bizState?: string;
    code?: string;
    data?: number;
    message?: string;
    timestamp?: number;
  };

  type ResultNotificationUnreadResponse_ = {
    bizState?: string;
    code?: string;
    data?: NotificationUnreadResponse;
    message?: string;
    timestamp?: number;
  };

  type ResultPageCursorResultLongConfigInfoResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultLongConfigInfoResponse_;
    message?: string;
    timestamp?: number;
  };

  type ResultPageCursorResultLongUgcResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultLongUgcResponse_;
    message?: string;
    timestamp?: number;
  };

  type ResultPageCursorResultLongUserBasicInfoResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultLongUserBasicInfoResponse_;
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

  type ResultPageCursorResultStringNotificationResponse_ = {
    bizState?: string;
    code?: string;
    data?: PageCursorResultStringNotificationResponse_;
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
    icon?: string;
    priority?: number;
    qaSuggestion?: string;
    qaTemplate?: string;
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

  type UgcQueryRequest = {
    authorId?: string;
    categoryId?: string;
    cursor?: string;
    keyword?: string;
    page?: number;
    qaStatus?: boolean;
    reqId?: string;
    size?: number;
    tags?: string[];
    timeCursor?: number;
    ugcId?: string;
    ugcStatus?: string;
    ugcType?: string;
  };

  type UgcResponse = {
    attachmentUrls?: string[];
    author?: UserBasicInfoResponse;
    categoryId?: string;
    categoryName?: string;
    collectCount?: number;
    collected?: boolean;
    commentaryCount?: number;
    content?: string;
    cover?: string;
    gmtCreate?: number;
    gmtModified?: number;
    hasSolved?: boolean;
    likeCount?: number;
    liked?: boolean;
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
    nickname?: string;
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
    nickname?: string;
    personalizedTags?: string[];
    reqId?: string;
    userId?: string;
    workDirection?: number;
    workStartTime?: string;
  };

  type UserFollowRequest = {
    follow?: boolean;
    followUserId?: string;
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
