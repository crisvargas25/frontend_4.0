import { Modal, Input, Switch, Button, Form, InputNumber } from 'antd';
import { useState, useEffect } from 'react';

interface ProductEditModalProps {
  visible: boolean;
  product: any;
  onCancel: () => void;
  onSave: (product: any) => void;
}

export default function ProductEditModal({ visible, product, onCancel, onSave }: ProductEditModalProps) {
  const [editedProduct, setEditedProduct] = useState<any>({
    id: '',
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    status: false,
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        status: product.status || false,
      });
    } else {
      setEditedProduct({
        id: '',
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        status: false,
      });
    }
  }, [product]);

  const handleChange = (field: string, value: any) => {
    setEditedProduct({ ...editedProduct, [field]: value });
  };

  const handleSaveClick = () => {
    onSave(editedProduct);
  };

  return (
    <Modal
      title={product ? 'Editar Producto' : 'Agregar Producto'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="save" type="primary" onClick={handleSaveClick}>
          Guardar
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Nombre" required>
          <Input
            placeholder="Nombre del producto"
            value={editedProduct.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Descripción">
          <Input
            placeholder="Descripción breve"
            value={editedProduct.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Cantidad">
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            value={editedProduct.quantity}
            onChange={(value) => handleChange('quantity', value || 0)}
          />
        </Form.Item>

        <Form.Item label="Precio">
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            value={editedProduct.price}
            onChange={(value) => handleChange('price', value || 0)}
            prefix="$"
          />
        </Form.Item>

        <Form.Item label="Estado">
          <Switch
            checked={editedProduct.status}
            onChange={(checked) => handleChange('status', checked)}
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
