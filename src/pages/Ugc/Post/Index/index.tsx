import { Footer } from '@/components';
import PostList from '@/components/Ugc/PostList';
import PostPublisher from '@/components/Ugc/PostPublisher';
import UgcHotRank from '@/components/Ugc/UgcHotRank';
import UserCard from '@/components/User/UserCard';
import { UgcType } from '@/constants/UgcConstant';
import { publishUgcUsingPost } from '@/services/socialx/ugcController';
import { queryUgcTopicUsingGet } from '@/services/socialx/ugcMetadataController';
import { history, useModel } from '@umijs/max';
import { Card, Col, Layout, message, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';

const { Content } = Layout;

const initTabItems = [
  {
    key: 'all',
    label: '综合',
  },
];

export default function PostPage() {
  const { initialState } = useModel('@@initialState');
  const [categoryId, setCategoryId] = useState('');
  const [tabItems, setTabItems] = useState([]);

  const loadPostTopics = () => {
    queryUgcTopicUsingGet().then((res) => {
      const categories = res.data?.ugcCategoryList?.map((item) => {
        return {
          key: item.categoryId,
          label: item.categoryName,
        };
      });
      // @ts-ignore
      setTabItems([...initTabItems, ...(categories || [])]);
    });
  };
  const handlePublishPost = async (content: string, topic: string, attachmentUrls: string[]) => {
    try {
      const reqId = initialState?.currentUser?.userId + '_' + content;
      await publishUgcUsingPost({
        ugcType: UgcType.POST,
        content,
        categoryId: topic,
        attachmentUrls,
        reqId,
      });
      message.success('发布成功，待审核通过');
      history.replace('/account/center?tab=post&st=AUDITING');
    } catch (error: any) {
      message.error(error.message || '发布失败，请重试');
    }
  };
  useEffect(() => {
    loadPostTopics();
  }, []);

  return (
    <Layout
      style={{
        padding: '16px',
        transition: 'margin 0.2s',
        height: '100vh',
        margin: '0 24px',
      }}
    >
      <Content style={{ marginLeft: 16, minHeight: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
            {initialState?.currentUser && <PostPublisher onPublish={handlePublishPost} />}
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '0 12px',
              }}
            >
              <Tabs
                size="large"
                defaultActiveKey="all"
                items={tabItems}
                onTabClick={(key) => {
                  if (key === 'all') {
                    setCategoryId('');
                    return;
                  }
                  setCategoryId(key);
                }}
              />
              <PostList categoryId={categoryId} />
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {initialState?.currentUser && <UserCard user={initialState.currentUser} self />}
              <UgcHotRank ugcType={UgcType.POST} title="帖子榜" />
              <Footer />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
