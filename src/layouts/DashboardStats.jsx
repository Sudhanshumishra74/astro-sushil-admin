export default function DashboardStats() {
  const stats = [
    { title: "Total Users", value: "1,240" },
    { title: "Revenue", value: "₹45,000" },
    { title: "Orders", value: "320" },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-heading text-primary">{item.title}</h3>
          <p className="text-2xl mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
}