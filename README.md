# CustomCall — Vencord Plugin / Плагин для Vencord

**EN:** Custom ringtones for Discord calls: presets or your own music file
with trim, loop and volume control.
**RU:** Кастомные рингтоны для звонков Discord: пресеты или свой музыкальный файл
с обрезкой, зацикливанием и регулировкой громкости.

## Features / Возможности

**EN:**
- 14 presets (Discord's yearly sounds: Halloween / Christmas / Secret);
- upload your own music file right in the client settings;
- trim the file (start/end in seconds);
- loop on/off;
- volume (adjustable live, even during a call);
- preview button — test the sound without a call;
- replace incoming and/or outgoing call ringtone.

**RU:**
- 14 пресетов (годовые звуки Discord: Хэллоуин / Рождество / Secret);
- загрузка своего музыкального файла прямо в настройках клиента;
- обрезка файла (начало/конец в секундах);
- зацикливание вкл/выкл;
- громкость (меняется на лету, даже во время звонка);
- кнопка превью — проверка звука без звонка;
- замена входящего и/или исходящего рингтона.

## Installation / Установка

**EN:**
1. Copy the `CustomCall` folder into `src/userplugins/` of your Vencord install.
2. Put mp3 files into `CustomCall/sounds/` with names matching the presets exactly.
3. Run `pnpm build` and restart Discord.
4. Settings → Vencord → Plugins → CustomCall → gear icon.

**RU:**
1. Скопируйте папку `CustomCall` в `src/userplugins/` вашей сборки Vencord.
2. Положите mp3-файлы в `CustomCall/sounds/` строго под именами пресетов.
3. Выполните `pnpm build` и перезапустите Discord.
4. Настройки → Vencord → Plugins → CustomCall → шестерёнка.

## Sound names / Имена звуков

discord-classic, discord-halloween-2020, discord-christmas-2020, discord-halloween-2022,
discord-halloween-2022-remix, discord-halloween-2023, discord-halloween-2024,
discord-halloween-2025, discord-halloween-2024-remix, discord-halloween-2026, discord-christmas-2022,
discord-christmas-2024, discord-christmas-2025, discord-secret

## Notes / Примечания

**EN:**
- Your custom sound is stored as a data URL in the settings (don't clear Discord cache if you want to keep it).
- Presets are loaded lazily.
- License: GPL-3.0-or-later (inherited from Vencord).

**RU:**
- Свой звук хранится как data URL в настройках (не очищайте кэш Discord, если хотите его сохранить).
- Пресеты подгружаются лениво.
- Лицензия: GPL-3.0-or-later (наследуется от Vencord).

**EN:** Preset sounds are inlined into the bundle at build time via Vencord's `fileUrlPlugin`
(`file://./sounds/*.mp3?base64` imports), so no separate asset files are needed at runtime.
**RU:** Пресетные звуки встраиваются в бандл при сборке через `fileUrlPlugin` Vencord
(импорты `file://./sounds/*.mp3?base64`), отдельные файлы на диске в рантайме не нужны.

## Quick install (script) / Быстрая установка

**EN:** Run the included script — it installs everything automatically:
- **Windows:** double-click `install.bat`
- **Linux / macOS:** `chmod +x install.sh && ./install.sh`

Requirements: [Node.js](https://nodejs.org) (LTS) and git.
The script clones Vencord to `~/Vencord`, copies the plugin, builds and injects.

**RU:** Запустите included-скрипт — он установит всё автоматически:
- **Windows:** двойной клик по `install.bat`
- **Linux / macOS:** `chmod +x install.sh && ./install.sh`

Требования: [Node.js](https://nodejs.org) (LTS) и git.
Скрипт клонирует Vencord в `~/Vencord`, скопирует плагин, соберёт и инжектнёт.

## Troubleshooting / Известные проблемы

**EN:**
- No ring on calls at all → check that Discord notifications are enabled (Settings → Notifications).
- During seasonal events (Halloween/New Year) disable the event sound pack in Settings → Notifications.
- `pnpm is not recognized` → run `corepack enable` (on Windows as administrator), or reinstall Node.js.
- Plugin not in the list → make sure you fully restarted Discord (close it from the system tray).
- Clearing Discord cache deletes your custom uploaded sounds.

**RU:**
- Звонок вообще без звука → проверьте, что уведомления Discord включены (Настройки → Уведомления).
- Во время ивентов (Хэллоуин/Новый год) отключите звуковой набор ивента в Настройки → Уведомления.
- `pnpm is not recognized` → выполните `corepack enable` (в Windows от администратора) или переустановите Node.js.
- Плагина нет в списке → полностью перезапустите Discord (закройте из трея).
- Очистка кэша Discord удалит ваши загруженные кастомные звуки.
