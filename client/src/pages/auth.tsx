import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomDropdown } from '@/components/auth/CustomDropdown';
import { InternationalPhoneInput } from '@/components/auth/InternationalPhoneInput';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';
import { Mail, Lock, User, Building, Briefcase, Eye, EyeOff } from 'lucide-react';

const COUNTRIES = [
  { code: "ad", name: "Andorra" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "af", name: "Afghanistan" },
  { code: "ag", name: "Antigua and Barbuda" },
  { code: "ai", name: "Anguilla" },
  { code: "al", name: "Albania" },
  { code: "am", name: "Armenia" },
  { code: "ao", name: "Angola" },
  { code: "aq", name: "Antarctica" },
  { code: "ar", name: "Argentina" },
  { code: "as", name: "American Samoa" },
  { code: "at", name: "Austria" },
  { code: "au", name: "Australia" },
  { code: "aw", name: "Aruba" },
  { code: "ax", name: "Aland Islands" },
  { code: "az", name: "Azerbaijan" },
  { code: "ba", name: "Bosnia and Herzegovina" },
  { code: "bb", name: "Barbados" },
  { code: "bd", name: "Bangladesh" },
  { code: "be", name: "Belgium" },
  { code: "bf", name: "Burkina Faso" },
  { code: "bg", name: "Bulgaria" },
  { code: "bh", name: "Bahrain" },
  { code: "bi", name: "Burundi" },
  { code: "bj", name: "Benin" },
  { code: "bl", name: "Saint Barthelemy" },
  { code: "bm", name: "Bermuda" },
  { code: "bn", name: "Brunei" },
  { code: "bo", name: "Bolivia" },
  { code: "bq", name: "Bonaire, Saint Eustatius and Saba" },
  { code: "br", name: "Brazil" },
  { code: "bs", name: "Bahamas" },
  { code: "bt", name: "Bhutan" },
  { code: "bv", name: "Bouvet Island" },
  { code: "bw", name: "Botswana" },
  { code: "by", name: "Belarus" },
  { code: "bz", name: "Belize" },
  { code: "ca", name: "Canada" },
  { code: "cc", name: "Cocos Islands" },
  { code: "cd", name: "Democratic Republic of the Congo" },
  { code: "cf", name: "Central African Republic" },
  { code: "cg", name: "Republic of the Congo" },
  { code: "ch", name: "Switzerland" },
  { code: "ci", name: "Ivory Coast" },
  { code: "ck", name: "Cook Islands" },
  { code: "cl", name: "Chile" },
  { code: "cm", name: "Cameroon" },
  { code: "cn", name: "China" },
  { code: "co", name: "Colombia" },
  { code: "cr", name: "Costa Rica" },
  { code: "cu", name: "Cuba" },
  { code: "cv", name: "Cape Verde" },
  { code: "cw", name: "Curacao" },
  { code: "cx", name: "Christmas Island" },
  { code: "cy", name: "Cyprus" },
  { code: "cz", name: "Czech Republic" },
  { code: "de", name: "Germany" },
  { code: "dj", name: "Djibouti" },
  { code: "dk", name: "Denmark" },
  { code: "dm", name: "Dominica" },
  { code: "do", name: "Dominican Republic" },
  { code: "dz", name: "Algeria" },
  { code: "ec", name: "Ecuador" },
  { code: "ee", name: "Estonia" },
  { code: "eg", name: "Egypt" },
  { code: "eh", name: "Western Sahara" },
  { code: "er", name: "Eritrea" },
  { code: "es", name: "Spain" },
  { code: "et", name: "Ethiopia" },
  { code: "fi", name: "Finland" },
  { code: "fj", name: "Fiji" },
  { code: "fk", name: "Falkland Islands" },
  { code: "fm", name: "Micronesia" },
  { code: "fo", name: "Faroe Islands" },
  { code: "fr", name: "France" },
  { code: "ga", name: "Gabon" },
  { code: "gb", name: "United Kingdom" },
  { code: "gd", name: "Grenada" },
  { code: "ge", name: "Georgia" },
  { code: "gf", name: "French Guiana" },
  { code: "gg", name: "Guernsey" },
  { code: "gh", name: "Ghana" },
  { code: "gi", name: "Gibraltar" },
  { code: "gl", name: "Greenland" },
  { code: "gm", name: "Gambia" },
  { code: "gn", name: "Guinea" },
  { code: "gp", name: "Guadeloupe" },
  { code: "gq", name: "Equatorial Guinea" },
  { code: "gr", name: "Greece" },
  { code: "gs", name: "South Georgia and the South Sandwich Islands" },
  { code: "gt", name: "Guatemala" },
  { code: "gu", name: "Guam" },
  { code: "gw", name: "Guinea-Bissau" },
  { code: "gy", name: "Guyana" },
  { code: "hk", name: "Hong Kong" },
  { code: "hm", name: "Heard Island and McDonald Islands" },
  { code: "hn", name: "Honduras" },
  { code: "hr", name: "Croatia" },
  { code: "ht", name: "Haiti" },
  { code: "hu", name: "Hungary" },
  { code: "id", name: "Indonesia" },
  { code: "ie", name: "Ireland" },
  { code: "il", name: "Israel" },
  { code: "im", name: "Isle of Man" },
  { code: "in", name: "India" },
  { code: "io", name: "British Indian Ocean Territory" },
  { code: "iq", name: "Iraq" },
  { code: "ir", name: "Iran" },
  { code: "is", name: "Iceland" },
  { code: "it", name: "Italy" },
  { code: "je", name: "Jersey" },
  { code: "jm", name: "Jamaica" },
  { code: "jo", name: "Jordan" },
  { code: "jp", name: "Japan" },
  { code: "ke", name: "Kenya" },
  { code: "kg", name: "Kyrgyzstan" },
  { code: "kh", name: "Cambodia" },
  { code: "ki", name: "Kiribati" },
  { code: "km", name: "Comoros" },
  { code: "kn", name: "Saint Kitts and Nevis" },
  { code: "kp", name: "North Korea" },
  { code: "kr", name: "South Korea" },
  { code: "kw", name: "Kuwait" },
  { code: "ky", name: "Cayman Islands" },
  { code: "kz", name: "Kazakhstan" },
  { code: "la", name: "Laos" },
  { code: "lb", name: "Lebanon" },
  { code: "lc", name: "Saint Lucia" },
  { code: "li", name: "Liechtenstein" },
  { code: "lk", name: "Sri Lanka" },
  { code: "lr", name: "Liberia" },
  { code: "ls", name: "Lesotho" },
  { code: "lt", name: "Lithuania" },
  { code: "lu", name: "Luxembourg" },
  { code: "lv", name: "Latvia" },
  { code: "ly", name: "Libya" },
  { code: "ma", name: "Morocco" },
  { code: "mc", name: "Monaco" },
  { code: "md", name: "Moldova" },
  { code: "me", name: "Montenegro" },
  { code: "mf", name: "Saint Martin" },
  { code: "mg", name: "Madagascar" },
  { code: "mh", name: "Marshall Islands" },
  { code: "mk", name: "North Macedonia" },
  { code: "ml", name: "Mali" },
  { code: "mm", name: "Myanmar" },
  { code: "mn", name: "Mongolia" },
  { code: "mo", name: "Macao" },
  { code: "mp", name: "Northern Mariana Islands" },
  { code: "mq", name: "Martinique" },
  { code: "mr", name: "Mauritania" },
  { code: "ms", name: "Montserrat" },
  { code: "mt", name: "Malta" },
  { code: "mu", name: "Mauritius" },
  { code: "mv", name: "Maldives" },
  { code: "mw", name: "Malawi" },
  { code: "mx", name: "Mexico" },
  { code: "my", name: "Malaysia" },
  { code: "mz", name: "Mozambique" },
  { code: "na", name: "Namibia" },
  { code: "nc", name: "New Caledonia" },
  { code: "ne", name: "Niger" },
  { code: "nf", name: "Norfolk Island" },
  { code: "ng", name: "Nigeria" },
  { code: "ni", name: "Nicaragua" },
  { code: "nl", name: "Netherlands" },
  { code: "no", name: "Norway" },
  { code: "np", name: "Nepal" },
  { code: "nr", name: "Nauru" },
  { code: "nu", name: "Niue" },
  { code: "nz", name: "New Zealand" },
  { code: "om", name: "Oman" },
  { code: "pa", name: "Panama" },
  { code: "pe", name: "Peru" },
  { code: "pf", name: "French Polynesia" },
  { code: "pg", name: "Papua New Guinea" },
  { code: "ph", name: "Philippines" },
  { code: "pk", name: "Pakistan" },
  { code: "pl", name: "Poland" },
  { code: "pm", name: "Saint Pierre and Miquelon" },
  { code: "pn", name: "Pitcairn" },
  { code: "pr", name: "Puerto Rico" },
  { code: "ps", name: "Palestine" },
  { code: "pt", name: "Portugal" },
  { code: "pw", name: "Palau" },
  { code: "py", name: "Paraguay" },
  { code: "qa", name: "Qatar" },
  { code: "re", name: "Reunion" },
  { code: "ro", name: "Romania" },
  { code: "rs", name: "Serbia" },
  { code: "ru", name: "Russia" },
  { code: "rw", name: "Rwanda" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "sb", name: "Solomon Islands" },
  { code: "sc", name: "Seychelles" },
  { code: "sd", name: "Sudan" },
  { code: "se", name: "Sweden" },
  { code: "sg", name: "Singapore" },
  { code: "sh", name: "Saint Helena" },
  { code: "si", name: "Slovenia" },
  { code: "sj", name: "Svalbard and Jan Mayen" },
  { code: "sk", name: "Slovakia" },
  { code: "sl", name: "Sierra Leone" },
  { code: "sm", name: "San Marino" },
  { code: "sn", name: "Senegal" },
  { code: "so", name: "Somalia" },
  { code: "sr", name: "Suriname" },
  { code: "ss", name: "South Sudan" },
  { code: "st", name: "Sao Tome and Principe" },
  { code: "sv", name: "El Salvador" },
  { code: "sx", name: "Sint Maarten" },
  { code: "sy", name: "Syria" },
  { code: "sz", name: "Eswatini" },
  { code: "tc", name: "Turks and Caicos Islands" },
  { code: "td", name: "Chad" },
  { code: "tf", name: "French Southern Territories" },
  { code: "tg", name: "Togo" },
  { code: "th", name: "Thailand" },
  { code: "tj", name: "Tajikistan" },
  { code: "tk", name: "Tokelau" },
  { code: "tl", name: "East Timor" },
  { code: "tm", name: "Turkmenistan" },
  { code: "tn", name: "Tunisia" },
  { code: "to", name: "Tonga" },
  { code: "tr", name: "Turkey" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "tv", name: "Tuvalu" },
  { code: "tw", name: "Taiwan" },
  { code: "tz", name: "Tanzania" },
  { code: "ua", name: "Ukraine" },
  { code: "ug", name: "Uganda" },
  { code: "um", name: "United States Minor Outlying Islands" },
  { code: "us", name: "United States" },
  { code: "uy", name: "Uruguay" },
  { code: "uz", name: "Uzbekistan" },
  { code: "va", name: "Vatican" },
  { code: "vc", name: "Saint Vincent and the Grenadines" },
  { code: "ve", name: "Venezuela" },
  { code: "vg", name: "British Virgin Islands" },
  { code: "vi", name: "U.S. Virgin Islands" },
  { code: "vn", name: "Vietnam" },
  { code: "vu", name: "Vanuatu" },
  { code: "wf", name: "Wallis and Futuna" },
  { code: "ws", name: "Samoa" },
  { code: "ye", name: "Yemen" },
  { code: "yt", name: "Mayotte" },
  { code: "za", name: "South Africa" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" },
];

const BUSINESS_TYPES = [
  "Cryptocurrency Exchange",
  "Payment Processor", 
  "Digital Wallet Provider",
  "DeFi Protocol",
  "Banking Institution",
  "Fintech Startup",
  "Compliance Firm",
  "Other",
];

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const [match] = useRoute('/auth/:mode');
  
  // Extract mode from the URL path directly as a fallback
  const extractedMode = location.includes('/signup') ? 'signup' : 'signin';
  const mode = (match && typeof match === 'object' ? match.mode as 'signin' | 'signup' : null) || extractedMode;
  
  const { toast } = useToast();
  const { signIn, signUp, isLoading: authLoading } = useAuthState();

  // Password validation function
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 6) errors.push('Password must be at least 6 characters');
    if (password.length > 15) errors.push('Password must be no more than 15 characters');
    return errors;
  };

  const handlePasswordChange = (password: string) => {
    setSignUpData(prev => ({ ...prev, password }));
    setPasswordErrors(validatePassword(password));
  };

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    businessType: '',
  });

  const [phoneValid, setPhoneValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await signIn(signInData.email, signInData.password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      
      // Redirect to dashboard
      setLocation('/');
    } else {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordErrors.length > 0) {
      toast({
        title: "Invalid password",
        description: passwordErrors[0],
        variant: "destructive",
      });
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    if (!phoneValid) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    const success = await signUp(signUpData);
    
    if (success) {
      toast({
        title: "Account created successfully!",
        description: "Welcome to AML Compliance Dashboard.",
      });
      
      // Redirect to dashboard
      setLocation('/');
    } else {
      toast({
        title: "Registration failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const toggleMode = () => {
    setLocation(mode === 'signin' ? '/auth/signup' : '/auth/signin');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Card className="auth-form-card">
          <CardHeader className="text-center">
            <CardTitle className="auth-title">
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="auth-form">
                <div className="auth-row">
                  <div className="input-with-icon">
                    <Mail className="input-icon" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-signin-email"
                    />
                  </div>
                </div>
                <div className="auth-row">
                  <div className="input-with-icon">
                    <Lock className="input-icon" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-signin-password"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="auth-button"
                  disabled={authLoading}
                  data-testid="button-signin"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="auth-form">
                <div className="auth-row auth-row--double">
                  <div className="input-with-icon">
                    <User className="input-icon" />
                    <Input
                      type="text"
                      placeholder="First Name"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="input-with-icon">
                    <User className="input-icon" />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="auth-row auth-row--double">
                  <div className="input-with-icon">
                    <Building className="input-icon" />
                    <Input
                      type="text"
                      placeholder="Company Name"
                      value={signUpData.companyName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-company"
                    />
                  </div>
                  <div className="input-with-icon">
                    <Briefcase className="input-icon" />
                    <Input
                      type="text"
                      placeholder="Job Title"
                      value={signUpData.jobTitle}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-job-title"
                    />
                  </div>
                </div>
                <div className="auth-row auth-row--double">
                  <div className="input-with-icon">
                    <Mail className="input-icon" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="auth-input auth-input-with-icon"
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <InternationalPhoneInput
                    value={signUpData.phone}
                    onChange={(value, isValid, formatted) => {
                      setSignUpData(prev => ({ ...prev, phone: formatted }));
                      setPhoneValid(isValid);
                    }}
                    required
                  />
                </div>
                <div className="auth-row auth-row--double">
                  <div className="input-with-icon">
                    <Lock className="input-icon" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (6-15 chars)"
                      value={signUpData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`auth-input auth-input-with-icon ${passwordErrors.length > 0 ? 'error' : ''}`}
                      required
                      maxLength={15}
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="input-with-icon">
                    <Lock className="input-icon" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`auth-input auth-input-with-icon ${signUpData.password !== signUpData.confirmPassword && signUpData.confirmPassword ? 'error' : ''}`}
                      required
                      maxLength={15}
                      data-testid="input-confirm-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      data-testid="toggle-confirm-password"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {passwordErrors.length > 0 && (
                  <div className="password-errors">
                    {passwordErrors.map((error, index) => (
                      <p key={index} className="error-text">{error}</p>
                    ))}
                  </div>
                )}
                {signUpData.password !== signUpData.confirmPassword && signUpData.confirmPassword && (
                  <div className="password-errors">
                    <p className="error-text">Passwords do not match</p>
                  </div>
                )}
                <div className="auth-row auth-row--double">
                  <CustomDropdown
                    options={[
                      { value: "", label: "Select Country" },
                      ...COUNTRIES.map((c) => ({
                        value: c.code,
                        label: c.name,
                      })),
                    ]}
                    placeholder="Select Country"
                    value={signUpData.country}
                    onChange={(value) => setSignUpData(prev => ({ ...prev, country: value }))}
                    required
                  />
                  <CustomDropdown
                    options={[
                      { value: "", label: "Select Business Type" },
                      ...BUSINESS_TYPES.map((b) => ({
                        value: b.toLowerCase().replace(/\s+/g, "-"),
                        label: b,
                      })),
                    ]}
                    placeholder="Select Business Type"
                    value={signUpData.businessType}
                    onChange={(value) => setSignUpData(prev => ({ ...prev, businessType: value }))}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="auth-button"
                  disabled={authLoading || !phoneValid}
                  data-testid="button-signup"
                >
                  {authLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="auth-toggle">
              <p>
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className="auth-toggle-link"
                  data-testid="toggle-auth-mode"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}