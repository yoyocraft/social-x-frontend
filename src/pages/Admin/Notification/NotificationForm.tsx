'use client';

import MdEditor from '@/components/MdEditor';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Form } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';

interface NotificationFormProps {
  initialValues?: {
    title?: string;
    content?: string;
  };
  onFinish: (values: API.NotificationPublishRequest) => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(initialValues?.content || '');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setContent(initialValues.content || '');
    }
  }, [initialValues, form]);

  const handleReset = () => {
    form.resetFields();
    setContent(initialValues?.content || '');
  };

  const handleFinish = (values: any) => {
    onFinish({ ...values, content });
    handleReset();
  };

  return (
    <ProForm form={form} initialValues={initialValues} onFinish={handleFinish} submitter={false}>
      <ProFormText
        name="title"
        label="标题"
        placeholder="请输入通知标题"
        rules={[{ required: true, message: '请输入标题' }]}
      />
      <ProForm.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
        <MdEditor
          value={content}
          source="SYSTEM"
          onChange={(value) => {
            setContent(value);
            form.setFieldsValue({ content: value });
          }}
        />
      </ProForm.Item>
      <Form.Item>
        <Button type="primary" onClick={() => form.submit()} style={{ marginRight: 8 }}>
          提交
        </Button>
        <Button onClick={handleReset}>重置</Button>
      </Form.Item>
    </ProForm>
  );
};

export default NotificationForm;
