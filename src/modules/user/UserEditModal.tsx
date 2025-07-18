import  { useState, useEffect } from 'react';
import { Modal, Input, Select, Switch, Button, Input as AntdInput } from 'antd';
const { Password } = AntdInput;
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
        password: '', // No se edita la contraseña existente
      });
    } else {
      // Modo creación: inicializar con valores vacíos
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
          value={editedUser.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Correo:</label>
        <Input
          value={editedUser.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Teléfono:</label>
        <Input
          value={editedUser.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Rol:</label>
        <Select
          value={editedUser.role}
          onChange={(value) => handleChange('role', value)}
          style={{ width: '100%' }}
        >
          <Option value="user">Usuario</Option>
          <Option value="admin">Administrador</Option>
          <Option value="moderator">Moderador</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Contraseña:</label>
        <Password
          value={editedUser.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Ingresa una contraseña segura"
          disabled={!!user} // Deshabilitado en modo edición para no modificar contraseña existente
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Estado:</label>
        <Switch
          checked={editedUser.status}
          onChange={(checked) => handleChange('status', checked)}
        />
      </div>
    </Modal>
  );
}
