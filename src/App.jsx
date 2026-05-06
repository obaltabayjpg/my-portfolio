import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Send, MessageCircle } from 'lucide-react';

const VisitorGate = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      const visitorData = {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      };
      
      try {
        const response = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitorData)
        });
        
        if (response.ok) {
          const data = await response.json();
          onSubmit(data.visitor);
        } else {
          throw new Error('Ошибка сохранения');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        // Запасной вариант - всё равно пускаем на сайт
        onSubmit(visitorData);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
          <h2 className="text-3xl font-light text-zinc-100 mb-2">Добро пожаловать</h2>
          <p className="text-zinc-400 mb-8">Пожалуйста, представьтесь</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-emerald-500/20 transition-shadow"
            >
              Войти
            </motion.button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminPanel = ({ isOpen, onClose }) => {
  const [visitors, setVisitors] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const ADMIN_PASSWORD = "admin123";
  
  const loadVisitors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/visitors');
      const data = await response.json();
      setVisitors(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      // Запасной вариант из localStorage
      const stored = JSON.parse(localStorage.getItem('visitors') || '[]');
      setVisitors(stored);
    } finally {
      setLoading(false);
    }
  };
  
  const clearLog = async () => {
    if (confirm('⚠️ Вы уверены, что хотите очистить весь лог посетителей?')) {
      try {
        await fetch('/api/visitors', { method: 'DELETE' });
        setVisitors([]);
        alert('✅ Лог успешно очищен');
      } catch (error) {
        console.error('Ошибка очистки:', error);
        localStorage.removeItem('visitors');
        setVisitors([]);
        alert('✅ Лог очищен (локально)');
      }
    }
  };
  
  const checkPassword = () => {
    if (password === ADMIN_PASSWORD) {
      setHasAccess(true);
      setPasswordError(false);
      loadVisitors();
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      setHasAccess(false);
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // ... JSX такой же, но добавь индикатор загрузки
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-2xl font-light text-zinc-100">
                {hasAccess ? '📋 Лог посетителей' : '🔒 Доступ ограничен'}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-auto">
              {!hasAccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Lock className="w-16 h-16 text-zinc-600 mb-6" />
                  <h4 className="text-xl text-zinc-200 mb-4">Введите пароль администратора</h4>
                  <div className="w-full max-w-sm">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
                      placeholder="Пароль"
                      className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-zinc-100 ${
                        passwordError ? 'border-red-500' : 'border-zinc-700'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      autoFocus
                    />
                    {passwordError && <p className="text-red-500 text-sm mt-2">❌ Неверный пароль</p>}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={checkPassword}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium"
                    >
                      Войти
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-zinc-500">
                      📊 Всего посетителей: <span className="text-emerald-400 font-semibold">{visitors.length}</span>
                    </div>
                    <button
                      onClick={clearLog}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all hover:scale-105"
                    >
                      🗑️ Очистить весь лог
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-12 text-zinc-500">Загрузка...</div>
                  ) : visitors.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">📭 Лог посетителей пуст</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">#</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Имя</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Фамилия</th>
                          <th className="text-left py-3 px-4 text-zinc-400 font-medium">Дата и время</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visitors.map((visitor, index) => (
                          <tr key={visitor.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                            <td className="py-3 px-4 text-zinc-400">{index + 1}</td>
                            <td className="py-3 px-4 text-zinc-100">{visitor.first_name || visitor.firstName}</td>
                            <td className="py-3 px-4 text-zinc-100">{visitor.last_name || visitor.lastName}</td>
                            <td className="py-3 px-4 text-zinc-400">
                              📅 {new Date(visitor.timestamp).toLocaleString('ru-RU')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ServiceCard = ({ title, description, gradient, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-6 rounded-xl bg-gradient-to-br ${gradient} border border-zinc-700/50 shadow-lg hover:shadow-xl transition-all text-left overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <h3 className="text-xl font-semibold text-zinc-100 mb-2 relative z-10">{title}</h3>
      <p className="text-zinc-400 relative z-10">{description}</p>
    </motion.button>
  );
};

const SoloWorkModal = ({ isOpen, onClose }) => {
  const services = [
    { name: 'Веб-разработка (Frontend)', price: '150 000 ₸', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit' },
    { name: 'UI/UX Дизайн', price: '100 000 ₸', description: 'Sed do eiusmod tempor incididunt ut labore et dolore' },
    { name: 'Консультация по проекту', price: '25 000 ₸', description: 'Ut enim ad minim veniam quis nostrud exercitation' },
    { name: 'Техническая поддержка (месяц)', price: '50 000 ₸', description: 'Duis aute irure dolor in reprehenderit in voluptate' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-2xl font-light text-zinc-100">Соло работа</h3>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-auto">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-zinc-200 mb-3">Условия работы</h4>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-start"><span className="text-emerald-500 mr-2">•</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
                  <li className="flex items-start"><span className="text-emerald-500 mr-2">•</span> Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</li>
                  <li className="flex items-start"><span className="text-emerald-500 mr-2">•</span> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris</li>
                  <li className="flex items-start"><span className="text-emerald-500 mr-2">•</span> Duis aute irure dolor in reprehenderit in voluptate velit</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium text-zinc-200 mb-4">Прайс-лист</h4>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-zinc-100">{service.name}</h5>
                        <span className="text-emerald-400 font-semibold">{service.price}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [hasEnteredGate, setHasEnteredGate] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSoloWork, setShowSoloWork] = useState(false);

  const categories = [
    { title: 'Соло работа', description: 'Индивидуальные проекты и консультации', gradient: 'from-blue-900/50 to-blue-800/30', onClick: () => setShowSoloWork(true) },
    { title: 'Командные проекты', description: 'Работа в составе команды', gradient: 'from-purple-900/50 to-purple-800/30', onClick: () => alert('Модальное окно для командных проектов') },
    { title: 'Корпоративные решения', description: 'Разработка для бизнеса', gradient: 'from-emerald-900/50 to-emerald-800/30', onClick: () => alert('Модальное окно для корпоративных решений') },
    { title: 'Обучение', description: 'Менторство и курсы', gradient: 'from-violet-900/50 to-violet-800/30', onClick: () => alert('Модальное окно для обучения') }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AnimatePresence>
        {!hasEnteredGate && <VisitorGate onSubmit={() => setHasEnteredGate(true)} />}
      </AnimatePresence>

      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      <SoloWorkModal isOpen={showSoloWork} onClose={() => setShowSoloWork(false)} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: hasEnteredGate ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-20"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: hasEnteredGate ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 bg-clip-text text-transparent">
            Frontend Developer
          </h1>
          <p className="text-xl text-zinc-400 font-light">Создаю премиальные цифровые продукты</p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: hasEnteredGate ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: hasEnteredGate ? 1 : 0, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <ServiceCard {...category} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: hasEnteredGate ? 1 : 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-light mb-8 text-zinc-200">Связаться со мной</h2>
          <div className="flex gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-shadow"
            >
              <Send className="w-5 h-5" />
              Telegram
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow"
            >
              <MessageCircle className="w-5 h-5" />
              TikTok
            </motion.a>
          </div>
        </motion.div>
      </motion.section>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: hasEnteredGate ? 0.3 : 0 }}
        whileHover={{ opacity: 1 }}
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-8 right-8 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-all"
      >
        <Lock className="w-5 h-5 text-zinc-400" />
      </motion.button>
    </div>
  );
}