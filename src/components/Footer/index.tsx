import { BilibiliOutlined, GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="2024 by yoyocraft"
      links={[
        {
          key: 'youyi',
          title: (
            <span>
              <BilibiliOutlined /> 游艺Geek
            </span>
          ),
          href: 'https://space.bilibili.com/266690556/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <span>
              <GithubOutlined /> yoyocraft
            </span>
          ),
          href: 'https://github.com/yoyocraft',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
