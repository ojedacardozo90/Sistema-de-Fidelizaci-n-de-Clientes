export default function Input({ label, value, onChange, type = "text", name }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium text-darkGray">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-midGray rounded px-3 py-2 focus:outline-primary"
      />
    </div>
  );
}
