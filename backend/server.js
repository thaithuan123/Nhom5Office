const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('API Backend bán điẹn thoại đang chạy!'));
app.listen(process.env.PORT || 3000, () => console.log('Server OK'));