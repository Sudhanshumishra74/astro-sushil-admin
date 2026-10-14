// pages/settings/sections/TechSections.jsx
import { useState } from "react";
import {
  Bell, Mail, MessageSquare, Key, Settings, FileText,
  Globe, Hash, Clock, RefreshCw,
} from "lucide-react";
import { useSettingStore } from "../../store/useSettingStore";
import { Field, Input, Textarea, NumberInput, Toggle, SectionCard, Grid, SaveBar } from "./Settingsui";


export function CommunicationSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.communication || { enableOrderEmails: true, enableOrderSMS: true, enablePushNotifications: false });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("communication", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Notifications" description="Order alerts via email, SMS and push" icon={Bell}>
      <Toggle label="Order Email Notifications" description="Send email updates for every order status change" value={data.enableOrderEmails} onChange={(v) => set("enableOrderEmails", v)} />
      <Toggle label="Order SMS Notifications" description="Send SMS updates to customers" value={data.enableOrderSMS} onChange={(v) => set("enableOrderSMS", v)} />
      {/* <Toggle label="Push Notifications" description="Enable browser / app push notifications" value={data.enablePushNotifications} onChange={(v) => set("enablePushNotifications", v)} /> */}
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}


export function SmtpSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.smtp || { host: "", port: 587, secure: false, username: "", password: "", fromEmail: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("smtp", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="SMTP Configuration" description="Outgoing email server settings" icon={Mail}>
      <Grid>
        <Field label="SMTP Host">
          <Input icon={Globe} placeholder="smtp.gmail.com" value={data.host} onChange={(e) => set("host", e.target.value)} />
        </Field>
        <Field label="Port">
          <NumberInput icon={Hash} placeholder="587" value={data.port} onChange={(e) => set("port", e.target.value)} />
        </Field>
        <Field label="Username">
          <Input icon={Mail} placeholder="you@gmail.com" value={data.username} onChange={(e) => set("username", e.target.value)} />
        </Field>
        <Field label="Password">
          <Input icon={Key} placeholder="App password" value={data.password} onChange={(e) => set("password", e.target.value)} secret />
        </Field>
        <Field label="From Email">
          <Input icon={Mail} placeholder="noreply@store.com" value={data.fromEmail} onChange={(e) => set("fromEmail", e.target.value)} />
        </Field>
      </Grid>
      <Toggle label="Use SSL / TLS (Secure)" description="Enable for port 465" value={data.secure} onChange={(v) => set("secure", v)} />
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}


export function SmsSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.sms || { provider: "", apiKey: "", senderId: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("sms", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="SMS Gateway" description="Provider credentials for SMS alerts" icon={MessageSquare}>
      <Grid>
        <Field label="Provider">
          <Input icon={MessageSquare} placeholder="Twilio / MSG91 / etc." value={data.provider} onChange={(e) => set("provider", e.target.value)} />
        </Field>
        <Field label="API Key">
          <Input icon={Key} placeholder="API key" value={data.apiKey} onChange={(e) => set("apiKey", e.target.value)} secret />
        </Field>
        <Field label="Sender ID">
          <Input icon={Hash} placeholder="MYSTORE" value={data.senderId} onChange={(e) => set("senderId", e.target.value)} />
        </Field>
      </Grid>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}


export function OtpSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.otp || { expiryMinutes: 5, resendTimeoutSec: 30 });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("otp", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="OTP Settings" description="One-time password expiry and resend rules" icon={Key}>
      <Grid>
        <Field label="OTP Expiry (minutes)">
          <NumberInput icon={Clock} placeholder="5" value={data.expiryMinutes} onChange={(e) => set("expiryMinutes", e.target.value)} />
        </Field>
        <Field label="Resend Timeout (seconds)">
          <NumberInput icon={RefreshCw} placeholder="30" value={data.resendTimeoutSec} onChange={(e) => set("resendTimeoutSec", e.target.value)} />
        </Field>
      </Grid>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}


export function SystemSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.system || { maintenanceMode: false, enableRegistration: true });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("system", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="System Controls" description="Maintenance mode and registrations" icon={Settings}>
      <Toggle label="Maintenance Mode" description="Shows a maintenance page to all visitors" value={data.maintenanceMode} onChange={(v) => set("maintenanceMode", v)} />
     
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}

// ─── Legal ────────────────────────────────────────────────────────────────────
export function LegalSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.legal || { privacyPolicy: "", termsConditions: "", returnPolicyText: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("legal", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Legal Documents" description="Policy content shown to customers" icon={FileText}>
      <Field label="Privacy Policy">
        <Textarea placeholder="Your privacy policy text..." value={data.privacyPolicy} onChange={(e) => set("privacyPolicy", e.target.value)} rows={6} />
      </Field>
      <Field label="Terms & Conditions">
        <Textarea placeholder="Your terms and conditions..." value={data.termsConditions} onChange={(e) => set("termsConditions", e.target.value)} rows={6} />
      </Field>
      <Field label="Return Policy Text">
        <Textarea placeholder="Your return policy details..." value={data.returnPolicyText} onChange={(e) => set("returnPolicyText", e.target.value)} rows={4} />
      </Field>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}