module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/packages/ui-foundation/lib/SensitiveContentBoundary.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SensitiveContentBoundary",
    ()=>SensitiveContentBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const SensitiveContentBoundary = ({ authorized, children, fallback = null, label = "Sensitive content boundary" })=>{
    if (!authorized) return fallback ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
        "aria-label": label,
        "data-sensitive-boundary": "redacted",
        children: fallback
    }) : null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    });
};
}),
"[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "motionProfiles",
    ()=>motionProfiles,
    "settingsByProfile",
    ()=>settingsByProfile
]);
const motionProfiles = [
    "NONE",
    "REDUCED",
    "SUBTLE",
    "STANDARD",
    "EMPHASIZED",
    "SAFETY-IMMEDIATE"
];
const settingsByProfile = {
    NONE: {
        profile: "NONE",
        durationMs: 0,
        distancePx: 0,
        reducedMotion: "always"
    },
    REDUCED: {
        profile: "REDUCED",
        durationMs: 80,
        distancePx: 0,
        reducedMotion: "user"
    },
    SUBTLE: {
        profile: "SUBTLE",
        durationMs: 140,
        distancePx: 4,
        reducedMotion: "user"
    },
    STANDARD: {
        profile: "STANDARD",
        durationMs: 220,
        distancePx: 10,
        reducedMotion: "user"
    },
    EMPHASIZED: {
        profile: "EMPHASIZED",
        durationMs: 320,
        distancePx: 14,
        reducedMotion: "user"
    },
    "SAFETY-IMMEDIATE": {
        profile: "SAFETY-IMMEDIATE",
        durationMs: 40,
        distancePx: 0,
        reducedMotion: "always"
    }
};
}),
"[project]/packages/ui-foundation/lib/motion/MotionPresence.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MotionPresence",
    ()=>MotionPresence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.41.0_react_1f856a0cccf20bdcfa7c92d97b45a938/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion@12.41.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/motion/dist/es/react.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)");
;
;
;
const MotionPresence = ({ present, profile = "SUBTLE", children })=>{
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsByProfile"][profile];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        mode: "wait",
        children: present ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
            initial: {
                opacity: settings.durationMs === 0 ? 1 : 0
            },
            animate: {
                opacity: 1
            },
            exit: {
                opacity: 0
            },
            transition: {
                duration: settings.durationMs / 1000
            },
            children: children
        }, "present") : null
    });
};
}),
"[project]/packages/ui-foundation/lib/motion/MotionProvider.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MotionProvider",
    ()=>MotionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$MotionConfig$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.41.0_react_1f856a0cccf20bdcfa7c92d97b45a938/node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)");
;
;
;
const MotionProvider = ({ profile = "STANDARD", children })=>{
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsByProfile"][profile];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$MotionConfig$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MotionConfig"], {
        reducedMotion: settings.reducedMotion,
        transition: {
            duration: settings.durationMs / 1000
        },
        children: children
    });
};
}),
"[project]/packages/ui-foundation/lib/motion/MotionReveal.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MotionReveal",
    ()=>MotionReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion@12.41.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/motion/dist/es/react.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.41.0_react_1f856a0cccf20bdcfa7c92d97b45a938/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)");
