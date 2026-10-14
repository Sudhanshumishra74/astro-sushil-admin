import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../../styles/admin-phone-input.css";

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;

/**
 * @param {string} value - phone number with country code (e.g. "911234567890")
 * @param {(value: string) => void} onChange - called with the raw phone string
 * @param {string} [placeholder]
 * @param {"default"|"white"} [variant] - "white" for modal inputs with bg-white
 */
export default function AdminPhoneInput({
  value,
  onChange,
  placeholder = "Phone number",
  variant = "default",
}) {
  return (
    <div className={`admin-phone-input${variant === "white" ? " white" : ""}`}>
      <PhoneInput
        country="in"
        value={value}
        onChange={(val) => onChange(val ? "+" + val : "")}
        placeholder={placeholder}
        enableSearch
        searchPlaceholder="Search country..."
        disableSearchIcon
        preferredCountries={["in", "us", "gb", "ae", "au", "ca"]}
      />
    </div>
  );
}
