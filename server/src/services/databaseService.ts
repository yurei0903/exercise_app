import express from 'express';
import { PrismaClient } from '@prisma/client';

// --- 初期設定 ---

const prisma = new PrismaClient();
const app = express();
const port = 3000; // サーバーが待ち受けるポート番号

// --- ミドルウェア設定 ---

// フロントエンドから送られてくるJSON形式のデータ（リクエストボディ）を
// 読めるようにするためのおまじない
app.use(express.json());

// --- APIエンドポイントの定義 ---

/**
 * 動作確認用 (GET /)
 * ブラウザで http://localhost:3000/ にアクセスすると動作確認できる
 */
app.get('/', (req, res) => {
  res.send('こんにちは！AIチャットアプリのサーバーです。');
});

/**
 * API: 新しいユーザーを作成する
 * (POST http://localhost:3000/api/users)
 *
 * フロントエンドから {"name": "山田"} のようなJSONが送られてくる想定
 */
app.post('/api/users', async (req, res) => {
  try {
    const { name } = req.body; // 送られてきたJSONから name を取り出す

    const newUser = await prisma.user.create({
      data: {
        name: name,
      },
    });

    res.json(newUser); // 作成したユーザー情報をフロントに返す
  } catch (error) {
    res.status(500).json({ error: 'ユーザー作成に失敗しました' });
  }
});

/**
 * API: チャット履歴を保存する
 * (POST http://localhost:3000/api/chat)
 *
 * フロントエンドから以下のようなJSONが送られてくる想定
 * {
 * "userId": "xxxxxxxx",
 * "userInput": "こんにちは",
 * "appResponse": "はい、こんにちは。"
 * }
 */
app.post('/api/chat', async (req, res) => {
  try {
    // フロントから送られてきたデータを取り出す
    const { userId, userInput, appResponse } = req.body;

    // データベースに保存 (test.ts でやったことと同じ)
    const newChat = await prisma.chatHistory.create({
      data: {
        userId: userId,
        userInput: userInput,
        appResponse: appResponse,
      },
    });

    res.json(newChat); // 保存したチャット履歴をフロントに返す
  } catch (error) {
    console.error(error); // サーバー側でもエラーログを出す
    res.status(500).json({ error: 'チャット履歴の保存に失敗しました' });
  }
});

/**
 * API: 特定ユーザーのチャット履歴を取得する（おまけ）
 * (GET http://localhost:3000/api/chat/ユーザーID)
 */
app.get('/api/chat/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // URLの :userId 部分を取り出す

    const history = await prisma.chatHistory.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc', // 古い順
      },
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: '履歴の取得に失敗しました' });
  }
});

// --- サーバー起動 ---

app.listen(port, () => {
  console.log(`サーバーがポート ${port} で起動しました。`);
  console.log(`動作確認: http://localhost:${port}`);
});