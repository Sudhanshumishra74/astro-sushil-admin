export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[#9a9abf] mb-1 block">
        {label} {required && "*"}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl outline-none focus:border-primary"
      />
    </div>
  );
}