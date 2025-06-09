const express = require('express');
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const Quote = require('./models/quote');
require('dotenv').config();

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pricingcalc';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı.'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Basit API rotaları
app.get('/', (req, res) => {
  res.send('Pricing Calculator API');
});

app.post('/api/quotes', async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/quotes', async (req, res) => {
  const quotes = await Quote.find().sort({ createdAt: -1 });
  res.json(quotes);
});

// PDF export
app.get('/api/quotes/:id/pdf', async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).send('Quote not found');

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text(`Customer: ${quote.customerName}`);
  doc.text(`Prepared By: ${quote.preparedBy}`);
  doc.moveDown();
  quote.items.forEach((item) => {
    doc.text(`${item.name} x ${item.quantity} = $${item.unitPrice * item.quantity}`);
  });
  doc.end();
});

// Excel export
app.get('/api/quotes/:id/excel', async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) return res.status(404).send('Quote not found');

  const data = [
    ['Customer', quote.customerName],
    ['Prepared By', quote.preparedBy],
    [],
    ['Name', 'Unit Price', 'Quantity', 'Total']
  ];
  quote.items.forEach((item) => {
    data.push([item.name, item.unitPrice, item.quantity, item.unitPrice * item.quantity]);
  });
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quote');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=quote.xlsx');
  res.send(buf);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${port}`);
});
