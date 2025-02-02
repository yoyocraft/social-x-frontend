import {
  ConfigMonacoEditorLanguage,
  ConfigType,
  ConfigTypeTagColor,
} from '@/constants/ConfigConstant';
import {
  createConfigUsingPost,
  deleteConfigUsingPost,
  queryConfigForMainPageUsingGet,
  queryConfigUsingGet,
  updateConfigUsingPost,
} from '@/services/socialx/configController';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Tag,
  message,
} from 'antd';
import React, { useRef, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

const ConfigCenter: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<API.ConfigInfoResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<API.ConfigInfoResponse | null>(null);
  const [cursor, setCursor] = useState(0);

  const [newConfigKey, setNewConfigKey] = useState<string>('');
  const [newConfigType, setNewConfigType] = useState<string>(ConfigType.DEFAULT);
  const [newConfigValue, setNewConfigValue] = useState<string>('');

  const fetchData = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const res = await queryConfigForMainPageUsingGet({ cursor });
      if (res?.data) {
        setDataSource((prev) => [...prev, ...(res?.data?.list || [])]);
        setHasMore(!!(res?.data?.list && res?.data?.list.length > 0));
        setCursor(res?.data?.cursor || 0);
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const queryConfigByKey = async (configKey: string) => {
    setLoading(true);
    try {
      const res = await queryConfigUsingGet({ key: configKey });
      if (res?.data) {
        setDataSource([res?.data]);
      }
    } catch (error) {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: API.ConfigInfoResponse) => {
    setCurrentConfig(record);
    setNewConfigValue(record.configValue || '');
    setEditModalVisible(true);
  };

  const handleView = (record: API.ConfigInfoResponse) => {
    setCurrentConfig(record);
    setNewConfigValue(record.configValue || '');
    setViewModalVisible(true);
  };

  const doUpdateConfig = async () => {
    if (!currentConfig) return;

    const payload: API.ConfigUpdateRequest = {
      configKey: currentConfig.configKey,
      currVersion: currentConfig.version,
      newConfigValue,
      reqId: `update-${Date.now()}`,
    };

    setLoading(true);
    try {
      await updateConfigUsingPost(payload);
      message.success('配置更新成功');
      setDataSource((prev) =>
        prev.map((item) =>
          item.configId === currentConfig.configId
            ? { ...item, configValue: newConfigValue, version: (currentConfig.version ?? 0) + 1 }
            : item,
        ),
      );
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
      setEditModalVisible(false);
    }
  };

  const doDeleteConfig = async (record: API.ConfigInfoResponse) => {
    const payload: API.ConfigDeleteRequest = {
      configKey: record.configKey,
      reqId: `delete-${Date.now()}`,
    };

    setLoading(true);
    try {
      await deleteConfigUsingPost(payload);
      message.success('删除成功');
      setDataSource((prev) =>
        prev.map((item) => (item.configId === record.configId ? { ...item, deleted: true } : item)),
      );
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const doCreateConfig = async () => {
    const payload: API.ConfigCreateRequest = {
      configKey: newConfigKey,
      configType: newConfigType,
      configValue: newConfigValue,
      reqId: `create-${Date.now()}`,
    };

    setLoading(true);
    try {
      await createConfigUsingPost(payload);
      message.success('配置新增成功');
      fetchData();
    } catch (error) {
      message.error('新增配置失败');
    } finally {
      setAddModalVisible(false);
      setLoading(false);
    }
  };

  return (
    <>
      <ProTable<API.ConfigInfoResponse>
        rowKey="configId"
        actionRef={actionRef}
        dataSource={dataSource}
        request={async () => {
          fetchData();
          return { success: true };
        }}
        columns={[
          {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
          },
          {
            title: '配置 Key',
            dataIndex: 'configKey',
            key: 'configKey',
            width: 400,
            copyable: true,
            ellipsis: true,
            tooltip: '标题过长会自动收缩',
          },
          {
            title: '类型',
            dataIndex: 'configType',
            key: 'configType',
            width: 100,
            search: false,
            renderFormItem: (_, { defaultRender }) => {
              return defaultRender(_);
            },
            render: (_, record) => (
              <Space>
                <Tag
                  color={ConfigTypeTagColor[record?.configType || ConfigType.DEFAULT]}
                  key={record.configId}
                >
                  {record.configType}
                </Tag>
              </Space>
            ),
          },
          {
            title: '最近修改',
            dataIndex: 'lastModified',
            key: 'lastModified',
            valueType: 'dateTime',
            search: false,
          },
          {
            title: '状态',
            dataIndex: 'deleted',
            key: 'deleted',
            width: 100,
            search: false,
            valueEnum: {
              false: { text: '正常', status: 'Success' },
              true: { text: '已删除', status: 'Error' },
            },
          },
          {
            title: '操作',
            key: 'action',
            search: false,
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => handleView(record)}>
                  查看
                </Button>
                <Button type="link" onClick={() => handleEdit(record)}>
                  编辑
                </Button>
                {!record.deleted && (
                  <Popconfirm title="确定删除?" onConfirm={() => doDeleteConfig(record)}>
                    <Button type="link" danger loading={loading}>
                      删除
                    </Button>
                  </Popconfirm>
                )}
              </>
            ),
          },
        ]}
        toolbar={{
          search: {
            loading: loading,
            onSearch: async (value: string) => {
              await queryConfigByKey(value);
            },
            placeholder: '请输入配置 Key',
            size: 'middle',
          },
          actions: [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
              type="primary"
            >
              新建
            </Button>,
          ],
        }}
        pagination={false}
        search={false}
        scroll={{ y: 500 }}
        // @ts-ignore
        onScroll={({ target }) => {
          const element = target as HTMLElement;
          if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            fetchData();
          }
        }}
      />
      {/* 新增配置 Drawer */}
      <Drawer
        title="新增配置"
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        placement="bottom"
        size="large"
        extra={
          <Space>
            <Button onClick={() => setAddModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={doCreateConfig} loading={loading}>
              确认
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={doCreateConfig}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="配置 Key">
                <Input
                  value={newConfigKey}
                  onChange={(e) => setNewConfigKey(e.target.value)}
                  placeholder="请输入配置 Key"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="配置类型">
                <Select
                  value={newConfigType}
                  onChange={setNewConfigType}
                  options={Array.from(new Set(Object.values(ConfigType))).map((type) => ({
                    label: type,
                    value: type,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="配置值">
                <MonacoEditor
                  height="500"
                  language={ConfigMonacoEditorLanguage[newConfigType || ConfigType.DEFAULT]}
                  value={newConfigValue}
                  onChange={setNewConfigValue}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      {/* 查看配置 */}
      <Drawer
        title="查看配置"
        open={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        placement="right"
        size="large"
      >
        <MonacoEditor
          height="700"
          language={ConfigMonacoEditorLanguage[currentConfig?.configType || ConfigType.DEFAULT]}
          value={newConfigValue}
          options={{ readOnly: true }}
        />
      </Drawer>
      {/* 编辑配置 */}
      <Drawer
        title="编辑配置"
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        placement="bottom"
        size="large"
        extra={
          <Space>
            <Button onClick={() => setEditModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={doUpdateConfig} loading={loading}>
              确认
            </Button>
          </Space>
        }
      >
        <MonacoEditor
          height="700"
          language={ConfigMonacoEditorLanguage[currentConfig?.configType || ConfigType.DEFAULT]}
          value={newConfigValue}
          onChange={setNewConfigValue}
        />
      </Drawer>
    </>
  );
};

export default ConfigCenter;
