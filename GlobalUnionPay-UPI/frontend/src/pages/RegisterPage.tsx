import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';
import { Eye, EyeOff, Phone, Lock, User, Mail } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(3, 'Full name required'),
  email: z.string().email('Enter valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone'),
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match', path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authApi.register({ fullName: data.fullName, email: data.email, phone: data.phone, password: data.password });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold">GlobalUnion Pay</h1>
          <p className="text-white/70 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
          {[
            { name: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe', type: 'text' },
            { name: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com', type: 'email' },
            { name: 'phone', label: 'Phone Number', icon: Phone, placeholder: '9876543210', type: 'text' },
          ].map(({ name, label, icon: Icon, placeholder, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  {...register(name as any)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:text-white"
                />
              </div>
              {errors[name as keyof FormData] && (
                <p className="text-red-500 text-xs mt-1">{errors[name as keyof FormData]?.message}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 characters"
                className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:text-white"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Repeat password"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:text-white"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
