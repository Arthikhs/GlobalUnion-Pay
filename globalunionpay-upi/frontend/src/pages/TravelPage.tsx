import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useBankBalance } from '../hooks/useBankBalance';
import toast from 'react-hot-toast';

const travelTypes = [
  { id: 'flight', label: 'Flights', emoji: '✈️' },
  { id: 'train',  label: 'Trains',  emoji: '🚆' },
  { id: 'bus',    label: 'Bus',     emoji: '🚌' },
  { id: 'cab',    label: 'Cab',     emoji: '🚕' },
  { id: 'metro',  label: 'Metro',   emoji: '🚇' },
  { id: 'fastag', label: 'FASTag',  emoji: '🛣️' },
];

function generateResults(type: string, from: string, to: string) {
  const base = from.slice(0,3).toUpperCase()+'→'+to.slice(0,3).toUpperCase();
  if (type==='flight') return [
    { id:'f1', name:'IndiGo 6E-201',   dep:'06:00', arr:'08:10', duration:'2h 10m', price:3299, seats:['1A','1B','2A','2C','3B','4A','4D'], class:'Economy' },
    { id:'f2', name:'Air India AI-505', dep:'09:30', arr:'11:45', duration:'2h 15m', price:4899, seats:['1A','1C','2B','3A','3D','5A'],     class:'Economy' },
    { id:'f3', name:'SpiceJet SG-101',  dep:'13:00', arr:'15:05', duration:'2h 05m', price:2799, seats:['2A','2B','3C','4A','4B','6D'],     class:'Economy' },
    { id:'f4', name:'Vistara UK-801',   dep:'17:45', arr:'19:55', duration:'2h 10m', price:5499, seats:['1A','1B','1C','2A','2B'],          class:'Business' },
  ];
  if (type==='train') return [
    { id:'t1', name:'Rajdhani Express 12951', dep:'07:00', arr:'11:30', duration:'4h 30m', price:899,  seats:['S1-12','S1-24','S2-05','S2-18','B1-03'], class:'Sleeper' },
    { id:'t2', name:'Shatabdi Express 12001', dep:'10:00', arr:'13:45', duration:'3h 45m', price:1299, seats:['C1-04','C1-22','C2-11','C2-33'],         class:'Chair Car' },
    { id:'t3', name:'Duronto Express 12213',  dep:'15:30', arr:'20:00', duration:'4h 30m', price:1099, seats:['S3-07','S3-19','B2-01','B2-14'],         class:'Sleeper' },
    { id:'t4', name:`${base} Express 19001`,  dep:'22:00', arr:'06:30', duration:'8h 30m', price:599,  seats:['S5-10','S5-22','S6-03','S6-15','S6-27'], class:'Sleeper' },
  ];
  if (type==='bus') return [
    { id:'b1', name:'KSRTC Airavat',  dep:'06:30', arr:'10:00', duration:'3h 30m', price:399, seats:['1','2','3','5','7','9','11','13','15'],  class:'AC Sleeper' },
    { id:'b2', name:'VRL Travels',    dep:'09:00', arr:'12:30', duration:'3h 30m', price:299, seats:['2','4','6','8','10','12','14','16','18'], class:'AC Seater' },
    { id:'b3', name:'SRS Travels',    dep:'14:00', arr:'17:30', duration:'3h 30m', price:349, seats:['1','3','5','7','9','11','13'],            class:'Non-AC' },
    { id:'b4', name:'Orange Travels', dep:'21:00', arr:'06:00', duration:'9h 00m', price:699, seats:['L1','L2','L3','U1','U2','U3','U4'],      class:'Sleeper' },
  ];
  if (type==='cab') return [
    { id:'c1', name:'Ola Mini',     dep:'Now', arr:'~15 min', duration:'On demand', price:249, seats:['Book Now'], class:'Mini' },
    { id:'c2', name:'Ola Prime',    dep:'Now', arr:'~18 min', duration:'On demand', price:399, seats:['Book Now'], class:'Prime' },
    { id:'c3', name:'Uber Go',      dep:'Now', arr:'~12 min', duration:'On demand', price:279, seats:['Book Now'], class:'Go' },
    { id:'c4', name:'Uber Premier', dep:'Now', arr:'~20 min', duration:'On demand', price:499, seats:['Book Now'], class:'Premier' },
  ];
  if (type==='metro') return [
    { id:'m1', name:'Metro Line 1 (Purple)', dep:'Every 5 min', arr:'~20 min', duration:'20 min', price:40, seats:['General','Ladies','Disabled'], class:'AC' },
    { id:'m2', name:'Metro Line 2 (Green)',  dep:'Every 8 min', arr:'~35 min', duration:'35 min', price:60, seats:['General','Ladies','Disabled'], class:'AC' },
    { id:'m3', name:'Metro Line 3 (Blue)',   dep:'Every 6 min', arr:'~28 min', duration:'28 min', price:50, seats:['General','Ladies','Disabled'], class:'AC' },
  ];
  return [
    { id:'ft1', name:'FASTag Recharge', dep:'-', arr:'-', duration:'Instant', price:200,  seats:['Recharge'], class:'NHAI' },
    { id:'ft2', name:'FASTag Recharge', dep:'-', arr:'-', duration:'Instant', price:500,  seats:['Recharge'], class:'NHAI' },
    { id:'ft3', name:'FASTag Recharge', dep:'-', arr:'-', duration:'Instant', price:1000, seats:['Recharge'], class:'NHAI' },
  ];
}

