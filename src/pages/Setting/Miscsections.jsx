
import { useState } from "react";
import { Briefcase, Hash } from "lucide-react";
import { useSettingStore } from "../../store/useSettingStore";
import { Field, Input, SectionCard, Grid, SaveBar } from "./Settingsui";

export function BusinessSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.business || { companyName: "", gstNumber: "", panNumber: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("business", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Business Details" description="Legal and tax registration info" icon={Briefcase}>
      <Grid>
        <Field label="Company Name">
          <Input icon={Briefcase} placeholder="Acme Pvt. Ltd." value={data.companyName} onChange={(e) => set("companyName", e.target.value)} />
        </Field>
        <Field label="GST Number">
          <Input icon={Hash} placeholder="22AAAAA0000A1Z5" value={data.gstNumber} onChange={(e) => set("gstNumber", e.target.value)} />
        </Field>
        <Field label="PAN Number">
          <Input icon={Hash} placeholder="AAAPL1234C" value={data.panNumber} onChange={(e) => set("panNumber", e.target.value)} />
        </Field>
      </Grid>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}

// ─── Payment Section ──────────────────────────────────────────────────────────
import { CreditCard, Key, Percent } from "lucide-react";
import { Select, NumberInput, Toggle } from "./Settingsui";

export function PaymentSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.payment || { currency: "INR", taxPercent: 0, codEnabled: true, razorpayKey: "", razorpaySecret: "", stripeKey: "", stripeSecret: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("payment", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="General Payment" description="Currency, tax and COD settings" icon={CreditCard} index={0}>
        <Grid>
          {/* <Field label="Currency">
            <Select value={data.currency} onChange={(e) => set("currency", e.target.value)}>
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </Select>
          </Field> */}
          <Field label="Tax Percent">
            <NumberInput icon={Percent} placeholder="18" value={data.taxPercent} onChange={(e) => set("taxPercent", e.target.value)} />
          </Field>
        </Grid>
        <Toggle label="Cash on Delivery (COD)" description="Allow customers to pay on delivery" value={data.codEnabled} onChange={(v) => set("codEnabled", v)} />
        <SaveBar onSave={handleSave} loading={loading} saved={saved} />
      </SectionCard>

      <SectionCard title="Razorpay" description="Indian payment gateway credentials" icon={CreditCard} index={1}>
        <Grid>
          <Field label="Razorpay Key ID">
            <Input icon={Key} placeholder="rzp_live_..." value={data.razorpayKey} onChange={(e) => set("razorpayKey", e.target.value)} secret />
          </Field>
          <Field label="Razorpay Secret">
            <Input icon={Key} placeholder="Secret key" value={data.razorpaySecret} onChange={(e) => set("razorpaySecret", e.target.value)} secret />
          </Field>
        </Grid>
      </SectionCard>

      <SectionCard title="Stripe" description="International payment gateway" icon={CreditCard} index={2}>
        <Grid>
          <Field label="Stripe Publishable Key">
            <Input icon={Key} placeholder="pk_live_..." value={data.stripeKey} onChange={(e) => set("stripeKey", e.target.value)} secret />
          </Field>
          <Field label="Stripe Secret Key">
            <Input icon={Key} placeholder="sk_live_..." value={data.stripeSecret} onChange={(e) => set("stripeSecret", e.target.value)} secret />
          </Field>
        </Grid>
      </SectionCard>
    </div>
  );
}

// ─── Shipping Section ─────────────────────────────────────────────────────────
import { Truck } from "lucide-react";

export function ShippingSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.shipping || { freeShippingThreshold: 1000, baseDeliveryCharge: 50, deliveryChargePerKM: 5, maxCODLimit: 20000, supportedAreas: [] });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("shipping", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Shipping & Delivery" description="Rates, thresholds, and service areas" icon={Truck}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Free Shipping Above" hint="Amount in ₹">
          <NumberInput prefix="₹" placeholder="1000" value={data.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", e.target.value)} />
        </Field>
        <Field label="Base Delivery Charge">
          <NumberInput prefix="₹" placeholder="50" value={data.baseDeliveryCharge} onChange={(e) => set("baseDeliveryCharge", e.target.value)} />
        </Field>
        {/* <Field label="Charge per KM">
          <NumberInput prefix="₹" placeholder="5" value={data.deliveryChargePerKM} onChange={(e) => set("deliveryChargePerKM", e.target.value)} />
        </Field> */}
        {/* <Field label="Max COD Limit">
          <NumberInput prefix="₹" placeholder="20000" value={data.maxCODLimit} onChange={(e) => set("maxCODLimit", e.target.value)} />
        </Field> */}
      </div>
      <Field label="Supported Areas" hint="Comma-separated list of pincodes or city names">
        <textarea
          rows={3}
          placeholder="110001, 110002, Mumbai, Delhi..."
          value={(data.supportedAreas || []).join(", ")}
          onChange={(e) => set("supportedAreas", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="w-full bg-secondary border border-[#d8d0ee] rounded-xl px-4 py-3 text-sm text-black placeholder-[#b0a8c8] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
        />
      </Field>
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}

// ─── Product Section ──────────────────────────────────────────────────────────
import { Package, AlertTriangle, ShoppingCart } from "lucide-react";

export function ProductSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.product || { lowStockWarning: 5, maxQuantityInCart: 10, allowOutOfStockPurchase: false });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("product", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Product Settings" description="Stock, cart and purchase rules" icon={Package}>
      <Grid>
        <Field label="Low Stock Warning" hint="Alert when stock falls below this number">
          <NumberInput icon={AlertTriangle} placeholder="5" value={data.lowStockWarning} onChange={(e) => set("lowStockWarning", e.target.value)} />
        </Field>
        <Field label="Max Qty in Cart" hint="Per-product cart limit">
          <NumberInput icon={ShoppingCart} placeholder="10" value={data.maxQuantityInCart} onChange={(e) => set("maxQuantityInCart", e.target.value)} />
        </Field>
      </Grid>
     
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}

// ─── Offers Section ───────────────────────────────────────────────────────────
import { Tag } from "lucide-react";

export function OffersSection() {
  const { settings, updateSection, loading } = useSettingStore();
  const [data, setData] = useState(() => settings?.offers || { referralRewardPercent: 0, enableCoupons: true, flashSaleEnabled: false });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const ok = await updateSection("offers", data);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <SectionCard title="Offers & Promotions" description="Referrals, coupons, and flash sales" icon={Tag}>
      <Field label="Referral Reward Percent">
        <NumberInput icon={Percent} placeholder="5" value={data.referralRewardPercent} onChange={(e) => set("referralRewardPercent", e.target.value)} />
      </Field>
      <Toggle label="Enable Coupons" description="Allow coupon codes at checkout" value={data.enableCoupons} onChange={(v) => set("enableCoupons", v)} />
      <Toggle label="Flash Sale Mode" description="Activate site-wide flash sale banner" value={data.flashSaleEnabled} onChange={(v) => set("flashSaleEnabled", v)} />
      <SaveBar onSave={handleSave} loading={loading} saved={saved} />
    </SectionCard>
  );
}

// ─── Order Section ────────────────────────────────────────────────────────────
// import { Clock, RefreshCw } from "lucide-react";

// export function OrderSection() {
//   const { settings, updateSection, loading } = useSettingStore();
//   const [data, setData] = useState(() => settings?.order || { autoCancelUnpaidMinutes: 60, returnPolicyDays: 7, maxOrderValue: 100000 });
//   const [saved, setSaved] = useState(false);
//   const set = (k, v) => setData((p) => ({ ...p, [k]: v }));

//   const handleSave = async () => {
//     const ok = await updateSection("order", data);
//     if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
//   };

//   return (
//     <SectionCard title="Order Management" description="Auto-cancel, returns and limits" icon={ShoppingCart}>
//       <Grid cols={3}>
//         <Field label="Auto-cancel Unpaid Orders" hint="Minutes before auto-cancellation">
//           <NumberInput icon={Clock} placeholder="60" value={data.autoCancelUnpaidMinutes} onChange={(e) => set("autoCancelUnpaidMinutes", e.target.value)} />
//         </Field>
//         <Field label="Return Policy Days">
//           <NumberInput icon={RefreshCw} placeholder="7" value={data.returnPolicyDays} onChange={(e) => set("returnPolicyDays", e.target.value)} />
//         </Field>
//         <Field label="Max Order Value">
//           <NumberInput prefix="₹" placeholder="100000" value={data.maxOrderValue} onChange={(e) => set("maxOrderValue", e.target.value)} />
//         </Field>
//       </Grid>
//       <SaveBar onSave={handleSave} loading={loading} saved={saved} />
//     </SectionCard>
//   );
// }