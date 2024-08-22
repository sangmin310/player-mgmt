const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mysql = require("mysql");

const app = express();
const port = process.env.PORT || 5000;

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 데이터베이스 설정
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});

connection.connect((err) => {
  if (err) {
    console.error("데이터베이스 연결 중 오류가 발생했습니다:", err);
    return;
  }
  console.log("데이터베이스에 연결되었습니다.");
});

// 파일 업로드 설정
const upload = multer({ dest: "./upload" });

// 사용자 등록 (회원가입) API
app.post("/api/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화

    let sql =
      "INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, now())";
    let params = [username, hashedPassword, email];

    connection.query(sql, params, (err, rows, fields) => {
      if (err) {
        console.error("회원가입 중 오류가 발생했습니다:", err);
        return res.status(500).send("회원가입 중 오류가 발생했습니다.");
      }
      res.status(201).send({ message: "회원가입이 완료되었습니다." });
    });
  } catch (error) {
    console.error("회원가입 요청 처리 중 오류가 발생했습니다:", error);
    res.status(500).send("회원가입 요청 처리 중 오류가 발생했습니다.");
  }
});

// 사용자 로그인 API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  let sql = "SELECT * FROM users WHERE username = ?";
  connection.query(sql, [username], async (err, rows, fields) => {
    if (err) {
      console.error("로그인 처리 중 오류가 발생했습니다:", err);
      return res.status(500).send("로그인 처리 중 오류가 발생했습니다.");
    }

    if (rows.length === 0) {
      return res.status(401).send("로그인 정보가 올바르지 않습니다.");
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send("로그인 정보가 올바르지 않습니다.");
    }

    const secretKey = process.env.JWT_SECRET_KEY || "your_jwt_secret_key";
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secretKey,
      { expiresIn: "1h" }
    );

    res.send({ message: "로그인 성공", token });
  });
});

// 고객 목록 조회 API
app.get("/api/customers", (req, res) => {
  let sql = "SELECT * FROM CUSTOMER WHERE isDeleted = 0";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.error("고객 목록 조회 중 오류가 발생했습니다:", err);
      return res.status(500).send("고객 목록 조회 중 오류가 발생했습니다.");
    }
    res.send(rows);
  });
});

// 프로필 이미지 제공
app.use("/image", express.static("./upload"));

// 고객 추가 API
app.post("/api/customers", upload.single("image"), (req, res) => {
  let sql =
    "INSERT INTO CUSTOMER (image, name, birthday, gender, position, number, createdate, isDeleted) VALUES (?, ?, ?, ?, ?, ?, now(), 0)";
  let image = "/image/" + req.file.filename;
  let { name, birthday, gender, position, number } = req.body;
  let params = [image, name, birthday, gender, position, number];

  connection.query(sql, params, (err, rows, fields) => {
    if (err) {
      console.error("고객 추가 중 오류가 발생했습니다:", err);
      return res.status(500).send("고객 추가 중 오류가 발생했습니다.");
    }
    res.send(rows);
  });
});

// 고객 삭제 API (소프트 삭제)
app.delete("/api/customers/:id", (req, res) => {
  let sql = "UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ?";
  let params = [req.params.id];

  connection.query(sql, params, (err, rows, fields) => {
    if (err) {
      console.error("고객 삭제 중 오류가 발생했습니다:", err);
      return res.status(500).send("고객 삭제 중 오류가 발생했습니다.");
    }
    res.send(rows);
  });
});

// 서버 시작
app.listen(port, () => console.log(`Listening on port ${port}`));
