import React from 'react';
import styles from './Notification.module.css';

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      errors: {}
    };
  }
  
  validateField = (fieldName, value) => {
    let error = '';
    if (fieldName === 'name') {
      if (!value.trim()) {
        error = 'Имя обязательно';
      } else if (value.length < 2) {
        error = 'Имя должно содержать минимум 2 символа';
      }
    } else if (fieldName === 'email') {
      if (!value.trim()) {
        error = 'Email обязателен';
      } else if (!value.includes('@')) {
        error = 'Введите корректный email (должен содержать @)';
      }
    } else if (fieldName === 'password') {
      if (!value) {
        error = 'Пароль обязателен';
      } else if (value.length < 8) {
        error = 'Пароль должен содержать минимум 8 символов';
      }
    }
    return error;
  };

  // Проверка всех полей (при отправке)
  validateAll = () => {
    const { name, email, password } = this.state;
    const errors = {};
    const nameError = this.validateField('name', name);
    if (nameError) errors.name = nameError;
    const emailError = this.validateField('email', email);
    if (emailError) errors.email = emailError;
    const passwordError = this.validateField('password', password);
    if (passwordError) errors.password = passwordError;
    this.setState({ errors });
    return Object.keys(errors).length === 0; // true, если ошибок нет
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      // После обновления поля проверяем его и обновляем ошибки
      const error = this.validateField(name, value);
      this.setState(prevState => ({
        errors: { ...prevState.errors, [name]: error }
      }));
    });
  };

    handleBack = () => {
  if (this.props.onBack) this.props.onBack();
};

  handleSubmit = (e) => {
    e.preventDefault();
    // Проверяем все поля перед отправкой
    const isValid = this.validateAll();
    if (isValid) {
      console.log('Данные из ContactForm:', this.state);
      if (this.props.onSubmit) {
        this.props.onSubmit(this.state);
      }
    } else {
      console.log('Форма содержит ошибки');
    }
  };

  render() {
    const { name, email, password, errors } = this.state;
    return (
      <div className={styles.regsheet}>
        <form onSubmit={this.handleSubmit} noValidate>
          <h2>Зарегестрироваться</h2>
          
          <div className={styles.inputContainer}>
            <input
              className={styles.inputField}
              type="text"
              name="name"
              placeholder="Имя"
              value={name}
              onChange={this.handleChange}
              required
            />
            {errors.name && <div className={styles.inputError}>{errors.name}</div>}
          </div>
          
          <div className={styles.inputContainer}>
            <input
              className={styles.inputField}
              type="text"
              name="email"
              placeholder="Электронная почта"
              value={email}
              onChange={this.handleChange}
              required
            />
            {errors.email && <div className={styles.inputError}>{errors.email}</div>}
          </div>
          
          <div className={styles.inputContainer}>
            <input
              className={styles.inputField}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={this.handleChange}
              required
            />
            <div className={styles.inputHint}>Пароль обязателен (минимум 8 символов)</div>
            {errors.password && <div className={styles.inputError}>{errors.password}</div>}
          </div>
          
          <button type="submit">Зарегестрироваться </button>
          <button type="button" onClick={this.handleBack}>Назад</button>
        </form>
      </div>
    );
  }
}

export default ContactForm;