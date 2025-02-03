import { Tabs } from 'antd';
import React, { useState } from 'react';

const tabItems = [
  {
    key: 'article',
    label: '文章',
    children: 'Content of Tab 1',
  },
  {
    key: 'post',
    label: '动态',
    children: 'Content of Tab 2',
  },
  {
    key: 'question',
    label: '问答',
    children: 'Content of Tab 3',
  },
  {
    key: 'collection',
    label: '收藏',
    children: 'Content of Tab 4',
  },
  {
    key: 'like',
    label: '喜欢',
    children: 'Content of Tab 5',
  },
  {
    key: 'follow',
    label: '关注',
    children: 'Content of Tab 6',
  },
];

const UgcTabSection: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState('article');

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <Tabs
      activeKey={activeTabKey}
      onChange={handleTabChange}
      items={tabItems}
      size="large"
      style={{ minHeight: 500 }}
    />
  );
};

export default UgcTabSection;
