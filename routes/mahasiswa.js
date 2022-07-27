const jwt = require("jsonwebtoken");
// gunakan model mahasiswa yang sudah dibuat untuk mengelola database
const Mahasiwa = require("../models/mahasiswa");
const mahasiswaRouter = require("express").Router();

// route ini dapat diakses melalui URL : http://localhost:3000/api/mahasiswa
// GUNAKAN KEYWORD async/await UNTUK MENGGUNAKAN MODEL
// TAMPILKAN JSON KE PENGGUNA

// KODE INI SEBAGAI MIDDLEWARE UNTUK MENGECEK APAKAH PENGGUNA TERAUTENTIKASI JWT
// SILAHKAN DIFAHAMI DAN JANGAN LUPA DIPRAKTEKKAN
function verifyUser(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    res.status(403);
    res.json({ message: "Anda belum terautentikasi" });
  }
}
function jwtVerify(token, res) {
  jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
    if (err) {
      res.status(403);
      res.json({
        error: err,
        message: "Anda belum terautentikasi",
      });
      res.end();
    }
  });
}

// TAMPILKAN SEMUA DATA MAHASISWA
mahasiswaRouter.get("/", verifyUser, async (req, res, next) => {
  jwtVerify(req.token, res);

  const response = await Mahasiwa.find({});
  res.json({
    message: "semua data ditemukan",
    data: response,
  });
});

// TAMPILKAN DATA MAHASIWA BERDASARKAN ID
mahasiswaRouter.get("/(:id)", verifyUser, async (req, res) => {
  jwtVerify(req.token, res);
  const id = req.params.id;
  // lanjutkan
  const responseMahasiswa = await Mahasiwa.findById(id);
  res.json(responseMahasiswa);
});

// TAMBAH DATA MAHASISWA
mahasiswaRouter.post("/", verifyUser, async (req, res) => {
  jwtVerify(req.token, res);
  // lanjutkan
  const mahasiswaPost = new Mahasiwa({
    nama: req.body.nama,
    nim: req.body.nim,
    email: req.body.email,
    alamat: req.body.alamat,
    tahunMasuk: req.body.tahunMasuk,
    tanggalLahir: req.body.tanggalLahir,
  });

  try {
    const mahasiswaData = await mahasiswaPost.save();
    res.json(mahasiswaData);
  } catch (err) {
    res.json({ message: err });
  }
});

// UBAH DATA MAHASISWA
mahasiswaRouter.put("/(:id)", verifyUser, async (req, res) => {
  jwtVerify(req.token, res);
  const id = req.params.id;
  // lanjutkan
  try {
    const ubahMahasiswaData = await Mahasiwa.updateOne({ id: id }, { nama: req.body.nama, nim: req.body.nim, email: req.body.email, alamat: req.body.alamat, tahunMasuk: req.body.tahunMasuk, tanggalLahir: req.body.tanggalLahir });
    res.json(ubahMahasiswaData);
  } catch (err) {
    res.json({ message: err });
  }
});

// HAPUS DATA MAHASISWA
mahasiswaRouter.delete("/(:id)", verifyUser, async (req, res) => {
  jwtVerify(req.token, res);
  const id = req.params.id;
  try {
    const hapusMahasiswaData = await Mahasiwa.deleteOne({ id: id });
    res.json(hapusMahasiswaData);
  } catch (err) {
    res.json({ message: err });
  }
});
// lanjutkan
// TAMBAHAN: buat sendiri sebuah route untuk mencari data mahasiswa berdasarkan `keyword` yang diketikkan pengguna
// keyword yang dicari adalah `nama`
// boleh gunakan method `get` atau `post`
mahasiswaRouter.get("/search", verifyUser, async (req, res) => {
  jwtVerify(req.token, res);
  const keyword = req.body.keyword;
  const id = req.params.id;
  // lanjutkan
  try {
    const dataMahasiswaData = await Mahasiwa.findOne({ id: id }, { nama: req.body.nama }, keyword);
    res.json(dataMahasiswaData);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = mahasiswaRouter;
