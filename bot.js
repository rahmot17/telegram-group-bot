const TelegramBot = require('node-telegram-bot-api');

const token = '8063991735:AAEO1j0Ve2fC1zTPAW6LjyA9f2hzwmtfoXI';
const OWNER_ID = 6510008944; // তোমার numeric Telegram ID

const bot = new TelegramBot(token, { polling: true });

let groupIds = [];

bot.onText(/\/start/, (msg) => {
  if (msg.from.id === OWNER_ID) {
    bot.sendMessage(msg.chat.id, '👋 স্বাগতম! আপনি বটের মালিক।');
  } else {
    bot.sendMessage(msg.chat.id, '❌ তুমি মালিক নও, বট ব্যবহার করতে পারবে না।');
  }
});

bot.onText(/\/add (.+)/, (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;

  const newGroupId = match[1];
  if (!groupIds.includes(newGroupId)) {
    groupIds.push(newGroupId);
    bot.sendMessage(msg.chat.id, `✅ গ্রুপ আইডি ${newGroupId} সফলভাবে যোগ হয়েছে।`);
  } else {
    bot.sendMessage(msg.chat.id, 'ℹ️ এই গ্রুপ আইডি আগেই যোগ করা হয়েছে।');
  }
});

bot.onText(/\/groups/, (msg) => {
  if (msg.from.id !== OWNER_ID) return;

  if (groupIds.length === 0) {
    bot.sendMessage(msg.chat.id, 'ℹ️ এখনো কোনো গ্রুপ যোগ করা হয়নি।');
  } else {
    const list = groupIds.join('\n');
    bot.sendMessage(msg.chat.id, `🤖 মোট গ্রুপ: ${groupIds.length}\n\n📋 লিস্ট:\n${list}`);
  }
});

bot.onText(/\/post (.+)/, async (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;

  const text = match[1];
  let success = 0;
  let failed = 0;

  for (const id of groupIds) {
    try {
      await bot.sendMessage(id, text);
      success++;
    } catch {
      failed++;
    }
  }

  bot.sendMessage(msg.chat.id, `✅ মেসেজ পাঠানো শেষ\nসফল: ${success}\nব্যর্থ: ${failed}`);
});
