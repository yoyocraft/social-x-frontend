import { LeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Menu, Space } from 'antd';
import React, { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const UserSettings: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/account/settings') {
      history.push('/account/settings/profile');
    }
  }, [location]);

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
  ];

  return (
    <PageContainer
      header={{
        title: false,
        breadcrumb: {
          items: [
            {
              onClick: () => history.push('/account/center'),
              title: (
                <Space style={{ fontSize: '16px', cursor: 'pointer' }}>
                  <LeftOutlined />
                  返回个人主页
                </Space>
              ),
            },
          ],
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <ProCard
          style={{
            width: 280,
            minHeight: '70vh',
            flex: '0 0 auto',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
          bordered={false}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname.split('/')[3]]}
            items={menuItems}
            style={{
              border: 'none',
              height: '100%',
              fontSize: '15px',
              padding: '8px 0',
            }}
          />
        </ProCard>

        <ProCard
          headerBordered
          style={{
            flex: 1,
            minHeight: '70vh',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Outlet />
        </ProCard>
      </div>
    </PageContainer>
  );
};

export default UserSettings;
