import React from 'react';
import { Phone, Watch, Tablet } from 'lucide-react';
import '../styles/DeviceSelector.css';

interface DeviceSelectorProps {
  currentDevice: 'phone' | 'watch' | 'tablet';
  onDeviceChange: (device: 'phone' | 'watch' | 'tablet') => void;
}

const deviceInfo = {
  phone: {
    icon: Phone,
    label: 'Телефон',
    description: 'NoNamePhone Pro'
  },
  watch: {
    icon: Watch,
    label: 'Часы',
    description: 'NoName Watch 5'
  },
  tablet: {
    icon: Tablet,
    label: 'Планшет',
    description: 'NoName Tab S8'
  }
};

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ currentDevice, onDeviceChange }) => {
  return (
    <nav className="device-nav">
      {Object.entries(deviceInfo).map(([key, info]) => {
        const Icon = info.icon;
        const isActive = key === currentDevice;
        
        return (
          <button
            key={key}
            onClick={() => onDeviceChange(key as 'phone' | 'watch' | 'tablet')}
            className={`device-button ${isActive ? 'active' : ''}`}
          >
            <Icon 
              size={20} 
              className="device-icon"
            />
            <span className="device-label">{info.label}</span>
            {isActive && (
              <span className="device-description">
                {info.description}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default DeviceSelector;