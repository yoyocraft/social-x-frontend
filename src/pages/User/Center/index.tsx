import { Footer } from '@/components';
import MorePageFeature from '@/components/MorePageFeature';
import { queryUgcStatisticUsingPost } from '@/services/socialx/ugcController';
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
  const [ugcStatistic, setUgcStatistic] = useState<API.UgcStatisticResponse>();

  // 优化 selfPage 逻辑，确保当前用户已加载
  const currentUserId = initialState?.currentUser?.userId;
  const selfPage = !userId || userId === currentUserId;

  // 获取实际需要展示的用户ID
  const targetUserId = selfPage ? currentUserId : userId;

  // 加载用户统计数据
  const loadUgcStatistic = async (targetId: string) => {
    try {
      const res = await queryUgcStatisticUsingPost({ authorId: targetId });
      setUgcStatistic(res.data);
    } catch (error: any) {
      console.error('加载用户统计数据失败:', error);
    }
  };

  // 加载用户信息
  const loadUserInfo = async () => {
    if (!targetUserId || (selfPage && initialState?.currentUser)) {
      // 如果是个人页面且已有当前用户信息，则直接使用
      if (selfPage && initialState?.currentUser) {
        setUserInfo(initialState.currentUser);
        loadUgcStatistic(currentUserId!);
      }
      return;
    }

    try {
      const res = await getUserInfoUsingGet({ userId: targetUserId });
      setUserInfo(res.data);

      // 加载完用户信息后再加载统计数据，但不阻塞页面渲染
      if (res.data?.userId) {
        loadUgcStatistic(res.data.userId); // 移除 await，异步加载统计数据
      }
    } catch (error: any) {
      message.error('获取用户信息失败: ' + error.message);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, [userId, initialState?.currentUser]);

  // 确定要展示的用户信息
  const displayUserInfo = selfPage ? initialState?.currentUser : userInfo;

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
            <UserInfo userInfo={displayUserInfo} self={selfPage} />
          </ProCard>

          <UgcTabSection self={selfPage} />
        </Col>

        <Col span={6}>
          <UserSiderBar userInfo={displayUserInfo} ugcStatistic={ugcStatistic} />
          <Footer />
        </Col>
      </Row>
      <MorePageFeature />
    </PageContainer>
  );
};

export default UserCenter;
