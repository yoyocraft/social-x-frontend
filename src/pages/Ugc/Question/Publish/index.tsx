import MdEditor from '@/components/MdEditor';
import { MediaSource } from '@/constants/MediaConstant';
import { UgcType } from '@/constants/UgcConstant';
import { publishUgcUsingPost } from '@/services/socialx/ugcController';
import { queryUgcQuestionCategoryUsingGet } from '@/services/socialx/ugcMetadataController';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useModel, useNavigate } from '@umijs/max';
import { Alert, Button, Card, Col, Input, message, Row, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface QuestionCategory {
  categoryId: string;
  categoryName: string;
  qaTemplate: string;
  qaSuggestion: string;
}

interface Opt {
  value: string;
  label: string;
}

const QuestionPublishPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [qaCategories, setQaCategories] = useState<QuestionCategory[]>([]);
  const [qaCategoryOptions, setQaCategoryOptions] = useState<Opt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');

  const navigate = useNavigate();
  const handlePublishQuestion = async () => {
    setLoading(true);

    try {
      if (!title || !content) {
        alert('请填写标题和内容');
        return;
      }
      if (!selectedCategory) {
        alert('请选择问题类别');
        return;
      }

      const reqId = initialState?.currentUser?.userId + '_' + title;
      await publishUgcUsingPost({
        ugcType: UgcType.QUESTION,
        title,
        content,
        categoryId: selectedCategory?.categoryId,
        reqId,
      });

      message.success('发布成功');
      navigate('/question');
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const loadQaCategory = async () => {
    try {
      const res = await queryUgcQuestionCategoryUsingGet();
      const categories = res.data?.ugcCategoryList?.map((item) => {
        return {
          qaTemplate: item.qaTemplate || '',
          qaSuggestion: item.qaSuggestion || '',
          categoryId: item.categoryId || '',
          categoryName: item.categoryName || '',
        };
      });
      const opts = res.data?.ugcCategoryList?.map((item) => {
        return {
          value: item.categoryId || '',
          label: item.categoryName || '',
        };
      });
      setQaCategoryOptions(opts || []);
      setQaCategories(categories || []);
      setSelectedCategory(categories?.[0]);
    } catch (error: any) {
      // 错误处理
    }
  };

  useEffect(() => {
    loadQaCategory();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setContent(selectedCategory.qaTemplate);
    }
  }, [selectedCategory]);

  const handleQaCategoryChange = (value: string) => {
    const newSelectedCategory = qaCategories?.find((item) => item.categoryId === value);
    setSelectedCategory(newSelectedCategory);
  };

  return (
    <Card title="发起提问">
      <Row gutter={20}>
        <Col span={18}>
          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            <Typography.Text>问题类型</Typography.Text>
            <Select
              value={selectedCategory?.categoryId}
              style={{ width: 120 }}
              onChange={handleQaCategoryChange}
              options={qaCategoryOptions}
            />
          </Space>
          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            <Typography.Text>请详细描述您的问题</Typography.Text>
            <MdEditor value={content} source={MediaSource.QUESTION} />
          </Space>
          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            <Typography.Text>标题</Typography.Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请简洁清晰的概括问题"
            />
          </Space>

          <Space style={{ width: '100%', marginTop: 16 }}>
            <Button type="primary" onClick={handlePublishQuestion} loading={loading}>
              提问
            </Button>
            <Typography.Text>将会在一个工作日内答复</Typography.Text>
          </Space>
        </Col>
        <Col span={6}>
          <Alert
            message={<Typography.Title level={3}>提问建议</Typography.Title>}
            description={
              <>
                <MarkdownPreview
                  source={selectedCategory?.qaSuggestion}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontSize: 18,
                  }}
                  className="markdown-preview"
                />
              </>
            }
            type="warning"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default QuestionPublishPage;