;
;
;
const MotionReveal = ({ profile = "STANDARD", children, className, id })=>{
    const prefersReducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsByProfile"][prefersReducedMotion ? "REDUCED" : profile];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
        id: id,
        className: className,
        initial: {
            opacity: settings.durationMs === 0 ? 1 : 0,
            y: settings.distancePx
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: settings.durationMs / 1000,
            ease: [
                0.2,
                0.8,
                0.2,
                1
            ]
        },
        children: children
    });
};
}),
"[project]/packages/ui-foundation/lib/primitives/Alert.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Alert",
    ()=>Alert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Alert = ({ tone = "info", title, children })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("section", {
        className: `nh-alert nh-alert--${tone}`,
        role: tone === "danger" ? "alert" : "status",
        "aria-label": title,
        children: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("strong", {
                children: title
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
                children: children
            })
        ]
    });
}),
"[project]/packages/ui-foundation/lib/primitives/Button.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Button = ({ variant = "primary", children, className = "", ...props })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("button", {
        className: `nh-button nh-button--${variant} ${className}`.trim(),
        ...props,
        children: children
    });
}),
"[project]/packages/ui-foundation/lib/primitives/Dialog.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionPresence$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/MotionPresence.js [app-rsc] (ecmascript)");
;
;
const Dialog = ({ open, title, children })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionPresence$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MotionPresence"], {
        present: open,
        profile: "SAFETY-IMMEDIATE",
        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "nh-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": title,
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: "nh-dialog__panel",
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("h2", {
                        children: title
                    }),
                    children
                ]
            })
        })
    });
}),
"[project]/packages/ui-foundation/lib/primitives/Field.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Field",
    ()=>Field
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Field = ({ label, hint, id, className = "", ...props })=>{
    const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("label", {
        className: `nh-field ${className}`.trim(),
        htmlFor: fieldId,
        children: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("span", {
                className: "nh-field__label",
                children: label
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("input", {
                id: fieldId,
                className: "nh-field__input",
                ...props
            }),
            hint ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("span", {
                className: "nh-field__hint",
                children: hint
            }) : null
        ]
    });
};
}),
"[project]/packages/ui-foundation/lib/primitives/Stack.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Stack",
    ()=>Stack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Stack = ({ gap = "md", direction = "column", children, className = "", ...props })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: `nh-stack nh-stack--${direction} nh-stack--${gap} ${className}`.trim(),
        ...props,
        children: children
    });
}),
"[project]/packages/ui-foundation/lib/primitives/Surface.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Surface",
    ()=>Surface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Surface = ({ as: Component = "section", tone = "plain", children, className = "", ...props })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(Component, {
        className: `nh-surface nh-surface--${tone} ${className}`.trim(),
        ...props,
        children: children
    });
}),
"[project]/packages/ui-foundation/lib/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$SensitiveContentBoundary$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/SensitiveContentBoundary.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionPresence$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/MotionPresence.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionProvider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/MotionProvider.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionReveal$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/MotionReveal.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Alert.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Button$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Button.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Dialog$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Dialog.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Field$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Field.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Stack$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Stack.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Surface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Surface.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/apps/patient-web/src/shell.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPatientShellApiClient",
    ()=>createPatientShellApiClient,
    "patientShellDescriptor",
    ()=>patientShellDescriptor,
    "patientShellNavigation",
    ()=>patientShellNavigation,
    "patientShellStateScaffolds",
    ()=>patientShellStateScaffolds
]);
const patientShellDescriptor = {
    appId: "patient-web",
    issue: "P02-ISS-012",
    phase5Issue: "P05-ISS-001",
    syntheticOnly: true,
    protectedProviderDetailsExposed: false
};
const patientShellNavigation = [
    "Overview",
    "Appointments",
    "Care timeline",
    "Billing",
    "Settings"
];
const patientShellStateScaffolds = [
    {
        key: "loading",
        title: "Loading",
        message: "Show predictable loading placeholders while shell context initializes.",
        stateTone: "info"
    },
    {
        key: "empty",
        title: "Empty",
        message: "Show clear empty-state guidance when no records are available.",
        stateTone: "success"
    },
    {
        key: "error",
        title: "Error",
        message: "Show safe retry messaging when shell data fetch fails.",
        stateTone: "danger"
    },
    {
        key: "unauthorized",
        title: "Unauthorized",
        message: "Fail closed when access scope is missing or revoked.",
        stateTone: "warning"
    },
    {
        key: "offline",
        title: "Offline",
        message: "Preserve draft-safe behavior when connectivity is unavailable.",
        stateTone: "warning"
    },
    {
        key: "reduced-motion",
        title: "Reduced motion",
        message: "Respect reduced-motion preference while preserving readable shell transitions.",
        stateTone: "info"
    }
];
function createPatientShellApiClient(baseUrl, factory) {
    return factory(baseUrl);
}
}),
"[project]/apps/patient-web/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PatientWebHomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_46889c56b216b77b7b53033aa3329009/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Alert.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Stack$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Stack.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Surface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Surface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/patient-web/src/shell.ts [app-rsc] (ecmascript)");
;
;
;
function PatientWebHomePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "nh-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Surface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Surface"], {
                as: "section",
                "aria-labelledby": "patient-shell-title",
                className: "nh-shell__header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Stack$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Stack"], {
                    gap: "md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            id: "patient-shell-title",
                            children: "Patient Web Shell"
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 13,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "This shell is synthetic-only and does not expose protected pharmacy or laboratory provider details before payment authorization."
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            "aria-label": "Patient shell navigation scaffold",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "nh-shell__nav",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["patientShellNavigation"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "nh-shell__nav-item",
                                        children: item
                                    }, item, false, {
                                        fileName: "[project]/apps/patient-web/app/page.tsx",
                                        lineNumber: 21,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/apps/patient-web/app/page.tsx",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 18,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Alert"], {
                            tone: "info",
                            title: "Phase 2 Foundation",
                            children: `Issue: ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["patientShellDescriptor"].issue} | App: ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["patientShellDescriptor"].appId}`
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Alert"], {
                            tone: "success",
                            title: "Phase 5 Foundation",
                            children: `Issue: ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["patientShellDescriptor"].phase5Issue} | State scaffolds: ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["patientShellStateScaffolds"].length}`
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/patient-web/app/page.tsx",
                    lineNumber: 12,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/patient-web/app/page.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-labelledby": "patient-shell-state-title",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Stack$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Stack"], {
                    gap: "sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            id: "patient-shell-state-title",
                            children: "Patient shell state scaffolds"
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "nh-shell__state-grid",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$patient$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["patientShellStateScaffolds"].map((state)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Surface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Surface"], {
                                    as: "article",
                                    tone: "raised",
                                    className: "nh-shell__state-card",
                                    "aria-label": `Patient shell ${state.title} state`,
                                    "data-shell-state": state.key,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: state.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/patient-web/app/page.tsx",
                                            lineNumber: 49,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: state.message
                                        }, void 0, false, {
                                            fileName: "[project]/apps/patient-web/app/page.tsx",
                                            lineNumber: 50,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_46889c56b216b77b7b53033aa3329009$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "nh-shell__state-meta",
                                            children: [
                                                "Tone: ",
                                                state.stateTone
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/patient-web/app/page.tsx",
                                            lineNumber: 51,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, state.key, true, {
                                    fileName: "[project]/apps/patient-web/app/page.tsx",
                                    lineNumber: 41,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/patient-web/app/page.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/patient-web/app/page.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/patient-web/app/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/patient-web/app/page.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/patient-web/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/patient-web/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0x1m5t0._.js.map