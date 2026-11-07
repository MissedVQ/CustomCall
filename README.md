# CustomCall — Vencord Plugin / Плагин для Vencord

**EN:** Custom ringtones for Discord calls: 21 presets or your own file/URL, with separate settings for incoming and outgoing calls.
**RU:** Кастомные рингтоны для звонков Discord: 21 пресет или свой файл/URL, с отдельными настройками для входящих и исходящих звонков.

## Features / Возможности

**EN:**
- **21 presets** in 5 categories: Classic (5), Halloween (7), Christmas (4), Remixes (4), Songs (1)
- separate settings for **incoming** and **outgoing** calls: preset, custom file, song URL, volume, loop, trim, preview
- optional **"Use custom sound"** toggle per direction — or just use a preset
- **Song URL** support — stream any direct mp3 link
- volume adjustable live, even during a call
- replace incoming, outgoing, or both
- preview stops automatically when leaving settings, switching sounds or on a real call

**RU:**
- **21 пресет** в 5 категориях: Classic (5), Halloween (7), Christmas (4), Remixes (4), Songs (1)
- отдельные настройки для **входящего** и **исходящего** звонка: пресет, свой файл, URL песни, громкость, цикл, обрезка, превью
- тумблер **«Включить кастомную музыку»** для каждого направления — или просто пресет
- поддержка **URL песни** — прямое прямое mp3 стримится напрямую
- громкость меняется на лету, даже во время звонка
- замена входящего, исходящего или обоих сразу
- превью останавливается само при выходе из настроек, смене звука или при реальном звонке

## Installation / Установка

**EN:**
1. Copy the `CustomCall` folder into `src/userplugins/` of your Vencord install.
2. Run `pnpm build` and restart Discord (fully — close from tray).
3. Settings → Vencord → Plugins → CustomCall → gear icon.

**RU:**
1. Скопируйте папку `CustomCall` в `src/userplugins/` вашей сборки Vencord.
2. Выполните `pnpm build` и перезапустите Discord (полностью, из трея).
3. Настройки → Vencord → Plugins → CustomCall → шестерёнка.

### Quick install (script) / Быстрая установка

**EN:** Run the included script — it clones Vencord, copies the plugin, builds and injects automatically:
- **Windows:** right-click `install.bat` → **Run as administrator**
- **Linux / macOS:** `chmod +x install.sh && ./install.sh`

**RU:** Запустите скрипт из архива — он склонирует Vencord, скопирует плагин, соберёт и инжектнёт:
- **Windows:** правый клик по `install.bat` → **Запуск от имени администратора**
- **Linux / macOS:** `chmod +x install.sh && ./install.sh`

## Presets / Пресеты

**Classic:** Classic, Classic — Remix, Discord 8-bit, Classic — Speed Up, Discord Secret
**Halloween:** 2020, 2022, 2023, 2024, 2024 — Remix, 2025, 2026
**Christmas:** 2020, 2022(3), 2024, 2025
**Remixes:** Discord Anime, Discord Chill, Discord Night, Discord Natural
**Songs:** Discordix — Erix

## Notes / Примечания

**EN:**
- Your custom file / settings persist in Vencord settings; clearing Discord cache deletes uploaded files.
- If a seasonal event (Halloween, New Year) is replacing the call sound, disable the event sound pack in **Settings → Notifications**.
- License: GPL-3.0-or-later (inherited from Vencord).

**RU:**
- Свой файл и настройки хранятся в настройках Vencord; очистка кэша Discord удалит загруженные файлы.
- Если ивент (Хэллоуин, Новый год) заменяет звук звонка — отключите звуковой набор ивента в **Настройки → Уведомления**.
- Лицензия: GPL-3.0-or-later (наследуется от Vencord).

## Updating / Обновление

**EN:** Download the latest release and run `install.bat` again — your settings are kept.
**RU:** Скачайте свежий релиз и запустите `install.bat` заново — настройки сохранятся.

## Troubleshooting / Известные проблемы

**EN:**
- Build error `Could not resolve "./sounds/..."` — make sure all mp3 files are in the `sounds/` folder with exact names.
- `pnpm is not recognized` — run `corepack enable` (Windows: as administrator).
- Plugin not in the list — fully restart Discord (close from system tray).
- No ring at all — check that Discord notifications are enabled (Settings → Notifications).
- **`Inject failed` / `fetch failed` / `ETIMEDOUT`** — The build was **successful**, but the script cannot download the installer because GitHub is blocked by your ISP. **Solution 1:** Download `VencordInstallerCli.exe` **manually** (`https://github.com/Vencord/Installer/releases/latest/download/VencordInstallerCli.exe`) and place it in the **root of your Vencord source folder** (e.g., `C:\Users\<YourUser>\Vencord`), then run `pnpm inject` again. **Solution 2 (Ultimate Fallback):** If the script still tries to download and fails, bypass the installer entirely. Your plugin is already built! Open `C:\Users\<YourUser>\Vencord\dist\`, select all files and copy them. Then press **Win + R**, type `%AppData%\Vencord` (or `%LocalAppData%\Vencord`) and press Enter. Paste the files there with replacement. Fully restart Discord.
- **⚠️ DO NOT double-click `VencordInstallerCli.exe` directly!** If you do, it will download and install the **official** Vencord, erasing your custom build (and the plugin). Use the methods described above.

**RU:**
- Ошибка сборки `Could not resolve "./sounds/..."` — убедитесь, что все mp3 лежат в папке `sounds/` с точными именами.
- `pnpm is not recognized` — выполните `corepack enable` (в Windows от администратора).
- Плагина нет в списке — полностью перезапустите Discord (закройте из трея).
- Звонок вообще без звука — проверьте, что уведомления Discord включены (Настройки → Уведомления).
- **Ошибка `Inject failed` / `fetch failed` / `ETIMEDOUT`** — Сборка **прошла успешно**, но скрипт не может скачать установщик, так как GitHub заблокирован вашим провайдером. **Решение 1:** Скачайте `VencordInstallerCli.exe` **вручную** (`https://github.com/Vencord/Installer/releases/latest/download/VencordInstallerCli.exe`) и положите в **корень папки с исходниками Vencord** (например, `C:\Users\<ВашеИмя>\Vencord`), затем запустите `pnpm inject`. **Решение 2 (Крайний случай):** Если скрипт всё равно лезет в интернет и падает, обойдите установщик. Плагин уже собран! Откройте папку `C:\Users\<ВашеИмя>\Vencord\dist\`, выделите все файлы и скопируйте их. Затем нажмите **Win + R**, введите `%AppData%\Vencord` (или `%LocalAppData%\Vencord`) и нажмите Enter. Вставьте туда файлы с заменой. Полностью перезапустите Discord.
- **⚠️ НЕ запускайте `VencordInstallerCli.exe` двойным кликом!** Если вы сделаете это, программа скачает и установит **официальный** Vencord, стерев вашу кастомную сборку (и плагин). Используйте методы, описанные выше.

## Author / Автор

Telegram: **@MissedVQExtera**

Discord: **@MissedVQCord** and **@MissedVQ**
