import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { Button, React } from "@webpack/common";

// === PRESET LIST ===
// Sounds are inlined into the bundle at build time via Vencord's fileUrlPlugin
// File names must be lowercase with hyphens (case matters on Linux builds)
import sClassic from "file://./sounds/discord-classic.mp3?base64";
import sClassicSpeedup from "file://./sounds/discord-classic-speedup.mp3?base64";
import sSecret from "file://./sounds/discord-secret.mp3?base64";
import sClassicRemix from "file://./sounds/discord-classic-remix.mp3?base64";
import sHalloween2020 from "file://./sounds/discord-halloween-2020.mp3?base64";
import sHalloween2022 from "file://./sounds/discord-halloween-2022.mp3?base64";
import sHalloween2023 from "file://./sounds/discord-halloween-2023.mp3?base64";
import sHalloween2024 from "file://./sounds/discord-halloween-2024.mp3?base64";
import sHalloween2025 from "file://./sounds/discord-halloween-2025.mp3?base64";
import sHalloween2024Remix from "file://./sounds/discord-halloween-2024-remix.mp3?base64";
import sHalloween2026 from "file://./sounds/discord-halloween-2026.mp3?base64";
import sChristmas2020 from "file://./sounds/discord-christmas-2020.mp3?base64";
import sChristmas2022 from "file://./sounds/discord-christmas-2022-3.mp3?base64";
import sChristmas2024 from "file://./sounds/discord-christmas-2024.mp3?base64";
import sChristmas2025 from "file://./sounds/discord-christmas-2025.mp3?base64";
import sDiscordixErix from "file://./sounds/discordix-erix.mp3?base64";
import sNatural from "file://./sounds/discord-natural.mp3?base64";
import sNight from "file://./sounds/discord-night.mp3?base64";
import s8bit from "file://./sounds/discord-8bit.mp3?base64";
import sChill from "file://./sounds/discord-chill.mp3?base64";
import sAnime from "file://./sounds/discord-anime.mp3?base64";

type Cat = "classic" | "halloween" | "christmas" | "remixes" | "songs";

const CATEGORY_LABELS: Record<Cat, string> = {
    classic: "Classic",
    halloween: "Halloween",
    christmas: "Christmas",
    remixes: "Remixes",
    songs: "Songs",
};

interface Preset {
    id: string;
    label: string;
    cat: Cat;
}

const PRESETS: Preset[] = [
    { id: "discord-classic", label: "Classic", cat: "classic" },
    { id: "classic-speedup", label: "Classic — Speed Up", cat: "classic" },
    { id: "classic-remix", label: "Classic — Remix", cat: "classic" },
    { id: "discord-halloween-2020", label: "Discord Halloween 2020", cat: "halloween" },
    { id: "discord-halloween-2022", label: "Discord Halloween 2022", cat: "halloween" },
    { id: "discord-halloween-2023", label: "Discord Halloween 2023", cat: "halloween" },
    { id: "discord-halloween-2024", label: "Discord Halloween 2024", cat: "halloween" },
    { id: "discord-halloween-2025", label: "Discord Halloween 2025", cat: "halloween" },
    { id: "discord-halloween-2026", label: "Discord Halloween 2026", cat: "halloween" },
    { id: "discord-halloween-2024-remix", label: "Discord Halloween 2024 — Remix", cat: "halloween" },
    { id: "discord-christmas-2020", label: "Discord Christmas 2020", cat: "christmas" },
    { id: "discord-christmas-2022-3", label: "Discord Christmas 2022(3)", cat: "christmas" },
    { id: "discord-christmas-2024", label: "Discord Christmas 2024", cat: "christmas" },
    { id: "discord-christmas-2025", label: "Discord Christmas 2025", cat: "christmas" },
    { id: "discord-secret", label: "Discord Secret", cat: "classic" },
    { id: "discordix-erix", label: "Discordix — Erix (обрезанная)", cat: "songs" },
    { id: "discord-natural", label: "Discord Natural", cat: "remixes" },
    { id: "discord-night", label: "Discord Night", cat: "remixes" },
    { id: "discord-8bit", label: "Discord 8-bit", cat: "classic" },
    { id: "discord-chill", label: "Discord Chill", cat: "remixes" },
    { id: "discord-anime", label: "Discord Anime", cat: "remixes" },
];

