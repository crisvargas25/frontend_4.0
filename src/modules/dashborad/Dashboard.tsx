import { Layout } from 'antd';
import { Header, Content, Footer } from 'antd/es/layout/layout';
import { Sider } from 'antd/es/layout/Sider'; 
import React from 'react';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200}>
        {/* Sidebar content goes here */}
      </Sider>
      <Layout>
        <Header>
        </Header>
        <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff' }}>
            <Outlet/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ©️2025 Created by BrunOnline Team
        </Footer>
      </Layout>
    </Layout>
  );
}