let rus = {
    //common
    'unknown': (commandName) => 'Неизвестная команда \'' + commandName + '\'',
    'incorrect_length': (commandName, length) => 'Некорректное число аргументов для команды \'' + commandName +
        '\': ' + length,
    'unknown_argument': (commandName, argName) => 'Неизвестный аргумент \'' + argName + '\' для команды \'' +
        commandName + '\'',
    'no_voice': () => 'Голосовое соединение отсутствует',
    'key': (key) => 'Твой ключ: ' + key,
    'salt': () => 'Нехватает соли',
    'empty': () => 'Очередь пуста',

    //download
    'too_long': () => 'Трек слишком длинный',
    'start_download': (trackName) => 'Начинаю загружать трек \'' + trackName + '\'',
    'download_error': (trackName) => 'Ошибка при загрузке трека \'' + trackName + '\'',
    'save_error': (trackName) => 'Ошибка при сохранении трека \'' + trackName + '\'',
    'save_success': (trackName) => 'Трек \'' + trackName + '\' успешно загружен',
    'already_download': (trackName) => 'Трек \'' + trackName + '\' найден в памяти',

    //channel
    'join_channel': (channelName) => 'Присоединился к каналу \'' + channelName + '\'',
    'change_channel': (oldChannel, newChannel) => 'Перешел из канала \'' + oldChannel + '\' в \'' + newChannel + '\'',
    'already_channel': (channelName) => 'Уже присоеденен к каналу \'' + channelName + '\'',
    'leave_channel': (channelName) => 'Покинул канал \'' + channelName + '\'',
    'not_found_channel': (channelName) => 'Канал \'' + channelName + '\' не найден',
    'no_channel': () => 'Не присоеденен ни к одному каналу',
    'incorrect_channel': () => 'Некорректное имя канала',

    //player
    'player_add_err': (trackName) => 'Ошибка при добавлении трека \'' + trackName + '\' в очередь',
    'player_add': (trackName, trackTime) => 'Трек \'' + trackName + '\' ' + trackTime + ' добавлен в очередь',
    'player_play': (trackName, trackTime) => 'Начинаю воспроизводить \'' + trackName + '\' ' + trackTime,
    'player_play_seek': (trackName, trackTime, seekTime) => 'Начинаю воспроизводить \'' + trackName + '\' ' +
        trackTime + ' с момента ' + seekTime,
    'player_next': (trackName) => 'Следующий трек \'' + trackName + '\'',
    'player_resume': () => 'Воспроизведение возобновлено',
    'player_no_resume': () => 'Нечего возобновлять',
    'player_pause': () => 'Воспроизведение приостановлнено',
    'player_no_pause': () => 'Нечего приостанавливать',
    'player_volume': (volume) => 'Громкость установлена на ' + volume,
    'no_playing': () => 'Ничего не воспроизводится',

    //youtube
    'yt_incorrect': (link) => 'Некоректная youtube ссылка: ' + link,
    'ytpl_incorrect': (link) => 'Некоректная youtube playlist ссылка: ' + link,
    'yt_error': (link) => 'Ошибка при получении информации о треке: ' + link
};

let eng = {
    'unknown': function (commandName) {
        return 'Unknown command: ' + commandName;
    }
};

module.exports = {
    Rus: rus,
    Eng: eng
};