export default function TravelPage() {
  const { balance, accountNumber, bankPay } = useBankBalance();
  const [activeType, setActiveType]     = useState('flight');
  const [from, setFrom]                 = useState('');
  const [to, setTo]                     = useState('');
  const [date, setDate]                 = useState('');
  const [dateError, setDateError]       = useState('');
  const [results, setResults]           = useState<any[]>([]);
  const [searched, setSearched]         = useState(false);
  const [selected, setSelected]         = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [step, setStep]                 = useState<'list'|'seat'|'confirm'|'success'>('list');
  const [bookedInfo, setBookedInfo]     = useState<any>(null);
  const [paying, setPaying]             = useState(false);

  function handleSearch() {
    if (!from || !to) return;
    const needsDate = !['cab','metro','fastag'].includes(activeType);
    if (needsDate) {
      if (!date) { setDateError('Please select a travel date.'); return; }
      const today = new Date(); today.setHours(0,0,0,0);
      const picked = new Date(date); picked.setHours(0,0,0,0);
      if (picked <= today) { setDateError('Travel date must be a future date.'); return; }
    }
    setDateError('');
    setResults(generateResults(activeType, from, to));
    setSearched(true); setSelected(null); setSelectedSeat(''); setStep('list');
  }

  async function handlePay() {
    setPaying(true);
    const result = await bankPay(selected.price, `${activeType.toUpperCase()} Booking: ${from} → ${to}`);
    setPaying(false);
    if (result.success) {
      setStep('success');
      setBookedInfo({ ...selected, seat: selectedSeat, from, to, date });
    } else {
      toast.error(result.message);
    }
  }

  function handleReset() {
    setStep('list'); setSelected(null); setSelectedSeat('');
    setSearched(false); setResults([]); setFrom(''); setTo(''); setDate('');
  }

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : 'Today';

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel & Transit</h1>
        <p className="text-sm text-gray-500 mt-1">Book tickets & manage travel payments</p>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {travelTypes.map(t => (
          <button key={t.id} onClick={() => { setActiveType(t.id); setSearched(false); setResults([]); setStep('list'); setDateError(''); setDate(''); }}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition ${activeType===t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'}`}>
            <span className="text-2xl">{t.emoji}</span>
            <span className="text-xs font-medium text-gray-700">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Book {travelTypes.find(t=>t.id===activeType)?.label}</h3>
          <span className="text-xs text-gray-400">Bank Balance: <span className="font-bold text-blue-600">₹{fmt(balance)}</span></span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium">From</label>
            <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="City / Station"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium">To</label>
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="City / Station"
              className="w-full mt-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>
        {!['cab','metro','fastag'].includes(activeType) && (
          <div>
            <label className="text-xs text-gray-500 font-medium">Travel Date</label>
            <input value={date} onChange={e=>{setDate(e.target.value);setDateError('');}} type="date"
              min={new Date(Date.now()+86400000).toISOString().split('T')[0]}
              className={`w-full mt-1 px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${dateError?'border-red-400':'border-gray-200'}`} />
            {dateError && <p className="text-xs text-red-500 mt-1">{dateError}</p>}
          </div>
        )}
        <button onClick={handleSearch} disabled={!from||!to}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
          Search {travelTypes.find(t=>t.id===activeType)?.label}
        </button>
      </div>

      <AnimatePresence>
        {searched && step==='list' && (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">
              {results.length} results for {from} → {to}{date ? ` · ${fmtDate(date)}` : ''}
            </p>
            {results.map(item => (
              <motion.div key={item.id} whileHover={{scale:1.01}}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-blue-300 transition"
                onClick={()=>{setSelected(item);setSelectedSeat('');setStep('seat');}}>
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.dep} → {item.arr} · {item.duration} · {item.class}</p>
                  <p className="text-xs text-green-600 font-medium">{item.seats.length} seats available</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">₹{item.price.toLocaleString('en-IN')}</p>
                  <span className="mt-1 inline-block text-xs bg-blue-600 text-white px-3 py-1 rounded-lg">Select</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Seat Modal */}
      <AnimatePresence>
        {step==='seat' && selected && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Select Seat</h2>
                <button onClick={()=>setStep('list')} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="font-semibold text-sm text-gray-900">{selected.name}</p>
                <p className="text-xs text-gray-500">{from} → {to} · {selected.dep} → {selected.arr}</p>
              </div>
              <p className="text-xs text-gray-500 mb-3 font-medium">Available Seats</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {selected.seats.map((s:string) => (
                  <button key={s} onClick={()=>setSelectedSeat(s)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition ${selectedSeat===s?'bg-blue-600 text-white border-blue-600':'border-gray-200 text-gray-700 hover:border-blue-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={()=>setStep('confirm')} disabled={!selectedSeat}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                Continue <ArrowRight size={16}/>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {step==='confirm' && selected && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Confirm Booking</h2>
                <button onClick={()=>setStep('seat')} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  ['Journey', `${from} → ${to}`],
                  ['Service', selected.name],
                  ['Timing',  `${selected.dep} → ${selected.arr}`],
                  ['Class',   selected.class],
                  ['Seat',    selectedSeat],
                  ['Date',    fmtDate(date)],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-lg">₹{selected.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Bank Balance {accountNumber && `(${accountNumber})`}</span>
                  <span className={`font-semibold ${balance<selected.price?'text-red-500':'text-green-600'}`}>₹{fmt(balance)}</span>
                </div>
                {balance < selected.price && (
                  <p className="text-xs text-red-500 font-medium">⚠️ Insufficient bank balance.</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={()=>setStep('seat')} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Back</button>
                <button onClick={handlePay} disabled={balance<selected.price||paying}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                  {paying ? 'Processing...' : `Pay ₹${selected.price.toLocaleString('en-IN')}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {step==='success' && bookedInfo && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4"/>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h2>
              <p className="text-gray-500 text-sm mb-5">Your ticket has been booked successfully</p>
              <div className="bg-blue-50 rounded-2xl p-4 text-left space-y-2 mb-4">
                {[
                  ['From → To',   `${bookedInfo.from} → ${bookedInfo.to}`],
                  ['Service',     bookedInfo.name],
                  ['Seat',        bookedInfo.seat],
                  ['Timing',      `${bookedInfo.dep} → ${bookedInfo.arr}`],
                  ['Date',        fmtDate(bookedInfo.date)],
                  ['Amount Paid', `₹${bookedInfo.price.toLocaleString('en-IN')}`],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-5">New Bank Balance: ₹{fmt(balance)}</p>
              <button onClick={handleReset}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                Book Another
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
