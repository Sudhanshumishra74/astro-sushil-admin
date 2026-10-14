/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
// pages/settings/sections/SocialSection.jsx

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

import { useSettingStore } from "../../store/useSettingStore";
import {
  Field,
  SectionCard,
  Grid,
  SaveBar,
} from "./Settingsui";

const SOCIALS = [
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    placeholder: "https://facebook.com/...",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    placeholder: "https://instagram.com/...",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: FaTwitter,
    placeholder: "https://twitter.com/...",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    placeholder: "https://linkedin.com/...",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FaYoutube,
    placeholder: "https://youtube.com/...",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    placeholder: "+91 99999 99999",
  },
];

export default function SocialSection() {
  const {
    settings,
    updateSection,
    loading,
  } = useSettingStore();

  const [data, setData] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    whatsapp: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.socialLinks) {
      setData({
        facebook:
          settings.socialLinks.facebook || "",
        instagram:
          settings.socialLinks.instagram || "",
        twitter:
          settings.socialLinks.twitter || "",
        linkedin:
          settings.socialLinks.linkedin || "",
        youtube:
          settings.socialLinks.youtube || "",
        whatsapp:
          settings.socialLinks.whatsapp || "",
      });
    }
  }, [settings?.socialLinks]);

  const set = (k, v) => {
    setData((prev) => ({
      ...prev,
      [k]: v,
    }));
  };

  const handleSave = async () => {
    const ok = await updateSection(
      "socialLinks",
      data
    );

    if (ok) {
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    }
  };

  return (
    <SectionCard
      title="Social Media Links"
      description="Connect your social profiles"
      icon={Share2}
    >
      <Grid>
        {SOCIALS.map(
          ({
            key,
            label,
            icon: Icon,
            placeholder,
          }) => (
            <Field
              key={key}
              label={label}
            >
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#b0a8c8] pointer-events-none text-sm">
                  <Icon />
                </span>

                <input
                  type="text"
                  placeholder={placeholder}
                  value={data[key] ?? ""}
                  onChange={(e) =>
                    set(
                      key,
                      e.target.value
                    )
                  }
                  className="w-full pl-9 pr-4 bg-secondary border border-[#d8d0ee] rounded-xl py-2.5 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </Field>
          )
        )}
      </Grid>

      <SaveBar
        onSave={handleSave}
        loading={loading}
        saved={saved}
      />
    </SectionCard>
  );
}