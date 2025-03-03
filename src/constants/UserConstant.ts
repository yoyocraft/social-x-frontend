export enum IdentityType {
  EMAIL_CAPTCHA = 'EMAIL_CAPTCHA',
  EMAIL_PASSWORD = 'EMAIL_PASSWORD',
}

export const emailCheckRule = [
  {
    required: true,
    message: '邮箱是必填项！',
  },
  {
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: '不合法的邮箱！',
  },
];

export const captchaCheckRule = [
  {
    required: true,
    message: '验证码是必填项！',
  },
  {
    pattern: /^\d{6}$/,
    message: '验证码不合法！',
  },
];

export const passwordCheckRule = [
  {
    required: true,
    message: '密码是必填项！',
  },
  {
    pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/,
    message: '密码必须包含大小写字母、数字、特殊字符(@#$%^&+=)，长度在8-20之间！',
  },
];
