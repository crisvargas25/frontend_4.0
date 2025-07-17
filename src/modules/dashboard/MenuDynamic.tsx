import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, ShoppingOutlined, ShoppingCartOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAuth } from '../../auth/AuthContext';

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
}

interface ApiMenuItem {
  _id: string;
  title: string;
  path: string;
  icon: string;
  roles: string[];
  isActive: boolean;
}

const iconMap: { [key: string]: React.ReactNode } = {
  HomeOutlined: <HomeOutlined />,
  UserOutlined: <UserOutlined />,
  ShoppingOutlined: <ShoppingOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  BarChartOutlined: <BarChartOutlined />,
};

const MenuDynamic: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!token || !user?.role?.roleType) {
      setMenuItems([]);
      return;
    }

    const fetchMenuItems = async () => {
      try {
        const response = await fetch('https://apps40-production.up.railway.app/api/menu/byrole', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: user.role.roleType }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const menuList: ApiMenuItem[] = await response.json();
        const items = menuList.map((item) => ({
          key: item.path,
          icon: iconMap[item.icon] || null,
          label: item.title,
        }));
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setMenuItems([]);
      }
    };

    fetchMenuItems();
  }, [user?.role?.roleType, token]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={menuItems}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default MenuDynamic;