// Подключаем модули и создаём бота
const Telegraf = require('telegraf')
const config = require('./logs/config')
const fs = require('fs')
const SupportBot = new Telegraf('1273972291:AAEBdrllJkUGi_SQXvPGpJWY8lKZ5ORTDBY')

// Заготовки текста
let replyText = {
    "helloAdmin": "Привет админ, ждем сообщения от пользователей",
    "helloUser1": `Приветствую! Отправьте мне сообщение которое хотели бы адресовать разработчику @GraphyDogBot'a. Он ответит вам в ближайшее время.`,
    "helloUser2": `\n\nДля корректной работы бота вам необходимо в настройка включить функцию "пересылка сообщений" (Настройки > Конфиденциальность > Пересылка сообщений), или добавить этого бота в исключения.`,
    "replyWrong": "Error: для ответа пользователю используйте функцию Ответить/Reply."
};

// Проверяем пользователя на права администратора
let isAdmin = (userId) => {
    return userId == config.admin1;
};


// Старт бота + GIF
SupportBot.start((msg) => {
    const dogGif = new Promise(function (resolve, reject) {
        msg.telegram.sendDocument(msg.from.id, {
            source: __dirname + '/src/call_center.gif', // ?????
            filename: 'call_center.gif'
        })

    })
    msg.reply(isAdmin(msg.message.from.id) ? replyText.helloAdmin : (replyText.helloUser1 + replyText.helloUser2))
    // dogGif.then()

})

// Перенаправляем админу от пользователя или уведомляем админа об ошибке
let forwardToAdmin = (msg) => {
    if (isAdmin(msg.message.from.id)) {

        msg.reply(replyText.replyWrong);
    } else {
        msg.forwardMessage(config.admin1, msg.from.id, msg.message.id);
    }
};

// Слушаем на наличие объекта message
SupportBot.on('message', (msg) => {
    // убеждаемся что это админ ответил на сообщение пользователя
    if (msg.message.reply_to_message
        && msg.message.reply_to_message.forward_from
        && isAdmin(msg.message.from.id)) {
        let userId = msg.message.reply_to_message.forward_from.id;
        //  проверяем что пришло и отправляем соответствующим методом
        switch (msg.updateSubTypes[0]) {
            case 'text':
                msg.telegram.sendMessage(
                    userId,
                    msg.message.text
                );
                break;
            case 'sticker':
                msg.telegram.sendSticker(
                    userId,
                    msg.message.sticker.file_id
                );
                break;
            case 'photo':
                let file = msg.message.photo.length - 1;
                msg.telegram.sendPhoto(
                    userId,
                    msg.message.photo[file].file_id,
                    {
                        'caption': msg.message.caption
                    }
                );
                break;
            case 'document':
                msg.telegram.sendDocument(
                    userId,
                    msg.message.document.file_id,
                    {
                        'caption': msg.message.caption
                    }
                );
                break;
            case 'voice':
                msg.telegram.sendVoice(
                    userId,
                    msg.message.voice.file_id,
                    {
                        'caption': msg.message.caption
                    }
                );
                break;
            case 'video_note':
                msg.telegram.sendVideoNote(
                    userId,
                    msg.message.video_note.file_id
                );
                break;
            case 'video':
                msg.telegram.sendVideo(
                    userId,
                    msg.message.video.file_id,
                    {
                        'caption': msg.message.caption
                    }
                );
                break;
            case 'audio':
                msg.telegram.sendAudio(
                    userId,
                    msg.message.audio.file_id,
                    {
                        'caption': msg.message.caption
                    }
                );
                break;
            default:
                console.log('other');
        }
    } else {
        forwardToAdmin(msg);
    }
});

// function startTime() {
//     var date = new Date();
//     var hours = date.getHours();
//     var minutes = date.getMinutes();
//     var seconds = date.getSeconds();
//     if (hours < 10) hours = "0" + hours;
//     if (minutes < 10) minutes = "0" + minutes;
//     if (seconds < 10) seconds = "0" + seconds;
//     console.log(hours + ":" + minutes + ":" + seconds)
//     setTimeout(startTime, 1000);
// }
//
// startTime()


// запуск бота
SupportBot.launch();