// Подключаем модули и создаём бота
const Telegraf = require('telegraf')
const config = require('/logs/config')
const SupportBot = new Telegraf(config.botToken)

// Заготовки текста
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser1": `Приветствую! Отправьте мне сообщение которое хотели бы адресовать разработчику @GraphyDogBot'a. Он ответит вам в ближайшее время.`,
    "helloUser2": `\n\nДля корректной работы бота вам необходимо в настройка включить функцию "пересылка сообщений" (Настройки > Конфиденциальность > Пересылка сообщений), или добавить этого бота в исключения.`,
    "replyWrong": "Error: для ответа пользователю используйте функцию Ответить/Reply."
};

// Проверяем пользователя на права администратора
let isAdmin = (userId) => {
    return userId == config.admin;
};


// Перенаправляем админу от пользователя или уведомляем админа об ошибке
let forwardToAdmin = (msg) => {
    if (isAdmin(msg.message.from.id)) {

        msg.reply(replyText.replyWrong);
    } else {
        msg.forwardMessage(config.adminList(1||2), msg.from.id, msg.message.id);
    }
};

// Старт бота

bot.start((msg) => {
    const dogGif = new Promise(function (resolve, reject) {
        msg.telegram.sendDocument(msg.from.id, {
            source: __dirname + '/src/call_center.gif', // ?????
            filename: 'call_center.gif'
        })
    })
    msg.reply(isAdmin(msg.message.from.id) ? replyText.helloAdmin : replyText.helloUser1 + replyText.helloUser2)
    dogGif.then()
})