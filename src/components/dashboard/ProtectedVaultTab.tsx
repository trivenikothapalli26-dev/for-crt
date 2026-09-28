import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Plus, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Search,
  KeyRound,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VaultItem {
  id: string;
  title: string;
  content: string;
  category: 'Secret' | 'Note' | 'API Key' | 'Reminder';
  updatedAt: string;
}

export const ProtectedVaultTab: React.FC = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [requireVerificationForSecrets, setRequireVerificationForSecrets] = useState(true);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<VaultItem['category']>('Secret');

  // Load items scoped to current user UID
  useEffect(() => {
    if (!currentUser) return;
    try {
      const storageKey = `authshield_vault_${currentUser.uid}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Seed initial sample protected note for new users
        const initial: VaultItem[] = [
          {
            id: '1',
            title: 'Welcome to your Protected Vault',
            content: 'This workspace is protected by Firebase Authentication and scoped to your unique UID: ' + currentUser.uid,
            category: 'Note',
            updatedAt: new Date().toLocaleDateString()
          }
        ];
        setItems(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const saveItems = (updated: VaultItem[]) => {
    if (!currentUser) return;
    setItems(updated);
    try {
      localStorage.setItem(`authshield_vault_${currentUser.uid}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    // Check email verification gate if active
    if (requireVerificationForSecrets && !currentUser?.emailVerified && newCategory === 'Secret') {
      alert('Email verification required! Please verify your email to store classified Secret keys.');
      return;
    }

    const newItem: VaultItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      updatedAt: new Date().toLocaleDateString()
    };

    saveItems([newItem, ...items]);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    saveItems(items.filter((item) => item.id !== id));
  };

  const isVerified = currentUser?.emailVerified;
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <span>Authenticated Data Vault</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Data in this workspace is accessible only after successful authentication with Firebase.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel Entry' : 'New Vault Record'}</span>
        </button>
      </div>

      {/* Email Verification Policy Gate Demo */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {isVerified ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Route Authorization Policy</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isVerified ? 'High Security Tier: Email Verified' : 'Standard Tier: Unverified Email'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Demonstrates Role &amp; Verification based security gates. When enabled, classified "Secret" records require verified email status.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer self-start md:self-auto">
          <input
            type="checkbox"
            checked={requireVerificationForSecrets}
            onChange={(e) => setRequireVerificationForSecrets(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <span>Enforce Email Verification Gate</span>
        </label>
      </div>

      {/* New Item Form Drawer */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <h3 className="text-sm font-bold text-slate-900">Create Secured Record</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Production AWS Secret or Project Note"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as VaultItem['category'])}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
              >
                <option value="Secret">Secret (Verification required)</option>
                <option value="Note">General Note</option>
                <option value="API Key">API Key</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Encrypted Payload / Content</label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter private note details..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Store Securely
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your private records..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {['All', 'Secret', 'Note', 'API Key', 'Reminder'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No records found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? 'Try clearing your search query.' : 'Create your first authenticated vault record above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      item.category === 'Secret'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.category === 'API Key'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.updatedAt}
                </span>
                <span className="font-mono text-[10px] text-slate-300">UID: {currentUser?.uid.slice(0, 5)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
