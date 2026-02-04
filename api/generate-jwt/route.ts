import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// 从 Vercel 环境变量中读取你的 Coze 信息
const SIGNING_KEY = process.env.COZE_PRIVATE_KEY || '';
const ISS = process.env.COZE_APP_ID || '';
const KID = process.env.COZE_KID || '';

export async function POST(request: Request) {
  try {
    // 从前端获取匿名 UID
    const { sessionName } = await request.json();

    // 构建 JWT Payload
    const payload = {
      iss: ISS,
      aud: 'api.coze.cn',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 有效期1小时
      jti: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      session_name: sessionName // 把前端传的匿名UID填进去
    };

    // 构建 JWT Header
    const headers = {
      alg: 'RS256',
      typ: 'JWT',
      kid: KID
    };

    // 生成 JWT Token
    const token = jwt.sign(payload, SIGNING_KEY, { algorithm: 'RS256', header: headers });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: '生成 Token 失败' }, { status: 500 });
  }
}