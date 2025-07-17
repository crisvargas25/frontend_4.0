import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Swal from 'sweetalert2';
import './Login.css';

function Login() {
  const [form] = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields(); // Valida los campos del formulario
      const response = await fetch('https://apps40-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data = await response.json();
      login(data.accessToken, data.user); // Llama a la función login con el token
      form.resetFields(); // Resetea los campos del formulario
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Has iniciado sesión correctamente.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/'); // Redirige al Dashboard
    } catch (error) {
      console.error('Error en el login:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo' },
              { type: 'email', message: 'Por favor ingresa un correo válido' },
            ]}
          >
            <Input className="login-input" placeholder="Ingresa tu correo" disabled={loading} />
          </Form.Item>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password className="login-input" placeholder="Ingresa tu contraseña" disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={`login-button ${loading ? 'loading' : ''}`}
              block
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;