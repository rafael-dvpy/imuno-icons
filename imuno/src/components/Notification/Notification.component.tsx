import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  index: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onClose,
  index
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-600';
      case 'error': return 'bg-red-500 border-red-600';
      case 'info': default: return 'bg-blue-500 border-blue-600';
    }
  };
  
  return (
    <div 
      className={`
        fixed right-5 z-50 px-4 py-3 rounded-lg shadow-lg
        text-white border-l-4 flex justify-between items-center
        transform transition-all duration-300 max-w-sm
        ${getTypeStyles()}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
      style={{ top: `${5 + index * 64}px` }}
    >
      <span>{message}</span>
      <button 
        onClick={handleClose}
        className="text-white opacity-70 hover:opacity-100 transition-opacity ml-3"
        aria-label="Fechar notificação"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification; 