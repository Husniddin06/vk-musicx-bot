const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// TOKEN SAQLANGAN
const bot = new Telegraf('5879313391:AAGuOpL1-phV7JH-jLFL8rB3G1_1-JL0O2Y');

// Foydalanuvchilar bazasi
let users = {};

// /start
bot.start((ctx) => {
  const userId = ctx.from.id;
  if (!users[userId]) {
    users[userId] = { coins: 0, hits: 10, vip: false };
  }
  
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.webApp('🎵 MINI APP', 'https://vk-musicx-bot.vercel.app')],
    [{ text: '💰 Bonus', callback_ 'bonus' }],
    [{ text: '⭐ VIP', callback_ 'vip' }]
  ]);
  
  ctx.reply(`🎵 <b>VKMusicX Premium</b>\n\n💰 Coins: ${users[userId].coins}\n🎶 Hits: ${users[userId].hits}\n⭐ ${users[userId].vip ? 'VIP' : 'Free'}`, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
});

// Bonus
bot.action('bonus', (ctx) => {
  const userId = ctx.from.id;
  users[userId].coins += 100;
  ctx.answerCbQuery('✅ +100 coins!');
  ctx.reply(`💰 Balans: ${users[userId].coins}`);
});

// VIP
bot.action('vip', (ctx) => {
  const userId = ctx.from.id;
  users[userId].vip = true;
  users[userId].hits = 999;
  ctx.answerCbQuery('⭐ VIP faollashtirildi!');
});

// Webhook mini app uchun
app.post('/webhook', (req, res) => {
  const userId = req.body.user_id;
  if (users[userId]) {
    users[userId].coins += 50;
  }
  res.json({ ok: true });
});

// Barcha so'rovlar
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Bot ishlamoqda'));
bot.launch();

module.exports = app;
