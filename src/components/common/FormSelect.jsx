export default function FormSelect({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[#9a9abf] mb-1 block">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 text-sm bg-secondary border border-[#d8d0ee] rounded-xl"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}