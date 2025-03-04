import { message } from 'antd';

export const getBaseUrl = () => {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
};

export const copyCurrentUrlToClipboard = (item?: API.UgcResponse) => {
  const currentUrl = getBaseUrl();
  const copyText = item
    ? `我在SocialX发现了「${item?.title}」，快来看看 ${currentUrl}`
    : currentUrl;
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
