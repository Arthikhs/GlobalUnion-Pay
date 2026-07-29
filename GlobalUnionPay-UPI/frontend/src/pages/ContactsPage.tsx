import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Star, Send, Phone, Trash2, UserCheck } from 'lucide-react';

const mockContacts = [
  { id: 1, name: 'Rahul Sharma', phone: '9876543210', upiId: 'rahul@gupay', avatar: 'R', favorite: true, verified: true },
  { id: 2, name: 'Priya Singh', phone: '9123456789', upiId: 'priya@gupay', avatar: 'P', favorite: true, verified: true },
  { id: 3, name: 'Amit Kumar', phone: '9988776655', upiId: 'amit@gupay', avatar: 'A', favorite: false, verified: false },
  { id: 4, name: 'Sneha Patel', phone: '9765432100', upiId: 'sneha@gupay', avatar: 'S', favorite: false, verified: true },
  { id: 5, name: 'Vikram Rao', phone: '9654321098', upiId: 'vikram@gupay', avatar: 'V', favorite: false, verified: false },
  { id: 6, name: 'Deepa Nair', phone: '9543210987', upiId: 'deepa@gupay', avatar: 'D', favorite: true, verified: true },
];

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState(mockContacts);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', upiId: '' });
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchTab = activeTab === 'all' || c.favorite;
    return matchTab && (c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.upiId.toLowerCase().includes(q));
  });

  const toggleFavorite = (id: number) =>
    setContacts(cs => cs.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));

  const deleteContact = (id: number) => setContacts(cs => cs.filter(c => c.id !== id));

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts(cs => [...cs, { ...newContact, id: Date.now(), avatar: newContact.name[0].toUpperCase(), favorite: false, verified: false }]);
    setNewContact({ name: '', phone: '', upiId: '' });
    setShowAdd(false);
  };

  const avatarColors = ['bg-indigo-500', 'bg-purple-500', 'bg-cyan-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">{contacts.length} contacts</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {/* Search + Tabs */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:text-white" />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {(['all', 'favorites'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500'}`}>
              {tab === 'favorites' ? '⭐ Favorites' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((contact, i) => (
          <motion.div key={contact.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-card-hover transition"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${avatarColors[i % avatarColors.length]} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {contact.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{contact.name}</p>
                    {contact.verified && <UserCheck size={14} className="text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={10} />{contact.phone}</p>
                  <p className="text-xs text-primary-500 mt-0.5">{contact.upiId}</p>
                </div>
              </div>
              <button onClick={() => toggleFavorite(contact.id)}>
                <Star size={16} className={contact.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl text-xs font-medium hover:bg-primary-100 transition">
                <Send size={12} /> Pay
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-medium hover:bg-gray-100 transition">
                <Phone size={12} /> Call
              </button>
              <button onClick={() => deleteContact(contact.id)}
                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-100 transition">
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">No contacts found</p>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Add New Contact</h2>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
                { key: 'phone', label: 'Phone Number', placeholder: '9876543210' },
                { key: 'upiId', label: 'UPI ID (optional)', placeholder: 'john@gupay' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 font-medium">{f.label}</label>
                  <input value={newContact[f.key as keyof typeof newContact]}
                    onChange={e => setNewContact(n => ({ ...n, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full mt-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition dark:text-white">Cancel</button>
              <button onClick={addContact} disabled={!newContact.name || !newContact.phone}
                className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition">
                Add Contact
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
