import { Footer } from '@/components';
import ArticleList from '@/components/Ugc/ArticleList';
import UgcHotRank from '@/components/Ugc/UgcHotRank';
import HotAuthorCard from '@/components/User/HotAuthorCard';
import SuggestedUserCard from '@/components/User/SuggestedUserCard';
import { UgcType } from '@/constants/UgcConstant';
import { queryUgcCategoryUsingGet } from '@/services/socialx/ugcMetadataController';
import { Affix, Card, Col, Layout, Menu, Row, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';

const { Sider, Content } = Layout;

const initSideMenuItems = [
  { key: 'follow', label: '关注', icon: '👥' },
  { key: 'comprehensive', label: '综合', icon: '📚' },
];

const tabItems = [
  {
    key: 'recommended',
    label: '推荐',
  },
  {
    key: 'latest',
    label: '最新',
  },
];

const ArticleIndex = () => {
  const [sideMenu, setSideMenu] = useState(initSideMenuItems);
  const [categoryId, setCategoryId] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [viewFollow, setViewFollow] = useState(false);
  const isFirstLoad = useRef(true);

  const loadSideMenu = () => {
    queryUgcCategoryUsingGet().then((res) => {
      const categories = res.data?.ugcCategoryList?.map((item) => {
        return {
          key: item.categoryId,
          icon: item.icon,
          label: item.categoryName,
        };
      });
      // @ts-ignore
      setSideMenu([...initSideMenuItems, ...(categories || [])]);
    });
  };

  useEffect(() => {
    Promise.all([loadSideMenu()]).then(() => {
      isFirstLoad.current = false;
    });
  }, []);

  return (
    <Layout
      style={{
        padding: '12px',
        transition: 'margin 0.2s',
        height: '100vh',
      }}
    >
      <Sider
        theme="light"
        collapsible
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          overflow: 'auto',
        }}
      >
        <Affix offsetTop={55}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['comprehensive']}
            items={sideMenu.map((item) => ({
              key: item.key,
              icon: <span>{item.icon}</span>,
              label: item.label,
            }))}
            style={{ borderRight: 0 }}
            onSelect={(item) => {
              if (item.key === 'follow') {
                setViewFollow(true);
                return;
              }
              if (item.key === 'comprehensive') {
                setCategoryId('');
              } else {
                setCategoryId(item.key);
              }
              setViewFollow(false);
            }}
          />
        </Affix>
      </Sider>

      <Content
        style={{
          marginLeft: 16,
          minHeight: '100%',
          transition: 'margin 0.2s',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '0 8px',
              }}
            >
              {!viewFollow && (
                <Tabs
                  size="large"
                  defaultActiveKey="recommended"
                  items={tabItems}
                  onChange={setActiveTab}
                />
              )}
              <ArticleList categoryId={categoryId} fetchType={activeTab} viewFollow={viewFollow} />
            </Card>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <UgcHotRank ugcType={UgcType.ARTICLE} />
              <SuggestedUserCard />
              <HotAuthorCard />
              <Footer />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ArticleIndex;
