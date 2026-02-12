import React, { useState } from 'react';
import { LightBackground } from '../components/visuals/Backgrounds';
import { User, Mail, Building, Bell, Shield, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    role: 'Senior Analyst',
    email: 'john.doe@biopharma.inc',
    company: 'Biopharma Inc.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, save to backend here
  };

  return (
    <div className="min-h-screen pt-24 px-8 pb-8 font-sans text-gray-800">
      <LightBackground />
      <div className="max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
         {/* Header */}
         <div className="mb-8 flex items-end justify-between">
            <div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </div>
            {isEditing ? (
                 <div className="flex gap-2">
                     <button 
                         onClick={() => setIsEditing(false)}
                         className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1 rounded-md border border-gray-200 bg-white"
                     >
                         <X size={14} /> Cancel
                     </button>
                     <button 
                         onClick={handleSave}
                         className="flex items-center gap-1 text-sm text-white bg-brand-cyan hover:bg-brand-teal transition-colors px-3 py-1 rounded-md shadow-sm"
                     >
                         <Save size={14} /> Save Changes
                     </button>
                 </div>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-gray-500 hover:text-brand-cyan underline transition-colors"
                >
                    Edit Profile
                </button>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Identity */}
            <div className="md:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-white"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-teal to-brand-cyan rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-brand-cyan/20 relative z-10 border-4 border-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="relative z-10 w-full">
                        {isEditing ? (
                            <div className="space-y-3 mb-4">
                                <input 
                                    type="text" 
                                    value={user.name}
                                    onChange={e => setUser({...user, name: e.target.value})}
                                    className="w-full text-center font-bold text-gray-900 border-b border-brand-cyan outline-none bg-transparent focus:bg-gray-50"
                                />
                                <input 
                                    type="text" 
                                    value={user.role}
                                    onChange={e => setUser({...user, role: e.target.value})}
                                    className="w-full text-center text-sm text-gray-500 border-b border-gray-300 outline-none bg-transparent focus:border-brand-cyan focus:bg-gray-50"
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-500 mb-6">{user.role}</p>
                            </>
                        )}
                    </div>
                    
                    <div className="w-full pt-4 border-t border-gray-50 text-left space-y-4 relative z-10">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <Mail size={14} />
                            </div>
                            {isEditing ? (
                                <input 
                                    type="email" 
                                    value={user.email}
                                    onChange={e => setUser({...user, email: e.target.value})}
                                    className="flex-1 border-b border-gray-300 outline-none text-sm bg-transparent focus:border-brand-cyan"
                                />
                            ) : (
                                <span className="truncate">{user.email}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <Building size={14} />
                            </div>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={user.company}
                                    onChange={e => setUser({...user, company: e.target.value})}
                                    className="flex-1 border-b border-gray-300 outline-none text-sm bg-transparent focus:border-brand-cyan"
                                />
                            ) : (
                                <span>{user.company}</span>
                            )}
                        </div>
                         <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <Shield size={14} />
                            </div>
                            <span>Admin Access</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="md:col-span-2 space-y-6">
                {/* Notifications */}
                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Bell size={18} className="text-brand-cyan" /> Intelligence Preferences
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Daily Market Digest', desc: 'Summary of key movements every morning.', active: true },
                            { title: 'Real-time Breaking News', desc: 'Instant alerts for high-impact events.', active: true },
                            { title: 'Scientific Publications', desc: 'Weekly roundup of new research.', active: false },
                            { title: 'Monthly Digest', desc: 'Monthly Review publication notifications', active: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                                <button className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${item.active ? 'bg-brand-cyan' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${item.active ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;