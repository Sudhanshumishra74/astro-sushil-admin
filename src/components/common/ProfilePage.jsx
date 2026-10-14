/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, X, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
       
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

       
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede8f8]">
            <h2 className="font-heading font-bold text-base text-black">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-gray-400 hover:text-primary"
            >
              <X size={16} />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>
      <label className="block text-xs text-[#9a9abf] mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs text-[#9a9abf] mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 pr-10 text-sm bg-secondary border border-[#d8d0ee] rounded-xl text-black placeholder-[#b0a8c8] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center cursor-pointer gap-1.5 px-4 py-1.5 border border-[#d8d0ee] rounded-full text-[13px] text-primary font-medium bg-white hover:bg-secondary transition-colors"
    >
      <Pencil size={12} />
      Edit
    </button>
  );
}

function InfoGrid({ rows }) {
  return (
    <div className="space-y-5">
      {rows.map((row, i) => (
        <div key={i}>
          {i > 0 && <hr className="border-[#ede8f8] mb-5" />}
          <div
            className={`grid gap-5 ${row.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
          >
            {row.map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-[#9a9abf] mb-1">{label}</p>
                <p className="text-sm font-semibold text-black">
                  {value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, fetchProfile, updateProfile, changePassword } =
    useAuthStore();

  const [modal, setModal] = useState(null); 

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    designation: "",
    website: "",
    portfolioLink: "",
  });

  const [personalForm, setPersonalForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    designation: "",
  });

  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  React.useEffect(() => {
    if (!user) return;
    setProfileForm({
      fullName: user.fullName || "",
      designation: user.designation || "",
      website: user.website || "",
      portfolioLink: user.portfolioLink || "",
    });
    setPersonalForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      designation: user.designation || "",
    });
    setAddressForm({
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      postalCode: user.postalCode || "",
    });
  }, [user]);

  const handleChange = (setter) => (e) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async () => {
    const ok = await updateProfile(profileForm);
    if (ok) setModal(null);
  };

  const handleUpdatePersonal = async () => {
    const ok = await updateProfile(personalForm);
    if (ok) setModal(null);
  };

  const handleUpdateAddress = async () => {
    const ok = await updateProfile(addressForm);
    if (ok) setModal(null);
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return;
    const ok = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    if (ok) {
      setModal(null);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MC";

  const personalInfoRows = [
    [
      { label: "Full Name", value: user?.fullName },
      { label: "Username", value: user?.username },
    ],
    [
      { label: "Email address", value: user?.email },
      { label: "Phone", value: user?.phoneNumber },
    ],
    [{ label: "Designation", value: user?.designation }],
  ];

  const addressInfoRows = [
    [
      { label: "Address", value: user?.address },
      { label: "City", value: user?.city },
    ],
    [
      { label: "State", value: user?.state },
      { label: "Postal Code", value: user?.postalCode },
    ],
  ];

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-black">
            Profile
          </h1>
          <nav className="flex items-center gap-2 text-sm text-[#9a9abf]">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-primary font-medium">Profile</span>
          </nav>
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl p-6">
          <p className="font-heading text-base font-bold text-black mb-4">
            Profile
          </p>
          <div className="border border-[#ede8f8] rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Avatar */}
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-[#e0d9f5]"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {initials}
                </div>
              )}

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-black text-base">
                  {user?.fullName || "—"}
                </p>
                <p className="text-sm text-[#9a9abf] mt-0.5">
                  {user?.designation || "—"}
                  {user?.city && (
                    <>
                      <span className="mx-1.5">|</span>
                      {user.city}, {user.state}
                    </>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <EditButton onClick={() => setModal("profile")} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-heading text-base font-bold text-black">
              Personal Information
            </p>
            <EditButton onClick={() => setModal("personal")} />
          </div>
          <InfoGrid rows={personalInfoRows} />
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-heading text-base font-bold text-black">
              Address
            </p>
            <EditButton onClick={() => setModal("address")} />
          </div>
          <InfoGrid rows={addressInfoRows} />
        </div>

        <div className="bg-white border border-[#e0d9f5] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-base font-bold text-black">
                Password
              </p>
              <p className="text-xs text-[#9a9abf] mt-0.5">
                Update your account password
              </p>
            </div>
            <EditButton onClick={() => setModal("password")} />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {modal === "profile" && (
          <Modal title="Edit Profile" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <FormField
                label="Full Name"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleChange(setProfileForm)}
              />
              <FormField
                label="Designation"
                name="designation"
                value={profileForm.designation}
                onChange={handleChange(setProfileForm)}
              />
              <FormField
                label="Website"
                name="website"
                value={profileForm.website}
                onChange={handleChange(setProfileForm)}
                placeholder="https://"
              />
              <FormField
                label="Portfolio Link"
                name="portfolioLink"
                value={profileForm.portfolioLink}
                onChange={handleChange(setProfileForm)}
                placeholder="https://"
              />
              <SubmitRow
                loading={loading}
                onCancel={() => setModal(null)}
                onSave={handleUpdateProfile}
              />
            </div>
          </Modal>
        )}

        {modal === "personal" && (
          <Modal
            title="Edit Personal Information"
            onClose={() => setModal(null)}
          >
            <div className="space-y-4">
              <FormField
                label="Full Name"
                name="fullName"
                value={personalForm.fullName}
                onChange={handleChange(setPersonalForm)}
              />
              <FormField
                label="Email"
                name="email"
                value={personalForm.email}
                onChange={handleChange(setPersonalForm)}
                type="email"
              />
              <FormField
                label="Phone Number"
                name="phoneNumber"
                value={personalForm.phoneNumber}
                onChange={handleChange(setPersonalForm)}
              />
              <FormField
                label="Designation"
                name="designation"
                value={personalForm.designation}
                onChange={handleChange(setPersonalForm)}
              />
              <SubmitRow
                loading={loading}
                onCancel={() => setModal(null)}
                onSave={handleUpdatePersonal}
              />
            </div>
          </Modal>
        )}

        {modal === "address" && (
          <Modal title="Edit Address" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <FormField
                label="Address"
                name="address"
                value={addressForm.address}
                onChange={handleChange(setAddressForm)}
              />
              <FormField
                label="City"
                name="city"
                value={addressForm.city}
                onChange={handleChange(setAddressForm)}
              />
              <FormField
                label="State"
                name="state"
                value={addressForm.state}
                onChange={handleChange(setAddressForm)}
              />
              <FormField
                label="Postal Code"
                name="postalCode"
                value={addressForm.postalCode}
                onChange={handleChange(setAddressForm)}
              />
              <SubmitRow
                loading={loading}
                onCancel={() => setModal(null)}
                onSave={handleUpdateAddress}
              />
            </div>
          </Modal>
        )}

        {modal === "password" && (
          <Modal title="Change Password" onClose={() => setModal(null)}>
            <div className="space-y-4">
              <PasswordField
                label="Current Password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handleChange(setPasswordForm)}
              />
              <PasswordField
                label="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handleChange(setPasswordForm)}
              />
              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handleChange(setPasswordForm)}
              />
              {passwordForm.newPassword &&
                passwordForm.confirmPassword &&
                passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              <SubmitRow
                loading={loading}
                onCancel={() => setModal(null)}
                onSave={handleChangePassword}
                disabled={
                  !passwordForm.oldPassword ||
                  !passwordForm.newPassword ||
                  passwordForm.newPassword !== passwordForm.confirmPassword
                }
              />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function SubmitRow({ loading, onCancel, onSave, disabled = false }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        onClick={onCancel}
        className="px-5 py-2  cursor-pointer rounded-xl text-sm text-gray-500 border border-[#d8d0ee] hover:bg-secondary transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={loading || disabled}
        className="px-5 py-2  cursor-pointer rounded-xl text-sm font-medium bg-primary text-white hover:bg-[#363b62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
