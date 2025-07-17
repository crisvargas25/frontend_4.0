
import { useState, useEffect } from 'react';
import { Table, Typography, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Swal from 'sweetalert2';
import OrderEditModal from './OrderEditModal'; // Ajusta la ruta según tu estructura
import { Tag } from 'antd';

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Definir las columnas de la tabla
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Usuario',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (products: any[]) => products.map(p => p.productId.name).join(', '),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'orange';
        if (status === 'pagado') color = 'green';
        else if (status === 'cancelado') color = 'red';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <span>
          <a onClick={() => handleEditOrder(record)}>Editar Estado</a>
        </span>
      ),
    },
  ];

  // Obtener órdenes del backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/orders/getall');
        if (!response.ok) throw new Error('Error al obtener órdenes');
        const data = await response.json();
        setOrders(
          data.orders.map((order: any) => ({
            id: order._id,
            userId: order.userId,
            total: order.total,
            products: order.products,
            status: order.status,
          }))
        );
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las órdenes. Intenta de nuevo.',
        });
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filtrar órdenes
  const filteredOrders = orders.filter((order: any) =>
    (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.total || 0).toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.products.some((p: any) =>
      (p.productId.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Abrir modal de edición
  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  // Abrir modal de agregar orden
  const handleAddOrder = () => {
    setSelectedOrder(null);
    setIsModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  // Guardar cambios con conexión al backend
  const handleSave = async (editedOrder: any) => {
    try {
      let response = null;
      if (!editedOrder.id) {
        // Crear nueva orden
        response = await fetch('http://localhost:3000/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editedOrder.userId,
            products: editedOrder.products.map((p: any) => ({
              productId: p.productId,
              quantity: p.quantity || 1,
            })),
            status: editedOrder.status,
          }),
        });
      } else if (editedOrder.status === 'cancelado') {
        const confirmCancel = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas cancelar esta orden?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cancelar',
          cancelButtonText: 'No',
        });
        if (!confirmCancel.isConfirmed) return;
        response = await fetch(
          `http://localhost:3000/api/orders/delete/${encodeURIComponent(editedOrder.id)}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else if (editedOrder.status === 'pagado') {
        const confirmComplete = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Deseas completar esta orden?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, completar',
          cancelButtonText: 'No',
        });
        if (!confirmComplete.isConfirmed) return;
        response = await fetch(
          `http://localhost:3000/api/orders/update/${encodeURIComponent(editedOrder.id)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'pagado' }),
          }
        );
      }

      if (response && !response.ok) throw new Error('Error al guardar la orden');
      if (response) {
        const updatedOrderData = await response.json();
        if (!editedOrder.id) {
          // Agregar nueva orden a la lista
          setOrders([...orders, updatedOrderData]);
        } else {
          // Actualizar estado de la orden existente
          const updatedOrders = orders.map(order =>
            order.id === editedOrder.id ? { ...order, ...updatedOrderData } : order
          );
          setOrders(updatedOrders);
        }
      }
      setIsModalVisible(false);
      setSelectedOrder(null);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: !editedOrder.id ? 'Orden creada correctamente.' : `Orden ${editedOrder.status} correctamente.`,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la orden.',
      });
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <Typography.Title level={2}>Lista de Órdenes</Typography.Title>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddOrder}>
          Agregar Orden
        </Button>
      </div>
      <Input
        placeholder="Buscar órdenes"
        style={{ marginBottom: 8 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
      <OrderEditModal
        visible={isModalVisible}
        order={selectedOrder}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
