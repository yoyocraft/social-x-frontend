import { uploadImageUsingPost } from '@/services/socialx/mediaResourceController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, UploadProps } from 'antd';
import React, { useState } from 'react';

interface Props {
  source: string;
  onChange?: (url: string) => void;
  value?: string;
  afterUpload?: (url: string) => void;
}

const PictureUploader: React.FC<Props> = (props) => {
  const { source, value, onChange, afterUpload } = props;
  const [loading, setLoading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    listType: 'picture-card',
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    customRequest: async (fileObj: any) => {
      setLoading(true);
      try {
        const res = await uploadImageUsingPost(
          {
            source,
          },
          {},
          fileObj.file,
        );
        const fullPath = res.data?.accessUrl || '';
        onChange?.(fullPath);
        fileObj.onSuccess(fullPath);
        afterUpload?.(fullPath);
      } catch (e: any) {
        message.error('上传失败，' + e.message);
        fileObj.onError(e);
      }
      setLoading(false);
    },
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <Upload {...uploadProps}>
      {value ? <img src={value} alt="image" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default PictureUploader;
