import React, { useState } from 'react';

const UserStatsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState([]);
  
  // ⚠️ ПОМЕНЯЙТЕ EMAIL НА НУЖНЫЙ ⚠️
  const ALLOWED_EMAIL = "admin@example.com";
  
  // Текущий пользователь (ЗАМЕНИТЕ НА РЕАЛЬНЫЕ ДАННЫЕ)
  const currentUser = {
    email: "admin@example.com", // Поменяйте на email нужного человека
    firstName: "Иван",
    lastName: "Петров"
  };
  
  // Данные о входах пользователей (ВАШИ РЕАЛЬНЫЕ ДАННЫЕ)
  const usersLoginData = [
    { id: 1, firstName: "Анна", lastName: "Иванова", lastLogin: "2026-05-04 10:30:00" },
    { id: 2, firstName: "Петр", lastName: "Сидоров", lastLogin: "2026-05-04 09:15:00" },
    { id: 3, firstName: "Мария", lastName: "Кузнецова", lastLogin: "2026-05-03 18:45:00" },
  ];
  
  const checkAccess = () => {
    if (currentUser.email === ALLOWED_EMAIL) {
      setUserStats(usersLoginData);
      setIsOpen(true);
    } else {
      alert("❌ У вас нет доступа к этой информации");
    }
  };
  
  const closeModal = () => {
    setIsOpen(false);
  };
  
  return (
    <div>
      <button 
        onClick={checkAccess}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        📊 Посмотреть статистику входов
      </button>
      
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0 }}>Статистика входов пользователей</h2>
              <button 
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Имя</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Фамилия</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Время входа</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map(user => (
                  <tr key={user.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.firstName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.lastName}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={closeModal}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatsModal;