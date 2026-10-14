/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { Save, ShieldCheck, Pencil, X } from "lucide-react";
import Toppage from "../../components/common/Toppage";
import RichTextEditor from "../../components/common/Richtexteditor2";
import { useSettingStore } from "../../store/useSettingStore";


const INITIAL_CONTENT = `<h2>Privacy Policy</h2>
<p>Last updated: April 14, 2026</p>
<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, submit a form, make a purchase, or contact us for support. This may include your name, email address, phone number, and payment information.</p>
<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
<h3>3. Information Sharing</h3>
<p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances: with your consent, to comply with laws, or to protect rights and safety.</p>
<h3>4. Data Security</h3>
<p>We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
<h3>5. Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at privacy@example.com.</p>`;

export default function PrivacyPolicyPage() {
  const [editing, setEditing] = useState(false);
 const { settings, updateSection,fetchSettings , } = useSettingStore();

const [saved, setSaved] = useState("");
const [draft, setDraft] = useState("");
  const [lastSaved, setLastSaved] = useState(new Date());

  const handleEdit = () => {
    setDraft(saved);
    setEditing(true);
  };

 const handleSave = async () => {
  const ok = await updateSection("legal", {
    privacyPolicy: draft,
  });

  if (ok) {
    setSaved(draft);
    setLastSaved(new Date());
    setEditing(false);
  }
};

  const handleDiscard = () => {
    setDraft(saved);
    setEditing(false);
  };
React.useEffect(() => {
  if (settings?.legal?.privacyPolicy) {
    setSaved(settings.legal.privacyPolicy);
    setDraft(settings.legal.privacyPolicy);
  }
}, [settings]);

useEffect(() => {
  fetchSettings();
}, []);
  return (
    <div className="space-y-5">
      <Toppage Title="Privacy Policy" />

      <div className="bg-white border border-[#e0d9f5] rounded-2xl">
      
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-heading text-base font-bold text-black">
                Privacy Policy
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Last saved: {lastSaved.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleDiscard}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-[#d8d0ee] text-gray-500 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <X size={14} /> Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors cursor-pointer"
                >
                  <Save size={14} /> Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors cursor-pointer"
              >
                <Pencil size={14} /> Edit Policy
              </button>
            )}
          </div>
        </div>

        
        <div className="p-6">
          {editing ? (
            <RichTextEditor
              value={draft}
              onChange={setDraft}
              placeholder="Write your privacy policy..."
              minHeight={420}
            />
          ) : (
            <div
              className="prose prose-sm max-w-none text-black leading-relaxed
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:text-sm [&_p]:text-[#4a4a6a] [&_p]:mb-3 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-[#4a4a6a]
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:text-[#4a4a6a]
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#9a9abf]"
              dangerouslySetInnerHTML={{ __html: saved }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
