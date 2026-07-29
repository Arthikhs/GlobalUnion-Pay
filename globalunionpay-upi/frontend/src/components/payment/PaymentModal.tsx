import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { upiApi } from '../../services/api';
import { useAuthStore } from '../../store/store';
import { X, CheckCircle, User, ArrowRight, IndianRupee } from 'lucide-react';

const schema = z.object({
  receiverInput: z.string().min(1, 'Enter phone or UPI ID'),
  amount: z.number().min(1).max(100000),
  note: z.string().optional(),
  upiPin: z.string().length(6, 'PIN must be 6 digits'),
});

type FormData = z.infer<typeof schema>;

type Step = 'input' | 'confirm' | 'pin' | 'processing' | 'success' | 'failed';

interface ReceiverInfo {
  upiId: string;
  fullName: string;
  verified: boolean;
}

interface Props {
  onClose: () => void;
  senderUpiId: string;
}

export default function PaymentModal({ onClose, senderUpiId }: Props) {
  const [step, setStep] = useState<Step>('input');
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo | null>(null);
  const [txnRef, setTxnRef] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const amount = watch('amount');

  const validateReceiver = async () => {
    const input = watch('receiverInput');
    if (!input) return;
    setLoading(true);
    try {
      const isPhone = /^[6-9]\d{9}$/.test(input);
      const res = isPhone
        ? await upiApi.validateByPhone(input)
        : await upiApi.validateUpiId(input);
      setReceiverInfo(res.data);
      setStep('confirm');
    } catch {
      toast.error('UPI ID or phone not found');
    } finally {
      setLoading(false);
    }
  };

  const submitPayment = async (data: FormData) => {
    setStep('processing');
    try {
      const res = await upiApi.initiatePayment({
        senderUpiId,
        receiverUpiId: receiverInfo!.upiId,
        amount: data.amount,
        note: data.note,
        upiPin: data.upiPin,
      });
      setTxnRef(res.data.transactionRef);
      setStep('success');
    } catch (err: any) {
      setStep('failed');
      toast.error(err.response?.data?.message || 'Payment failed');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Send Money</h2>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                <X size={20} />
              </button>
            </div>
            <p className="text-white/70 text-sm mt-1">Fast & Secure UPI Transfer</p>
          </div>

          <div className="p-6">
            {/* Step 1: Enter phone/UPI */}
            {step === 'input' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number or UPI ID
                </label>
                <input
                  {...register('receiverInput')}
                  placeholder="9876543210 or name@globalunionpay"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button
                  onClick={validateReceiver}
                  disabled={loading}
                  className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? 'Checking...' : <><span>Continue</span><ArrowRight size={18} /></>}
                </button>
              </motion.div>
            )}

            {/* Step 2: Confirm receiver + amount */}
            {step === 'confirm' && receiverInfo && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Receiver card */}
                <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {receiverInfo.fullName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{receiverInfo.fullName}</p>
                    <p className="text-sm text-gray-500">{receiverInfo.upiId}</p>
                    {receiverInfo.verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle size={12} /> Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="relative mb-4">
                  <IndianRupee className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    {...register('amount', { valueAsNumber: true })}
                    type="number"
                    placeholder="Enter amount"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-2xl font-bold dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                </div>

                <input
                  {...register('note')}
                  placeholder="Add a note (optional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none mb-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />

                <button
                  onClick={() => setStep('pin')}
                  disabled={!amount || amount <= 0}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
                >
                  Proceed to Pay ₹{amount || 0}
                </button>
              </motion.div>
            )}

            {/* Step 3: UPI PIN */}
            {step === 'pin' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm">Paying</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">₹{amount}</p>
                  <p className="text-sm text-gray-500 mt-1">to {receiverInfo?.fullName}</p>
                </div>

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                  Enter UPI PIN
                </label>
                <input
                  {...register('upiPin')}
                  type="password"
                  maxLength={6}
                  placeholder="••••••"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-center text-3xl tracking-widest dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {errors.upiPin && <p className="text-red-500 text-xs mt-1 text-center">{errors.upiPin.message}</p>}

                <button
                  onClick={handleSubmit(submitPayment)}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  Pay Now
                </button>
              </motion.div>
            )}

            {/* Processing */}
            {step === 'processing' && (
              <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                  className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-lg font-semibold text-gray-900 dark:text-white">Processing Payment...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait, do not close this window</p>
              </motion.div>
            )}

            {/* Success */}
            {step === 'success' && (
              <motion.div className="text-center py-8" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <motion.div
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="text-green-500" size={48} />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</h3>
                <p className="text-gray-500 mt-1">₹{amount} sent to {receiverInfo?.fullName}</p>
                <p className="text-xs text-gray-400 mt-2">Ref: {txnRef}</p>
                <button
                  onClick={onClose}
                  className="w-full mt-6 bg-primary-500 text-white py-3 rounded-xl font-semibold"
                >
                  Done
                </button>
              </motion.div>
            )}

            {/* Failed */}
            {step === 'failed' && (
              <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="text-red-500" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Failed</h3>
                <p className="text-gray-500 mt-1">Something went wrong. Please try again.</p>
                <button
                  onClick={() => setStep('input')}
                  className="w-full mt-6 bg-primary-500 text-white py-3 rounded-xl font-semibold"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
