const redirect = (req, res, path) => {
  response.writeHead(302, {
    'Location': `${process.env.HOST}:${process.env.PORT}/user`
    // TODO: Add other headers here...
  });
  response.end();
}

module.exports = {
  redirect,
};