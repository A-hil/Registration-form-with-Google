import React from 'react';
import styles from './Notification.module.css'; 

function Notification({ isOn, config: { message, type } }) {
  return (
    <div className={`${styles.switch} ${isOn ? styles.on : ''} ${styles[type] || ''}`}>
      {message}
    </div>
  );
}

export default Notification;
