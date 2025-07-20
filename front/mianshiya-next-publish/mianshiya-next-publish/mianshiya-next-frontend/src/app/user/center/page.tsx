"use client";
import { Avatar, Card, Col, Row, Button, Form, Input, message, Modal } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import { useState } from "react";
import CalendarChart from "@/app/user/center/components/CalendarChart";
import { updateMyUserUsingPost } from '@/api/userController';
import "./index.css";

/**
 * 用户中心页面
 * @constructor
 */
export default function UserCenterPage() {
  // 获取登录用户信息
  const loginUser = useSelector((state: RootState) => state.loginUser);
  // 便于复用，新起一个变量
  const user = loginUser;
  // 控制菜单栏的 Tab 高亮
  const [activeTabKey, setActiveTabKey] = useState<string>("record");
  // 控制编辑模态框的显示
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      userName: user.userName,
      userAvatar: user.userAvatar,
      userProfile: user.userProfile,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await updateMyUserUsingPost({
        id: user.id,
        userName: values.userName,
        userAvatar: values.userAvatar,
        userProfile: values.userProfile,
      });
      if (response.code === 0) {
        message.success('修改成功');
        setIsModalVisible(false);
        // 更新本地数据
        user.userName = values.userName;
        user.userAvatar = values.userAvatar;
        user.userProfile = values.userProfile;
        // 强制刷新页面以显示最新内容
        window.location.reload();
      } else {
        message.error(response.message);
      }
    } catch (error) {

    }
  };

  return (
    <div id="userCenterPage" className="max-width-content">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card style={{ textAlign: "center" }}>
            <Avatar src={user.userAvatar} size={72} />
            <div style={{ marginBottom: 16 }} />
            <Card.Meta
              title={
                <Title level={4} style={{ marginBottom: 0 }}>
                  {user.userName}
                </Title>
              }
              description={
                <Paragraph type="secondary">{user.userProfile}</Paragraph>
              }
            />
            <Button type="primary" onClick={handleEdit} style={{ marginTop: 16 }}>
              编辑
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card
            tabList={[
              {
                key: "record",
                label: "刷题记录",
              },
              {
                key: "others",
                label: "刷题历史",
              },
            ]}
            activeTabKey={activeTabKey}
            onTabChange={(key: string) => {
              setActiveTabKey(key);
            }}
          >
            {activeTabKey === "record" && (
              <>
                <CalendarChart />
              </>
            )}
            {activeTabKey === "others" && <>bbb</>}
          </Card>
        </Col>
      </Row>
      <Modal
        title="编辑个人信息"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <p style={{ marginBottom: 16 }}>请填写以下信息以更新您的个人资料：</p>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label="头像链接" name="userAvatar">
            <Input placeholder="请输入头像链接" />
          </Form.Item>
          <Form.Item label="用户名" name="userName">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="个人简介" name="userProfile">
            <Input.TextArea placeholder="请输入个人简介" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}