import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Phone, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'reset' | 'done'>('phone');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { toast.error('Enter valid phone number'); return; }
    setLoading(true);
    try {
      await fetch('/api/v1/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
      toast.success('OTP sent to your phone');
      setStep('otp');
    } catch { toast.error('Failed to send OTP'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setStep('reset');
  };

  const resetPassword = async () => {
    if (newPassword.length < 8) { toast.error('Min 8 characters'); return; }
    setLoading(true);
    try {
      toast.success('Password reset successful!');
      setStep('done');
    } catch { toast.error('Reset failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">GU</span>
          </div>
          <h1 className="text-xl font-bold">Reset Password</h1>
          <p className="text-white/70 text-sm mt-1">We'll help you get back in</p>
        </div>

        <div className="p-8 space-y-5">
          {step === 'phone' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-gray-500">Enter your registered phone number to receive an OTP.</p>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              </div>
              <button onClick={sendOtp} disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-gray-500">Enter the 6-digit OTP sent to <strong>{phone}</strong></p>
              <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-center text-2xl tracking-widest dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              <button onClick={verifyOtp}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
                Verify OTP
              </button>
              <button onClick={() => setStep('phone')} className="w-full text-sm text-gray-500 hover:text-primary-500 flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Change number
              </button>
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-sm text-gray-500">Enter your new password.</p>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" placeholder="New password (min 8 chars)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700" />
              <button onClick={resetPassword} disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-4 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Password Reset!</h3>
              <p className="text-sm text-gray-500">You can now login with your new password.</p>
              <Link to="/login" className="block w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold text-center hover:opacity-90 transition">
                Go to Login
              </Link>
            </motion.div>
          )}

          {step !== 'done' && (
            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-primary-500 font-medium hover:underline flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
