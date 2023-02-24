app.get('/', (req, res) => {
  res.send('Pricing Calculator API');
});

app.get('/birim-fiyatlar', (req, res) => {
  res.sendFile('public/birim-fiyatlar.html', { root: __dirname });
});
