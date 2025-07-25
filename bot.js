const TelegramBot = require('node-telegram-bot-api');
const token = '8063991735:AAEO1j0Ve2fC1zTPAW6LjyA9f2hzwmtfoXI';
const ownerId = 6510008944;
const bot = new TelegramBot(token, { polling: true });

const groupIds = [];

bot.on('message', (msg) => {
  if (msg.chat.type.endsWith('group') && msg.new_chat_member) {
    bot.sendMessage(msg.chat.id, `✅ এই গ্রুপের আইডি: ${msg.chat.id}`);
    if (!groupIds.includes(msg.chat.id)) groupIds.push(msg.chat.id);
  }

  if (msg.text === '/start') {
    bot.sendMessage(msg.chat.id, '👋 স্বাগতম! এই বট শুধুমাত্র মালিক ব্যবহার করতে পারবে।');
  }

  if (msg.text?.startsWith('/post') && msg.from.id === ownerId) {
    const content = msg.text.replace('/post', '').trim();
    let success = 0, failed = 0;
    groupIds.forEach(id => {
      bot.sendMessage(id, content).then(() => success++).catch(() => failed++);
    });
    bot.sendMessage(msg.chat.id, `✅ মেসেজ পাঠানো শেষ\nসফল: ${success}\nব্যর্থ: ${failed}`);
  }

  if (msg.text === '/groups' && msg.from.id === ownerId) {
    bot.sendMessage(msg.chat.id, `🤖 মোট গ্রুপ: ${groupIds.length}`);
  }
});
