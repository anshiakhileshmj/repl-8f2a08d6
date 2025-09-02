import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
  placeholder: string;
  maxLength: number;
}

const COUNTRIES: Country[] = [
  { code: "us", name: "United States", dial_code: "+1", flag: "🇺🇸", placeholder: "(555) 123-4567", maxLength: 14 },
  { code: "gb", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧", placeholder: "7911 123456", maxLength: 11 },
  { code: "ca", name: "Canada", dial_code: "+1", flag: "🇨🇦", placeholder: "(555) 123-4567", maxLength: 14 },
  { code: "au", name: "Australia", dial_code: "+61", flag: "🇦🇺", placeholder: "0412 345 678", maxLength: 12 },
  { code: "de", name: "Germany", dial_code: "+49", flag: "🇩🇪", placeholder: "0171 2345678", maxLength: 12 },
  { code: "fr", name: "France", dial_code: "+33", flag: "🇫🇷", placeholder: "06 12 34 56 78", maxLength: 14 },
  { code: "it", name: "Italy", dial_code: "+39", flag: "🇮🇹", placeholder: "312 345 6789", maxLength: 12 },
  { code: "es", name: "Spain", dial_code: "+34", flag: "🇪🇸", placeholder: "612 34 56 78", maxLength: 11 },
  { code: "jp", name: "Japan", dial_code: "+81", flag: "🇯🇵", placeholder: "090-1234-5678", maxLength: 13 },
  { code: "kr", name: "South Korea", dial_code: "+82", flag: "🇰🇷", placeholder: "010-1234-5678", maxLength: 13 },
  { code: "cn", name: "China", dial_code: "+86", flag: "🇨🇳", placeholder: "139 0013 0013", maxLength: 13 },
  { code: "in", name: "India", dial_code: "+91", flag: "🇮🇳", placeholder: "81234 56789", maxLength: 11 },
  { code: "br", name: "Brazil", dial_code: "+55", flag: "🇧🇷", placeholder: "(11) 91234-5678", maxLength: 15 },
  { code: "mx", name: "Mexico", dial_code: "+52", flag: "🇲🇽", placeholder: "55 1234 5678", maxLength: 12 },
  { code: "ru", name: "Russia", dial_code: "+7", flag: "🇷🇺", placeholder: "912 345-67-89", maxLength: 13 },
  { code: "za", name: "South Africa", dial_code: "+27", flag: "🇿🇦", placeholder: "071 123 4567", maxLength: 12 },
  { code: "ae", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪", placeholder: "50 123 4567", maxLength: 11 },
  { code: "sg", name: "Singapore", dial_code: "+65", flag: "🇸🇬", placeholder: "8123 4567", maxLength: 9 },
  { code: "ch", name: "Switzerland", dial_code: "+41", flag: "🇨🇭", placeholder: "078 123 45 67", maxLength: 13 },
  { code: "nl", name: "Netherlands", dial_code: "+31", flag: "🇳🇱", placeholder: "06 12345678", maxLength: 11 },
  { code: "se", name: "Sweden", dial_code: "+46", flag: "🇸🇪", placeholder: "070-123 45 67", maxLength: 13 },
  { code: "no", name: "Norway", dial_code: "+47", flag: "🇳🇴", placeholder: "406 12 345", maxLength: 11 },
  { code: "af", name: "Afghanistan", dial_code: "+93", flag: "🇦🇫", placeholder: "070 123 4567", maxLength: 12 },
  { code: "al", name: "Albania", dial_code: "+355", flag: "🇦🇱", placeholder: "067 212 3456", maxLength: 12 },
  { code: "dz", name: "Algeria", dial_code: "+213", flag: "🇩🇿", placeholder: "0551 23 45 67", maxLength: 13 },
];

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
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default to US
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const validatePhoneNumber = (number: string, country: Country): boolean => {
    // Remove any non-digit characters for validation
    const cleaned = number.replace(/\D/g, '');
    // Basic validation: should have enough digits for the country
    const minLength = country.maxLength - 4; // Allow some flexibility
    return cleaned.length >= minLength && cleaned.length <= country.maxLength;
  };

  const formatPhoneNumber = (number: string, country: Country): string => {
    const cleaned = number.replace(/\D/g, '');
    return `${country.dial_code} ${cleaned}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove any non-digit characters except spaces and common phone formatting
    inputValue = inputValue.replace(/[^\d\s\-\(\)\+]/g, '');
    
    // Limit length based on selected country
    if (inputValue.length > selectedCountry.maxLength) {
      inputValue = inputValue.substring(0, selectedCountry.maxLength);
    }

    setPhoneNumber(inputValue);
    
    const isValid = validatePhoneNumber(inputValue, selectedCountry);
    const formattedNumber = formatPhoneNumber(inputValue, selectedCountry);
    
    onChange(formattedNumber, isValid, formattedNumber);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Re-validate with new country
    const isValid = validatePhoneNumber(phoneNumber, country);
    const formattedNumber = formatPhoneNumber(phoneNumber, country);
    onChange(formattedNumber, isValid, formattedNumber);
  };

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dial_code.includes(searchTerm)
  );

  return (
    <div className="phone-input-container">
      <div className="phone-input-wrapper">
        {/* Country Selector */}
        <div 
          ref={dropdownRef}
          className="country-selector"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          data-testid="country-selector"
        >
          <span className="country-flag">{selectedCountry.flag}</span>
          <span className="country-code">{selectedCountry.dial_code}</span>
          <ChevronDown className={`chevron ${isDropdownOpen ? 'open' : ''}`} />
          
          {isDropdownOpen && (
            <div className="country-dropdown">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="country-search"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="country-search"
                />
              </div>
              <div className="country-list">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCountrySelect(country);
                    }}
                    data-testid={`country-option-${country.code}`}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                    <span className="country-code">{country.dial_code}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={selectedCountry.placeholder}
          className="phone-number-input auth-input"
          required={required}
          data-testid="input-phone-number"
        />
      </div>
    </div>
  );
};