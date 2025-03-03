import {
  BilibiliOutlined,
  BorderlessTableOutlined,
  DesktopOutlined,
  GithubOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Avatar, Button, Space, Typography } from 'antd';
import type React from 'react';

const { Text, Title } = Typography;

interface Props {
  userInfo?: API.UserBasicInfoResponse;
  self?: boolean;
}

const UserInfo: React.FC<Props> = ({ userInfo, self = false }) => {
  const gotoUserSettingPage = () => {
    history.push('/account/settings/profile');
  };
  return (
    <ProCard bodyStyle={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Avatar size={100} src={userInfo?.avatar} icon={<UserOutlined />} />

        <div style={{ flex: 1, marginLeft: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Title level={3} style={{ margin: 0, marginRight: 12 }}>
              {userInfo?.nickname}
            </Title>
          </div>

          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space size={4}>
              <DesktopOutlined />
              <Text type="secondary">
                {userInfo?.company} | {userInfo?.jobTitle}
              </Text>
            </Space>
            <Space size={4}>
              <BorderlessTableOutlined />
              <Text type="secondary">{userInfo?.bio}</Text>
            </Space>
          </Space>
        </div>

        {self && (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}
          >
            <Space size={16}>
              <BilibiliOutlined style={{ fontSize: 20 }} />
              <GithubOutlined style={{ fontSize: 20 }} />
              <GlobalOutlined style={{ fontSize: 20 }} />
            </Space>
            <Button
              type="default"
              style={{
                borderRadius: 20,
                paddingLeft: 24,
                paddingRight: 24,
                borderColor: '#1677ff',
                color: '#1677ff',
              }}
              onClick={gotoUserSettingPage}
            >
              设置
            </Button>
          </div>
        )}
      </div>
    </ProCard>
  );
};

export default UserInfo;
