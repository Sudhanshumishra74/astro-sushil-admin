// pages/settings/sections/ShiprocketSection.jsx
import { useState } from "react";
import { Truck, Mail, Key, MapPin, Hash, Webhook, Warehouse, Phone } from "lucide-react";
import { useSettingStore } from "../../store/useSettingStore";
import { Field, Input, SectionCard, Grid, SaveBar } from "./Settingsui";

const DEFAULTS = {
  email: "",
  password: "",
  passwordSet: false,
  webhookToken: "",
  pickupLocation: "",
  pickupPincode: "",
  warehouseName: "Warehouse",
  warehouseEmail: "",
  warehousePhone: "",
  warehouseAddress: "",
  warehouseCity: "",
  warehouseState: "",
  warehousePincode: "",
};

export default function ShiprocketSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => ({ ...DEFAULTS, ...settings?.shiprocket }));
  // One flag per card — all four cards save the same underlying `shiprocket`
  // object, but each has its own Save button and should only show "Saved!"
  // for the card that was actually clicked.
  const [savedSection, setSavedSection] = useState(null);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async (section) => {
    // Password is write-only — never send a blank value, or a save with
    // nothing typed would wipe out the previously-saved password.
    const payload = { ...data };
    delete payload.passwordSet;
    if (!payload.password) delete payload.password;

    const ok = await updateSection("shiprocket", payload);
    if (ok) {
      setData((p) => ({ ...p, password: "" }));
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Shiprocket Account" description="Login credentials for the Shiprocket API" icon={Truck} index={0}>
        <Grid>
          <Field label="Account Email">
            <Input icon={Mail} placeholder="you@business.com" value={data.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Password" hint={data.passwordSet ? "Password saved — leave blank to keep it" : "Not set"}>
            <Input icon={Key} placeholder={data.passwordSet ? "••••••••" : "Password"} value={data.password} onChange={(e) => set("password", e.target.value)} secret />
          </Field>
        </Grid>
        <SaveBar onSave={() => handleSave("account")} loading={loading} saved={savedSection === "account"} />
      </SectionCard>

      <SectionCard title="Pickup Location" description="Must match a pickup address already added on Shiprocket" icon={MapPin} index={1}>
        <Grid>
          <Field label="Pickup Location Nickname">
            <Input icon={MapPin} placeholder="Primary Warehouse" value={data.pickupLocation} onChange={(e) => set("pickupLocation", e.target.value)} />
          </Field>
          <Field label="Pickup Pincode" hint="Used for rate-shopping — Shiprocket has no lookup for this">
            <Input icon={Hash} placeholder="110001" value={data.pickupPincode} onChange={(e) => set("pickupPincode", e.target.value)} />
          </Field>
        </Grid>
        <SaveBar onSave={() => handleSave("pickup")} loading={loading} saved={savedSection === "pickup"} />
      </SectionCard>

      <SectionCard title="Webhook" description="Shared token Shiprocket sends back on every status webhook call" icon={Webhook} index={2}>
        <Field label="Webhook Token">
          <Input icon={Key} placeholder="Shared secret configured on the Shiprocket dashboard" value={data.webhookToken} onChange={(e) => set("webhookToken", e.target.value)} secret />
        </Field>
        <SaveBar onSave={() => handleSave("webhook")} loading={loading} saved={savedSection === "webhook"} />
      </SectionCard>

      <SectionCard title="Return Warehouse" description="Destination address for reverse-pickup (return) shipments" icon={Warehouse} index={3}>
        <Grid>
          <Field label="Warehouse Name">
            <Input icon={Warehouse} placeholder="Warehouse" value={data.warehouseName} onChange={(e) => set("warehouseName", e.target.value)} />
          </Field>
          <Field label="Warehouse Email">
            <Input icon={Mail} placeholder="warehouse@business.com" value={data.warehouseEmail} onChange={(e) => set("warehouseEmail", e.target.value)} />
          </Field>
          <Field label="Warehouse Phone">
            <Input icon={Phone} placeholder="+91 99999 99999" value={data.warehousePhone} onChange={(e) => set("warehousePhone", e.target.value)} />
          </Field>
          <Field label="Warehouse Pincode">
            <Input icon={Hash} placeholder="110001" value={data.warehousePincode} onChange={(e) => set("warehousePincode", e.target.value)} />
          </Field>
          <Field label="Warehouse City">
            <Input icon={MapPin} placeholder="New Delhi" value={data.warehouseCity} onChange={(e) => set("warehouseCity", e.target.value)} />
          </Field>
          <Field label="Warehouse State">
            <Input icon={MapPin} placeholder="Delhi" value={data.warehouseState} onChange={(e) => set("warehouseState", e.target.value)} />
          </Field>
        </Grid>
        <Field label="Warehouse Address">
          <Input icon={Warehouse} placeholder="Full street address" value={data.warehouseAddress} onChange={(e) => set("warehouseAddress", e.target.value)} />
        </Field>
        <SaveBar onSave={() => handleSave("warehouse")} loading={loading} saved={savedSection === "warehouse"} />
      </SectionCard>
    </div>
  );
}
