import React, { useEffect, useRef, useState } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
}

// Simple phone validation - in a real app you'd want more robust validation
const validatePhoneNumber = (phone: string): boolean => {
  // Basic validation: should have country code and be 7-15 digits
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "+1 234 567 8900",
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Allow + at the start and numbers only
    inputValue = inputValue.replace(/[^\d+]/g, '');
    
    // Only allow + at the beginning
    if (inputValue.includes('+') && !inputValue.startsWith('+')) {
      inputValue = inputValue.replace(/\+/g, '');
    }
    
    // Limit to one + at start
    if (inputValue.startsWith('+') && inputValue.indexOf('+', 1) !== -1) {
      inputValue = '+' + inputValue.slice(1).replace(/\+/g, '');
    }

    const isValid = validatePhoneNumber(inputValue);
    onChange(inputValue, isValid);
  };

  return (
    <div className="phone-input-wrapper">
      <input
        ref={inputRef}
        type="tel"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`auth-input ${focused ? 'auth-input--focused' : ''}`}
        placeholder={placeholder}
        required={required}
        data-testid="input-phone"
      />
    </div>
  );
};