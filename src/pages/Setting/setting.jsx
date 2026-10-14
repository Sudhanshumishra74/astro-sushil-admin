// /* eslint-disable no-unused-vars */
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Store, Phone, Share2, Briefcase, CreditCard, Truck,
//   Package, Tag, ShoppingCart, Bell, Mail, MessageSquare,
//   Key, Settings, FileText, ChevronRight,
//   Save, Upload, Globe,
//   AlertTriangle, CheckCircle,  Percent,
//    Clock, RefreshCw, Eye, EyeOff, Hash,
 
// } from "lucide-react";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaTwitter,
//   FaLinkedin,
//   FaYoutube,
//   FaWhatsapp,
// } from "react-icons/fa";

// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: (i = 0) => ({
//     opacity: 1, y: 0,
//     transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
//   }),
// };
// const socialFields = [
//   { name: "facebook", label: "Facebook", icon: <FaFacebook /> },
//   { name: "instagram", label: "Instagram", icon: <FaInstagram /> },
//   { name: "twitter", label: "Twitter", icon: <FaTwitter /> },
//   { name: "linkedin", label: "LinkedIn", icon: <FaLinkedin /> },
//   { name: "youtube", label: "YouTube", icon: <FaYoutube /> },
//   { name: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
// ];
// const slideIn = {
//   hidden: { opacity: 0, x: -16 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
//   exit:   { opacity: 0, x: 16,  transition: { duration: 0.2 } },
// };


// const NAV = [
//   { id: "branding",       label: "Branding",       icon: Store },
//   { id: "contact",        label: "Contact",         icon: Phone },
//   { id: "social",         label: "Social Links",    icon: Share2 },
//   { id: "business",       label: "Business",        icon: Briefcase },
//   { id: "payment",        label: "Payment",         icon: CreditCard },
//   { id: "shipping",       label: "Shipping",        icon: Truck },
//   { id: "product",        label: "Products",        icon: Package },
//   { id: "offers",         label: "Offers",          icon: Tag },
//   { id: "order",          label: "Orders",          icon: ShoppingCart },
//   { id: "communication",  label: "Communication",   icon: Bell },
//   { id: "smtp",           label: "SMTP Email",      icon: Mail },
//   { id: "sms",            label: "SMS",             icon: MessageSquare },
//   { id: "otp",            label: "OTP",             icon: Key },
//   { id: "system",         label: "System",          icon: Settings },
//   { id: "legal",          label: "Legal",           icon: FileText },
 
// ];

// const Field = ({ label, hint, children }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</label>
//     {children}
//     {hint && <p className="text-xs text-slate-400">{hint}</p>}
//   </div>
// );

// const Input = ({ icon: Icon, type = "text", placeholder, value, onChange, secret }) => {
//   const [show, setShow] = useState(false);
//   return (
//     <div className="relative flex items-center">
//       {Icon && (
//         <span className="absolute left-3.5 text-slate-400 pointer-events-none">
//           <Icon size={14} />
//         </span>
//       )}
//       <input
//         type={secret && !show ? "password" : type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className={[
//           "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-800",
//           "placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2",
//           "focus:ring-indigo-100 transition-all",
//           Icon ? "pl-9 pr-4" : "px-4",
//           secret ? "pr-10" : "",
//         ].join(" ")}
//       />
//       {secret && (
//         <button
//           type="button"
//           onClick={() => setShow(!show)}
//           className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
//         >
//           {show ? <EyeOff size={14} /> : <Eye size={14} />}
//         </button>
//       )}
//     </div>
//   );
// };

// const Textarea = ({ placeholder, value, onChange, rows = 4 }) => (
//   <textarea
//     rows={rows}
//     placeholder={placeholder}
//     value={value}
//     onChange={onChange}
//     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
//   />
// );

// const Toggle = ({ label, description, value, onChange }) => {
//   return (
//     <div className="flex   items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      
//       {/* Left Content */}
//       <div>
//         <p className="text-sm font-medium text-slate-800">{label}</p>
//         {description && (
//           <p className="text-xs text-slate-400 mt-0.5">{description}</p>
//         )}
//       </div>

