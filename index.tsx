import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { Button, React } from "@webpack/common";

// === PRESET LIST ===
// Sounds are inlined into the bundle at build time via Vencord's fileUrlPlugin
import sClassic from "file://./sounds/discord-classic.mp3?base64";
import sHalloween2020 from "file://./sounds/discord-halloween-2020.mp3?base64";
import sChristmas2020 from "file://./sounds/discord-christmas-2020.mp3?base64";
import sHalloween2022 from "file://./sounds/discord-halloween-2022.mp3?base64";
import sHalloween2022Remix from "file://./sounds/discord-halloween-2022-remix.mp3?base64";
import sHalloween2023 from "file://./sounds/discord-halloween-2023.mp3?base64";
import sHalloween2024 from "file://./sounds/discord-halloween-2024.mp3?base64";
import sHalloween2025 from "file://./sounds/discord-halloween-2025.mp3?base64";
import sHalloween2024Remix from "file://./sounds/discord-halloween-2024-remix.mp3?base64";
import sHalloween2026 from "file://./sounds/discord-halloween-2026.mp3?base64";
import sChristmas2022 from "file://./sounds/discord-christmas-2022.mp3?base64";
import sChristmas2024 from "file://./sounds/discord-christmas-2024.mp3?base64";
import sChristmas2025 from "file://./sounds/discord-christmas-2025.mp3?base64";
import sSecret from "file://./sounds/discord-secret.mp3?base64";

const PRESET_SOUNDS = {
    "discord-classic": "Classic",
    "discord-halloween-2020": "Discord Halloween 2020",
    "discord-christmas-2020": "Discord Christmas 2020",
    "discord-halloween-2022": "Discord Halloween 2022",
    "discord-halloween-2022-remix": "Discord Halloween 2022 — Remix",
    "discord-halloween-2023": "Discord Halloween 2023",
    "discord-halloween-2024": "Discord Halloween 2024",
    "discord-halloween-2025": "Discord Halloween 2025",
    "discord-halloween-2024-remix": "Discord Halloween 2024 — Remix",
    "discord-halloween-2026": "Discord Halloween 2026",
    "discord-christmas-2022": "Discord Christmas 2022",
    "discord-christmas-2024": "Discord Christmas 2024",
    "discord-christmas-2025": "Discord Christmas 2025",
    "discord-secret": "Discord Secret",
} as const;

type Preset = keyof typeof PRESET_SOUNDS;

const SOUND_DATA: Record<Preset, string> = {
    "discord-classic": sClassic,
    "discord-halloween-2020": sHalloween2020,
    "discord-christmas-2020": sChristmas2020,
    "discord-halloween-2022": sHalloween2022,
    "discord-halloween-2022-remix": sHalloween2022Remix,
    "discord-halloween-2023": sHalloween2023,
    "discord-halloween-2024": sHalloween2024,
    "discord-halloween-2025": sHalloween2025,
    "discord-halloween-2024-remix": sHalloween2024Remix,
    "discord-halloween-2026": sHalloween2026,
    "discord-christmas-2022": sChristmas2022,
    "discord-christmas-2024": sChristmas2024,
    "discord-christmas-2025": sChristmas2025,
    "discord-secret": sSecret,
};

function getPresetUrl(preset: Preset): string {
    return `data:audio/mpeg;base64,${SOUND_DATA[preset]}`;
}

let currentAudio: HTMLAudioElement | null = null;
let previewMode = false;

function currentSrc(): string {
    if (settings.store.customSoundEnabled && settings.store.customSound)
        return settings.store.customSound;
    return getPresetUrl(settings.store.preset as Preset);
}

function playCustom(volume: number) {
    stopCustom();

    const audio = new Audio(currentSrc());
    audio.volume = volume;
    audio.loop = false;

    const trimStart = Math.max(0, settings.store.trimStart || 0);
    let trimEnd = settings.store.trimEnd || 0;

    audio.addEventListener("loadedmetadata", () => {
        if (!trimEnd || trimEnd > audio.duration) trimEnd = audio.duration;
        audio.currentTime = Math.min(trimStart, Math.max(0, audio.duration - 0.05));
    });

    audio.addEventListener("timeupdate", () => {
        const end = trimEnd || audio.duration;
        if (audio.currentTime >= end) {
            if (settings.store.loop) audio.currentTime = Math.min(trimStart, Math.max(0, end - 0.05));
            else { audio.pause(); currentAudio = null; }
        }
    });

    audio.play().catch(() => { });
    currentAudio = audio;
}

function stopCustom() {
    currentAudio?.pause();
    currentAudio = null;
}

