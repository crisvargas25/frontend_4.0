
import { Modal, Input, Switch, Button } from 'antd';
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
      // Modo creación: inicializar con valores vacíos
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
      visible={visible}
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
      <div style={{ marginBottom: 16 }}>
        <label>Nombre:</label>
        <Input
          value={editedProduct.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Descripción:</label>
        <Input
          value={editedProduct.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Cantidad:</label>
        <Input
          type="number"
          min={0}
          value={editedProduct.quantity}
          onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Precio:</label>
        <Input
          type="number"
          min={0}
          value={editedProduct.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Estado:</label>
        <Switch
          checked={editedProduct.status}
          onChange={(checked) => handleChange('status', checked)}
        />
      </div>
    </Modal>
  );
}
