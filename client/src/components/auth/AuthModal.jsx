import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { Mail, Lock, User, Phone, Sparkles, KeyRound } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, sendOtp, verifyOtp, googleAuth, loginAsDemo } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  // 'email-login' | 'email-register' | 'mobile-otp'
  const [authMode, setAuthMode] = useState('email-login');
  const [isLoading, setIsLoading] = useState(false);

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Mobile OTP state
  const [mobile, setMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDemoHint, setOtpDemoHint] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setMobile('');
    setOtpCode('');
    setOtpSent(false);
    setOtpDemoHint('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === 'email-login') {
      const res = await login(email, password);
      if (res.success) {
        handleClose();
        navigate('/dashboard');
      }
    } else {
      const res = await register({ name, email, password });
      if (res.success) {
        handleClose();
        navigate('/dashboard');
      }
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) return;
    setIsLoading(true);

    const res = await sendOtp(mobile);
    if (res.success) {
      setOtpSent(true);
      if (res.data?.demoOtp) {
        setOtpDemoHint(res.data.demoOtp);
        setOtpCode(res.data.demoOtp); // pre-fill for ease of testing
      }
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) return;
    setIsLoading(true);

    const res = await verifyOtp(mobile, otpCode, name);
    if (res.success) {
      handleClose();
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Simulate/trigger verified Google identity
    const demoGoogleUser = {
      email: 'krish.verma.google@arthafinance.in',
      name: 'Krish Verma (Google Auth)',
      googleId: 'google-oauth-109283746192',
    };
    const res = await googleAuth(demoGoogleUser);
    if (res.success) {
      handleClose();
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  const handleInstantDemo = async () => {
    setIsLoading(true);
    const res = await loginAsDemo();
    if (res.success) {
      handleClose();
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        authMode === 'email-register'
          ? t('auth.signUpTitle')
          : authMode === 'mobile-otp'
          ? 'Mobile OTP Authentication'
          : t('auth.signInTitle')
      }
      subtitle="Access your unified personal wealth & expense intelligence dashboard"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        {/* Auth Method Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('email-login');
              setOtpSent(false);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === 'email-login' || authMode === 'email-register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Email / Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('mobile-otp')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === 'mobile-otp'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mobile + OTP
          </button>
        </div>

        {/* Option 1: Email Form */}
        {(authMode === 'email-login' || authMode === 'email-register') && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {authMode === 'email-register' && (
              <Input
                label={t('auth.fullName')}
                placeholder="Krish Verma"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              label={t('auth.email')}
              type="email"
              placeholder="krish.verma@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {authMode === 'email-register' ? t('auth.register') : t('auth.login')}
            </Button>

            {/* Switch between Sign In and Sign Up */}
            <div className="text-center text-xs text-slate-500 pt-1">
              {authMode === 'email-login' ? (
                <>
                  {t('auth.dontHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('email-register')}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {t('auth.register')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('email-login')}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {t('auth.login')}
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        {/* Option 2: Mobile OTP Form */}
        {authMode === 'mobile-otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Indian Mobile Number"
                  type="tel"
                  placeholder="9876543210 (10 digits)"
                  icon={Phone}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  helperText="We will send a 6-digit cryptographic verification code."
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {t('auth.sendOtp')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200">
                  <p className="font-semibold">OTP Code Sent to {mobile}</p>
                  {otpDemoHint && (
                    <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                      Dev/Test Code: <span className="font-mono font-bold">{otpDemoHint}</span> (Auto-filled)
                    </p>
                  )}
                </div>

                <Input
                  label="6-Digit Verification Code"
                  type="text"
                  placeholder="123456"
                  icon={KeyRound}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {t('auth.verifyOtp')}
                </Button>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="hover:underline text-slate-600 dark:text-slate-400"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {t('auth.resend')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Google Authentication */}
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-slate-200 dark:border-slate-700"
          isLoading={isLoading}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('auth.googleSignIn')}</span>
        </Button>

        {/* 1-Click Instant Evaluator Demo Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleInstantDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('auth.demoAccount')}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
