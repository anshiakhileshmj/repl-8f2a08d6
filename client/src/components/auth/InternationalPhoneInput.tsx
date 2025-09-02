import React, { useState } from 'react';
import IntlTelInput from 'intl-tel-input/react';
import 'intl-tel-input/build/css/intlTelInput.css';

interface InternationalPhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean, formattedNumber: string) => void;
  required?: boolean;
}

export const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = ({
  value,
  onChange,
  required = false,
}) => {
  const [phone, setPhone] = useState(value);
  const [isValid, setIsValid] = useState(false);

  return (
    <div className="phone-input-wrapper">
      <IntlTelInput
        initialValue={phone}
        onChangeNumber={(num) => {
          // Allow optional "+" at start
          const formatted = num.replace(/(?!^\+)\D/g, "");
          setPhone(formatted);
          onChange(formatted, isValid, formatted);
        }}
        onChangeValidity={(valid) => {
          setIsValid(valid);
          onChange(phone, valid, phone);
        }}
        initOptions={{
          initialCountry: "in",
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js",
        } as any} // 👈 cast so TS accepts utilsScript
        inputProps={{
          name: "phone",
          required: required,
          className: "phone-number auth-input",
          style: { maxWidth: 250 },
          placeholder: "+91 9876543210"
        }}
      />
    </div>
  );
};