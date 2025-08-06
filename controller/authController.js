const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../users/fakeUsers");

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const register = async (req, res) => {
  const { username, password, role } = req.body;

  const existing = users.find((u) => u.username === username);
  if (existing) {
    return res.status(400).json({ message: "User sudah terdaftar" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, role: role || "user" });
  res.status(201).json({ message: "Registrasi berhasil" });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!users) {
    return res.status(401).json({ message: "User tidak ditemukan" });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Password salah" });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, {
    expiresIn: EXPIRES_IN,
  });
  res.json({ message: "Login berhasil", token });
};

const getProfile = (req, res) => {
  res.json({ message: `Halo, ${req.user.username}` });
};

const getAllUsers = (req, res) => {
  res.status(200).json({ data: users });
};

const onlyAdmin = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Hanya admin yang boleh akses" });
  }

  res.json({ message: `Halo admin ${req.user.username}` });
};

module.exports = { register, login, getProfile, getAllUsers, onlyAdmin };

