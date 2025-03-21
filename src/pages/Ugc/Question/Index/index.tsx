import { Footer } from '@/components';
import MorePageFeature from '@/components/MorePageFeature';
import QuestionList from '@/components/Ugc/QuestionList';
import UgcHotRank from '@/components/Ugc/UgcHotRank';
import { UgcType } from '@/constants/UgcConstant';
import { queryUgcQuestionCategoryUsingGet } from '@/services/socialx/ugcMetadataController';
import { QuestionOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Layout, Row, Space, Tabs, Tag, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';

const { Content } = Layout;

const items = [
  {
    label: '全部',
    key: 'all',
  },
  {
    label: '待解决',
    key: 'unadopted',
  },
  {
    label: '采纳',
    key: 'adopted',
  },
];
const QuestionPage: React.FC = () => {
  const [questionTags, setQuestionTags] = useState<API.UgcCategoryInfoResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<API.UgcCategoryInfoResponse>();
  const [qaStatus, setQaStatus] = useState<string>('all');

  const loadQuestionTags = async () => {
    try {
      const res = await queryUgcQuestionCategoryUsingGet();
      setQuestionTags(res.data?.ugcCategoryList || []);
      setSelectedTag(res.data?.ugcCategoryList?.[0]);
    } catch (error: any) {}
  };

  const handleSelect = (tag: API.UgcCategoryInfoResponse) => {
    setSelectedTag(tag);
  };

  const handleQaStatusChange = (key: string) => {
    setQaStatus(key);
  };

  const operations = (
    <Button icon={<QuestionOutlined />} type="primary">
      提问题
    </Button>
  );

  useEffect(() => {
    loadQuestionTags();
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
      <Content style={{ minHeight: '100%' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '0 6px',
              }}
            >
              <Form layout="horizontal">
                <Form.Item
                  label={<Typography.Text strong>分类搜索</Typography.Text>}
                  labelCol={{ style: { fontSize: '14px', fontWeight: 'normal' } }}
                >
                  <Space size="middle" wrap>
                    {questionTags.map((tag) => (
                      <Tag.CheckableTag
                        key={tag.categoryId}
                        checked={selectedTag?.categoryId === tag.categoryId}
                        onChange={() => handleSelect(tag)}
                        style={{
                          fontSize: '14px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                        }}
                      >
                        {tag.categoryName}
                      </Tag.CheckableTag>
                    ))}
                  </Space>
                </Form.Item>
              </Form>
              <Tabs
                tabBarExtraContent={operations}
                items={items}
                activeKey={qaStatus}
                onChange={handleQaStatusChange}
                size="middle"
              />
              <QuestionList category={selectedTag} qaStatus={qaStatus} />
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
              <UgcHotRank ugcType={UgcType.QUESTION} title="热门问答" />
              <Footer />
            </div>
          </Col>
        </Row>
      </Content>
      <MorePageFeature />
    </Layout>
  );
};

export default QuestionPage;