const SOUND_DATA: Record<string, string> = {
    "discord-classic": sClassic,
    "classic-speedup": sClassicSpeedup,
    "classic-remix": sClassicRemix,
    "discord-secret": sSecret,
    "discord-halloween-2020": sHalloween2020,
    "discord-halloween-2022": sHalloween2022,
    "discord-halloween-2023": sHalloween2023,
    "discord-halloween-2024": sHalloween2024,
    "discord-halloween-2025": sHalloween2025,
    "discord-halloween-2024-remix": sHalloween2024Remix,
    "discord-halloween-2026": sHalloween2026,
    "discord-christmas-2020": sChristmas2020,
    "discord-christmas-2022-3": sChristmas2022,
    "discord-christmas-2024": sChristmas2024,
    "discord-christmas-2025": sChristmas2025,
    "discordix-erix": sDiscordixErix,
    "discord-natural": sNatural,
    "discord-night": sNight,
    "discord-8bit": s8bit,
    "discord-chill": sChill,
    "discord-anime": sAnime,
};

function getPresetUrl(id: string): string {
    return `data:audio/mpeg;base64,${SOUND_DATA[id]}`;
}

// === UI STYLES (lazy inject — head may not exist at module load) ===
let ccStylesInjected = false;
function ensureCcStyles() {
    if (ccStylesInjected) return;
    try {
        if (!document || !document.head) return;
        const styleEl = document.createElement("style");
        styleEl.id = "cc-styles";
        styleEl.textContent = `
.cc-range { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; background: var(--background-secondary-alt); outline: none; cursor: pointer; }
.cc-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: var(--brand-500); border: none; cursor: pointer; }
.cc-range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--brand-500); border: none; cursor: pointer; }
.cc-opt { padding: 9px 12px; cursor: pointer; font-size: 14px; color: var(--text-normal); }
.cc-opt:hover { background: var(--background-modifier-hover); }
.cc-opt.sel { background: var(--background-modifier-selected); }
`;
        document.head.appendChild(styleEl);
        ccStylesInjected = true;
    } catch { }
}

// === AUDIO ENGINE ===
let currentAudio: HTMLAudioElement | null = null;
let currentDir: "in" | "out" = "in";
let previewDir: "in" | "out" | null = null;
const previewListeners = new Set<() => void>();

function notifyPreview() {
    previewListeners.forEach(l => l());
}

function dirSrc(dir: "in" | "out"): string {
    const st = settings.store;
    const customOn = Boolean(dirKey(dir, "customEnabled"));
    if (customOn) {
        const url = (dirKey(dir, "url") || "").trim();
        if (url) return url;
        const custom = dirKey(dir, "custom") || "";
        if (custom) return custom;
    }
    const preset = dir === "in" ? st.in_preset : st.out_preset;
    return getPresetUrl(preset);
}

function dirKey(dir: "in" | "out", key: string): any {
    return settings.store[`${dir}_${key}` as keyof typeof settings.store];
}

function playDir(dir: "in" | "out", volume: number) {
    stopCustom();

    const trimStart = Math.max(0, Number(dirKey(dir, "trimStart")) || 0);
    let trimEnd = Number(dirKey(dir, "trimEnd")) || 0;
    const loop = dirKey(dir, "loop") !== false;

    const audio = new Audio(dirSrc(dir));
    audio.volume = volume;
    audio.loop = false;

    audio.addEventListener("loadedmetadata", () => {
        if (!trimEnd || trimEnd > audio.duration) trimEnd = audio.duration;
        audio.currentTime = Math.min(trimStart, Math.max(0, audio.duration - 0.05));
    });

    audio.addEventListener("timeupdate", () => {
        const end = trimEnd || audio.duration;
        if (audio.currentTime >= end) {
            if (loop) audio.currentTime = Math.min(trimStart, Math.max(0, end - 0.05));
            else { audio.pause(); currentAudio = null; }
        }
    });

    audio.play().catch(() => { });
    currentAudio = audio;
    currentDir = dir;
    previewDir = dir;
    notifyPreview();
}

