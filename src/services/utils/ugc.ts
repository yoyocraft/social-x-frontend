import { message } from 'antd';

export const copyCurrentUrlToClipboard = (item?: API.UgcResponse) => {
  const currentUrl = window.location.href;
  const copyText = `我在SocialX发现了「${item?.title}」，快来看看 ${currentUrl}`;
  navigator.clipboard
    .writeText(copyText)
    .then(() => {
      message.success('链接复制成功');
    })
    .catch((err) => {
      console.error('复制失败: ', err);
      message.error('复制失败，请重试！');
    });
};
