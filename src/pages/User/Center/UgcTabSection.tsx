import UserArticleList from '@/components/User/UserArticleList';
import UserCollectionList from '@/components/User/UserCollectionList';
import UserFollowerList from '@/components/User/UserFollowerList';
import UserFollowingUserList from '@/components/User/UserFollowingUserList';
import UserPostList from '@/components/User/UserPostList';
import UserQuestionList from '@/components/User/UserQuestionList';
import { UgcStatus } from '@/constants/UgcConstant';
import { ProCard } from '@ant-design/pro-components';
import { Select, Tabs } from 'antd';
import React, { useState } from 'react';

const tabItems = [
  {
    key: 'article',
    label: '文章',
  },
  {
    key: 'post',
    label: '动态',
  },
  {
    key: 'question',
    label: '问答',
  },
  {
    key: 'collection',
    label: '收藏',
  },
  {
    key: 'follow',
    label: '关注',
  },
  {
    key: 'fan',
    label: '粉丝',
  },
];

const ugcStatusTabItems = [
  {
    value: UgcStatus.PUBLISHED,
    label: '已发布',
  },
  {
    value: UgcStatus.AUDITING,
    label: '审核中',
  },
  {
    value: UgcStatus.REJECTED,
    label: '审核不通过',
  },
  {
    value: UgcStatus.PRIVATE,
    label: '私有',
  },
  {
    value: UgcStatus.DRAFT,
    label: '草稿',
  },
];

const showExtraTabKeys = ['article', 'post', 'question'];

const UgcTabSection: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState('article');
  const [ugcStatus, setUgcStatus] = useState('PUBLISHED');

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const handleUgcStatusChange = (value: string) => {
    setUgcStatus(value);
  };
  const operations = showExtraTabKeys.includes(activeTabKey) && (
    <Select
      defaultValue={ugcStatus}
      style={{ width: 120 }}
      onChange={handleUgcStatusChange}
      options={ugcStatusTabItems}
    />
  );

  return (
    <ProCard bodyStyle={{ padding: 24 }}>
      <Tabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        items={tabItems}
        size="large"
        tabBarExtraContent={operations}
      />

      {activeTabKey === 'article' && <UserArticleList self ugcStatus={ugcStatus} />}
      {activeTabKey === 'post' && <UserPostList self ugcStatus={ugcStatus} />}
      {activeTabKey === 'question' && <UserQuestionList self ugcStatus={ugcStatus} />}
      {activeTabKey === 'collection' && <UserCollectionList />}
      {activeTabKey === 'follow' && <UserFollowingUserList />}
      {activeTabKey === 'fan' && <UserFollowerList />}
    </ProCard>
  );
};

export default UgcTabSection;
