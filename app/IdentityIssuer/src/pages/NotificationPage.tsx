import React, { useState, useEffect, CSSProperties } from 'react';
import { fetchNotifications } from '../scripts/api'; 

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    getNotifications();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.header}>Notifications</h1>
        <div style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <p style={styles.noNotifications}>No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} style={styles.notificationBox}>
                <p style={styles.message}>{notification.message}</p>
                <p style={styles.timestamp}>{new Date(notification.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: '0px 100px',
  },
  container: {
    flex: 1,
    padding: '20px', 
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: '1.25em',
    color: '#001f3f', 
    textAlign: 'center',
    marginBottom: '10px', 
  },
  notificationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  noNotifications: {
    fontSize: '0.6em',
    color: '#333',
    textAlign: 'center',
  },
  notificationBox: {
    padding: '10px', 
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  message: {
    fontSize: '0.6em', 
    color: '#333',
    marginBottom: '5px', 
  },
  timestamp: {
    fontSize: '0.6em', 
    color: '#666',
  },
};

export default NotificationPage;