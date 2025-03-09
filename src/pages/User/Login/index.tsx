import { Footer } from '@/components';
import { ResponseCode } from '@/constants/ResponseCode';
import { BizType } from '@/constants/SystemConstant';
import { captchaCheckRule, emailCheckRule, IdentityType } from '@/constants/UserConstant';
import { loginUsingPost } from '@/services/socialx/userController';
import { notifyEmailCaptchaUsingPost } from '@/services/socialx/verificationController';
import {
  GithubOutlined,
  LockOutlined,
  QqOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('/media/bg/bg-login.png')",
      backgroundSize: '100% 100%',
    },
  };
});
const ActionIcons = () => {
  const { styles } = useStyles();
  return (
    <>
      <GithubOutlined key="GithubOutlined" className={styles.action} />
      <QqOutlined key="QqOutlined" className={styles.action} />
    </>
  );
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>(IdentityType.EMAIL_CAPTCHA);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.UserAuthenticateRequest) => {
    try {
      if (type === IdentityType.EMAIL_PASSWORD) {
        if (!values.extra) {
          message.error('验证码是必填项！');
          return;
        }
        if (!values.credential) {
          message.error('密码是必填项！');
          return;
        }
        values.credential = initialState?.encryptStr?.(values.credential);
      }
      // 登录
      await loginUsingPost({
        ...values,
        identityType: type,
      });
      const defaultLoginSuccessMessage = '登录成功！';
      message.success(defaultLoginSuccessMessage);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    } catch (error: any) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(error.message || defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="SocialX"
          subTitle={'SocialX 社交网络平台'}
          actions={['其他登录方式 :', <ActionIcons key="icons" />]}
          onFinish={async (values) => {
            const req: API.UserAuthenticateRequest = {
              ...values,
              extra: {
                imageCaptcha: values.imageCaptcha,
              },
            };
            await handleSubmit(req);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: IdentityType.EMAIL_CAPTCHA,
                label: '验证码登录 / 注册',
              },
              {
                key: IdentityType.EMAIL_PASSWORD,
                label: '密码登录',
              },
            ]}
            size="large"
          />
          {/* 邮箱验证码登录 */}
          {type === IdentityType.EMAIL_CAPTCHA && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                name="identifier"
                placeholder={'请输入邮箱！'}
                rules={[...emailCheckRule]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码！'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'秒后重新获取'}`;
                  }
                  return '获取验证码';
                }}
                name="credential"
                phoneName="identifier"
                rules={[...captchaCheckRule]}
                onGetCaptcha={async (email) => {
                  const result = await notifyEmailCaptchaUsingPost({
                    bizType: BizType.LOGIN,
                    email,
                  });
                  if (result.code !== ResponseCode.SUCCESS) {
                    message.error(result.message);
                    return;
                  }
                  message.success('获取验证码成功！');
                }}
              />
            </>
          )}
          {/* 邮箱密码登录 */}
          {type === IdentityType.EMAIL_PASSWORD && (
            <>
              <ProFormText
                name="identifier"
                initialValue={'codejuzi@163.com'}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'请输入邮箱！'}
                rules={[...emailCheckRule]}
              />
              <ProFormText.Password
                name="credential"
                initialValue={'SocialX12138@'}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请输入密码！'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText
                name="imageCaptcha"
                placeholder="请输入验证码"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
                fieldProps={{
                  size: 'large',
                  prefix: <SafetyOutlined />,
                  suffix: (
                    <img
                      width={100}
                      height={38}
                      src={`/api/verification/image/captcha?timestamp=${new Date().getTime()}`}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/api/verification/image/captcha?timestamp=${new Date().getTime()}`;
                      }}
                      alt="验证码"
                    />
                  ),
                }}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 36,
            }}
          >
            <span
              style={{
                float: 'right',
                color: '#1890ff',
                textDecoration: 'none',
                marginBottom: 8,
              }}
            >
              没有账号？验证码登录自动注册
            </span>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
