const products = [
  { name: 'VCore', unitPrice: 1.68 },
  { name: 'Ram', unitPrice: 0.79 },
  { name: 'SSD Disk', unitPrice: 0.09 },
  { name: 'NVME Disk', unitPrice: 0.14 },
  { name: 'Windows Server Lisans Per Core', unitPrice: 7.90 },
  { name: 'Windows Server Rdp Lisans Per User', unitPrice: 2.90 },
  { name: 'Public Ip', unitPrice: 5.00 },
  { name: 'Virtual Network', unitPrice: 1.00 },
  { name: 'Load Balancer', unitPrice: 10.00 },
  { name: 'Point To Site Vpn (SSL Vpn) Per User', unitPrice: 3.00 },
  { name: 'Site To Site Vpn (IPsec)', unitPrice: 15.00 },
  { name: '10-Day Backup Per Vm', unitPrice: 10.00 },
  { name: 'Sql Server Enterprise Lisans Per Core', unitPrice: 273.75 },
  { name: 'Sql Server Standard Lisans Per Core', unitPrice: 73.00 },
  { name: 'Managed Services (SLA)', unitPrice: 0.00 },
  { name: 'Yedekleme Alanı', unitPrice: 0.07 },
  { name: 'Disaster Replication Per Vm', unitPrice: 25.00 },
  { name: 'Disaster Replication Alanı', unitPrice: 0.07 },
  { name: 'Kubernetes Managed Cluster', unitPrice: 38.00 },
  { name: 'S3 Storage', unitPrice: 0.14 },
  { name: 'Suse Linux Enterprise', unitPrice: 192.00 }
];

const itemsBody = document.getElementById('items');
products.forEach((p, idx) => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${p.name}</td>
    <td>$ ${p.unitPrice.toFixed(2)}</td>
    <td><input type="number" min="0" value="0" data-index="${idx}"></td>
  `;
  itemsBody.appendChild(row);
});

function calculateTotal() {
  let total = 0;
  document.querySelectorAll('#items input').forEach((el) => {
    const product = products[el.dataset.index];
    total += Number(el.value) * product.unitPrice;
  });
  document.getElementById('total').innerText = total.toFixed(2);
}

document.querySelectorAll('#items input').forEach((el) => {
  el.addEventListener('input', calculateTotal);
});

document.getElementById('quote-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const quote = {
    customerName: document.getElementById('customer').value,
    preparedBy: document.getElementById('prepared').value,
    items: []
  };
  document.querySelectorAll('#items input').forEach((el) => {
    const qty = Number(el.value);
    if (qty > 0) {
      const p = products[el.dataset.index];
      quote.items.push({ name: p.name, unitPrice: p.unitPrice, quantity: qty });
    }
  });
  const res = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote)
  });
  const saved = await res.json();
  document.getElementById('result').innerHTML = `
    <p>Teklif kaydedildi.</p>
    <a href="/api/quotes/${saved._id}/pdf">PDF</a> |
    <a href="/api/quotes/${saved._id}/excel">Excel</a> |
    <a href="/api/quotes/${saved._id}/word">Word</a>
  `;
});
