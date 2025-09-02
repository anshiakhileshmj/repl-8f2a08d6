import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div
      ref={ref}
      className="auth-dropdown"
      tabIndex={0}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen(!open);
        }
      }}
      data-testid={`dropdown-${placeholder.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="auth-dropdown__display">
        {selectedLabel || (
          <span className="auth-dropdown__placeholder">{placeholder}</span>
        )}
      </div>
      <span className="auth-dropdown__arrow">▼</span>
      
      {open && (
        <div className="auth-dropdown__options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`auth-dropdown__option ${
                value === opt.value ? 'auth-dropdown__option--selected' : ''
              }`}
              onMouseDown={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              data-testid={`option-${opt.value}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      
      {required && (
        <input
          tabIndex={-1}
          style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
          value={value}
          required
          readOnly
        />
      )}
    </div>
  );
};