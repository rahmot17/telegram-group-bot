const TelegramBot = require('node-telegram-bot-api');

const token = '8063991735:AAEO1j0Ve2fC1zTPAW6LjyA9f2hzwmtfoXI';
const OWNER_ID = 6510008944;

const bot = new TelegramBot(token, { polling: true });
let groupIds = [];

bot.onText(/\/start/, msg => {
  const from = msg.from.id;
  bot.sendMessage(msg.chat.id,
    from === OWNER_ID
      ? '👋 স্বাগতম! আপনি বটের মালিক।'
      : '❌ তুমি মালিক নও, বট ব্যবহার করতে পারবে না।'
  );
});

bot.onText(/\/add (.+)/, (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;
  const gid = match[1];
  if (!groupIds.includes(gid)) {
    groupIds.push(gid);
    bot.sendMessage(msg.chat.id, `✅ গ্রুপ আইডি ${gid} যোগ হয়েছে।`);
  } else {
    bot.sendMessage(msg.chat.id, `ℹ️ ${gid} আগেই আছে।`);
  }
});

bot.onText(/\/groups/, msg => {
  if (msg.from.id !== OWNER_ID) return;
  bot.sendMessage(msg.chat.id,
    groupIds.length === 0
      ? 'ℹ️ এখনো কোনো গ্রুপ যোগ হয়নি।'
      : `🤖 মোট গ্রুপ: ${groupIds.length}\n📋 লিস্ট:\n${groupIds.join('\n')}`
  );
});

bot.onText(/\/post (.+)/, async (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;
  const txt = match[1];
  let success = 0, fail = 0;
  for (const gid of groupIds) {
    try { await bot.sendMessage(gid, txt); success++; }
    catch { fail++; }
  }
  bot.sendMessage(msg.chat.id, `✅ শেষ\nসফল: ${success}  ব্যর্থ: ${fail}`);
});