const settings = definePluginSettings({
    notice: {
        type: OptionType.COMPONENT,
        component: () => (
            <div style={{
                padding: "12px 16px",
                marginBottom: "16px",
                borderRadius: "8px",
                backgroundColor: "var(--background-secondary-alt)",
                color: "var(--text-normal)",
                fontSize: "14px",
                lineHeight: "1.4"
            }}>
                <b>EN:</b> If a seasonal event (Halloween, New Year) is currently replacing the call sound,
                go to <b>Settings → Notifications</b> and disable the event sound pack.
                <br />
                <b>RU:</b> Если сейчас ивент (Хэллоуин, Новый год), который заменяет звук звонка,
                зайдите в <b>Настройки → Уведомления</b> и отключите звуковой набор ивента.
            </div>
        ),
    },
    preset: {
        type: OptionType.SELECT,
        description: "Preset call sound / Пресетный звук звонка",
        options: Object.entries(PRESET_SOUNDS).map(([value, label]) => ({
            label, value,
            ...(value === "discord-classic" ? { default: true } : {}),
        })),
    },
    volume: {
        type: OptionType.SLIDER,
        description: "Volume / Громкость",
        markers: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        default: 80,
        stickToMarkers: false,
        onChange(v: number) {
            if (currentAudio) currentAudio.volume = v / 100;
        },
    },
    loop: {
        type: OptionType.BOOLEAN,
        description: "Loop the sound / Зацикливать звук",
        default: true,
    },
    customSoundEnabled: {
        type: OptionType.BOOLEAN,
        description: "Use your own sound instead of preset / Свой звук вместо пресета",
        default: false,
    },
    customSoundPicker: {
        type: OptionType.COMPONENT,
        component: () => {
            const [name, setName] = React.useState(settings.store.customSoundName);
            return (
                <input
                    type="file"
                    accept="audio/*"
                    data-selected={name}
                    onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                            settings.store.customSound = reader.result as string;
                            settings.store.customSoundName = file.name;
                            settings.store.customSoundEnabled = true;
                            setName(file.name);
                        };
                        reader.readAsDataURL(file);
                    }}
                />
            );
        },
    },
    customSound: {
        type: OptionType.STRING,
        description: "Custom sound (data URL, filled by the button above)",
        default: "",
    },
    customSoundName: {
        type: OptionType.STRING,
        description: "Uploaded file name",
        default: "",
    },
    trimStart: {
        type: OptionType.NUMBER,
        description: "Trim: start, sec (0 = from beginning)",
        default: 0,
    },
    trimEnd: {
        type: OptionType.NUMBER,
        description: "Trim: end, sec (0 = to end)",
        default: 0,
    },
    preview: {
        type: OptionType.COMPONENT,
        component: () => {
            const [playing, setPlaying] = React.useState(false);
            return (
                <Button
                    onClick={() => {
                        if (playing) {
                            stopCustom();
                            previewMode = false;
                            setPlaying(false);
                        } else {
                            previewMode = true;
                            playCustom(settings.store.volume / 100);
                            setPlaying(true);
                            const t = setInterval(() => {
                                if (!currentAudio) {
                                    previewMode = false;
                                    setPlaying(false);
                                    clearInterval(t);
                                }
                            }, 500);
                        }
                    }}
                >
                    {playing ? "Stop preview / Остановить" : "▶ Preview / Прослушать"}
                </Button>
            );
        },
    },
    replaceIncoming: {
        type: OptionType.BOOLEAN,
        description: "Replace incoming call sound / Заменять входящий звонок",
        default: true,
    },
    replaceOutgoing: {
        type: OptionType.BOOLEAN,
        description: "Replace outgoing call sound / Заменять исходящий звонок",
        default: false,
    },
});

export default definePlugin({
    name: "CustomCall",
    description: "Custom ringtones for Discord calls: presets or your own file with trim, loop and volume. NOTE: if a seasonal event (Halloween, New Year) is currently replacing the call ringtone, disable the event sound pack in Settings -> Notifications.",
    authors: [{ name: "missedvq", id: 0n }],
    tags: ["Voice", "Fun"],
    settings,

    patches: [
        {
            // Discord's new sound engine: AudioPlayer class
            find: "could not play audio:",
            group: true,
            replacement: [
                {
                    // Replace the audio source for call sounds
                    match: /(\i\.src=)(\i\(\d+\))\(`\.\/\$\{this\.name\}\.mp3`\)/,
                    replace: "$1$self.resolveSrc(this,$2)",
                },
                {
                    // Apply loop/trim settings to the Audio element
                    match: /(new Audio;)(\i)(\.src=)/,
                    replace: "$1$self.applyLoopAndTrim(this,$2);$2$3",
                },
                {
                    // Scale volume with our volume slider (call sounds only)
                    match: /Math\.min\((\i\.\i\.getOutputVolume\(\))\/100\*this\._volume,1\)/,
                    replace: "Math.min($1/100*this._volume*$self.volumeScale(this),1)",
                },
            ],
        },
    ],

    isCallSound(name: unknown): name is string {
        return typeof name === "string" && /^(call_ringing|call_calling)/.test(name);
    },

    resolveSrc(player: { name: unknown }, req: (path: string) => string): string {
        const { name } = player;
        if (typeof name !== "string") return req("./undefined.mp3");

        const isIncoming = name.startsWith("call_ringing");
        const isOutgoing = name.startsWith("call_calling");

        if (this.isCallSound(name) &&
            ((isIncoming && settings.store.replaceIncoming) ||
             (isOutgoing && settings.store.replaceOutgoing))) {
            return currentSrc();
        }

        return req(`./${name}.mp3`);
    },

    volumeScale(player: { name: unknown }): number {
        return this.isCallSound(player.name) ? settings.store.volume / 100 : 1;
    },

    applyLoopAndTrim(player: { name: unknown }, el: HTMLAudioElement) {
        if (!this.isCallSound(player.name)) return;

        // We handle looping manually to respect trim points
        el.loop = false;

        el.addEventListener("loadedmetadata", () => {
            const start = Math.max(0, settings.store.trimStart || 0);
            if (start > 0) el.currentTime = Math.min(start, Math.max(0, el.duration - 0.05));
        });

        el.addEventListener("timeupdate", () => {
            const start = Math.max(0, settings.store.trimStart || 0);
            let end = settings.store.trimEnd || 0;
            if (!end || end > el.duration) end = el.duration;
            if (el.currentTime >= end) {
                if (settings.store.loop) el.currentTime = Math.min(start, Math.max(0, end - 0.05));
                else el.pause();
            }
        });
    },

    stop() {
        stopCustom();
    },
});
