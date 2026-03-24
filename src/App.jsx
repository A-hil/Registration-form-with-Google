// App.js
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Notification from './Notification';
import styles from './Notification.module.css';
import ContactForm from './ContactForm';

function App() {
  const [isNotification, setIsNotification] = useState(false);
  const [notifConfig, setNotifConfig] = useState({ message: '', type: '' });
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 

  // Обработчик успешного входа через Google
const handleGoogleSuccess = (credentialResponse) => {
  const decoded = jwtDecode(credentialResponse.credential);
  if (decoded.exp < Date.now() / 1000) {
    setNotifConfig({ message: 'Токен истёк', type: 'error' });
    return;
  }
  setUser(decoded);
  setIsLoggedIn(true);
  setNotifConfig({ 
    message: `Добро пожаловать, ${decoded.name}! Вы вошли через Google`, 
    type: 'success' 
  });
};

  // Обработчик ошибки входа через Google
  const handleGoogleError = () => {
    console.error('Вход через Google не удался');
    setNotifConfig({ message: 'Не удалось войти через Google', type: 'error' });
    setIsNotification(true);
    setTimeout(() => setIsNotification(false), 3000);
  };

  // Обработчик обычной регистрации
  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString().trim();
    const name = formData.get('name')?.toString().trim() || 'Пользователь';

    if (!email || !email.includes('@')) {
      setNotifConfig({ message: 'Ошибка в Email!', type: 'error' });
    } else if (password.length < 8) {
      setNotifConfig({ message: 'Пароль слишком короткий!', type: 'error' });
    } else {
      setRegisteredUser({ name, email, password });
      setNotifConfig({ message: 'Регистрация завершена!', type: 'success' });
      setIsLoginMode(true);
    }
    setIsNotification(true);
    setTimeout(() => setIsNotification(false), 3000);
  };

  // Обработчик обычного входа
  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const pass = data.get('password');

    if (registeredUser && email === registeredUser.email && pass === registeredUser.password) {
      setUser({ name: registeredUser.name, email: registeredUser.email });
      setIsLoggedIn(true);
    } else {
      setNotifConfig({ message: 'Данные не совпадают!', type: 'error' });
      setIsNotification(true);
      setTimeout(() => setIsNotification(false), 3000);
    }
  };

  // Выход из аккаунта
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setRegisteredUser(null);
    setNotifConfig({ message: 'Вы вышли из системы', type: 'success' });
    setIsNotification(true);
    setTimeout(() => setIsNotification(false), 3000);
  };

  // Если пользователь уже вошёл — показываем приветствие
  if (isLoggedIn && user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        {user.picture && (
          <img 
            src={user.picture} 
            alt="Profile" 
            style={{ borderRadius: '50%', width: '100px', height: '100px' }}
          />
        )}
        <h1>Добро пожаловать, {user.name || user.email}!</h1>
        <p>Вы успешно вошли в систему.</p>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!isLoginMode ? (
        /* ФОРМА РЕГИСТРАЦИИ */
        <div className={styles.regsheet}>
          <form onSubmit={handleRegister} noValidate>
            <h2>Регистрация</h2>
            <input type="text" name="name" placeholder="Имя" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Пароль" required />
            <button type="submit">Зарегистрироваться</button>
            <button type="button" onClick={() => setIsLoginMode(true)}>Уже есть аккаунт</button>
          </form>
          
          {/* Разделитель */}
          <hr style={{ margin: '20px 0', width: '100%' }} />
          
          {/* Кнопка входа через Google */}
          <div style={{ textAlign: 'center' }}>
            <p>Или зарегистрируйтесь через</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
            />
          </div>
        </div>
      ) : (
        /* ФОРМА ВХОДА */
        <div className={styles.regsheet}>
          <form onSubmit={handleLogin}>
            <h2>Вход в аккаунт</h2>
            <input type='text' name="email" placeholder="Email" required noValidate/>
            <input type="password" name="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
            <button type="button" onClick={() => setIsLoginMode(false)}>Назад к регистрации</button>
          </form>
          
          {/* Разделитель */}
          <hr style={{ margin: '20px 0', width: '100%' }} />
          
          {/* Кнопка входа через Google */}
          <div style={{ textAlign: 'center' }}>
            <p>Или войдите через</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>
        </div>
      )}
      
      <Notification isOn={isNotification} config={notifConfig} />
    </div>
  );
}

export default App;