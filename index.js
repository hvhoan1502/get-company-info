const reload = require('reload');
const { app } = require('./src/app');


// Run apps
const PORT = process.env.port || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
reload(app);