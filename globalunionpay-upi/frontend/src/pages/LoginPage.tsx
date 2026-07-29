import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/store';
import { ArrowRight, Lock, ShieldCheck, BadgeCheck, Zap, Globe, IndianRupee, ChevronDown, Building2, AlertCircle } from 'lucide-react';

const BANK_API = 'http://localhost:8090/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, setBankName } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'no-account'>('phone');
  const [loading, setLoading] = useState(false);
  const [bankCustomer, setBankCustomer] = useState<any>(null);

  const checkBankAccount = async (phoneNum: string) => {
    try {
      const res = await fetch(`${BANK_API}/accounts/check-phone?phone=${phoneNum}`);
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  };

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error('Enter valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      // Check if phone has a bank account
      const account = await checkBankAccount(phone);
      if (!account) {
        setBankCustomer(null);
        setStep('no-account');
        setLoading(false);
        return;
      }
      setBankCustomer(account);
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
      setAuth({ ...user, userId: String(user.id) }, accessToken, refreshToken);
      if (bankCustomer?.fullName) setBankName(bankCustomer.fullName);
      toast.success(`Welcome, ${user.fullName || phone}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ── Full screen girl image background ── */}
      <img
        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1600&q=90"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 20%' }}
      />

      {/* Only right side darkened behind form, left fully clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/70" />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-extrabold text-white text-lg">GU</div>
          <div>
            <p className="text-white font-bold text-base leading-tight">GlobalUnion Pay</p>
            <p className="text-white/50 text-xs">Fast • Secure • Reliable</p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-white/70 text-sm border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm bg-black/20">
          <Globe size={14} /> EN <ChevronDown size={12} />
        </button>
      </div>

      {/* ── Left side hero text (on top of girl image) ── */}
      <motion.div
        className="relative z-10 px-10 mt-16 max-w-lg"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
          Send Money<br />
          <span className="text-blue-400">Anywhere,</span><br />
          <span className="text-blue-400">Anytime</span>
        </h1>
        <p className="text-white/60 text-base mt-3 drop-shadow">
          Instant UPI payments with bank-grade security
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { icon: <Zap size={13} className="text-blue-400" />, label: 'Instant UPI' },
            { icon: <ShieldCheck size={13} className="text-emerald-400" />, label: 'Bank-grade Security' },
            { icon: <Globe size={13} className="text-purple-400" />, label: 'Global Transfers' },
            { icon: <IndianRupee size={13} className="text-yellow-400" />, label: 'Best Rates' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5">
              {f.icon}
              <span className="text-white text-xs font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── RIGHT side: Login form floating ── */}
      <div className="absolute top-0 right-0 h-full w-full max-w-sm flex flex-col justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-black/50 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-7">

            {step === 'phone' && (
              <>
                <h2 className="text-2xl font-extrabold text-white text-center mb-1">Welcome Back! 👋</h2>
                <p className="text-white/50 text-sm text-center mb-6">Enter your mobile number to continue</p>

                {/* Phone input */}
                <div className="flex border border-white/20 rounded-2xl overflow-hidden mb-4 focus-within:ring-2 focus-within:ring-blue-500 bg-white/10">
                  <div className="flex items-center gap-1.5 px-3 bg-white/10 border-r border-white/20 min-w-[80px]">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-white font-semibold text-sm">+91</span>
                    <ChevronDown size={12} className="text-white/50" />
                  </div>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    type="tel"
                    className="flex-1 px-3 py-3.5 outline-none text-sm bg-transparent text-white placeholder-white/30"
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

                <p className="text-center text-white/30 text-xs flex items-center justify-center gap-1 mb-5">
                  <Lock size={11} /> We will send you an OTP to verify your number
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/15" />
                  <span className="text-white/30 text-xs">or</span>
                  <div className="flex-1 h-px bg-white/15" />
                </div>

                {/* Register link */}
                <p className="text-center text-white/50 text-sm">
                  New to GlobalUnion Pay?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-blue-400 font-bold hover:text-blue-300 transition"
                  >
                    Sign Up
                  </button>
                </p>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 mt-5 bg-white/5 rounded-2xl p-3">
                  {[
                    { icon: <ShieldCheck size={15} className="text-blue-400" />, label: 'AES-256', sub: 'Encryption' },
                    { icon: <BadgeCheck size={15} className="text-emerald-400" />, label: 'RBI', sub: 'Compliant' },
                    { icon: <Lock size={15} className="text-purple-400" />, label: 'PCI-DSS', sub: 'Certified' },
                  ].map(b => (
                    <div key={b.label} className="flex flex-col items-center text-center">
                      <div className="mb-1">{b.icon}</div>
                      <p className="text-white text-[11px] font-semibold">{b.label}</p>
                      <p className="text-white/40 text-[10px]">{b.sub}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 'no-account' && (
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                  <h2 className="text-xl font-extrabold text-white mb-2">No Bank Account Found</h2>
                  <p className="text-white/50 text-sm">
                    The number <span className="text-white font-semibold">+91 {phone}</span> is not linked to any bank account.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 mb-5">
                  <div className="flex items-start gap-3">
                    <Building2 size={20} className="text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">Create a Bank Account First</p>
                      <p className="text-white/50 text-xs leading-relaxed">
                        To use GlobalUnion Pay, you need a bank account. Visit SecureBank to open your account and then come back to register.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { setStep('phone'); setPhone(''); }}
                  className="w-full text-sm text-white/40 hover:text-blue-400 transition text-center"
                >
                  ← Try a different number
                </button>
              </>
            )}

            {step === 'otp' && (
              <>
                <h2 className="text-2xl font-extrabold text-white text-center mb-1">Verify OTP</h2>
                <p className="text-white/50 text-sm text-center mb-4">OTP sent to +91 {phone}</p>

                {generatedOtp && (
                  <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl px-4 py-3 mb-5">
                    <span className="text-2xl">🔑</span>
                    <div>
                      <p className="text-amber-300 text-xs font-medium">Your OTP (demo)</p>
                      <p className="text-3xl font-extrabold tracking-[0.3em] text-amber-200">{generatedOtp}</p>
                    </div>
                  </div>
                )}

                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/, ''))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  type="tel"
                  className="w-full px-4 py-3.5 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-[0.4em] font-bold bg-white/10 text-white placeholder-white/30 mb-4"
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
                  className="w-full text-sm text-white/40 hover:text-blue-400 transition text-center"
                >
                  ← Change number
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 mt-4 text-white/25 text-xs">
            <span>24/7 Support</span><span>|</span>
            <span>Terms</span><span>|</span>
            <span>Privacy</span>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