//       {/* Right Toggle */}
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={() => onChange(!value)}
//           className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
//             value ? "bg-indigo-500" : "bg-gray-200"
//           }`}
//         >
//           <motion.span
//             layout
//             transition={{ type: "spring", stiffness: 500, damping: 30 }}
//             className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
//             animate={{
//               x: value ? 20 : 0,
//             }}
//           />
//         </button>

//         {/* Status Text */}
//         <span className="text-sm text-slate-700">
//           {value ? "Enabled" : "Disabled"}
//         </span>
//       </div>
//     </div>
//   );
// };
// const NumberInput = ({ icon: Icon, placeholder, value, onChange, prefix }) => (
//   <div className="relative flex items-center">
//     {prefix && (
//       <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none select-none">
//         {prefix}
//       </span>
//     )}
//     {Icon && !prefix && (
//       <span className="absolute left-3.5 text-slate-400 pointer-events-none">
//         <Icon size={14} />
//       </span>
//     )}
//     <input
//       type="number"
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className={[
//         "w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm text-slate-800",
//         "placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2",
//         "focus:ring-indigo-100 transition-all",
//         prefix ? "pl-7 pr-4" : Icon ? "pl-9 pr-4" : "px-4",
//       ].join(" ")}
//     />
//   </div>
// );

// const SectionCard = ({ title, description, icon: Icon, children, index = 0 }) => (
//   <motion.div
//     custom={index} variants={fadeUp} initial="hidden" animate="visible"
//     className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
//   >
//     <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
//       <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
//         <Icon size={15} className="text-indigo-500" />
//       </div>
//       <div>
//         <h3 className="text-sm font-bold text-slate-800">{title}</h3>
//         {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
//       </div>
//     </div>
//     <div className="p-6 space-y-5">{children}</div>
//   </motion.div>
// );

// const Grid = ({ cols = 2, children }) => (
//   <div className={`grid gap-5 grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-3" : ""}`}>
//     {children}
//   </div>
// );

// /* ─── Section renderers ─── */
// const BrandingSection = ({ data, set }) => (
//   <>
//     <SectionCard title="Site Identity" description="Brand name, logo, and favicon" icon={Store} index={0}>
//       <Field label="Site Name">
//         <Input icon={Globe} placeholder="My Ecommerce Store" value={data.siteName} onChange={e => set("siteName", e.target.value)} />
//       </Field>
//       <Grid>
//         <Field label="Logo URL" hint="Recommended: 200×60px PNG">
//           <div className="flex gap-2">
//             <Input icon={Upload} placeholder="https://..." value={data.logoUrl} onChange={e => set("logoUrl", e.target.value)} />
//           </div>
//           {data.logoUrl && (
//             <div className="mt-2 h-14 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
//               <img src={data.logoUrl} alt="logo preview" className="max-h-full object-contain" />
//             </div>
//           )}
//         </Field>
//         <Field label="Favicon URL" hint="Recommended: 32×32px ICO / PNG">
//           <Input icon={Upload} placeholder="https://..." value={data.faviconUrl} onChange={e => set("faviconUrl", e.target.value)} />
//           {data.faviconUrl && (
//             <div className="mt-2 h-14 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl">
//               <img src={data.faviconUrl} alt="favicon preview" className="w-8 h-8 object-contain" />
//             </div>
//           )}
//         </Field>
//       </Grid>
//     </SectionCard>
//   </>
// );

// const ContactSection = ({ data, set }) => (
//   <SectionCard title="Contact Information" description="How customers reach you" icon={Phone} index={0}>
//     <Grid>
//       <Field label="Email"><Input icon={Mail} placeholder="hello@store.com" value={data.email} onChange={e => set("email", e.target.value)} /></Field>
//       <Field label="Phone"><Input icon={Phone} placeholder="+91 99999 99999" value={data.phone} onChange={e => set("phone", e.target.value)} /></Field>
//       <Field label="WhatsApp"><Input icon={MessageSquare} placeholder="+91 99999 99999" value={data.whatsapp} onChange={e => set("whatsapp", e.target.value)} /></Field>
//     </Grid>
//     <Field label="Address">
//       <Textarea placeholder="Full address..." value={data.address} onChange={e => set("address", e.target.value)} rows={3} />
//     </Field>
//   </SectionCard>
// );

// const SocialSection = ({ data, set }) => (
//   <SectionCard title="Social Media Links" description="Connect your social profiles" icon={Share2} index={0}>
//     <Grid>
//       <Field label="Facebook"><Input icon={socialFields.facebook} placeholder="https://facebook.com/..." value={data.facebook} onChange={e => set("facebook", e.target.value)} /></Field>
//       <Field label="Instagram"><Input icon={socialFields.instagram} placeholder="https://instagram.com/..." value={data.instagram} onChange={e => set("instagram", e.target.value)} /></Field>
//       {/* <Field label="Twitter / X"><Input icon={Twitter} placeholder="https://twitter.com/..." value={data.twitter} onChange={e => set("twitter", e.target.value)} /></Field>
//       <Field label="YouTube"><Input icon={Youtube} placeholder="https://youtube.com/..." value={data.youtube} onChange={e => set("youtube", e.target.value)} /></Field>
//       <Field label="LinkedIn"><Input icon={Linkedin} placeholder="https://linkedin.com/..." value={data.linkedin} onChange={e => set("linkedin", e.target.value)} /></Field> */}
//     </Grid>
//   </SectionCard>
// );

// const BusinessSection = ({ data, set }) => (
//   <SectionCard title="Business Details" description="Legal and tax registration info" icon={Briefcase} index={0}>
//     <Grid>
//       <Field label="Company Name"><Input icon={Briefcase} placeholder="Acme Pvt. Ltd." value={data.companyName} onChange={e => set("companyName", e.target.value)} /></Field>
//       <Field label="GST Number"><Input icon={Hash} placeholder="22AAAAA0000A1Z5" value={data.gstNumber} onChange={e => set("gstNumber", e.target.value)} /></Field>
//       <Field label="PAN Number"><Input icon={Hash} placeholder="AAAPL1234C" value={data.panNumber} onChange={e => set("panNumber", e.target.value)} /></Field>
//     </Grid>
//   </SectionCard>
// );

// const PaymentSection = ({ data, set }) => (
//   <>
//     <SectionCard title="General Payment" description="Currency, tax and COD settings" icon={CreditCard} index={0}>
//       <Grid>
//         <Field label="Currency">
//           <select value={data.currency} onChange={e => set("currency", e.target.value)}
//             className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all">
//             <option value="INR">INR — Indian Rupee</option>
//             <option value="USD">USD — US Dollar</option>
//             <option value="EUR">EUR — Euro</option>
//           </select>
//         </Field>
//         <Field label="Tax Percent">
//           <NumberInput icon={Percent} placeholder="18" value={data.taxPercent} onChange={e => set("taxPercent", e.target.value)} />
//         </Field>
//       </Grid>
//       <Toggle label="Cash on Delivery (COD)" description="Allow customers to pay on delivery" value={data.codEnabled} onChange={v => set("codEnabled", v)} />
//     </SectionCard>

//     <SectionCard title="Razorpay" description="Indian payment gateway credentials" icon={CreditCard} index={1}>
//       <Grid>
//         <Field label="Razorpay Key ID"><Input icon={Key} placeholder="rzp_live_..." value={data.razorpayKey} onChange={e => set("razorpayKey", e.target.value)} secret /></Field>
//         <Field label="Razorpay Secret"><Input icon={Key} placeholder="Secret key" value={data.razorpaySecret} onChange={e => set("razorpaySecret", e.target.value)} secret /></Field>
//       </Grid>
//     </SectionCard>

//     <SectionCard title="Stripe" description="International payment gateway" icon={CreditCard} index={2}>
//       <Grid>
//         <Field label="Stripe Publishable Key"><Input icon={Key} placeholder="pk_live_..." value={data.stripeKey} onChange={e => set("stripeKey", e.target.value)} secret /></Field>
//         <Field label="Stripe Secret Key"><Input icon={Key} placeholder="sk_live_..." value={data.stripeSecret} onChange={e => set("stripeSecret", e.target.value)} secret /></Field>
//       </Grid>
//     </SectionCard>
//   </>
// );

// const ShippingSection = ({ data, set }) => (
//   <SectionCard title="Shipping & Delivery" description="Rates, thresholds, and service areas" icon={Truck} index={0}>
//     <Grid cols={3}>
//       <Field label="Free Shipping Above" hint="Amount in ₹">
//         <NumberInput prefix="₹" placeholder="1000" value={data.freeShippingThreshold} onChange={e => set("freeShippingThreshold", e.target.value)} />
//       </Field>
//       <Field label="Base Delivery Charge">
//         <NumberInput prefix="₹" placeholder="50" value={data.baseDeliveryCharge} onChange={e => set("baseDeliveryCharge", e.target.value)} />
//       </Field>
//       <Field label="Charge per KM">
//         <NumberInput prefix="₹" placeholder="5" value={data.deliveryChargePerKM} onChange={e => set("deliveryChargePerKM", e.target.value)} />
//       </Field>
//       <Field label="Max COD Limit">
//         <NumberInput prefix="₹" placeholder="20000" value={data.maxCODLimit} onChange={e => set("maxCODLimit", e.target.value)} />
//       </Field>
//     </Grid>
//     <Field label="Supported Areas" hint="Comma-separated list of pincodes or city names">
//       <Textarea
//         placeholder="110001, 110002, Mumbai, Delhi..."
//         value={(data.supportedAreas || []).join(", ")}
//         onChange={e => set("supportedAreas", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
//         rows={3}
//       />
//     </Field>
//   </SectionCard>
// );

// const ProductSection = ({ data, set }) => (
//   <SectionCard title="Product Settings" description="Stock, cart and purchase rules" icon={Package} index={0}>
//     <Grid>
//       <Field label="Low Stock Warning" hint="Alert when stock falls below this number">
//         <NumberInput icon={AlertTriangle} placeholder="5" value={data.lowStockWarning} onChange={e => set("lowStockWarning", e.target.value)} />
//       </Field>
//       <Field label="Max Qty in Cart" hint="Per-product cart limit">
//         <NumberInput icon={ShoppingCart} placeholder="10" value={data.maxQuantityInCart} onChange={e => set("maxQuantityInCart", e.target.value)} />
//       </Field>
//     </Grid>
//     <Toggle label="Allow Out-of-Stock Purchase" description="Let customers order even when stock is 0" value={data.allowOutOfStockPurchase} onChange={v => set("allowOutOfStockPurchase", v)} />
//   </SectionCard>
// );

// const OffersSection = ({ data, set }) => (
//   <SectionCard title="Offers & Promotions" description="Referrals, coupons, and flash sales" icon={Tag} index={0}>
//     <Field label="Referral Reward Percent">
//       <NumberInput icon={Percent} placeholder="5" value={data.referralRewardPercent} onChange={e => set("referralRewardPercent", e.target.value)} />
//     </Field>
//     <Toggle label="Enable Coupons" description="Allow coupon codes at checkout" value={data.enableCoupons} onChange={v => set("enableCoupons", v)} />
//     <Toggle label="Flash Sale Mode" description="Activate site-wide flash sale banner" value={data.flashSaleEnabled} onChange={v => set("flashSaleEnabled", v)} />
//   </SectionCard>
// );

// const OrderSection = ({ data, set }) => (
//   <SectionCard title="Order Management" description="Auto-cancel, returns and limits" icon={ShoppingCart} index={0}>
//     <Grid>
//       <Field label="Auto-cancel Unpaid Orders" hint="Minutes before auto-cancellation">
//         <NumberInput icon={Clock} placeholder="60" value={data.autoCancelUnpaidMinutes} onChange={e => set("autoCancelUnpaidMinutes", e.target.value)} />
//       </Field>
//       <Field label="Return Policy Days">
//         <NumberInput icon={RefreshCw} placeholder="7" value={data.returnPolicyDays} onChange={e => set("returnPolicyDays", e.target.value)} />
//       </Field>
//       <Field label="Max Order Value">
//         <NumberInput prefix="₹" placeholder="100000" value={data.maxOrderValue} onChange={e => set("maxOrderValue", e.target.value)} />
//       </Field>
//     </Grid>
//   </SectionCard>
// );

// const CommunicationSection = ({ data, set }) => (
//   <SectionCard title="Notifications" description="Order alerts via email, SMS and push" icon={Bell} index={0}>
//     <Toggle label="Order Email Notifications" description="Send email updates for every order status change" value={data.enableOrderEmails} onChange={v => set("enableOrderEmails", v)} />
//     <Toggle label="Order SMS Notifications" description="Send SMS updates to customers" value={data.enableOrderSMS} onChange={v => set("enableOrderSMS", v)} />
//     <Toggle label="Push Notifications" description="Enable browser / app push notifications" value={data.enablePushNotifications} onChange={v => set("enablePushNotifications", v)} />
//   </SectionCard>
// );

// const SmtpSection = ({ data, set }) => (
//   <SectionCard title="SMTP Configuration" description="Outgoing email server settings" icon={Mail} index={0}>
//     <Grid>
//       <Field label="SMTP Host"><Input icon={Globe} placeholder="smtp.gmail.com" value={data.host} onChange={e => set("host", e.target.value)} /></Field>
//       <Field label="Port"><NumberInput icon={Hash} placeholder="587" value={data.port} onChange={e => set("port", e.target.value)} /></Field>
//       <Field label="Username"><Input icon={Mail} placeholder="you@gmail.com" value={data.username} onChange={e => set("username", e.target.value)} /></Field>
//       <Field label="Password"><Input icon={Key} placeholder="App password" value={data.password} onChange={e => set("password", e.target.value)} secret /></Field>
//       <Field label="From Email"><Input icon={Mail} placeholder="noreply@store.com" value={data.fromEmail} onChange={e => set("fromEmail", e.target.value)} /></Field>
//     </Grid>
//     <Toggle label="Use SSL / TLS (Secure)" description="Enable for port 465" value={data.secure} onChange={v => set("secure", v)} />
//   </SectionCard>
// );

// const SmsSection = ({ data, set }) => (
//   <SectionCard title="SMS Gateway" description="Provider credentials for SMS alerts" icon={MessageSquare} index={0}>
//     <Grid>
//       <Field label="Provider"><Input icon={MessageSquare} placeholder="Twilio / MSG91 / etc." value={data.provider} onChange={e => set("provider", e.target.value)} /></Field>
//       <Field label="API Key"><Input icon={Key} placeholder="API key" value={data.apiKey} onChange={e => set("apiKey", e.target.value)} secret /></Field>
//       <Field label="Sender ID"><Input icon={Hash} placeholder="MYSTORE" value={data.senderId} onChange={e => set("senderId", e.target.value)} /></Field>
//     </Grid>
//   </SectionCard>
// );

// const OtpSection = ({ data, set }) => (
//   <SectionCard title="OTP Settings" description="One-time password expiry and resend rules" icon={Key} index={0}>
//     <Grid>
//       <Field label="OTP Expiry (minutes)">
//         <NumberInput icon={Clock} placeholder="5" value={data.expiryMinutes} onChange={e => set("expiryMinutes", e.target.value)} />
//       </Field>
//       <Field label="Resend Timeout (seconds)">
//         <NumberInput icon={RefreshCw} placeholder="30" value={data.resendTimeoutSec} onChange={e => set("resendTimeoutSec", e.target.value)} />
//       </Field>
//     </Grid>
//   </SectionCard>
// );

// const SystemSection = ({ data, set }) => (
//   <SectionCard title="System Controls" description="Maintenance mode and registrations" icon={Settings} index={0}>
//     <Toggle label="Maintenance Mode" description="Shows a maintenance page to all visitors" value={data.maintenanceMode} onChange={v => set("maintenanceMode", v)} />
   
//   </SectionCard>
// );

// const LegalSection = ({ data, set }) => (
//   <SectionCard title="Legal Documents" description="Policy content shown to customers" icon={FileText} index={0}>
//     <Field label="Privacy Policy"><Textarea placeholder="Your privacy policy text..." value={data.privacyPolicy} onChange={e => set("privacyPolicy", e.target.value)} rows={6} /></Field>
//     <Field label="Terms & Conditions"><Textarea placeholder="Your terms and conditions..." value={data.termsConditions} onChange={e => set("termsConditions", e.target.value)} rows={6} /></Field>
//     <Field label="Return Policy Text"><Textarea placeholder="Your return policy details..." value={data.returnPolicyText} onChange={e => set("returnPolicyText", e.target.value)} rows={4} /></Field>
//   </SectionCard>
// );


// /* ─── Initial state ─── */
// const INITIAL = {
//   branding:      { siteName: "", logoUrl: "", faviconUrl: "" },
//   contact:       { email: "", phone: "", whatsapp: "", address: "" },
//   social:        { facebook: "", instagram: "", twitter: "", youtube: "", linkedin: "" },
//   business:      { companyName: "", gstNumber: "", panNumber: "" },
//   payment:       { currency: "INR", taxPercent: 0, codEnabled: true, razorpayKey: "", razorpaySecret: "", stripeKey: "", stripeSecret: "" },
//   shipping:      { freeShippingThreshold: 1000, baseDeliveryCharge: 50, deliveryChargePerKM: 5, maxCODLimit: 20000, supportedAreas: [] },
//   product:       { lowStockWarning: 5, maxQuantityInCart: 10, allowOutOfStockPurchase: false },
//   offers:        { referralRewardPercent: 0, enableCoupons: true, flashSaleEnabled: false },
//   order:         { autoCancelUnpaidMinutes: 60, returnPolicyDays: 7, maxOrderValue: 100000 },
//   communication: { enableOrderEmails: true, enableOrderSMS: true, enablePushNotifications: false },
//   smtp:          { host: "", port: 587, secure: false, username: "", password: "", fromEmail: "" },
//   sms:           { provider: "", apiKey: "", senderId: "" },
//   otp:           { expiryMinutes: 5, resendTimeoutSec: 30 },
//   system:        { maintenanceMode: false, enableRegistration: true },
//   legal:         { privacyPolicy: "", termsConditions: "", returnPolicyText: "" },
//   pages:         { aboutUs: { heading: "", subHeading: "", description: "" } },
// };

// /* ─── Main Page ─── */
// export default function SettingsPanel() {
//   const [active, setActive]   = useState("branding");
//   const [settings, setSettings] = useState(INITIAL);
//   const [saved, setSaved]     = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* nested setter: "payment.taxPercent" → updates settings.payment.taxPercent */
//   const set = (section) => (keyOrPath, value) => {
//     setSettings(prev => {
//       const clone = { ...prev, [section]: { ...prev[section] } };
//       const parts = keyOrPath.split(".");
//       if (parts.length === 1) {
//         clone[section][keyOrPath] = value;
//       } else {
//         clone[section][parts[0]] = { ...clone[section][parts[0]], [parts[1]]: value };
//       }
//       return clone;
//     });
//   };

//   const handleSave = () => {
//     // TODO: dispatch to store / API
//     console.log("Saving settings:", settings);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const activeNav = NAV.find(n => n.id === active);

//   const renderContent = () => {
//     const s = settings;
//     switch (active) {
//       case "branding":      return <BrandingSection      data={s.branding}      set={set("branding")} />;
//       case "contact":       return <ContactSection       data={s.contact}       set={set("contact")} />;
//       case "social":        return <SocialSection        data={s.social}        set={set("social")} />;
//       case "business":      return <BusinessSection      data={s.business}      set={set("business")} />;
//       case "payment":       return <PaymentSection       data={s.payment}       set={set("payment")} />;
//       case "shipping":      return <ShippingSection      data={s.shipping}      set={set("shipping")} />;
//       case "product":       return <ProductSection       data={s.product}       set={set("product")} />;
//       case "offers":        return <OffersSection        data={s.offers}        set={set("offers")} />;
//       case "order":         return <OrderSection         data={s.order}         set={set("order")} />;
//       case "communication": return <CommunicationSection data={s.communication} set={set("communication")} />;
//       case "smtp":          return <SmtpSection          data={s.smtp}          set={set("smtp")} />;
//       case "sms":           return <SmsSection           data={s.sms}           set={set("sms")} />;
//       case "otp":           return <OtpSection           data={s.otp}           set={set("otp")} />;
//       case "system":        return <SystemSection        data={s.system}        set={set("system")} />;
//       case "legal":         return <LegalSection         data={s.legal}         set={set("legal")} />;
    
//       default:              return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 ">

     
//       <motion.header
//         initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//         className=" z-30 bg-white border-b border-slate-200 shadow-sm"
//       >
//         <div className=" mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             {/* Mobile hamburger */}
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
//             >
//               <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
//               </svg>
//             </button>
//             <div className="flex items-center gap-2.5">
//               <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
//                 <Settings size={15} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-sm font-extrabold text-slate-900 leading-none">Site Settings</h1>
//                 <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Manage your store configuration</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <AnimatePresence>
//               {saved && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
//                   className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5"
//                 >
//                   <CheckCircle size={13} /> Saved!
//                 </motion.div>
//               )}
//             </AnimatePresence>
//             <motion.button
//               whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//               onClick={handleSave}
//               className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
//             >
//               <Save size={14} />
//               <span className="hidden sm:inline">Save Changes</span>
//               <span className="sm:hidden">Save</span>
//             </motion.button>
//           </div>
//         </div>
//       </motion.header>

//       <div className=" mx-auto px-4 sm:px-6 py-6 flex gap-6">

//         {/* ── Sidebar (desktop) ── */}
//         <motion.aside
//           initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//           className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24 self-start"
//         >
//           {NAV.map((item) => {
//             const Icon = item.icon;
//             const isActive = active === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActive(item.id)}
//                 className={[
//                   "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full",
//                   isActive
//                     ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
//                     : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm",
//                 ].join(" ")}
//               >
//                 <Icon size={15} className={isActive ? "text-white" : "text-slate-400"} />
//                 {item.label}
//                 {isActive && <ChevronRight size={13} className="ml-auto text-indigo-200" />}
//               </button>
//             );
//           })}
//         </motion.aside>

//         {/* ── Mobile Sidebar Overlay ── */}
//         <AnimatePresence>
//           {sidebarOpen && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/30 z-40 lg:hidden"
//                 onClick={() => setSidebarOpen(false)}
//               />
//               <motion.div
//                 initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
//                 transition={{ type: "spring", damping: 28, stiffness: 260 }}
//                 className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl p-4 flex flex-col gap-1 overflow-y-auto"
//               >
//                 <div className="flex items-center gap-2 mb-4 px-2">
//                   <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
//                     <Settings size={13} className="text-white" />
//                   </div>
//                   <span className="text-sm font-bold text-slate-900">Settings</span>
//                 </div>
//                 {NAV.map((item) => {
//                   const Icon = item.icon;
//                   const isActive = active === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => { setActive(item.id); setSidebarOpen(false); }}
//                       className={[
//                         "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
//                         isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50",
//                       ].join(" ")}
//                     >
//                       <Icon size={15} className={isActive ? "text-white" : "text-slate-400"} />
//                       {item.label}
//                     </button>
//                   );
//                 })}
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>

//         {/* ── Content Area ── */}
//         <div className="flex-1 min-w-0">
//           {/* Section breadcrumb */}
//           <motion.div
//             key={active}
//             initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="flex items-center gap-2 mb-5"
//           >
//             <span className="text-xs text-slate-400 font-medium">Settings</span>
//             <ChevronRight size={12} className="text-slate-300" />
//             <span className="text-xs font-bold text-indigo-600">{activeNav?.label}</span>
//           </motion.div>

//           {/* Section panels */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={active}
//               variants={slideIn} initial="hidden" animate="visible" exit="exit"
//               className="flex flex-col gap-5"
//             >
//               {renderContent()}
//             </motion.div>
//           </AnimatePresence>

//           {/* Bottom Save */}
//           <div className="mt-8 flex justify-end">
//             <motion.button
//               whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
//               onClick={handleSave}
//               className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
//             >
//               <Save size={15} /> Save Changes
//             </motion.button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }