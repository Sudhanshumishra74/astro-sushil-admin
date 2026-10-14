// pages/settings/sections/BrandingSection.jsx
import React, {  useState } from "react";
import { Store, Globe, Upload } from "lucide-react";

import { Field, Input, SectionCard, SaveBar } from "./Settingsui";
import { useSettingStore } from "../../store/useSettingStore";

export default function BrandingSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.branding || { siteName: "", logoUrl: "", faviconUrl: "" });
  const [saved, setSaved] = useState(false);
   React.useEffect(() => {
    if (settings?.branding) {
      setData({
        siteName: settings.branding.siteName || "",
        logoUrl: settings.branding.logoUrl || "",
        faviconUrl: settings.branding.faviconUrl || "",
      });
    }
  }, [settings?.branding]);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("branding", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Site Identity" description="Brand name, logo, and favicon" icon={Store}>
      <Field label="Site Name">
        <Input icon={Globe} placeholder="My Business" value={data.siteName} onChange={(e) => set("siteName", e.target.value)} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Logo URL" hint="Recommended: 200×60px PNG">
          <Input icon={Upload} placeholder="https://..." value={data.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} />
          {data.logoUrl && (
            <div className="mt-2 h-14 flex items-center justify-center bg-secondary border border-[#ede8f8] rounded-xl overflow-hidden">
              <img src={data.logoUrl} alt="logo preview" className="max-h-full object-contain" />
            </div>
          )}
        </Field>
        <Field label="Favicon URL" hint="Recommended: 32×32px ICO / PNG">
          <Input icon={Upload} placeholder="https://..." value={data.faviconUrl} onChange={(e) => set("faviconUrl", e.target.value)} />
          {data.faviconUrl && (
            <div className="mt-2 h-14 flex items-center justify-center bg-secondary border border-[#ede8f8] rounded-xl">
              <img src={data.faviconUrl} alt="favicon preview" className="w-8 h-8 object-contain" />
            </div>
          )}
        </Field>
      </div>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}