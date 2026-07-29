import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Download, Share2, Printer, Camera } from 'lucide-react';
import { useAuthStore } from '../store/store';
import QRCode from 'qrcode';

export default function QRPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'scan' | 'generate' | 'merchant'>('generate');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upiId = `${user?.phone}@gupay`;

  const generateQR = async () => {
    const upiString = amount
      ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(user?.fullName || '')}&am=${amount}&tn=${encodeURIComponent(note)}`
      : `upi://pay?pa=${upiId}&pn=${encodeURIComponent(user?.fullName || '')}`;
    const url = await QRCode.toDataURL(upiString, { width: 300, margin: 2, color: { dark: '#4F46E5', light: '#FFFFFF' } });
    setQrDataUrl(url);
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'globalunionpay-qr.png';
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Management</h1>
        <p className="text-sm text-gray-500 mt-1">Scan, generate and share QR codes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {([
          { id: 'generate', label: '⚡ Generate QR' },
          { id: 'scan', label: '📷 Scan QR' },
          { id: 'merchant', label: '🏪 Merchant QR' },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Personal QR Code</h3>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <p className="text-xs text-gray-500">Your UPI ID</p>
              <p className="font-mono font-semibold text-primary-600">{upiId}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Amount (optional)</label>
              <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="Leave blank for any amount"
                className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Note (optional)</label>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Payment for..."
                className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
            </div>
            <button onClick={generateQR}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
              <QrCode size={18} /> Generate QR Code
            </button>
          </div>

          {/* QR Display */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
            {qrDataUrl ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <img src={qrDataUrl} alt="QR Code" className="w-56 h-56 mx-auto rounded-xl shadow-lg" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">{user?.fullName}</p>
                <p className="text-xs text-gray-400">{upiId}</p>
                {amount && <p className="text-lg font-bold text-primary-600 mt-1">₹{amount}</p>}
                <div className="flex gap-3 mt-4">
                  <button onClick={downloadQR} className="flex items-center gap-1.5 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition">
                    <Download size={14} /> Download
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 transition">
                    <Share2 size={14} /> Share
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 transition">
                    <Printer size={14} /> Print
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-400">
                <QrCode size={80} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Generate a QR code to display it here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'scan' && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 text-center">
            <div className="relative w-64 h-64 mx-auto bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
              {scanning ? (
                <motion.div className="absolute inset-0 flex items-center justify-center">
                  <Camera size={48} className="text-white/40" />
                  <motion.div className="absolute top-0 left-0 right-0 h-0.5 bg-primary-500"
                    animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity }} />
                </motion.div>
              ) : (
                <div className="text-center text-white/40">
                  <Camera size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Camera preview</p>
                </div>
              )}
              {/* Corner markers */}
              {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6 border-2 border-primary-500 ${i < 2 ? 'border-b-0' : 'border-t-0'} ${i % 2 === 0 ? 'border-r-0' : 'border-l-0'}`} />
              ))}
            </div>
            <button onClick={() => setScanning(!scanning)}
              className="mt-4 w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
              <Camera size={18} /> {scanning ? 'Stop Scanner' : 'Start Camera Scanner'}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Or upload QR image</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-500 hover:border-primary-300 hover:text-primary-500 transition flex items-center justify-center gap-2">
              <Upload size={16} /> Upload QR Image
            </button>
          </div>
        </div>
      )}

      {activeTab === 'merchant' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Merchant QR Code</h3>
            {[
              { label: 'Business Name', placeholder: 'My Store' },
              { label: 'Amount (optional)', placeholder: 'Fixed amount or leave blank' },
              { label: 'Description', placeholder: 'Payment for services' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs text-gray-500 font-medium">{f.label}</label>
                <input placeholder={f.placeholder}
                  className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white" />
              </div>
            ))}
            <button onClick={generateQR}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:opacity-90 transition">
              Generate Merchant QR
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-100 dark:border-gray-700 flex items-center justify-center">
            {qrDataUrl ? (
              <div className="text-center">
                <img src={qrDataUrl} alt="Merchant QR" className="w-56 h-56 mx-auto rounded-xl shadow-lg" />
                <div className="flex gap-3 mt-4 justify-center">
                  <button onClick={downloadQR} className="flex items-center gap-1.5 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl text-sm font-medium">
                    <Download size={14} /> Download
                  </button>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium">
                    <Printer size={14} /> Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <QrCode size={80} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Merchant QR will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
