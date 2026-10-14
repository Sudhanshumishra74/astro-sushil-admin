/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Save, FileText, Pencil, X } from "lucide-react";
import Toppage from "../../components/common/Toppage";
import RichTextEditor from "../../components/common/Richtexteditor2";
import { useSettingStore } from "../../store/useSettingStore";

const INITIAL_CONTENT = ``;

export default function TermsConditionsPage() {
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
      termsConditions: draft,
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
  if (settings?.legal?.termsConditions) {
    setSaved(settings.legal.termsConditions);
    setDraft(settings.legal.termsConditions);
  } else {
    setSaved(INITIAL_CONTENT);
    setDraft(INITIAL_CONTENT);
  }
}, [settings]);
  
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-5">
      <Toppage Title="Terms & Conditions" />

      <div className="bg-white border border-[#e0d9f5] rounded-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-[#ede8f8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-heading text-base font-bold text-black">
                Terms &amp; Conditions
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
                <Pencil size={14} /> Edit Terms
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {editing ? (
            <RichTextEditor
              value={draft}
              onChange={setDraft}
              placeholder="Write your terms and conditions..."
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
