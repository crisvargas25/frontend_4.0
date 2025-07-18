import { useState, useEffect } from 'react';
import { Modal, Input, Select, Switch, Button, Form } from 'antd';

const { Password } = Input;
const { Option } = Select;

interface UserEditModalProps {
  visible: boolean;
  user: any;
  onCancel: () => void;
  onSave: (user: any) => void;
}

export default function UserEditModal({ visible, user, onCancel, onSave }: UserEditModalProps) {
  const [editedUser, setEditedUser] = useState<any>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    status: false,
    password: '',
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        status: user.status || false,
        password: '', // No mostrar contraseña existente
      });
    } else {
      setEditedUser({
        id: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        status: false,
        password: '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: any) => {
    setEditedUser({ ...editedUser, [field]: value });
  };

  const handleSaveClick = () => {
    onSave(editedUser);
  };

  return (
    <Modal
      title={user ? 'Editar Usuario' : 'Agregar Usuario'}
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
            placeholder="Nombre completo"
            value={editedUser.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Correo electrónico" required>
          <Input
            type="email"
            placeholder="correo@ejemplo.com"
            value={editedUser.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Teléfono">
          <Input
            placeholder="Ej. 5551234567"
            value={editedUser.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Rol" required>
          <Select
            value={editedUser.role}
            onChange={(value) => handleChange('role', value)}
            placeholder="Selecciona un rol"
          >
            <Option value="user">Usuario</Option>
            <Option value="admin">Administrador</Option>
            <Option value="moderator">Moderador</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Contraseña" help={user ? 'No se puede cambiar en modo edición' : ''}>
          <Password
            placeholder="Ingresa una contraseña segura"
            value={editedUser.password}
            onChange={(e) => handleChange('password', e.target.value)}
            disabled={!!user}
          />
        </Form.Item>

        <Form.Item label="Estado">
          <Switch
            checked={editedUser.status}
            onChange={(checked) => handleChange('status', checked)}
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
