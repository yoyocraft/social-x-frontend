import MdEditor from '@/components/MdEditor';
import PictureUploader from '@/components/PictureUpload';
import { MediaSource } from '@/constants/MediaConstant';
import { UgcType } from '@/constants/UgcConstant';
import { publishUgcUsingPost, queryUgcDetailUsingPost } from '@/services/socialx/ugcController';
import {
  queryUgcArticleTagUsingGet,
  queryUgcCategoryUsingGet,
} from '@/services/socialx/ugcMetadataController';
import { history, useModel, useParams } from '@umijs/max';
import { Button, Card, Flex, Form, Input, message, Modal, Select, Typography } from 'antd';
import 'bytemd/dist/index.css';
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/vs.css';
import type React from 'react';
import { useEffect, useState } from 'react';

const ArticlePublisher: React.FC = () => {
  const param = useParams();
  const { ugcId } = param;
  const [initialValue, setInitialValue] = useState<API.UgcResponse>();
  const { initialState } = useModel('@@initialState');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  const summaryMaxLength = 200;

  const loadEditUgcData = async () => {
    try {
      const res = await queryUgcDetailUsingPost({ ugcId, editing: true });
      setInitialValue(res.data || {});
    } catch (error: any) {}
  };

  useEffect(() => {
    if (!ugcId) {
      return;
    }
    const fetchData = async () => {
      await loadEditUgcData();
    };
    fetchData();
  }, [ugcId]);

  useEffect(() => {
    if (initialValue) {
      setTitle(initialValue.title || '');
      setContent(initialValue.content || '');
      setCategory(initialValue.categoryId || undefined);
      setSelectedTags(initialValue.tags || []);
      setCoverImage(initialValue.cover || '');
      setSummary(initialValue.summary || '');
    }
  }, [initialValue]);

  const loadCategories = async () => {
    const res = await queryUgcCategoryUsingGet();
    const ugcCategoryList = res.data?.ugcCategoryList || [];
    const opts = ugcCategoryList.map((item) => {
      return { label: item.categoryName, value: item.categoryId };
    });
    // @ts-ignore
    setCategoryOptions(opts);
  };

  const loadTags = async () => {
    const res = await queryUgcArticleTagUsingGet();
    const ugcTagList = res.data?.ugcTagList || [];
    const opts = ugcTagList.map((item) => {
      return { label: item.tagName, value: item.tagName };
    });
    // @ts-ignore
    setTagOptions(opts);
  };

  const showPublishModal = () => {
    if (!title) {
      message.error('请输入文章标题');
      return;
    }
    if (!content) {
      message.error('请输入文章内容');
      return;
    }
    setSummary(initialValue?.summary || content.substring(0, summaryMaxLength));
    Promise.all([loadCategories(), loadTags()]);
    setIsModalOpen(true);
  };

  const doPublishArticle = async (drafting = false) => {
    if (!drafting) {
      if (!category) {
        message.error('请选择分类');
        return;
      }
      if (!summary) {
        message.error('请输入文章摘要');
        return;
      }
    }
    setLoading(true);
    try {
      const reqId = initialState?.currentUser?.userId + '_' + title;
      await publishUgcUsingPost({
        ugcType: UgcType.ARTICLE,
        title,
        content,
        summary,
        categoryId: category,
        tags: selectedTags,
        cover: coverImage,
        drafting,
        reqId,
        ugcId,
      });
      const successMesssage = drafting ? '保存草稿成功' : '发布成功';
      message.success(successMesssage);
      history.replace('/');
    } catch (error: any) {
      message.error(error.message || '发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
  };

  return (
    <Card title="发布文章">
      <Flex gap="8px">
        <Input
          placeholder="输入文章标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="large"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button onClick={() => doPublishArticle(true)}>草稿箱</Button>
          <Button type="primary" onClick={showPublishModal}>
            发布
          </Button>
        </div>
      </Flex>
      <div style={{ marginTop: '16px' }}></div>
      <MdEditor source="ARTICLE" value={content} onChange={setContent} placeholder="开始编写..." />

      <Modal
        title="发布文章"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="draft" onClick={() => doPublishArticle(true)}>
            存草稿箱
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => doPublishArticle()}>
            确认并发布
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="分类" required>
            <Select
              value={category}
              options={categoryOptions}
              onChange={setCategory}
              placeholder="请选择分类"
            ></Select>
          </Form.Item>

          <Form.Item label="添加标签">
            <Select
              mode="multiple"
              value={selectedTags}
              onChange={setSelectedTags}
              placeholder="请选择标签"
              options={tagOptions}
            ></Select>
          </Form.Item>

          <Form.Item label="文章封面">
            <PictureUploader
              source={MediaSource.ARTICLE}
              value={coverImage}
              onChange={setCoverImage}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              格式：支持JPG、PNG、JPEG（大小：5MB以内）
            </Typography.Text>
          </Form.Item>

          <Form.Item label="编辑摘要" required>
            <Input.TextArea
              value={summary}
              onChange={handleSummaryChange}
              maxLength={summaryMaxLength}
              rows={4}
              placeholder="输入文章摘要..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ArticlePublisher;
