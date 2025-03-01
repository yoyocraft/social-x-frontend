import { MediaSource } from '@/constants/MediaConstant';
import { publishCommentaryUsingPost } from '@/services/socialx/commentaryController';
import { uploadImageUsingPost } from '@/services/socialx/mediaResourceController';
import { PictureOutlined, SmileOutlined } from '@ant-design/icons';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Button, Card, Image, Input, message, Popover, Space, Typography, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type React from 'react';
import { useState } from 'react';

interface PostPublisherProps {
  onPublish?: (content: string, attachmentUrls: string[]) => void;
  refreshComments?: () => void;
  ugcId?: string;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const CommentPublisher: React.FC<PostPublisherProps> = ({ onPublish, refreshComments, ugcId }) => {
  const [content, setContent] = useState('');
  const [inputCount, setInputCount] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const maxLength = 500;

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

  const handlePublish = async () => {
    if (!content.trim()) {
      message.warning('请输入内容');
      return;
    }

    const attachmentUrls = fileList.map((uploadFile) => {
      return uploadFile.uid;
    });

    if (onPublish) {
      onPublish(content, attachmentUrls);
    } else if (ugcId) {
      try {
        await publishCommentaryUsingPost({
          ugcId,
          commentary: content,
          attachmentUrls,
          reqId: ugcId,
        });
        message.success('发布成功');

        if (refreshComments) {
          refreshComments();
        }
      } catch (error: any) {
        message.error('发布失败: ' + error.message);
        return;
      }
    }

    // Reset form
    setContent('');
    setFileList([]);
    setInputCount(0);
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
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: 16,
        width: '100%',
        maxWidth: '100%',
        border: '1px solid #f0f0f0',
      }}
    >
      <Input.TextArea
        placeholder="说点什么..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setInputCount(e.target.value.length);
        }}
        maxLength={maxLength}
        autoSize={{ minRows: 4, maxRows: 8 }}
        style={{ padding: '8px 8px', fontSize: 14 }}
        variant="filled"
      />

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

              const res = await uploadImageUsingPost(
                {
                  source: MediaSource.REPLY,
                },
                {},
                file,
              );
              const fullPath = res.data?.url;
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

export default CommentPublisher;
