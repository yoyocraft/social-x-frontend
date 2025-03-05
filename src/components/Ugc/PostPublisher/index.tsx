import { MediaSource } from '@/constants/MediaConstant';
import { uploadImageUsingPost } from '@/services/socialx/mediaResourceController';
import { queryUgcTopicUsingGet } from '@/services/socialx/ugcMetadataController';
import { CloseCircleFilled, LinkOutlined, PictureOutlined, SmileOutlined } from '@ant-design/icons';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  Badge,
  Button,
  Card,
  Image,
  Input,
  message,
  Popover,
  Space,
  Typography,
  Upload,
} from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useEffect, useRef, useState } from 'react';

interface PostPublisherProps {
  onPublish?: (content: string, topic: string, categories: string[]) => void;
}

interface Pair {
  key: string;
  label: string;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PostPublisher: React.FC<PostPublisherProps> = ({ onPublish }) => {
  const [content, setContent] = useState('');
  const [inputCount, setInputCount] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<Pair | null>();

  const [topicList, setTopicList] = useState<Pair[]>([]);

  const textAreaRef = useRef(null);
  const maxLength = 2000;

  const loadPostTopics = () => {
    queryUgcTopicUsingGet().then((res) => {
      const categories = res.data?.ugcCategoryList?.map((item) => {
        return {
          key: item.categoryId,
          label: item.categoryName,
        };
      });
      // @ts-ignore
      setTopicList(categories);
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setContent(value);
      setInputCount(value.length);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePublish = () => {
    if (!content.trim()) {
      message.warning('请输入内容');
      return;
    }

    const attachmentUrls = fileList.map((uploadFile) => {
      return uploadFile.uid;
    });

    if (onPublish) {
      onPublish(content, selectedTopic?.key || '', attachmentUrls);
    }

    // Reset form
    setContent('');
    setFileList([]);
    setInputCount(0);
    setSelectedTopic(null);

    message.success('发布成功，待审核通过');
  };

  const emojiPicker = (
    <Picker
      theme="light"
      data={data}
      onEmojiSelect={(emoji: any) => {
        setContent((prev) => prev + emoji?.native);
      }}
    />
  );

  const topicSelector = (
    <Space direction="vertical">
      {topicList.map((topic) => (
        <Button
          key={topic.key}
          type={selectedTopic?.key === topic.key ? 'primary' : 'text'}
          size="small"
          onClick={() => setSelectedTopic(topic)}
        >
          {topic.label}
        </Button>
      ))}
    </Space>
  );

  useEffect(() => {
    // focus textarea
    if (textAreaRef.current) {
      // @ts-ignore
      textAreaRef.current.focus();
    }
    loadPostTopics();
  }, []);

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: 16,
      }}
    >
      <Input.TextArea
        ref={textAreaRef}
        placeholder="说点和大家讨论吧..."
        value={content}
        onChange={handleContentChange}
        maxLength={maxLength}
        autoSize={{ minRows: 4, maxRows: 8 }}
        style={{ padding: '8px 8px', fontSize: 14 }}
        variant="filled"
      />

      {selectedTopic && (
        <div style={{ marginTop: 8 }}>
          <Badge
            count={
              <CloseCircleFilled
                style={{ color: 'gray' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTopic(null);
                }}
              />
            }
          >
            <Button variant="text" color="primary">
              #{selectedTopic.label}
            </Button>
          </Badge>
        </div>
      )}

      {/* Image preview area */}
      {fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={(file) => {
              const index = fileList.indexOf(file);
              const newFileList = fileList.slice();
              newFileList.splice(index, 1);
              setFileList(newFileList);
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <Space size="middle">
          <Popover content={emojiPicker} title="选择表情" trigger="click" placement="bottom">
            <Button type="text" icon={<SmileOutlined />}>
              表情
            </Button>
          </Popover>

          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={async (file) => {
              if (fileList.length >= 9) {
                message.warning('最多上传9张图片');
                return false;
              }
              console.log('file:', file);

              const res = await uploadImageUsingPost(
                {
                  source: MediaSource.ARTICLE,
                },
                {},
                file,
              );
              const fullPath = res.data?.accessUrl;
              if (!fullPath) {
                message.error('上传失败');
                return false;
              }
              setFileList([
                ...fileList,
                {
                  uid: fullPath,
                  name: file.name,
                  status: 'done',
                  originFileObj: file,
                } as UploadFile,
              ]);

              return true;
            }}
          >
            <Button type="text" icon={<PictureOutlined />}>
              图片
            </Button>
          </Upload>

          <Popover content={topicSelector} trigger="click" placement="bottom">
            <Button type="text" icon={<LinkOutlined />}>
              关联话题
            </Button>
          </Popover>
        </Space>
        <Space>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {inputCount}/{maxLength}
          </Typography.Text>
          <Button type="primary" shape="round" size="large" onClick={handlePublish}>
            发布
          </Button>
        </Space>
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </Card>
  );
};

export default PostPublisher;
