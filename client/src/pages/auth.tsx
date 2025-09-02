import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomDropdown } from '@/components/auth/CustomDropdown';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/useAuthState';

const COUNTRIES = [
  { code: "af", name: "Afghanistan" },
  { code: "al", name: "Albania" },
  { code: "dz", name: "Algeria" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "cn", name: "China" },
  { code: "in", name: "India" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
  { code: "ru", name: "Russia" },
  { code: "za", name: "South Africa" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "sg", name: "Singapore" },
  { code: "ch", name: "Switzerland" },
  { code: "nl", name: "Netherlands" },
  { code: "se", name: "Sweden" },
  { code: "no", name: "Norway" },
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
  const mode = (match?.mode as 'signin' | 'signup') || extractedMode;
  
  const { toast } = useToast();
  const { signIn, signUp, isLoading: authLoading } = useAuthState();

  // Debug logging
  console.log('Current location:', location);
  console.log('Route match:', match);
  console.log('Current mode:', mode);

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
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-signin-email"
                  />
                </div>
                <div className="auth-row">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-signin-password"
                  />
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
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-first-name"
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-last-name"
                  />
                </div>
                <div className="auth-row auth-row--double">
                  <Input
                    type="text"
                    placeholder="Company Name"
                    value={signUpData.companyName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-company"
                  />
                  <Input
                    type="text"
                    placeholder="Job Title"
                    value={signUpData.jobTitle}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-job-title"
                  />
                </div>
                <div className="auth-row auth-row--double">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-email"
                  />
                  <PhoneInput
                    value={signUpData.phone}
                    onChange={(value, isValid) => {
                      setSignUpData(prev => ({ ...prev, phone: value }));
                      setPhoneValid(isValid);
                    }}
                    required
                  />
                </div>
                <div className="auth-row auth-row--double">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-password"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="auth-input"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
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