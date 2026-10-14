const csvEscape = (value) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

// Browser-side CSV download shared by every "Export" button — Blob + a
// temporary <a download> link, no server round trip beyond whatever fetched
// the rows themselves. `rows` is an array of arrays already ordered to match
// `headers`.
export function downloadCsv(filename, headers, rows) {
  const lines = [
    headers.join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
