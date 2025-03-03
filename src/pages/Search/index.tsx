import { Footer } from '@/components';
import UgcHotRank from '@/components/Ugc/UgcHotRank';
import UserArticleCard from '@/components/User/UserArticleList/UserArticleCard';
import UserPostCard from '@/components/User/UserPostList/UserPostCard';
import UserQuestionCard from '@/components/User/UserQuestionList/UserQuestionCard';
import { UgcType } from '@/constants/UgcConstant';
import { listTimelineUgcFeedUsingPost } from '@/services/socialx/ugcController';
import { CloseOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import {
  Col,
  Empty,
  Input,
  List,
  message,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  type TabsProps,
} from 'antd';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const items: TabsProps['items'] = [
  {
    key: UgcType.ALL,
    label: '综合',
  },
  {
    key: UgcType.ARTICLE,
    label: '文章',
  },
  {
    key: UgcType.POST,
    label: '动态',
  },
  {
    key: UgcType.QUESTION,
    label: '问答',
  },
];

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const MAX_HISTORY_ITEMS = 10;

const SearchPage: React.FC = () => {
  const query = useQuery();
  const keyword = query.get('keyword');
  const [ugcType, setUgcType] = useState('');
  const [activeKey, setActiveKey] = useState('ALL');
  const [searchValue, setSearchValue] = useState(keyword || '');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [ugcList, setUgcList] = useState<API.UgcResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef('0');

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm,
      ...searchHistory.filter((item) => item !== searchTerm),
    ].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const loadUgcData = async (searchTerm: string = searchValue) => {
    try {
      const res = await listTimelineUgcFeedUsingPost({
        keyword: searchTerm,
        cursor: cursorRef.current,
        ugcType,
      });
      setUgcList((prev) => [...prev, ...(res.data?.data || [])]);
      cursorRef.current = res.data?.cursor ?? '0';
      setHasMore(res.data?.hasMore ?? false);
    } catch (error: any) {
      message.error('查询失败', error.message);
    }
  };

  const performSearch = () => {
    if (!searchValue.trim()) return;

    saveToHistory(searchValue);

    if (keyword !== searchValue) {
      history.replace(`/search?keyword=${encodeURIComponent(searchValue)}`);
    }

    setUgcList([]);
    setHasMore(true);
    cursorRef.current = '0';
    loadUgcData();
  };

  const removeFromHistory = (searchTerm: string) => {
    const updatedHistory = searchHistory.filter((item) => item !== searchTerm);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleHistoryClick = (value: string) => {
    setSearchValue(value);
    performSearch();
  };

  const handleActiveKeyChange = (key: string) => {
    setActiveKey(key);
    setUgcType(key === 'ALL' ? '' : key);
  };

  const renderUgcItem = (item: API.UgcResponse) => {
    return (
      <>
        {item.type === UgcType.ARTICLE && <UserArticleCard article={item} />}
        {item.type === UgcType.POST && <UserPostCard post={item} />}
        {item.type === UgcType.QUESTION && <UserQuestionCard question={item} />}
      </>
    );
  };

  useEffect(() => {
    if (keyword) {
      performSearch();
    }
    isFirstLoad.current = false;
  }, [keyword]);

  useEffect(() => {
    if (isFirstLoad.current) {
      return;
    }

    setUgcList([]);
    setHasMore(true);
    cursorRef.current = '0';
    loadUgcData();
  }, [ugcType]);

  return (
    <PageContainer
      header={{
        title: '',
        breadcrumb: {},
      }}
      style={{ background: '#f0f2f5' }}
    >
      <Row justify="center" style={{ marginBottom: 20 }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Input.Search
            enterButton="搜索"
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={performSearch}
            style={{ width: '100%' }}
          />
          {searchHistory.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Space size={[0, 8]} wrap>
                {searchHistory.map((item) => (
                  <Tag
                    key={item}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      padding: '4px 8px',
                      marginRight: 8,
                      marginBottom: 8,
                      background: '#f5f5f5',
                    }}
                    onClick={() => handleHistoryClick(item)}
                    closable
                    onClose={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item);
                    }}
                    closeIcon={<CloseOutlined style={{ fontSize: '10px' }} />}
                  >
                    {item}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </Col>
      </Row>

      <Row gutter={24} justify="center">
        <Col xs={24} md={18} lg={16}>
          <ProCard bodyStyle={{ padding: 24 }}>
            <Tabs
              defaultActiveKey="ALL"
              activeKey={activeKey}
              onChange={handleActiveKeyChange}
              centered={false}
              items={items}
              size="large"
            />
            <InfiniteScroll
              dataLength={ugcList.length}
              next={loadUgcData}
              hasMore={hasMore}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              pullDownToRefreshThreshold={50}
            >
              <List
                itemLayout="vertical"
                size="large"
                dataSource={ugcList}
                locale={{
                  emptyText: <Empty description="暂无数据" />,
                }}
                renderItem={(item) => renderUgcItem(item)}
              />
            </InfiniteScroll>
          </ProCard>
        </Col>

        <Col xs={0} md={6} lg={5}>
          <UgcHotRank ugcType={UgcType.ALL} title="热门榜单" />
          <Footer />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default SearchPage;
