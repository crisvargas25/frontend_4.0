import { useState, useEffect } from 'react';
import { Table, Typography, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Swal from 'sweetalert2';
import UserEditModal from './UserEditModal'; // Ajusta la ruta según tu estructura


export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

// Definir las columnas de la tabla
const columns: ColumnsType<any> = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Correo',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Teléfono',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Rol',
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => {
      const roleLabels: { [key: string]: string } = {
        user: 'Usuario',
        admin: 'Administrador',
        moderator: 'Moderador',
      };
      return role ? roleLabels[role] || role : 'Sin rol';
    },
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    render: (status: boolean) => (status ? 'Activo' : 'Inactivo'),
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: (_, record) => (
      <span>
        <a onClick={() => handleEditUser(record)}>Editar</a>
      </span>
    ),
  },
];


  // Obtener usuarios del backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/auth/getall');
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        setUsers(
          data.userList.map((user: any) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role?.roleType || '',
            status: user.status,
          }))
        );
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios. Intenta de nuevo.',
        });
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter((user: any) =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal de edición
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Abrir modal de agregar usuario
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Guardar cambios con conexión al backend
  const handleSave = async (editedUser: any) => {
    try {
      let response;
      if (!editedUser.id) {
        // Crear nuevo usuario
        response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editedUser.name,
            email: editedUser.email,
            phone: editedUser.phone,
            password: '1234',
            role: {
              roleType: editedUser.role,
              description: editedUser.role === 'admin' ? 'Usuario administrador con permisos completos' : 'Rol estándar',
            },
            status: editedUser.status,
          }),
        });
      } else {
        // Actualizar usuario existente
        response = await fetch(
          `http://localhost:3000/api/auth/update?email=${encodeURIComponent(editedUser.email)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: editedUser.name,
              email: editedUser.email,
              phone: editedUser.phone,
              role: {
                roleType: editedUser.role,
                description: editedUser.role === 'admin' ? 'Administrador del sistema' : 'Rol estándar',
              },
              status: editedUser.status,
            }),
          }
        );
      }

      if (!response.ok) throw new Error('Error al guardar el usuario');
      const updatedUserData = await response.json();
      if (!editedUser.id) {
        // Agregar nuevo usuario a la lista
        setUsers([...users, updatedUserData]);
      } else {
        // Actualizar usuario existente en la lista
        const updatedUsers = users.map(user =>
          user.id === editedUser.id ? { ...user, ...updatedUserData } : user
        );
        setUsers(updatedUsers);
      }
      setIsModalVisible(false);
      setSelectedUser(null);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: !editedUser.id ? 'Usuario creado correctamente.' : 'Usuario actualizado correctamente.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar el usuario.',
      });
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography.Title level={2}>Lista de Usuarios</Typography.Title>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddUser}>
          Agregar Usuario
        </Button>
      </div>
      <Input
        placeholder="Buscar usuarios"
        style={{ marginBottom: 8 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <UserEditModal
        visible={isModalVisible}
        user={selectedUser}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
