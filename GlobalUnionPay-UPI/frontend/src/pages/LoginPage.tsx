import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/store';
import { ArrowRight, ChevronDown, QrCode, KeyRound, Lock, BadgeCheck, ShieldCheck, Zap, Globe, IndianRupee } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Enter valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOtp(phone);
      setGeneratedOtp(res.data?.otp || '');
      toast.success('OTP sent!');
      setStep('otp');
    } catch {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ phone, otp });
      const { accessToken, refreshToken, user } = res.data;
      setAuth(user, accessToken, refreshToken);
      toast.success(`Welcome, ${user.fullName || phone}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0a0f1e]">

      {/* ── LEFT PANEL: Girl image + branding ── */}
      <div className="hidden lg:flex w-1/2 relative flex-col overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80"
          alt="girl using phone"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1ecc] via-[#0a0f1e55] to-[#0a0f1eee]" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-extrabold text-white text-lg">GU</div>
            <div>
              <p className="text-white font-bold text-base leading-tight">GlobalUnion Pay</p>
              <p className="text-white/50 text-xs">Fast • Secure • Reliable</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-white/70 text-sm border border-white/20 rounded-full px-3 py-1.5">
            <Globe size={14} /> English (EN) <ChevronDown size={12} />
          </button>
        </div>

        {/* Hero text */}
        <div className="relative z-10 mt-auto px-8 pb-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-3">
              Send Money<br />Anywhere,<br /><span className="text-blue-400">Anytime</span>
            </h1>
            <p className="text-white/60 text-base mb-8">
              Instant UPI payments,<br />Bank-grade security and<br />Global transactions.
            </p>

            {/* Feature pills */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <Zap size={20} className="text-blue-400" />, label: 'Instant', sub: 'UPI Payments' },
                { icon: <ShieldCheck size={20} className="text-emerald-400" />, label: 'Bank-grade', sub: 'Security' },
                { icon: <Globe size={20} className="text-purple-400" />, label: 'Global', sub: 'Transactions' },
                { icon: <IndianRupee size={20} className="text-yellow-400" />, label: 'Best Rates', sub: 'Guaranteed' },
              ].map(f => (
                <div key={f.label} className="bg-white/10 backdrop-blur rounded-2xl p-3 flex flex-col items-center text-center">
                  <div className="mb-1">{f.icon}</div>
                  <p className="text-white text-xs font-semibold leading-tight">{f.label}</p>
                  <p className="text-white/50 text-[10px] leading-tight">{f.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Login form ── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#f0f4ff] dark:bg-[#0d1224] overflow-y-auto">

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white text-sm">GU</div>
            <span className="text-gray-900 dark:text-white font-bold text-sm">GlobalUnion Pay</span>
          </div>
          <button className="flex items-center gap-1 text-gray-500 text-xs border border-gray-200 rounded-full px-2 py-1">
            <Globe size={12} /> EN <ChevronDown size={10} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Card */}
            <div className="bg-white dark:bg-[#131929] rounded-3xl shadow-2xl p-8">

              {step === 'phone' && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-1">
                    Welcome Back! 👋
                  </h2>
                  <p className="text-gray-400 text-sm text-center mb-7">Enter your mobile number to continue</p>

                  {/* Phone input */}
                  <div className="flex border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-blue-500">
                    <div className="flex items-center gap-1.5 px-3 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-w-[80px]">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">+91</span>
                      <ChevronDown size={12} className="text-gray-400" />
                    </div>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      type="tel"
                      className="flex-1 px-3 py-3.5 outline-none text-sm bg-white dark:bg-[#131929] text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Continue button */}
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition disabled:opacity-50 mb-3"
                  >
                    {loading ? 'Sending...' : 'Continue'} <ArrowRight size={18} />
                  </button>

                  <p className="text-center text-gray-400 text-xs flex items-center justify-center gap-1 mb-5">
                    <Lock size={11} /> We will send you an OTP to verify your number
                  </p>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    <span className="text-gray-400 text-xs">or</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  </div>

                  {/* Alt login */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <QrCode size={16} /> Scan QR to Login
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <KeyRound size={16} /> Login with Passkey
                    </button>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3">
                    {[
                      { icon: <ShieldCheck size={16} className="text-blue-500" />, label: 'AES-256', sub: 'Encryption' },
                      { icon: <BadgeCheck size={16} className="text-emerald-500" />, label: 'RBI', sub: 'Compliant' },
                      { icon: <Lock size={16} className="text-purple-500" />, label: 'PCI-DSS', sub: 'Certified' },
                    ].map(b => (
                      <div key={b.label} className="flex flex-col items-center text-center">
                        <div className="mb-1">{b.icon}</div>
                        <p className="text-gray-700 dark:text-gray-300 text-[11px] font-semibold">{b.label}</p>
                        <p className="text-gray-400 text-[10px]">{b.sub}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 'otp' && (
                <>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-1">
                    Verify OTP
                  </h2>
                  <p className="text-gray-400 text-sm text-center mb-5">
                    OTP sent to +91 {phone}
                  </p>

                  {/* OTP demo box */}
                  {generatedOtp && (
                    <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-4 py-3 mb-5">
                      <span className="text-2xl">🔑</span>
                      <div>
                        <p className="text-amber-600 dark:text-amber-400 text-xs font-medium">Your OTP (demo)</p>
                        <p className="text-3xl font-extrabold tracking-[0.3em] text-amber-700 dark:text-amber-300">{generatedOtp}</p>
                      </div>
                    </div>
                  )}

                  {/* OTP input */}
                  <input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    type="tel"
                    className="w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-[0.4em] font-bold dark:bg-[#131929] dark:text-white mb-4"
                  />

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition disabled:opacity-50 mb-3"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'} <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => { setStep('phone'); setOtp(''); setGeneratedOtp(''); }}
                    className="w-full text-sm text-gray-400 hover:text-blue-500 transition text-center"
                  >
                    ← Change number
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 mt-6 text-gray-400 text-xs">
              <span>24/7 Support</span>
              <span>|</span>
              <span>Terms of Use</span>
              <span>|</span>
              <span>Privacy Policy</span>
              <span>|</span>
              <span>v1.0.0</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
