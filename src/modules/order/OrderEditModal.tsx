
import { Modal, Switch, Button, Typography, Space, Tag, Input } from 'antd';
import { useState, useEffect } from 'react';

const { Text } = Typography;

interface OrderEditModalProps {
  visible: boolean;
  order: any;
  onCancel: () => void;
  onSave: (order: any) => void;
}

export default function OrderEditModal({ visible, order, onCancel, onSave }: OrderEditModalProps) {
  const [editedOrder, setEditedOrder] = useState<any>({
    id: '',
    userId: '',
    products: [],
    status: 'pendiente',
  });

  useEffect(() => {
    if (order) {
      setEditedOrder({
        id: order.id,
        userId: order.userId || '',
        products: order.products || [],
        status: order.status || 'pendiente',
      });
    } else {
      // Modo creación: inicializar con valores vacíos o predeterminados
      setEditedOrder({
        id: '',
        userId: '',
        products: [],
        status: 'pendiente',
      });
    }
  }, [order]);

  const handleChange = (field: string, value: any) => {
    if (field === 'products') {
      // Convertir texto de productos en un arreglo simple (e.g., "prod1, prod2" -> [{ productId: "prod1", quantity: 1 }, ...])
      const productList = value.split(',').map((p: string) => ({
        productId: p.trim(),
        quantity: 1,
      }));
      setEditedOrder({ ...editedOrder, [field]: productList });
    } else {
      setEditedOrder({ ...editedOrder, [field]: value });
    }
  };

  const handleSaveClick = () => {
    onSave(editedOrder);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'green';
      case 'cancelado':
        return 'red';
      case 'pendiente':
      default:
        return 'orange';
    }
  };

  return (
    <Modal
      title={order ? 'Editar Estado de la Orden' : 'Agregar Orden'}
      open={visible}
      onCancel={onCancel}
      centered
      width={400}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveClick}>
          Guardar cambios
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {order ? (
          <>
            <div>
              <Text strong>ID de Orden:</Text> <Text>{editedOrder.id}</Text>
            </div>
            <div>
              <Text strong>Estado actual:</Text>{' '}
              <Tag color={getStatusColor(editedOrder.status)}>{editedOrder.status.toUpperCase()}</Tag>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Cambiar estado:</Text>
              <Switch
                checked={editedOrder.status === 'pagado'}
                onChange={(value) => handleChange('status', value ? 'pagado' : 'cancelado')}
                checkedChildren="Pagado"
                unCheckedChildren="Cancelado"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Text strong>ID de Usuario:</Text>
              <Input
                value={editedOrder.userId}
                onChange={(e) => handleChange('userId', e.target.value)}
                placeholder="Ej. Carlos Diaz"
              />
            </div>
            <div>
              <Text strong>Productos (separados por coma):</Text>
              <Input
                value={editedOrder.products.map((p: any) => p.productId).join(', ')}
                onChange={(e) => handleChange('products', e.target.value)}
                placeholder="Ej. 68516d1f30bea083600acb2e, 68516d4d30bea083600acb30"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Estado inicial:</Text>
              <Tag color={getStatusColor(editedOrder.status)}>{editedOrder.status.toUpperCase()}</Tag>
            </div>
          </>
        )}
      </Space>
    </Modal>
  );
}
