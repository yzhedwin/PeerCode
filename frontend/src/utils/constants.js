export const EDITOR_SUPPORTED_LANGUAGES = [
    {
        id: 50,
        name: "C (GCC 9.2.0)",
        raw: "c",
    },
    {
        id: 54,
        name: "C++ (GCC 9.2.0)",
        raw: "cpp",
    },
    {
        id: 51,
        name: "C# (Mono 6.6.0.161)",
        raw: "csharp",
    },
    {
        id: 60,
        name: "Go (1.13.5)",
        raw: "go",
    },
    {
        id: 62,
        name: "Java (OpenJDK 13.0.1)",
        raw: "java",
    },
    {
        id: 63,
        name: "JavaScript (Node.js 12.14.0)",
        raw: "javascript",
    },
    {
        id: 78,
        name: "Kotlin (1.3.70)",
        raw: "kotlin",
    },
    {
        id: 64,
        name: "Lua (5.3.5)",
        raw: "lua",
    },
    {
        id: 79,
        name: "Objective-C (Clang 7.0.1)",
        raw: "objective-c",
    },
    {
        id: 85,
        name: "Perl (5.28.1)",
        raw: "perl",
    },
    {
        id: 68,
        name: "PHP (7.4.1)",
        raw: "php",
    },
    {
        id: 71,
        name: "Python (3.8.1)",
        raw: "python",
    },
    {
        id: 71,
        name: "Python3",
        raw: "python",
    },
    {
        id: 72,
        name: "Ruby (2.7.0)",
        raw: "ruby",
    },
    {
        id: 73,
        name: "Rust (1.40.0)",
        raw: "rust",
    },
    {
        id: 82,
        name: "SQL (SQLite 3.27.2)",
        raw: "sql",
    },
    {
        id: 83,
        name: "Swift (5.2.3)",
        raw: "swift",
    },
    {
        id: 74,
        name: "TypeScript (3.7.4)",
        raw: "typescript",
    },
];

export const API_GATEWAY = process.env.REACT_APP_API_GATEWAY;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL; 

export const MATCHMAKING_TIMEOUT = process.env.REACT_APP_MATCHMAKING_TIMEOUT;

export const EDITOR_SUPPORTED_THEMES = {
    "vs-dark": "vs-dark",
    light: "light",
    active4d: "Active4D",
    "all-hallows-eve": "All Hallows Eve",
    amy: "Amy",
    "birds-of-paradise": "Birds of Paradise",
    blackboard: "Blackboard",
    "brilliance-black": "Brilliance Black",
    "brilliance-dull": "Brilliance Dull",
    "chrome-devtools": "Chrome DevTools",
    "clouds-midnight": "Clouds Midnight",
    clouds: "Clouds",
    cobalt: "Cobalt",
    dawn: "Dawn",
    dreamweaver: "Dreamweaver",
    eiffel: "Eiffel",
    "espresso-libre": "Espresso Libre",
    github: "GitHub",
    idle: "IDLE",
    katzenmilch: "Katzenmilch",
    "kuroir-theme": "Kuroir Theme",
    lazy: "LAZY",
    "magicwb--amiga-": "MagicWB (Amiga)",
    "merbivore-soft": "Merbivore Soft",
    merbivore: "Merbivore",
    "monokai-bright": "Monokai Bright",
    monokai: "Monokai",
    "night-owl": "Night Owl",
    "oceanic-next": "Oceanic Next",
    "pastels-on-dark": "Pastels on Dark",
    "slush-and-poppies": "Slush and Poppies",
    "solarized-dark": "Solarized-dark",
    "solarized-light": "Solarized-light",
    spacecadet: "SpaceCadet",
    sunburst: "Sunburst",
    "textmate--mac-classic-": "Textmate (Mac Classic)",
    "tomorrow-night-blue": "Tomorrow-Night-Blue",
    "tomorrow-night-bright": "Tomorrow-Night-Bright",
    "tomorrow-night-eighties": "Tomorrow-Night-Eighties",
    "tomorrow-night": "Tomorrow-Night",
    tomorrow: "Tomorrow",
    twilight: "Twilight",
    "upstream-sunburst": "Upstream Sunburst",
    "vibrant-ink": "Vibrant Ink",
    "xcode-default": "Xcode_default",
    zenburnesque: "Zenburnesque",
    iplastic: "iPlastic",
    idlefingers: "idleFingers",
    krtheme: "krTheme",
    monoindustrial: "monoindustrial",
};

export const QUESTION_STATUS = {
    ATTEMPTED: "Attempted",
    COMPLETED: "Completed",
    NOT_ATTEMPTED: "Not Attempted",
};

export const JUDGE_STATUS = [
    {
        id: 1,
        description: "In Queue",
    },
    {
        id: 2,
        description: "Processing",
    },
    {
        id: 3,
        description: "Accepted",
    },
    {
        id: 4,
        description: "Wrong Answer",
    },
    {
        id: 5,
        description: "Time Limit Exceeded",
    },
    {
        id: 6,
        description: "Compilation Error",
    },
    {
        id: 7,
        description: "Runtime Error (SIGSEGV)",
    },
    {
        id: 8,
        description: "Runtime Error (SIGXFSZ)",
    },
    {
        id: 9,
        description: "Runtime Error (SIGFPE)",
    },
    {
        id: 10,
        description: "Runtime Error (SIGABRT)",
    },
    {
        id: 11,
        description: "Runtime Error (NZEC)",
    },
    {
        id: 12,
        description: "Runtime Error (Other)",
    },
    {
        id: 13,
        description: "Internal Error",
    },
    {
        id: 14,
        description: "Exec Format Error",
    },
];