function stopCustom() {
    currentAudio?.pause();
    currentAudio = null;
    previewDir = null;
    notifyPreview();
}

// === SETTINGS ===
// hidden keys (stored but not rendered)
const hidden = (defaultValue: any) => ({
    type: OptionType.COMPONENT,
    description: "hidden",
    default: defaultValue,
    component: () => null,
});

// custom toggle row (Vencord draws BOOLEAN titles from the raw key, so we build our own)
function Toggle({ label, sub, value, onChange }: {
    label: string;
    sub: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div
            onClick={() => onChange(!value)}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                background: "var(--background-secondary-alt, #1e1f22)",
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 10,
                userSelect: "none",
            }}
        >
            <div>
                <div style={{ color: "var(--text-normal, #dbdee1)", fontSize: 16, fontWeight: 600 }}>{label}</div>
                <div style={{ color: "var(--header-secondary, #949ba4)", fontSize: 13, marginTop: 2 }}>{sub}</div>
            </div>
            <div style={{
                width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                background: value ? "var(--brand-500, #5865f2)" : "var(--background-modifier-active, #4e5058)",
                position: "relative", transition: "background .15s",
            }}>
                <div style={{
                    position: "absolute", top: 2, left: value ? 22 : 2,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#fff", transition: "left .15s",
                }} />
            </div>
        </div>
    );
}

function ToggleSection({ storageKey, label, sub }: {
    storageKey: "inReplace" | "outReplace";
    label: string;
    sub: string;
}) {
    settings.use();
    return (
        <Toggle
            label={label}
            sub={sub}
            value={Boolean((settings.store as any)[storageKey])}
            onChange={v => { (settings.store as any)[storageKey] = v; }}
        />
    );
}

