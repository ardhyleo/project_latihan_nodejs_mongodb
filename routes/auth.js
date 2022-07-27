const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");

// route ini dapat diakses melalui URL : http://localhost:3000/api/auth
// buat sebuah proses autentikasi dengan jwt di sini
// GUNAKAN LIBRARY jsonwebtoken
// untuk dokumentasi jsonwebtoken kunjungi : https://www.npmjs.com/package/jsonwebtoken

// route login
// kirimkan data berupa username dan password
authRouter.post("/", (req, res) => {
  const payload = req.body;
  // const token = jwt.sign ...
  // set expiresIn: '1h' agar token expired dalam waktu 1 jam
  const token = jwt.sign(
    {
      data: payload,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  //   kirim token dan gunakan token yang diterima oleh respon
  res.json({
    message: "success",
    token,
  });
});

module.exports = authRouter;
