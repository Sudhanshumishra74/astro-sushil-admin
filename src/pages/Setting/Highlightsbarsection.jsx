// pages/settings/sections/HighlightsBarSection.jsx
import React, { useState } from "react";
import { Sparkles, Link2 } from "lucide-react";

import { Field, Input, ColorInput, Toggle, SectionCard, SaveBar } from "./Settingsui";
import { useSettingStore } from "../../store/useSettingStore";

const DEFAULTS = {
  enabled: false,
  text: "",
  bgColor: "#121045",
  textColor: "#ffffff",
  linkEnabled: false,
  linkUrl: "",
};

export default function HighlightsBarSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => ({ ...DEFAULTS, ...settings?.highlightsBar }));
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (settings?.highlightsBar) {
      setData({ ...DEFAULTS, ...settings.highlightsBar });
    }
  }, [settings?.highlightsBar]);

  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("highlightsBar", data);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <SectionCard
      title="Highlights Bar"
      description="A second strip shown below the main header on the customer site, bordered by gold lines"
      icon={Sparkles}
    >
      <Toggle
        label="Show highlights bar"
        description="Turn this strip on or off site-wide"
        value={data.enabled}
        onChange={(v) => set("enabled", v)}
      />

      <Field label="Text">
        <Input
          placeholder="Free Kundli Report | Certified Astrologers | 24x7 Support"
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
        description="Clicking the highlights bar navigates to a URL"
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
          className="rounded-xl py-3 px-4 text-center text-sm font-bold border-y-2 border-gold"
          style={{ backgroundColor: data.bgColor || "#121045", color: data.textColor || "#ffffff" }}
        >
          {data.text || "Your highlights bar text will appear here"}
        </div>
      </div>

      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}
