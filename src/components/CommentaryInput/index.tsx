import {
  EnvironmentOutlined,
  NumberOutlined,
  PictureOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Space, Typography } from 'antd';
import type React from 'react';
import { useState } from 'react';

const { TextArea } = Input;
const { Text } = Typography;

const CommentaryInput: React.FC = () => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 5000) {
      setComment(e.target.value);
    }
  };

  const handlePublish = () => {
    console.log('Published comment:', comment);
    setComment('');
  };

  return (
    <Card style={{ padding: '16px', maxWidth: '850px', margin: '0 auto' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ position: 'relative' }}>
          <TextArea
            value={comment}
            onChange={handleCommentChange}
            placeholder="#快来和大家讨论吧~"
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{
              padding: '16px',
              resize: 'none',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
          <Text
            type="secondary"
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              fontSize: '12px',
            }}
          >
            {comment.length}/5000
          </Text>
        </div>

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space size="middle">
            <Button type="text" icon={<SmileOutlined />}>
              表情
            </Button>
            <Button type="text" icon={<PictureOutlined />}>
              图片
            </Button>
            <Button type="text" icon={<NumberOutlined />}>
              关联话题
            </Button>
            <Button type="text" icon={<EnvironmentOutlined />}>
              打卡
            </Button>
          </Space>

          <Button
            type="primary"
            onClick={handlePublish}
            style={{
              borderRadius: '20px',
              paddingLeft: '24px',
              paddingRight: '24px',
            }}
          >
            发布
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default CommentaryInput;
