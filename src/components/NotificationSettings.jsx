import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, X } from 'lucide-react';

const NotificationSettings = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [newTime, setNewTime] = useState('');
    const [newLabel, setNewLabel] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('weatherApp_notifications');
        if (saved) {
            setNotifications(JSON.parse(saved));
        }
    }, []);

    const saveNotifications = (updated) => {
        setNotifications(updated);
        localStorage.setItem('weatherApp_notifications', JSON.stringify(updated));
    };

    const handleAdd = () => {
        if (!newTime) return;
        const updated = [...notifications, {
            id: Date.now(),
            time: newTime,
            label: newLabel || 'Bildirim'
        }];
        saveNotifications(updated);
        setNewTime('');
        setNewLabel('');
    };

    const handleDelete = (id) => {
        const updated = notifications.filter(n => n.id !== id);
        saveNotifications(updated);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-[#1a1a2e] w-full max-w-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Bell size={20} className="text-blue-400" /> Bildirim Ayarları
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Add New */}
                    <div className="space-y-3">
                        <label className="text-sm text-gray-400">Yeni Bildirim Ekle</label>
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400"
                            />
                            <input
                                type="text"
                                placeholder="Etiket (Örn: Sabah)"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-400"
                            />
                            <button
                                onClick={handleAdd}
                                disabled={!newTime}
                                className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-3">
                        <label className="text-sm text-gray-400">Kayıtlı Bildirimler</label>
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                Henüz bildirim ayarlanmamış.
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div>
                                            <div className="font-bold text-lg">{notif.time}</div>
                                            <div className="text-sm text-gray-400">{notif.label}</div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(notif.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
