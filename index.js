require("./src/app/config");
const server = require("./src/app/server");

server.listen(process.env.PORT);