// custom dropdown in Discord style (in-flow accordion — no overlays)
function Dropdown({ value, options, onChange }: {
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => { ensureCcStyles(); }, []);
    const current = options.find(o => o.value === value);

    return (
        <div>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    background: "var(--input-background, #1e1f22)",
                    border: "1px solid var(--input-border, #1e1f22)",
                    color: "var(--text-normal, #dbdee1)",
                    borderRadius: 6,
                    padding: "11px 12px",
                    fontSize: 15,
                    cursor: "pointer",
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span>{current?.label ?? "—"}</span>
                <span style={{ color: "var(--text-muted, #949ba4)", fontSize: 12 }}>{open ? "▲" : "▼"}</span>
            </div>
            {open && (
                <div style={{
                    marginTop: 4,
                    background: "var(--background-secondary, #2b2d31)",
                    borderRadius: 6,
                    border: "1px solid var(--background-modifier-active, #4e5058)",
                }}>
                    {options.map(o => (
                        <div
                            key={o.value}
                            className={"cc-opt" + (o.value === value ? " sel" : "")}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                        >
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function makeSection(dir: "in" | "out", title: string) {
    return function Section() {
        settings.use();
        const st = settings.store;
        const [open, setOpen] = React.useState(true);
        const [, force] = React.useReducer(x => x + 1, 0);

        React.useEffect(() => {
            ensureCcStyles();
            const l = () => force();
            previewListeners.add(l);
            return () => {
                previewListeners.delete(l);
                if (previewDir === dir) stopCustom(); // выход из настроек — стоп превью
            };
        }, []);

        const get = (k: string) => (dir === "in" ? (st as any)[`in_${k}`] : (st as any)[`out_${k}`]);
        const set = (k: string, v: any) => {
            if (dir === "in") (st as any)[`in_${k}`] = v;
            else (st as any)[`out_${k}`] = v;
            // если меняем источник звука во время превью — перезапускаем его с новым звуком
            if ((k === "preset" || k === "custom" || k === "url") && previewDir === dir)
                playDir(dir, get("volume") / 100);
        };

        const playing = previewDir === dir;
        const cat = get("category") as Cat;
        const catOptions = (Object.keys(CATEGORY_LABELS) as Cat[]).map(c => ({ value: c, label: CATEGORY_LABELS[c] }));
        const presetOptions = PRESETS.filter(p => p.cat === cat).map(p => ({ value: p.id, label: p.label }));

        const row = (label: string, children: React.ReactNode) => (
            <div>
                <div style={{ color: "var(--header-secondary, #949ba4)", fontSize: 14, marginBottom: 6 }}>{label}</div>
                {children}
            </div>
        );

        const inputStyle: React.CSSProperties = {
            width: "100%",
            background: "var(--input-background, #1e1f22)",
            border: "1px solid var(--input-border, #1e1f22)",
            color: "var(--text-normal, #dbdee1)",
            borderRadius: 6,
            padding: "11px 12px",
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
        };

        return (
            <div style={{
                borderRadius: 8,
                background: open ? "var(--background-secondary, #2b2d31)" : "transparent",
                padding: open ? 14 : 0,
                marginBottom: 10,
            }}>
                <div
                    onClick={() => setOpen(!open)}
                    style={{
                        cursor: "pointer",
                        padding: "13px 14px",
                        borderRadius: 8,
                        background: "var(--background-secondary-alt, #1e1f22)",
                        color: "var(--text-normal, #dbdee1)",
                        fontWeight: 600,
                        fontSize: 16,
                        userSelect: "none",
                    }}
                >
                    {open ? "▼" : "▶"} {title}
                </div>

                {open && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                        {row("Категория / Category", (
                            <Dropdown
                                value={cat}
                                options={catOptions}
                                onChange={v => {
                                    set("category", v);
                                    const first = PRESETS.find(p => p.cat === v);
                                    if (first) set("preset", first.id);
                                }}
                            />
                        ))}

                        {row("Звук / Sound", (
                            <Dropdown
                                value={get("preset")}
                                options={presetOptions}
                                onChange={v => set("preset", v)}
                            />
                        ))}

                        <Toggle
                            label="Включить кастомную музыку / Use custom sound"
                            sub="Вкл: играет файл или URL. Выкл: играет выбранный пресет."
                            value={get("customEnabled") === true}
                            onChange={v => {
                                set("customEnabled", v);
                                if (previewDir === dir) playDir(dir, get("volume") / 100);
                            }}
                        />

                        {row("Свой файл / Custom file", (
                            <div>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    style={{ fontSize: 14, color: "var(--text-normal)" }}
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            set("custom", reader.result as string);
                                            set("customName", file.name);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                />
                                {get("customName") && (
                                    <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
                                        Загружено: {get("customName")}
                                    </div>
                                )}
                            </div>
                        ))}

                        {row("Ссылка на песню / Song URL (приоритет над файлом)", (
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="https://example.com/song.mp3"
                                value={get("url") || ""}
                                onChange={e => set("url", e.target.value)}
                            />
                        ))}

                        {row(`Громкость / Volume: ${get("volume")}%`, (
                            <input
                                type="range"
                                className="cc-range"
                                min={0}
                                max={100}
                                value={get("volume")}
                                onChange={e => {
                                    set("volume", Number(e.target.value));
                                    if (currentAudio && currentDir === dir)
                                        currentAudio.volume = Number(e.target.value) / 100;
                                }}
                            />
                        ))}

                        <label style={{ color: "var(--text-normal)", fontSize: 15, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                style={{ width: 18, height: 18 }}
                                checked={get("loop") !== false}
                                onChange={e => set("loop", e.target.checked)}
                            />
                            Зацикливать / Loop
                        </label>

                        {row("Обрезка, сек / Trim, sec (0 = без обрезки)", (
                            <div style={{ display: "flex", gap: 10 }}>
                                <input
                                    type="number"
                                    min={0}
                                    style={{ ...inputStyle, width: "50%" }}
                                    placeholder="Начало / Start"
                                    value={get("trimStart") || 0}
                                    onChange={e => set("trimStart", Number(e.target.value))}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    style={{ ...inputStyle, width: "50%" }}
                                    placeholder="Конец / End"
                                    value={get("trimEnd") || 0}
                                    onChange={e => set("trimEnd", Number(e.target.value))}
                                />
                            </div>
                        ))}

                        <div>
                            <Button
                                size={Button.Sizes.LARGE}
                                onClick={() => {
                                    if (playing) stopCustom();
                                    else playDir(dir, get("volume") / 100);
                                }}
                            >
                                {playing ? "■ Stop / Остановить" : "▶ Preview / Прослушать"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    };
}

const settings = definePluginSettings({
    notice: {
        type: OptionType.COMPONENT,
        component: () => (
            <div style={{
                padding: "12px 16px",
                marginBottom: "16px",
                borderRadius: "8px",
                backgroundColor: "var(--background-secondary-alt, #1e1f22)",
                color: "var(--text-normal, #dbdee1)",
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
    inToggle: {
        type: OptionType.COMPONENT,
        component: () => (
            <ToggleSection
                storageKey="inReplace"
                label="Входящий звонок / Incoming call"
                sub="Заменять звук входящего звонка / Replace incoming ringtone"
            />
        ),
    },
    outToggle: {
        type: OptionType.COMPONENT,
        component: () => (
            <ToggleSection
                storageKey="outReplace"
                label="Исходящий звонок / Outgoing call"
                sub="Заменять звук исходящего звонка / Replace outgoing ringtone"
            />
        ),
    },
    inSection: {
        type: OptionType.COMPONENT,
        component: makeSection("in", "Входящий звонок"),
    },
    outSection: {
        type: OptionType.COMPONENT,
        component: makeSection("out", "Исходящий звонок"),
    },

    // hidden stored keys
    inReplace: hidden(true),
    outReplace: hidden(false),
    in_customEnabled: hidden(false),
    out_customEnabled: hidden(false),
    in_category: hidden("halloween"),
    in_preset: hidden("discord-halloween-2025"),
    in_custom: hidden(""),
    in_customName: hidden(""),
    in_url: hidden(""),
    in_volume: hidden(80),
    in_loop: hidden(true),
    in_trimStart: hidden(0),
    in_trimEnd: hidden(0),
    out_category: hidden("classic"),
    out_preset: hidden("discord-classic"),
    out_custom: hidden(""),
    out_customName: hidden(""),
    out_url: hidden(""),
    out_volume: hidden(80),
    out_loop: hidden(true),
    out_trimStart: hidden(0),
    out_trimEnd: hidden(0),
});

export default definePlugin({
    name: "CustomCall",
    description: "Custom ringtones for Discord calls: presets or your own file/URL with trim, loop and volume. NOTE: if a seasonal event (Halloween, New Year) is currently replacing the call ringtone, disable the event sound pack in Settings -> Notifications.",
    authors: [{ name: "missedvq", id: 1104693502039834654n }],
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

    dirOf(name: unknown): "in" | "out" {
        return typeof name === "string" && name.startsWith("call_calling") ? "out" : "in";
    },

    resolveSrc(player: { name: unknown }, req: (path: string) => string): string {
        const { name } = player;
        if (typeof name !== "string") return req("./undefined.mp3");

        const dir = this.dirOf(name);
        const replace = Boolean(dir === "in"
            ? (settings.store as any).inReplace
            : (settings.store as any).outReplace);

        if (this.isCallSound(name) && replace) {
            stopCustom(); // реальный звонок — глушим превью
            return dirSrc(dir);
        }
        return req(`./${name}.mp3`);
    },

    volumeScale(player: { name: unknown }): number {
        if (!this.isCallSound(player.name)) return 1;
        const dir = this.dirOf(player.name);
        return (Number(dirKey(dir, "volume")) || 80) / 100;
    },

    applyLoopAndTrim(player: { name: unknown }, el: HTMLAudioElement) {
        if (!this.isCallSound(player.name)) return;

        const dir = this.dirOf(player.name);
        const loop = dirKey(dir, "loop") !== false;

        el.loop = false;

        el.addEventListener("loadedmetadata", () => {
            const start = Math.max(0, Number(dirKey(dir, "trimStart")) || 0);
            if (start > 0) el.currentTime = Math.min(start, Math.max(0, el.duration - 0.05));
        });

        el.addEventListener("timeupdate", () => {
            const start = Math.max(0, Number(dirKey(dir, "trimStart")) || 0);
            let end = Number(dirKey(dir, "trimEnd")) || 0;
            if (!end || end > el.duration) end = el.duration;
            if (el.currentTime >= end) {
                if (loop) el.currentTime = Math.min(start, Math.max(0, end - 0.05));
                else el.pause();
            }
        });
    },
});
