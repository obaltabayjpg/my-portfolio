import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Send, MessageCircle } from 'lucide-react';

const VisitorGate = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      const visitorData = {
        firstName,
        lastName,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
      visitors.push(visitorData);
      localStorage.setItem('visitors', JSON.stringify(visitors));
      
      onSubmit(visitorData);
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
        transition={{ delay: 0.2 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-3xl font-light text-zinc-100 mb-2">Добро пожаловать</h2>
          <p className="text-zinc-400 mb-8">Пожалуйста, представьтесь</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100"
              required
            />
            <input
              type="text"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg"
            >
              Войти
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminPanel = ({ isOpen, onClose }) => {
  const [visitors, setVisitors] = useState([]);
  const [password, setPassword] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    if (isOpen && hasAccess) {
      const stored = JSON.parse(localStorage.getItem('visitors') || '[]');
      setVisitors(stored);
    }
    if (isOpen) {
      setPassword('');
      setHasAccess(false);
    }
  }, [isOpen, hasAccess]);

  const checkPassword = () => {
    if (password === ADMIN_PASSWORD) {
      setHasAccess(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl" onClick={onClose}>
      <div className="w-full max-w-4xl bg-zinc-900 rounded-2xl border border-zinc-800" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-zinc-800 flex justify-between">
          <h3 className="text-2xl text-zinc-100">{hasAccess ? 'Лог посетителей' : 'Доступ ограничен'}</h3>
          <button onClick={onClose} className="text-zinc-400">✕</button>
        </div>
        
        <div className="p-6">
          {!hasAccess ? (
            <div className="text-center py-8">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkPassword()}
                placeholder="Пароль"
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                autoFocus
              />
              {passwordError && <p className="text-red-500 mt-2">Неверный пароль</p>}
              <button onClick={checkPassword} className="ml-2 px-4 py-2 bg-blue-600 rounded-lg">Войти</button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2">Имя</th>
                  <th className="text-left py-2">Фамилия</th>
                  <th className="text-left py-2">Время</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v, i) => (
                  <tr key={v.id} className="border-b border-zinc-800/50">
                    <td className="py-2">{v.firstName}</td>
                    <td className="py-2">{v.lastName}</td>
                    <td className="py-2">{new Date(v.timestamp).toLocaleString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ title, description, gradient, onClick }) => (
  <button onClick={onClick} className={`p-6 rounded-xl bg-gradient-to-br ${gradient} border border-zinc-700 text-left`}>
    <h3 className="text-xl text-zinc-100 mb-2">{title}</h3>
    <p className="text-zinc-400">{description}</p>
  </button>
);

const SoloWorkModal = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90" onClick={onClose}>
        <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl border border-zinc-800 p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between mb-4">
            <h3 className="text-2xl text-zinc-100">Соло работа</h3>
            <button onClick={onClose} className="text-zinc-400">✕</button>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h4 className="font-medium text-zinc-100">Веб-разработка (Frontend)</h4>
              <p className="text-emerald-400">150 000 ₸</p>
            </div>
            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h4 className="font-medium text-zinc-100">UI/UX Дизайн</h4>
              <p className="text-emerald-400">100 000 ₸</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [hasEnteredGate, setHasEnteredGate] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSoloWork, setShowSoloWork] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AnimatePresence>
        {!hasEnteredGate && <VisitorGate onSubmit={() => setHasEnteredGate(true)} />}
      </AnimatePresence>

      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      <SoloWorkModal isOpen={showSoloWork} onClose={() => setShowSoloWork(false)} />

      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-light mb-6">Frontend Developer</h1>
        <p className="text-xl text-zinc-400">Создаю премиальные цифровые продукты</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto my-20">
          <ServiceCard title="Соло работа" description="Индивидуальные проекты" gradient="from-blue-900/50 to-blue-800/30" onClick={() => setShowSoloWork(true)} />
          <ServiceCard title="Командные проекты" description="Работа в команде" gradient="from-purple-900/50 to-purple-800/30" onClick={() => alert('В разработке')} />
          <ServiceCard title="Корпоративные решения" description="Для бизнеса" gradient="from-emerald-900/50 to-emerald-800/30" onClick={() => alert('В разработке')} />
          <ServiceCard title="Обучение" description="Менторство" gradient="from-violet-900/50 to-violet-800/30" onClick={() => alert('В разработке')} />
        </div>

        <button onClick={() => setShowAdmin(true)} className="fixed bottom-8 right-8 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <Lock className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}