import React, { useState } from 'react';
import { Store, Camera, Save, MapPin, Phone, Mail } from 'lucide-react';
import { Shop, User } from '../types';

interface ShopViewProps {
  shop: Shop;
  seller: User;
  onUpdateShop: (updatedFields: Partial<Shop>) => void;
  onUpdateSeller: (updatedFields: Partial<User>) => void;
}

export default function ShopView({
  shop,
  seller,
  onUpdateShop,
  onUpdateSeller
}: ShopViewProps) {
  const [shopName, setShopName] = useState(shop.name);
  const [description, setDescription] = useState(shop.description);
  const [location, setLocation] = useState(shop.location);
  const [residence, setResidence] = useState(seller.residence);
  const [contact, setContact] = useState(seller.contact);
  const [email, setEmail] = useState(seller.email);

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    setTimeout(() => {
      onUpdateShop({
        name: shopName,
        description,
        location
      });
      onUpdateSeller({
        residence,
        contact,
        email
      });
      setSaving(false);
      alert("Shop profile updated successfully!");
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-[#2E7D32]" />
          My Campus Shop Profile
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Customize shop details, logo, cover imagery, and hostel delivery pickup configurations</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover Graphic Frame */}
        <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
          <img
            src={shop.coverImage}
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-black/20" />
          <button
            type="button"
            className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            onClick={() => alert("Image upload simulation active. Selected photo is configured!")}
          >
            <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Change Cover</span>
          </button>

          {/* Logo Frame overlays bottom left */}
          <div className="absolute bottom-4 left-4 flex items-end gap-3.5">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow bg-white dark:bg-slate-900 group-avatar">
              <img
                src={shop.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-200"
                onClick={() => alert("Image upload simulation active. Selected logo updated!")}
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="text-white drop-shadow-md mb-1">
              <h3 className="font-extrabold text-sm">{shop.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-wide">University Verified Seller ✓</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-extrabold mb-1.5">Shop Business Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-extrabold mb-1.5">Shop Slogan / Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-extrabold mb-1.5 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" /> Physical Location (Hostel Block/Room)
              </label>
              <input
                type="text"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-extrabold mb-1.5 flex items-center gap-1">
                <Phone className="w-4 h-4 text-slate-400" /> Contact Phone Number
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-extrabold mb-1.5 flex items-center gap-1">
                <Mail className="w-4 h-4 text-slate-400" /> Student Verification Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl p-3 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2E7D32] hover:bg-emerald-700 disabled:bg-emerald-600/60 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow transition cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
