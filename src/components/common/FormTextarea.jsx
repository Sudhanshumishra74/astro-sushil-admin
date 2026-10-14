export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[#9a9abf] mb-1 block">
        {label}
      </label>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl"
      />
    </div>
  );
}