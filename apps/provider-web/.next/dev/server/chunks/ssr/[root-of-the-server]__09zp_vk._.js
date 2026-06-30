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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const SensitiveContentBoundary = ({ authorized, children, fallback = null, label = "Sensitive content boundary" })=>{
    if (!authorized) return fallback ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
        "aria-label": label,
        "data-sensitive-boundary": "redacted",
        children: fallback
    }) : null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.41.0_react_1f856a0cccf20bdcfa7c92d97b45a938/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion@12.41.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/motion/dist/es/react.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)");
;
;
;
const MotionPresence = ({ present, profile = "SUBTLE", children })=>{
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsByProfile"][profile];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        mode: "wait",
        children: present ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$MotionConfig$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.41.0_react_1f856a0cccf20bdcfa7c92d97b45a938/node_modules/framer-motion/dist/es/components/MotionConfig/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)");
;
;
;
const MotionProvider = ({ profile = "STANDARD", children })=>{
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsByProfile"][profile];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$MotionConfig$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MotionConfig"], {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/motion@12.41.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/motion/dist/es/react.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.41.0_react_1f856a0cccf20bdcfa7c92d97b45a938/node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/profiles.js [app-rsc] (ecmascript)");
;
;
;
const MotionReveal = ({ profile = "STANDARD", children, className, id })=>{
    const prefersReducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$41$2e$0_react_1f856a0cccf20bdcfa7c92d97b45a938$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$reduced$2d$motion$2f$use$2d$reduced$2d$motion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const settings = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$profiles$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["settingsByProfile"][prefersReducedMotion ? "REDUCED" : profile];
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$motion$40$12$2e$41$2e$0_react$2d$dom$40$19$2e$2$2e$7_react$40$19$2e$2$2e$7_$5f$react$40$19$2e$2$2e$7$2f$node_modules$2f$motion$2f$dist$2f$es$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["motion"].div, {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Alert = ({ tone = "info", title, children })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("section", {
        className: `nh-alert nh-alert--${tone}`,
        role: tone === "danger" ? "alert" : "status",
        "aria-label": title,
        children: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("strong", {
                children: title
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Button = ({ variant = "primary", children, className = "", ...props })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("button", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionPresence$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/motion/MotionPresence.js [app-rsc] (ecmascript)");
;
;
const Dialog = ({ open, title, children })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$motion$2f$MotionPresence$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MotionPresence"], {
        present: open,
        profile: "SAFETY-IMMEDIATE",
        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "nh-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": title,
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: "nh-dialog__panel",
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("h2", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Field = ({ label, hint, id, className = "", ...props })=>{
    const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])("label", {
        className: `nh-field ${className}`.trim(),
        htmlFor: fieldId,
        children: [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("span", {
                className: "nh-field__label",
                children: label
            }),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("input", {
                id: fieldId,
                className: "nh-field__input",
                ...props
            }),
            hint ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("span", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Stack = ({ gap = "md", direction = "column", children, className = "", ...props })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])("div", {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
const Surface = ({ as: Component = "section", tone = "plain", children, className = "", ...props })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(Component, {
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
"[project]/apps/provider-web/src/shell.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createProviderShellApiClient",
    ()=>createProviderShellApiClient,
    "providerShellDescriptor",
    ()=>providerShellDescriptor
]);
const providerShellDescriptor = {
    appId: "provider-web",
    issue: "P02-ISS-012",
    syntheticOnly: true,
    protectedProviderDetailsExposed: false
};
function createProviderShellApiClient(baseUrl, factory) {
    return factory(baseUrl);
}
}),
"[project]/apps/provider-web/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProviderWebHomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.9_@playwright+tes_7146846370e86d5ed17fe21d038ae4f6/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Alert.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Stack$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Stack.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Surface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-foundation/lib/primitives/Surface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$provider$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/provider-web/src/shell.ts [app-rsc] (ecmascript)");
;
;
;
function ProviderWebHomePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Surface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Surface"], {
            as: "section",
            "aria-labelledby": "provider-shell-title",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Stack$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Stack"], {
                gap: "md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        id: "provider-shell-title",
                        children: "Provider Web Shell"
                    }, void 0, false, {
                        fileName: "[project]/apps/provider-web/app/page.tsx",
                        lineNumber: 9,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "This shell is synthetic-only and does not expose protected pharmacy or laboratory provider details before payment authorization."
                    }, void 0, false, {
                        fileName: "[project]/apps/provider-web/app/page.tsx",
                        lineNumber: 10,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$9_$40$playwright$2b$tes_7146846370e86d5ed17fe21d038ae4f6$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$foundation$2f$lib$2f$primitives$2f$Alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Alert"], {
                        tone: "info",
                        title: "Phase 2 Foundation",
                        children: `Issue: ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$provider$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["providerShellDescriptor"].issue} | App: ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$provider$2d$web$2f$src$2f$shell$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["providerShellDescriptor"].appId}`
                    }, void 0, false, {
                        fileName: "[project]/apps/provider-web/app/page.tsx",
                        lineNumber: 14,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/provider-web/app/page.tsx",
                lineNumber: 8,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/provider-web/app/page.tsx",
            lineNumber: 7,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/provider-web/app/page.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/provider-web/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/provider-web/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09zp_vk._.js.map