// Подключаем модули и создаём бота
const Telegraf = require('telegraf');
const config = require('./src/config.js')
// Создаем объект бота
const bot = new Telegraf(config.botToken);

// Заготовки текста
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser1": `Приветствую! Отправьте мне сообщение которое хотели бы адресовать разработчику @GraphyDogBot'a. Он ответит вам в ближайшее время.`,
    "helloUser2": `\n\nДля корректной работы бота вам необходимо в настройка включить функцию "пересылка сообщений" (Настройки > Конфиденциальность > Пересылка сообщений), или добавить этого бота в исключения.`,
    "replyWrong": "Для ответа пользователю используйте функцию Ответить/Reply."
};
// Проверяем пользователя на права
let isAdmin = (userId) => {
    return userId == config.admin;
};

// Перенаправляем админу от пользователя или уведомляем админа об ошибке
let forwardToAdmin = (msg) => {
    if (isAdmin(msg.message.from.id)) {

        msg.reply(replyText.replyWrong);
    } else {
        msg.forwardMessage(config.admin, msg.from.id, msg.message.id);
    }
};

// Старт бота + GIF

bot.start((msg) => {
    const dogGif = new Promise(function (resolve, reject) {
        msg.telegram.sendDocument(msg.from.id, {
            source: __dirname + '/images/call_center.gif',
            filename: 'call_center.gif'
        })
    })
    msg.reply(isAdmin(msg.message.from.id)
        ? replyText.helloAdmin
        : replyText.helloUser1 + replyText.helloUser2)
    dogGif.then()
})

// Слушаем на наличие объекта message
bot.on('message', (msg) => {
    // убеждаемся что это админ ответил на сообщение пользователя
    if (msg.message.reply_to_message
        && msg.message.reply_to_message.forward_from
        && isAdmin(msg.message.from.id)) {
        // отправляем копию пользователю
        msg.telegram.sendCopy(msg.message.reply_to_message.forward_from.id, msg.message);
    } else {
        // перенаправляем админу
        forwardToAdmin(msg);
    }
});

// запуск бота
bot.launch();