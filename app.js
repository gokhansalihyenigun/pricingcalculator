const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('<your_mongodb_connection_string>', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı.'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

app.listen(3000, () => {
  console.log('Sunucu çalışıyor: http://localhost:3000');
});
