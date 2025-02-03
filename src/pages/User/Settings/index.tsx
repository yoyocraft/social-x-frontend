import {
  BellOutlined,
  LeftOutlined,
  LockOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import type { MenuProps } from 'antd';
import { Menu, Space } from 'antd';
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const UserSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/account/settings') {
      navigate('/account/settings/profile');
    }
  }, [location, navigate]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/account/settings/profile">个人资料</Link>,
    },
    {
      key: 'account',
      icon: <LockOutlined />,
      label: <Link to="/account/settings/account">账号设置</Link>,
    },
    {
      key: 'general',
      icon: <SettingOutlined />,
      label: <Link to="/account/settings/general">通用设置</Link>,
    },
    {
      key: 'notification',
      icon: <BellOutlined />,
      label: <Link to="/account/settings/notification">消息设置</Link>,
    },
  ];

  return (
    <PageContainer
      header={{
        title: false,
        breadcrumb: {
          items: [
            {
              onClick: () => navigate('/account/center'),
              title: (
                <Space style={{ fontSize: '16px' }}>
                  <LeftOutlined />
                  返回个人主页
                </Space>
              ),
            },
          ],
        },
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        <ProCard style={{ width: 240 }} bordered={false}>
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname.split('/')[2]]}
            items={menuItems}
            style={{ border: 'none' }}
          />
        </ProCard>

        <ProCard headerBordered style={{ flex: 1 }}>
          <Outlet />
        </ProCard>
      </div>
    </PageContainer>
  );
};

export default UserSettings;
