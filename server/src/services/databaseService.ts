import { PrismaClient } from '@prisma/client';

// Prismaを使うためのおまじない
const prisma = new PrismaClient();

// --- データの保存 ---

/**
 * 例1: 新しい利用者を登録する
 * (例: ユーザーが初めて名前を入力した時に呼ぶ)
 */
async function createNewUser(userName: string) {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: userName,
        // idは@default(cuid())で自動生成される
      },
    });
    console.log('新しいユーザーを作成しました:', newUser);
    return newUser;
  } catch (error) {
    console.error('ユーザー作成に失敗しました:', error);
  }
}

/**
 * 例2: AIとの対話履歴を保存する
 * (例: フロントから「発言と応答」が送られてきた時に呼ぶ)
 */
async function saveConversation(
  userId: string,  // どのユーザーか
  userInput: string, // ユーザーが書いた内容
  aiResponse: string // AIの応答
) {
  try {
    const newChat = await prisma.chatHistory.create({
      data: {
        userId: userId, // どのUserのidに紐づけるか
        userInput: userInput,
        appResponse: aiResponse,
        // id や createdAt は自動で入る
      },
    });
    console.log('対話履歴を保存しました:', newChat);
    return newChat;
  } catch (error) {
    console.error('履歴の保存に失敗しました:', error);
  }
}

// --- データの取得（おまけ） ---

/**
 * 例3: 特定の利用者のすべての対話履歴を取得する
 * (例: 「過去の履歴」ページで呼ぶ)
 */
async function getUserHistory(userId: string) {
  try {
    const history = await prisma.chatHistory.findMany({
      where: {
        userId: userId, // 指定したuserIdの履歴だけ
      },
      orderBy: {
        createdAt: 'desc', // 新しい順に並び替え
      },
    });
    return history;
  } catch (error) {
    console.error('履歴の取得に失敗しました:', error);
  }
}

// --- 実行例 ---
async function main() {
  // 1. ユーザー「山田さん」を作成
  const user = await createNewUser('山田');

  if (user) {
    // 2. 山田さんの対話履歴を保存
    await saveConversation(
      user.id,
      'こんにちは、元気ですか？',
      'はい、元気です。'
    );
    
    // 3. 山田さんの履歴を取得
    const history = await getUserHistory(user.id);
    console.log('山田さんの履歴:', history);
  }
  
  await prisma.$disconnect(); // 最後に接続を切る
}

main();