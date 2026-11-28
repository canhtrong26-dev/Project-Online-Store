const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Session } = require("../models/index");
const { sendError } = require("../utils/errors");
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

//cấu hình cookie chứa refreshToken
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true, //Js trên trình duyệt không đọc được cookie này
  secure: isProd, //chỉ gửi qua HTTPS khi chạy thật
  sameSite: isProd ? "none" : "lax", //cho phép gửi xuyên tên miền khi chạy thật
  maxAge: 7 * 24 * 60 * 60 * 1000, //sống 7 ngày, tính bằng mili giây
  path: "/api/auth", //chỉ gửi kèm khi gọi các route auth
};

//hai trang dùng chung backend nên phải đặt tên cookie khác nhau, tránh ghi đè
const getCookieName = (req) =>
  req.query.client === "admin" || req.body?.client === "admin"
    ? "adminRefreshToken"
    : "refreshToken";

//nhờ Cloudflare chấm xem người đang đăng nhập là người hay robot
const kiemTraTurnstile = async (token) => {
  //chưa khai khoá bí mật thì bỏ qua, đăng nhập như bình thường
  if (!process.env.TURNSTILE_SECRET_KEY) return true;

  //chưa tích ô xác minh thì chặn luôn, khỏi mất công gọi Cloudflare
  if (!token) return false;

  try {
    //gửi khoá bí mật + token lên Cloudflare nhờ chấm hộ
    const phanHoi = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      },
    );

    const ketQua = await phanHoi.json(); //Cloudflare trả về { success: true/false, ... }
    return ketQua.success === true;
  } catch (error) {
    return false; //mạng lỗi, gọi không tới Cloudflare thì coi như không qua
  }
};

// Đăng ký
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body; //nhận data từ fe

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, "EMAIL_EXISTS");
    }

    //kiểm tra phone đã tồn tại chưa
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return sendError(res, 400, "PHONE_EXISTS");
    }

    //băm password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "customer",
    });

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error(error); // in lỗi thật ở terminal server cho mình xem
    return sendError(res, 500, "SERVER_ERROR"); // khách chỉ thấy câu chung chung, không lộ chi tiết
  }
};

//Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password, turnstileToken } = req.body;

    //chặn robot TRƯỚC khi đụng tới database
    const laNguoiThat = await kiemTraTurnstile(turnstileToken);
    if (!laNguoiThat) {
      return sendError(res, 400, "TURNSTILE_FAILED");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return sendError(res, 400, "INVALID_CREDENTIALS"); //dùng chung mã với sai mật khẩu để không lộ email nào đã đăng ký
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 400, "INVALID_CREDENTIALS"); //trùng mã với email không tồn tại
    }

    // sau khi đáp ứng đủ cấc bước trên thì tạo accessToken
    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, //gồm id và role của user
      process.env.JWT_SECRET, //khoá bí mật của server, dùng chung để ký
      { expiresIn: ACCESS_TOKEN_EXPIRES }, //thời hạn 15 phút
    );

    //rồi đến refreshToken
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES },
    );

    // Lưu refresh token vào DB
    await Session.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    //đặt refreshToken vào cookie httpOnly, KHÔNG trả về trong JSON nữa
    res.cookie(getCookieName(req), refreshToken, cookieOptions);

    res.json({
      message: "Đăng nhập thành công!",
      accessToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

//Cấp accessToken mới, refreshToken lấy từ cookie
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies[getCookieName(req)];
    if (!refreshToken) {
      return sendError(res, 401, "NO_REFRESH_TOKEN");
    }

    const session = await Session.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!session) {
      return sendError(res, 401, "INVALID_REFRESH_TOKEN");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return sendError(res, 401, "INVALID_REFRESH_TOKEN");
      }

      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES },
      );
      res.json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

//đăng xuất
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies[getCookieName(req)]; // lấy token của máy đang bấm đăng xuất
    if (refreshToken)
      await Session.destroy({ where: { refresh_token: refreshToken } }); //có cookie mới xoá, tránh lỗi undefined hieuur

    //xoá cookie, phải trùng path và sameSite với lúc đặt
    res.clearCookie(getCookieName(req), {
      httpOnly: true, //JavaScript không đọc được cookie này
      secure: isProd, //chỉ gửi qua HTTPS khi chạy thật
      sameSite: isProd ? "none" : "lax", //cho gửi xuyên tên miền
      path: "/api/auth",
    });

    res.json({ message: "Đăng xuất thành công!" });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "SERVER_ERROR");
  }
};

module.exports = { register, login, refreshAccessToken, logout };
