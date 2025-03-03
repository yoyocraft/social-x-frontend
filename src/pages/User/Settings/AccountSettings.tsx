import { ResponseCode } from '@/constants/ResponseCode';
import { BizType } from '@/constants/SystemConstant';
import { captchaCheckRule, emailCheckRule, passwordCheckRule } from '@/constants/UserConstant';
import { setPwdUsingPost, verifyCaptchaUsingPost } from '@/services/socialx/userController';
import { notifyEmailCaptchaUsingPost } from '@/services/socialx/verificationController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard, ProFormCaptcha, ProFormText, StepsForm } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, Divider, message, Modal, Space, Typography } from 'antd';
import type React from 'react';
import { useState } from 'react';

const { Title, Text } = Typography;

interface AccountItemProps {
  label: string;
  value: string;
  action: React.ReactNode;
}

interface ResetPwdStepFormProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const AccountItem: React.FC<AccountItemProps> = ({ label, value, action }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
        }}
      >
        <Space size="large" style={{ flex: 1 }}>
          <Text style={{ width: 100, fontSize: '16px', fontWeight: 'bold' }}>{label}</Text>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            {value}
          </Text>
        </Space>
        {action}
      </div>
      <Divider style={{ margin: 0 }} />
    </>
  );
};

const ResetPwdStepForm: React.FC<ResetPwdStepFormProps> = ({ visible, setVisible }) => {
  const [resetPwdToken, setResetPwdToken] = useState<string>('');
  const { initialState } = useModel('@@initialState');

  return (
    <>
      <StepsForm
        onFinish={async (values) => {
          const resp = await setPwdUsingPost(
            {
              newPassword: initialState?.encryptStr
                ? initialState.encryptStr(values.newPassword)
                : values.newPassword,
              confirmPassword: initialState?.encryptStr
                ? initialState.encryptStr(values.confirmNewPassword)
                : values.confirmNewPassword,
            },
            {
              headers: {
                Authorization: resetPwdToken,
              },
            },
          );
          if (resp.code === ResponseCode.SUCCESS) {
            message.success('密码重置成功！');
            setVisible(false);
            history.push('/user/login');
            message.success('请重新登录！');
            return;
          }
          message.error(resp.message);
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title="重置密码"
              width={800}
              onCancel={() => setVisible(false)}
              open={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="captcha"
          title="获取验证码"
          onFinish={async (values) => {
            const resp = await verifyCaptchaUsingPost({
              bizType: BizType.SET_PWD,
              email: values.email,
              captcha: values.captcha,
            });
            const token = resp.data?.token;
            if (token) {
              setResetPwdToken(token);
              return true;
            }
            message.error(resp.message);
            return false;
          }}
        >
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            name="email"
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
            name="captcha"
            phoneName="email"
            rules={[...captchaCheckRule]}
            onGetCaptcha={async (email) => {
              const result = await notifyEmailCaptchaUsingPost({
                bizType: BizType.SET_PWD,
                email,
              });
              if (result.code !== ResponseCode.SUCCESS) {
                message.error(result.message);
                return;
              }
              message.success('获取验证码成功！');
            }}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm name="resetPassword" title="重置密码">
          <ProFormText.Password
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            name="newPassword"
            placeholder={'请输入新密码！'}
            rules={[...passwordCheckRule]}
          />
          <ProFormText.Password
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            name="confirmNewPassword"
            placeholder={'请确认新密码！'}
            rules={[
              { required: true, message: '请确认新密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入密码不一致'));
                },
              }),
            ]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};

const AccountSettings: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [resetPwdModalVisible, setResetPwdModalVisible] = useState(false);

  const handleResetPwd = () => {
    setResetPwdModalVisible(true);
  };

  const accountItems = [
    {
      label: '邮箱',
      value: currentUser?.desensitizedEmail || '未绑定',
      action: (
        <Button type="link" size="large">
          解绑
        </Button>
      ),
    },
    {
      label: '手机',
      value: currentUser?.desensitizedMobile || '未绑定',
      action: currentUser?.desensitizedMobile ? (
        <Button type="link" size="large">
          解绑
        </Button>
      ) : (
        <Button type="link" size="large">
          绑定
        </Button>
      ),
    },
    {
      label: '新浪微博',
      value: '未绑定',
      action: (
        <Button type="link" size="large" disabled>
          绑定（暂不支持）
        </Button>
      ),
    },
    {
      label: 'GitHub',
      value: '未绑定',
      action: (
        <Button type="link" size="large" disabled>
          绑定（暂不支持）
        </Button>
      ),
    },
    {
      label: '密码',
      value: '******',
      action: (
        <Button type="link" size="large" onClick={handleResetPwd}>
          重置
        </Button>
      ),
    },
    {
      label: '账号注销',
      value: '',
      action: (
        <Button type="link" size="large" danger disabled>
          注销（暂不支持）
        </Button>
      ),
    },
  ];

  return (
    <>
      <div>
        <Title level={4} style={{ marginTop: 0, fontSize: '24px' }}>
          账号设置
        </Title>
        <ProCard>
          {accountItems.map((item, index) => (
            <AccountItem key={index} {...item} />
          ))}
        </ProCard>
      </div>
      <ResetPwdStepForm visible={resetPwdModalVisible} setVisible={setResetPwdModalVisible} />
    </>
  );
};

export default AccountSettings;
