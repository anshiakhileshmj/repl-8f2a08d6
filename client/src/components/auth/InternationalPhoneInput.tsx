import React, { useState, useRef, useEffect } from 'react';

interface Country {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
  placeholder: string;
  maxLength: number;
}

// Comprehensive country data with phone formats based on E.164 standard
const COUNTRIES: Country[] = [
  // Asia
  { code: "in", name: "India", dial_code: "+91", flag: "🇮🇳", placeholder: "9876543210", maxLength: 10 },
  { code: "us", name: "United States", dial_code: "+1", flag: "🇺🇸", placeholder: "555-123-4567", maxLength: 10 },
  { code: "gb", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧", placeholder: "7911 123456", maxLength: 11 },
  { code: "ca", name: "Canada", dial_code: "+1", flag: "🇨🇦", placeholder: "555-123-4567", maxLength: 10 },
  { code: "au", name: "Australia", dial_code: "+61", flag: "🇦🇺", placeholder: "4XX XXX XXX", maxLength: 9 },
  { code: "de", name: "Germany", dial_code: "+49", flag: "🇩🇪", placeholder: "171 12345678", maxLength: 11 },
  { code: "fr", name: "France", dial_code: "+33", flag: "🇫🇷", placeholder: "6 12 34 56 78", maxLength: 10 },
  { code: "it", name: "Italy", dial_code: "+39", flag: "🇮🇹", placeholder: "312 345 6789", maxLength: 10 },
  { code: "es", name: "Spain", dial_code: "+34", flag: "🇪🇸", placeholder: "612 34 56 78", maxLength: 9 },
  { code: "jp", name: "Japan", dial_code: "+81", flag: "🇯🇵", placeholder: "90-1234-5678", maxLength: 11 },
  { code: "kr", name: "South Korea", dial_code: "+82", flag: "🇰🇷", placeholder: "10-1234-5678", maxLength: 11 },
  { code: "cn", name: "China", dial_code: "+86", flag: "🇨🇳", placeholder: "139 0013 0013", maxLength: 11 },
  { code: "br", name: "Brazil", dial_code: "+55", flag: "🇧🇷", placeholder: "11 91234-5678", maxLength: 11 },
  { code: "mx", name: "Mexico", dial_code: "+52", flag: "🇲🇽", placeholder: "55 1234 5678", maxLength: 10 },
  { code: "ru", name: "Russia", dial_code: "+7", flag: "🇷🇺", placeholder: "912 345-67-89", maxLength: 10 },
  { code: "za", name: "South Africa", dial_code: "+27", flag: "🇿🇦", placeholder: "71 123 4567", maxLength: 9 },
  { code: "ae", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪", placeholder: "50 123 4567", maxLength: 9 },
  { code: "sa", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦", placeholder: "50 123 4567", maxLength: 9 },
  { code: "sg", name: "Singapore", dial_code: "+65", flag: "🇸🇬", placeholder: "8123 4567", maxLength: 8 },
  { code: "ch", name: "Switzerland", dial_code: "+41", flag: "🇨🇭", placeholder: "78 123 45 67", maxLength: 9 },
  { code: "nl", name: "Netherlands", dial_code: "+31", flag: "🇳🇱", placeholder: "6 12345678", maxLength: 9 },
  { code: "se", name: "Sweden", dial_code: "+46", flag: "🇸🇪", placeholder: "70-123 45 67", maxLength: 9 },
  { code: "no", name: "Norway", dial_code: "+47", flag: "🇳🇴", placeholder: "406 12 345", maxLength: 8 },
  { code: "dk", name: "Denmark", dial_code: "+45", flag: "🇩🇰", placeholder: "20 12 34 56", maxLength: 8 },
  { code: "fi", name: "Finland", dial_code: "+358", flag: "🇫🇮", placeholder: "50 1234567", maxLength: 9 },
  { code: "be", name: "Belgium", dial_code: "+32", flag: "🇧🇪", placeholder: "470 12 34 56", maxLength: 9 },
  { code: "at", name: "Austria", dial_code: "+43", flag: "🇦🇹", placeholder: "664 123456", maxLength: 11 },
  { code: "pl", name: "Poland", dial_code: "+48", flag: "🇵🇱", placeholder: "512 123 456", maxLength: 9 },
  { code: "tr", name: "Turkey", dial_code: "+90", flag: "🇹🇷", placeholder: "501 234 56 78", maxLength: 10 },
  { code: "eg", name: "Egypt", dial_code: "+20", flag: "🇪🇬", placeholder: "100 123 4567", maxLength: 10 },
  { code: "ng", name: "Nigeria", dial_code: "+234", flag: "🇳🇬", placeholder: "802 123 4567", maxLength: 10 },
  { code: "ke", name: "Kenya", dial_code: "+254", flag: "🇰🇪", placeholder: "712 123456", maxLength: 9 },
  { code: "gh", name: "Ghana", dial_code: "+233", flag: "🇬🇭", placeholder: "23 123 4567", maxLength: 9 },
  { code: "ma", name: "Morocco", dial_code: "+212", flag: "🇲🇦", placeholder: "6 12 34 56 78", maxLength: 9 },
  { code: "dz", name: "Algeria", dial_code: "+213", flag: "🇩🇿", placeholder: "551 23 45 67", maxLength: 9 },
  { code: "tn", name: "Tunisia", dial_code: "+216", flag: "🇹🇳", placeholder: "20 123 456", maxLength: 8 },
  { code: "ly", name: "Libya", dial_code: "+218", flag: "🇱🇾", placeholder: "91 2345678", maxLength: 9 },
  { code: "et", name: "Ethiopia", dial_code: "+251", flag: "🇪🇹", placeholder: "91 123 4567", maxLength: 9 },
  { code: "af", name: "Afghanistan", dial_code: "+93", flag: "🇦🇫", placeholder: "70 123 4567", maxLength: 9 },
  { code: "al", name: "Albania", dial_code: "+355", flag: "🇦🇱", placeholder: "67 212 3456", maxLength: 9 },
  { code: "ar", name: "Argentina", dial_code: "+54", flag: "🇦🇷", placeholder: "9 11 2345-6789", maxLength: 10 },
  { code: "am", name: "Armenia", dial_code: "+374", flag: "🇦🇲", placeholder: "77 123456", maxLength: 8 },
  { code: "bd", name: "Bangladesh", dial_code: "+880", flag: "🇧🇩", placeholder: "171 234 5678", maxLength: 10 },
  { code: "by", name: "Belarus", dial_code: "+375", flag: "🇧🇾", placeholder: "29 1234567", maxLength: 9 },
  { code: "bg", name: "Bulgaria", dial_code: "+359", flag: "🇧🇬", placeholder: "87 123 4567", maxLength: 9 },
  { code: "kh", name: "Cambodia", dial_code: "+855", flag: "🇰🇭", placeholder: "91 234 567", maxLength: 8 },
  { code: "cl", name: "Chile", dial_code: "+56", flag: "🇨🇱", placeholder: "9 1234 5678", maxLength: 9 },
  { code: "co", name: "Colombia", dial_code: "+57", flag: "🇨🇴", placeholder: "300 1234567", maxLength: 10 },
  { code: "hr", name: "Croatia", dial_code: "+385", flag: "🇭🇷", placeholder: "91 234 5678", maxLength: 9 },
  { code: "cz", name: "Czech Republic", dial_code: "+420", flag: "🇨🇿", placeholder: "601 123 456", maxLength: 9 },
  { code: "ec", name: "Ecuador", dial_code: "+593", flag: "🇪🇨", placeholder: "99 123 4567", maxLength: 9 },
  { code: "ee", name: "Estonia", dial_code: "+372", flag: "🇪🇪", placeholder: "512 3456", maxLength: 8 },
  { code: "ge", name: "Georgia", dial_code: "+995", flag: "🇬🇪", placeholder: "555 12 34 56", maxLength: 9 },
  { code: "gr", name: "Greece", dial_code: "+30", flag: "🇬🇷", placeholder: "691 234 5678", maxLength: 10 },
  { code: "gt", name: "Guatemala", dial_code: "+502", flag: "🇬🇹", placeholder: "5123 4567", maxLength: 8 },
  { code: "hn", name: "Honduras", dial_code: "+504", flag: "🇭🇳", placeholder: "9123 4567", maxLength: 8 },
  { code: "hk", name: "Hong Kong", dial_code: "+852", flag: "🇭🇰", placeholder: "5123 4567", maxLength: 8 },
  { code: "hu", name: "Hungary", dial_code: "+36", flag: "🇭🇺", placeholder: "20 123 4567", maxLength: 9 },
  { code: "is", name: "Iceland", dial_code: "+354", flag: "🇮🇸", placeholder: "611 2345", maxLength: 7 },
  { code: "id", name: "Indonesia", dial_code: "+62", flag: "🇮🇩", placeholder: "812-3456-7890", maxLength: 11 },
  { code: "ir", name: "Iran", dial_code: "+98", flag: "🇮🇷", placeholder: "901 234 5678", maxLength: 10 },
  { code: "iq", name: "Iraq", dial_code: "+964", flag: "🇮🇶", placeholder: "790 123 4567", maxLength: 10 },
  { code: "ie", name: "Ireland", dial_code: "+353", flag: "🇮🇪", placeholder: "85 012 3456", maxLength: 9 },
  { code: "il", name: "Israel", dial_code: "+972", flag: "🇮🇱", placeholder: "50-123-4567", maxLength: 9 },
  { code: "jm", name: "Jamaica", dial_code: "+1", flag: "🇯🇲", placeholder: "876-123-4567", maxLength: 10 },
  { code: "jo", name: "Jordan", dial_code: "+962", flag: "🇯🇴", placeholder: "7 9012 3456", maxLength: 9 },
  { code: "kz", name: "Kazakhstan", dial_code: "+7", flag: "🇰🇿", placeholder: "701 123 45 67", maxLength: 10 },
  { code: "kw", name: "Kuwait", dial_code: "+965", flag: "🇰🇼", placeholder: "500 12345", maxLength: 8 },
  { code: "kg", name: "Kyrgyzstan", dial_code: "+996", flag: "🇰🇬", placeholder: "700 123 456", maxLength: 9 },
  { code: "la", name: "Laos", dial_code: "+856", flag: "🇱🇦", placeholder: "20 1234 5678", maxLength: 10 },
  { code: "lv", name: "Latvia", dial_code: "+371", flag: "🇱🇻", placeholder: "2123 4567", maxLength: 8 },
  { code: "lb", name: "Lebanon", dial_code: "+961", flag: "🇱🇧", placeholder: "71 123 456", maxLength: 8 },
  { code: "lt", name: "Lithuania", dial_code: "+370", flag: "🇱🇹", placeholder: "612 34567", maxLength: 8 },
  { code: "lu", name: "Luxembourg", dial_code: "+352", flag: "🇱🇺", placeholder: "628 123 456", maxLength: 9 },
  { code: "mo", name: "Macau", dial_code: "+853", flag: "🇲🇴", placeholder: "6612 3456", maxLength: 8 },
  { code: "mk", name: "North Macedonia", dial_code: "+389", flag: "🇲🇰", placeholder: "70 123 456", maxLength: 8 },
  { code: "my", name: "Malaysia", dial_code: "+60", flag: "🇲🇾", placeholder: "12-345 6789", maxLength: 9 },
  { code: "mv", name: "Maldives", dial_code: "+960", flag: "🇲🇻", placeholder: "771 2345", maxLength: 7 },
  { code: "ml", name: "Mali", dial_code: "+223", flag: "🇲🇱", placeholder: "65 01 23 45", maxLength: 8 },
  { code: "mt", name: "Malta", dial_code: "+356", flag: "🇲🇹", placeholder: "9696 1234", maxLength: 8 },
  { code: "mr", name: "Mauritania", dial_code: "+222", flag: "🇲🇷", placeholder: "22 12 34 56", maxLength: 8 },
  { code: "mu", name: "Mauritius", dial_code: "+230", flag: "🇲🇺", placeholder: "5251 2345", maxLength: 8 },
  { code: "md", name: "Moldova", dial_code: "+373", flag: "🇲🇩", placeholder: "621 12 345", maxLength: 8 },
  { code: "mc", name: "Monaco", dial_code: "+377", flag: "🇲🇨", placeholder: "6 12 34 56 78", maxLength: 9 },
  { code: "mn", name: "Mongolia", dial_code: "+976", flag: "🇲🇳", placeholder: "8812 3456", maxLength: 8 },
  { code: "me", name: "Montenegro", dial_code: "+382", flag: "🇲🇪", placeholder: "67 622 901", maxLength: 8 },
  { code: "mm", name: "Myanmar", dial_code: "+95", flag: "🇲🇲", placeholder: "9 212 3456", maxLength: 9 },
  { code: "na", name: "Namibia", dial_code: "+264", flag: "🇳🇦", placeholder: "81 123 4567", maxLength: 9 },
  { code: "np", name: "Nepal", dial_code: "+977", flag: "🇳🇵", placeholder: "984-1234567", maxLength: 10 },
  { code: "nz", name: "New Zealand", dial_code: "+64", flag: "🇳🇿", placeholder: "21 123 4567", maxLength: 9 },
  { code: "ni", name: "Nicaragua", dial_code: "+505", flag: "🇳🇮", placeholder: "8123 4567", maxLength: 8 },
  { code: "ne", name: "Niger", dial_code: "+227", flag: "🇳🇪", placeholder: "93 12 34 56", maxLength: 8 },
  { code: "kp", name: "North Korea", dial_code: "+850", flag: "🇰🇵", placeholder: "192 123 4567", maxLength: 10 },
  { code: "om", name: "Oman", dial_code: "+968", flag: "🇴🇲", placeholder: "9212 3456", maxLength: 8 },
  { code: "pk", name: "Pakistan", dial_code: "+92", flag: "🇵🇰", placeholder: "301 2345678", maxLength: 10 },
  { code: "pw", name: "Palau", dial_code: "+680", flag: "🇵🇼", placeholder: "620 1234", maxLength: 7 },
  { code: "ps", name: "Palestine", dial_code: "+970", flag: "🇵🇸", placeholder: "59 123 4567", maxLength: 9 },
  { code: "pa", name: "Panama", dial_code: "+507", flag: "🇵🇦", placeholder: "6123-4567", maxLength: 8 },
  { code: "pg", name: "Papua New Guinea", dial_code: "+675", flag: "🇵🇬", placeholder: "681 23456", maxLength: 8 },
  { code: "py", name: "Paraguay", dial_code: "+595", flag: "🇵🇾", placeholder: "961 123456", maxLength: 9 },
  { code: "pe", name: "Peru", dial_code: "+51", flag: "🇵🇪", placeholder: "912 345 678", maxLength: 9 },
  { code: "ph", name: "Philippines", dial_code: "+63", flag: "🇵🇭", placeholder: "917 123 4567", maxLength: 10 },
  { code: "pt", name: "Portugal", dial_code: "+351", flag: "🇵🇹", placeholder: "912 345 678", maxLength: 9 },
  { code: "pr", name: "Puerto Rico", dial_code: "+1", flag: "🇵🇷", placeholder: "787-123-4567", maxLength: 10 },
  { code: "qa", name: "Qatar", dial_code: "+974", flag: "🇶🇦", placeholder: "3312 3456", maxLength: 8 },
  { code: "ro", name: "Romania", dial_code: "+40", flag: "🇷🇴", placeholder: "712 034 567", maxLength: 9 },
  { code: "rw", name: "Rwanda", dial_code: "+250", flag: "🇷🇼", placeholder: "781 123 456", maxLength: 9 },
  { code: "rs", name: "Serbia", dial_code: "+381", flag: "🇷🇸", placeholder: "60 1234567", maxLength: 9 },
  { code: "sc", name: "Seychelles", dial_code: "+248", flag: "🇸🇨", placeholder: "251 2345", maxLength: 7 },
  { code: "sl", name: "Sierra Leone", dial_code: "+232", flag: "🇸🇱", placeholder: "25 123456", maxLength: 8 },
  { code: "sk", name: "Slovakia", dial_code: "+421", flag: "🇸🇰", placeholder: "912 123 456", maxLength: 9 },
  { code: "si", name: "Slovenia", dial_code: "+386", flag: "🇸🇮", placeholder: "31 123 456", maxLength: 8 },
  { code: "sb", name: "Solomon Islands", dial_code: "+677", flag: "🇸🇧", placeholder: "74 12345", maxLength: 7 },
  { code: "so", name: "Somalia", dial_code: "+252", flag: "🇸🇴", placeholder: "90 1234567", maxLength: 9 },
  { code: "lk", name: "Sri Lanka", dial_code: "+94", flag: "🇱🇰", placeholder: "71 234 5678", maxLength: 9 },
  { code: "sd", name: "Sudan", dial_code: "+249", flag: "🇸🇩", placeholder: "91 123 4567", maxLength: 9 },
  { code: "sr", name: "Suriname", dial_code: "+597", flag: "🇸🇷", placeholder: "612 3456", maxLength: 7 },
  { code: "sy", name: "Syria", dial_code: "+963", flag: "🇸🇾", placeholder: "944 123 456", maxLength: 9 },
  { code: "tw", name: "Taiwan", dial_code: "+886", flag: "🇹🇼", placeholder: "912 345 678", maxLength: 9 },
  { code: "tj", name: "Tajikistan", dial_code: "+992", flag: "🇹🇯", placeholder: "917 12 3456", maxLength: 9 },
  { code: "th", name: "Thailand", dial_code: "+66", flag: "🇹🇭", placeholder: "81 234 5678", maxLength: 9 },
  { code: "tl", name: "Timor-Leste", dial_code: "+670", flag: "🇹🇱", placeholder: "7721 2345", maxLength: 8 },
  { code: "tg", name: "Togo", dial_code: "+228", flag: "🇹🇬", placeholder: "90 12 34 56", maxLength: 8 },
  { code: "to", name: "Tonga", dial_code: "+676", flag: "🇹🇴", placeholder: "771 2345", maxLength: 7 },
  { code: "tt", name: "Trinidad and Tobago", dial_code: "+1", flag: "🇹🇹", placeholder: "868-123-4567", maxLength: 10 },
  { code: "tm", name: "Turkmenistan", dial_code: "+993", flag: "🇹🇲", placeholder: "65 123456", maxLength: 8 },
  { code: "tv", name: "Tuvalu", dial_code: "+688", flag: "🇹🇻", placeholder: "901234", maxLength: 6 },
  { code: "ua", name: "Ukraine", dial_code: "+380", flag: "🇺🇦", placeholder: "50 123 4567", maxLength: 9 },
  { code: "uy", name: "Uruguay", dial_code: "+598", flag: "🇺🇾", placeholder: "94 123 456", maxLength: 8 },
  { code: "uz", name: "Uzbekistan", dial_code: "+998", flag: "🇺🇿", placeholder: "90 123 45 67", maxLength: 9 },
  { code: "vu", name: "Vanuatu", dial_code: "+678", flag: "🇻🇺", placeholder: "591 2345", maxLength: 7 },
  { code: "ve", name: "Venezuela", dial_code: "+58", flag: "🇻🇪", placeholder: "414-1234567", maxLength: 10 },
  { code: "vn", name: "Vietnam", dial_code: "+84", flag: "🇻🇳", placeholder: "91 234 56 78", maxLength: 9 },
  { code: "ye", name: "Yemen", dial_code: "+967", flag: "🇾🇪", placeholder: "712 345 678", maxLength: 9 },
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
  // Find India as default country
  const defaultCountry = COUNTRIES.find(c => c.code === 'in') || COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const validatePhoneNumber = (number: string, country: Country): boolean => {
    // Remove any non-digit characters for validation
    const cleaned = number.replace(/\D/g, '');
    // Basic validation: should match expected length for the country
    return cleaned.length >= (country.maxLength - 2) && cleaned.length <= country.maxLength;
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
    if (inputValue.replace(/\D/g, '').length > selectedCountry.maxLength) {
      inputValue = inputValue.substring(0, selectedCountry.maxLength + 3); // Allow for formatting chars
    }

    setPhoneNumber(inputValue);
    
    const isValid = validatePhoneNumber(inputValue, selectedCountry);
    const formattedNumber = formatPhoneNumber(inputValue, selectedCountry);
    
    onChange(formattedNumber, isValid, formattedNumber);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    
    // Re-validate with new country
    const isValid = validatePhoneNumber(phoneNumber, country);
    const formattedNumber = formatPhoneNumber(phoneNumber, country);
    onChange(formattedNumber, isValid, formattedNumber);
  };

  return (
    <div className="auth-row auth-row--double">
      {/* Country Selector using exact same pattern as CustomDropdown */}
      <div
        ref={dropdownRef}
        className="auth-dropdown"
        tabIndex={0}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
          }
        }}
        data-testid="country-selector"
      >
        <div className="auth-dropdown__display">
          <span style={{ marginRight: '8px' }}>{selectedCountry.flag}</span>
          <span>{selectedCountry.dial_code}</span>
        </div>
        <span className="auth-dropdown__arrow">▼</span>
        
        {isDropdownOpen && (
          <div className="auth-dropdown__options">
            {COUNTRIES.map((country) => (
              <div
                key={country.code}
                className={`auth-dropdown__option ${
                  selectedCountry.code === country.code ? 'auth-dropdown__option--selected' : ''
                }`}
                onMouseDown={() => handleCountrySelect(country)}
                data-testid={`country-option-${country.code}`}
              >
                <span style={{ marginRight: '8px' }}>{country.flag}</span>
                <span style={{ marginRight: '8px' }}>{country.name}</span>
                <span style={{ opacity: 0.7, fontSize: '12px' }}>{country.dial_code}</span>
              </div>
            ))}
          </div>
        )}
        
        {required && (
          <input
            tabIndex={-1}
            style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
            value={selectedCountry.code}
            required
            readOnly
          />
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={selectedCountry.placeholder}
        className="auth-input"
        required={required}
        data-testid="input-phone-number"
      />
    </div>
  );
};