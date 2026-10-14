// pages/settings/sections/ContactSection.jsx
import { useState } from "react";
import { Phone, Mail, MessageSquare } from "lucide-react";
import { useSettingStore } from "../../store/useSettingStore";
import { Field, Input, Textarea, SectionCard, Grid, SaveBar } from "./Settingsui";

export default function ContactSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.contact || { email: "", phone: "", whatsapp: "", address: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("contact", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Contact Information" description="How customers reach you" icon={Phone}>
      <Grid>
        <Field label="Email">
          <Input icon={Mail} placeholder="hello@store.com" value={data.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input icon={Phone} placeholder="+1234567890" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="WhatsApp">
          <Input icon={MessageSquare} placeholder="+1234567890" value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
      </Grid>
      <Field label="Address">
        <Textarea placeholder="Full address..." value={data.address} onChange={(e) => set("address", e.target.value)} rows={3} />
      </Field>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}