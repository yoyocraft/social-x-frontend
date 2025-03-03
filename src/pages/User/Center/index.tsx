import { Footer } from '@/components';
import { getUserInfoUsingGet } from '@/services/socialx/userController';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Col, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import UgcTabSection from './UgcTabSection';
import UserInfo from './UserInfo';
import UserSiderBar from './UserSiderBar';

const UserCenter: React.FC = () => {
  const param = useParams();
  const { userId } = param;
  const { initialState } = useModel('@@initialState');
  const [userInfo, setUserInfo] = useState<API.UserBasicInfoResponse>();

  const selfPage = !userId || userId === initialState?.currentUser?.userId;

  const loadUserInfo = async () => {
    try {
      const res = await getUserInfoUsingGet({
        userId: userId,
      });
      setUserInfo(res.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (!userId) {
      return;
    }
    loadUserInfo();
  }, [userId]);
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
            <UserInfo userInfo={selfPage ? initialState?.currentUser : userInfo} self={selfPage} />
          </ProCard>

          <UgcTabSection self={selfPage} />
        </Col>

        <Col span={6}>
          <UserSiderBar userInfo={selfPage ? initialState?.currentUser : userInfo} />
          <Footer />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default UserCenter;
