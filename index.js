const server = require('./api/server.js');

server.listen(3000, () => {
  console.log('\n*** Server Running on http://localhost:4000 ***\n');
});