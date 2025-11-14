import { PrismaClient } from '@prisma/client';

// PrismaClientを初期化
const prisma = new PrismaClient();

async function main() {
  console.log('データベース接続テストを開始します...');

  try {
    // 1. 新しいユーザーを作成
    console.log('新しいユーザーを作成します...');
    const newUser = await prisma.user.create({
      data: {
        name: 'テストユーザー太郎',
      },
    });
    console.log('作成成功:', newUser);

    // 2. そのユーザーのチャット履歴を作成
    console.log('チャット履歴を作成します...');
    const newChat = await prisma.chatHistory.create({
      data: {
        userId: newUser.id, // 作成したユーザーのIDを紐付ける
        userInput: 'こんにちは、テストです。',
        appResponse: 'はい、テスト応答です。',
      },
    });
    console.log('作成成功:', newChat);

    // 3. データベースから今作成したユーザーを検索
    console.log('ユーザーを検索します...');
    const foundUser = await prisma.user.findUnique({
      where: {
        id: newUser.id,
      },
    });
    console.log('検索結果:', foundUser);

    console.log('テストが正常に完了しました！');

  } catch (error) {
    console.error('テスト中にエラーが発生しました:', error);
  } finally {
    // 最後に必ず接続を切断する
    await prisma.$disconnect();
    console.log('データベース接続を切断しました。');
  }
}

// main関数を実行
main();