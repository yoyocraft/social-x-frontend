import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Col, Row } from 'antd';
import React from 'react';
import UgcTabSection from './UgcTabSection';
import UserInfo from './UserInfo';
import UserSiderBar from './UserSiderBar';

const UserCenter: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  return (
    <PageContainer
      title={false}
      header={{
        breadcrumb: {},
      }}
    >
      <Row gutter={24}>
        <Col span={18}>
          <ProCard style={{ marginBottom: 24 }}>
            <UserInfo {...initialState?.currentUser} />
          </ProCard>

          <ProCard>
            <UgcTabSection />
          </ProCard>
        </Col>

        <Col span={6}>
          <UserSiderBar {...initialState?.currentUser} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UserCenter;
