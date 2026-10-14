// pages/settings/sections/TopBarSection.jsx
import React, { useState } from "react";
import { Megaphone, Link2 } from "lucide-react";

import { Field, Input, ColorInput, Toggle, SectionCard, SaveBar } from "./Settingsui";
import { useSettingStore } from "../../store/useSettingStore";

const DEFAULTS = {
  enabled: true,
  text: "",
  bgColor: "#ffffff",
  textColor: "#ef4444",
  linkEnabled: false,
  linkUrl: "",
};

export default function TopBarSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => ({ ...DEFAULTS, ...settings?.topBar }));
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (settings?.topBar) {
      setData({ ...DEFAULTS, ...settings.topBar });
    }
  }, [settings?.topBar]);

  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("topBar", data);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <SectionCard
      title="Top Bar"
      description="Announcement strip shown above the main header on the customer site"
      icon={Megaphone}
    >
      <Toggle
        label="Show top bar"
        description="Turn the announcement strip on or off site-wide"
        value={data.enabled}
        onChange={(v) => set("enabled", v)}
      />

      <Field label="Announcement Text">
        <Input
          placeholder="✨ Astro Sushil in Mumbai | 25th, 26th & 27th September 2026 ✨"
          value={data.text}
          onChange={(e) => set("text", e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Background Color">
          <ColorInput value={data.bgColor} onChange={(v) => set("bgColor", v)} />
        </Field>
        <Field label="Text Color">
          <ColorInput value={data.textColor} onChange={(v) => set("textColor", v)} />
        </Field>
      </div>

      <Toggle
        label="Make it a link"
        description="Clicking the top bar navigates to a URL"
        value={data.linkEnabled}
        onChange={(v) => set("linkEnabled", v)}
      />

      {data.linkEnabled && (
        <Field label="Link URL" hint="Internal path (e.g. /free-online-kundli) or a full https:// URL">
          <Input
            icon={Link2}
            placeholder="/free-online-kundli"
            value={data.linkUrl}
            onChange={(e) => set("linkUrl", e.target.value)}
          />
        </Field>
      )}

      <div>
        <p className="text-xs font-medium text-[#9a9abf] uppercase tracking-wider mb-1.5">Preview</p>
        <div
          className="rounded-xl py-3 px-4 text-center text-sm font-semibold"
          style={{ backgroundColor: data.bgColor || "#ffffff", color: data.textColor || "#000000" }}
        >
          {data.text || "Your announcement text will appear here"}
        </div>
      </div>

      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}
