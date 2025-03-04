import { copyCurrentUrlToClipboard, getBaseUrl } from '@/services/utils/ugc';
import { ShareAltOutlined } from '@ant-design/icons';
import { Popover, QRCode, Typography } from 'antd';
import React from 'react';
import IconText from '../IconText';

const { Paragraph } = Typography;

interface Props {
  item?: API.UgcResponse;
}

const ShareIconText: React.FC<Props> = ({ item = {} }) => {
  const link = getBaseUrl();
  const onCopy = (event: any) => {
    event.preventDefault();
    copyCurrentUrlToClipboard(item);
  };
  const content = (
    <div>
      <h4>复制分享链接</h4>
      <Paragraph copyable={{ onCopy }}>{link}</Paragraph>
      <h4>手机扫码查看</h4>
      <QRCode value={link || '-'} />
    </div>
  );

  return (
    <Popover content={content} trigger="click">
      <IconText icon={ShareAltOutlined} text="分享" key="list-vertical-share-o" />
    </Popover>
  );
};

export default ShareIconText;
