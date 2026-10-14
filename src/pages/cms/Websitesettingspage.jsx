/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Save, Globe, Mail, Phone, MapPin, Share2, Search, Image, ChevronDown, ChevronUp } from "lucide-react";
import Toppage from "../../components/common/Toppage";

// ─── Static Data ───────────────────────────────────────────────────────────────
const INITIAL_SETTINGS = {
  // General
  siteName: "My Business",
  tagline: "Your trusted partner in growth",
  logo: "",
  favicon: "",
  // Contact Info
  email: "contact@mybusiness.com",
  phone: "+91 98765 43210",
  address: "123, MG Road, Gurugram, Haryana 122001",
  mapUrl: "",

  // Social
  facebook: "https://facebook.com/mybusiness",
  instagram: "https://instagram.com/mybusiness",
  twitter: "https://twitter.com/mybusiness",
  linkedin: "https://linkedin.com/company/mybusiness",
  youtube: "",
  // Other
  maintenanceMode: false,
  googleAnalyticsId: "",
};

// ─── Section Wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white border border-[#e0d9f5] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-[#ede8f8] hover:bg-[#faf8ff] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon size={16} className="text-primary" />
          </div>
          <p className="font-heading text-sm font-bold text-black">{title}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-[#9a9abf]" /> : <ChevronDown size={16} className="text-[#9a9abf]" />}
      </button>
      {open && <div className="px-6 py-5">{children}</div>}
    </div>
  );
}

// ─── Form Field ────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-[#9a9abf] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
    />
  );
}

export default function WebsiteSettingsPage() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const set = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    // TODO: replace with actual API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-5">
        <Toppage Title="Website Settings" />
      <div className="flex items-center justify-end">
      
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-60"
        >
          <Save size={14} />
          {saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          ✓ Settings saved successfully!
        </div>
      )}

    
      <Section icon={Globe} title="General Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site Name *">
            <Input value={settings.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="My Business" />
          </Field>
          <Field label="Tagline">
            <Input value={settings.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Your trusted partner" />
          </Field>
          <Field label="Logo URL">
            <Input value={settings.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Favicon URL">
            <Input value={settings.favicon} onChange={(e) => set("favicon", e.target.value)} placeholder="https://.../favicon.ico" />
          </Field>
          <Field label="Google Analytics ID">
            <Input value={settings.googleAnalyticsId} onChange={(e) => set("googleAnalyticsId", e.target.value)} placeholder="G-XXXXXXXXXX" />
          </Field>
          <Field label="Maintenance Mode">
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => set("maintenanceMode", !settings.maintenanceMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.maintenanceMode ? "bg-primary" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.maintenanceMode ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm text-black">{settings.maintenanceMode ? "Enabled" : "Disabled"}</span>
            </div>
          </Field>
        </div>
      </Section>

     
      <Section icon={Phone} title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email *">
            <Input type="email" value={settings.email} onChange={(e) => set("email", e.target.value)} placeholder="contact@example.com" />
          </Field>
          <Field label="Phone">
            <Input value={settings.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Address">
              <Textarea value={settings.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, City, State, PIN" rows={2} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Google Maps Embed URL">
              <Input value={settings.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://maps.google.com/..." />
            </Field>
          </div>
        </div>
      </Section>

    
    
    
      <Section icon={Share2} title="Social Media Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "facebook", label: "Facebook" },
            { key: "instagram", label: "Instagram" },
            { key: "twitter", label: "Twitter / X" },
            { key: "linkedin", label: "LinkedIn" },
            { key: "youtube", label: "YouTube" },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input value={settings[key]} onChange={(e) => set(key, e.target.value)} placeholder={`https://${key}.com/...`} />
            </Field>
          ))}
        </div>
      </Section>

    
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-60"
        >
          <Save size={14} />
          {saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}