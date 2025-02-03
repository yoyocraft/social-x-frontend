import UgcTabSection from '@/components/UserCenter/UgcTabSection';
import UserInfo from '@/components/UserCenter/UserInfo';
import UserSiderBar from '@/components/UserCenter/UserSiderBar';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Col, Row } from 'antd';
import React from 'react';

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
