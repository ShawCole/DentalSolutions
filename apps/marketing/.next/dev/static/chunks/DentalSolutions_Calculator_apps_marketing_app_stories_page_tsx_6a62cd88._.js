(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StoriesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const stories = [
    {
        name: "Sarah Jenkins",
        location: "Los Angeles, CA",
        treatment: "Full Set Porcelain Veneers",
        quote: "I never thought I could afford a smile this perfect. The experience in Cancun was better than any dental visit I've had in the US. It truly was a vacation for my smile.",
        image: "/redesign/result1.png"
    },
    {
        name: "Michael Chen",
        location: "Toronto, Canada",
        treatment: "All-on-4 Dental Implants",
        quote: "The professionalism and technology at Dental Solutions are top-notch. I saved over 60% compared to my local quotes, and the result is flawless.",
        image: "/redesign/result1.png"
    },
    {
        name: "Anna Rodriguez",
        location: "Miami, FL",
        treatment: "Hollywood Smile Makeover",
        quote: "From the concierge picking me up at the airport to the final reveal, everything was seamless. I feel like a new person with my designer smile.",
        image: "/redesign/result1.png"
    }
];
const videos = [
    {
        url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b6793379d2316b471e21a.mp4",
        name: "Sarah's Transformation"
    },
    {
        url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b660c14eb6a868a001d8f.mp4",
        name: "Michael's New Smile"
    },
    {
        url: "https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974750759a77b9387a9f4c8.mp4",
        name: "Anna's Confidence",
        muteDuration: 0.5
    },
    {
        url: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/691b73b1013f312fd4892a65.mp4",
        name: "David's Experience"
    },
    {
        url: "https://storage.googleapis.com/msgsndr/dq3ylOAKb1QTcAeFKnwl/media/6974756ea87beb425d7caaae.mp4",
        name: "Matteo's Journey",
        startTime: 0.8
    }
];
const VideoTestimonial = ({ video })=>{
    _s();
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const start = video.startTime ?? 0.1;
    const handleInteraction = (active)=>{
        setIsHovered(active);
        if (videoRef.current) {
            if (active) {
                // Programmatic mute for specific duration if requested
                if (video.muteDuration) {
                    videoRef.current.muted = true;
                    setTimeout(()=>{
                        if (videoRef.current) videoRef.current.muted = false;
                    }, video.muteDuration * 1000);
                } else {
                    videoRef.current.muted = false;
                }
                videoRef.current.play().catch(()=>{});
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = start;
                videoRef.current.muted = false;
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-shrink-0 w-[280px] md:w-[320px] group overflow-hidden rounded-2xl bg-zinc-100 shadow-xl transition-all hover:shadow-2xl mx-3 md:mx-6 cursor-pointer relative",
        onMouseEnter: ()=>handleInteraction(true),
        onMouseLeave: ()=>handleInteraction(false),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-[9/16] bg-zinc-900 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        ref: videoRef,
                        loop: true,
                        playsInline: true,
                        preload: "metadata",
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("absolute inset-0 h-full w-full object-cover z-10 transition-transform duration-700", isHovered ? "scale-105" : "scale-100"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                            src: `${video.url}#t=${start}`,
                            type: "video/mp4"
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 83,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-500", isHovered ? "opacity-0" : "opacity-100")
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 87,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-4 left-4 z-30",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("flex h-1.5 w-1.5 rounded-full bg-gold", isHovered && "animate-pulse")
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] text-white font-bold uppercase tracking-widest",
                                    children: isHovered ? "Now Playing" : "Watch Story"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 94,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 93,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500", isHovered ? "opacity-0 scale-150" : "opacity-0 scale-100"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/30 shadow-2xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-10 h-10 text-white fill-current",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M8 5v14l11-7z"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 109,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 108,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 107,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 103,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 72,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 bg-white border-t border-zinc-100 relative z-30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-serif font-bold text-primary text-lg truncate group-hover:text-gold transition-colors",
                        children: video.name
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 115,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-zinc-400 uppercase tracking-widest font-black italic",
                                children: "Verified Result"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 117,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-0.5",
                                children: [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5
                                ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gold",
                                        children: "★"
                                    }, star, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 118,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 116,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 114,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
        lineNumber: 67,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(VideoTestimonial, "WvyStc9+l6UeB4trnVKaQ2DM390=");
_c = VideoTestimonial;
function StoriesPage() {
    _s1();
    const [activeStory, setActiveStory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-9d46210212716eb8" + " " + "min-h-screen bg-zinc-50 font-sans overflow-x-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "9d46210212716eb8",
                children: "@keyframes scroll{0%{transform:translate(0)}to{transform:translate(calc(-1600px - 15rem))}}.animate-scroll{will-change:transform;backface-visibility:hidden;width:max-content;animation:60s linear infinite scroll;display:flex}.animate-scroll:hover{animation-play-state:paused}.custom-scrollbar::-webkit-scrollbar{display:none}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "jsx-9d46210212716eb8" + " " + "fixed top-0 z-50 w-full bg-white/90 py-4 shadow-sm backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-9d46210212716eb8" + " " + "mx-auto flex max-w-7xl items-center justify-between px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/redesign",
                            className: "jsx-9d46210212716eb8" + " " + "text-2xl font-serif font-bold text-primary",
                            children: [
                                "DENTAL",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-9d46210212716eb8" + " " + "text-gold",
                                    children: "SOLUTIONS"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 31
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 157,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-9d46210212716eb8" + " " + "hidden space-x-8 md:flex",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/redesign",
                                    className: "jsx-9d46210212716eb8" + " " + "text-sm font-medium hover:text-gold transition-colors",
                                    children: "Home"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 161,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "jsx-9d46210212716eb8" + " " + "text-sm font-medium hover:text-gold transition-colors",
                                    children: "Treatments"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 162,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/redesign/vip",
                                    className: "jsx-9d46210212716eb8" + " " + "text-sm font-medium hover:text-gold transition-colors",
                                    children: "VIP Program"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "#",
                                    className: "jsx-9d46210212716eb8" + " " + "text-sm font-medium hover:text-gold transition-colors",
                                    children: "Prices"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 160,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/redesign/vip",
                            className: "jsx-9d46210212716eb8" + " " + "rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-gold transition-all duration-300",
                            children: "Book Consultation"
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 166,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                    lineNumber: 156,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 155,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-9d46210212716eb8" + " " + "bg-primary pt-32 pb-20 text-white px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-9d46210212716eb8" + " " + "mx-auto max-w-7xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "jsx-9d46210212716eb8" + " " + "mb-4 text-5xl font-serif font-bold md:text-6xl",
                            children: "Success Stories"
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 175,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "jsx-9d46210212716eb8" + " " + "mx-auto max-w-2xl text-lg text-white/70 font-light",
                            children: "Behind every smile is a journey. Explore how we've helped patients from around the world regain their confidence and oral health."
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 176,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                    lineNumber: 174,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 173,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-9d46210212716eb8" + " " + "py-24 px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-9d46210212716eb8" + " " + "mx-auto max-w-6xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9d46210212716eb8" + " " + "grid gap-12 md:grid-cols-2 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9d46210212716eb8" + " " + "relative overflow-hidden rounded-2xl shadow-2xl bg-white p-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: stories[activeStory].image,
                                        alt: "Before and After Results",
                                        width: 800,
                                        height: 600,
                                        className: "w-full h-auto rounded-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9d46210212716eb8" + " " + "absolute top-6 left-6 rounded-full bg-black/50 px-4 py-1 text-xs font-bold text-white backdrop-blur-sm",
                                        children: "BEFORE & AFTER"
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 186,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9d46210212716eb8" + " " + "space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9d46210212716eb8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-9d46210212716eb8" + " " + "mb-2 text-gold font-serif text-2xl italic",
                                                children: stories[activeStory].treatment
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                                lineNumber: 201,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "jsx-9d46210212716eb8" + " " + "text-4xl font-serif font-bold text-primary",
                                                children: stories[activeStory].name
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-9d46210212716eb8" + " " + "text-zinc-400 font-medium",
                                                children: stories[activeStory].location
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                                lineNumber: 203,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 200,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                        className: "jsx-9d46210212716eb8" + " " + "border-l-4 border-gold pl-8 py-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-9d46210212716eb8" + " " + "text-xl font-serif italic text-charcoal leading-relaxed",
                                            children: [
                                                '"',
                                                stories[activeStory].quote,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 206,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-9d46210212716eb8" + " " + "flex gap-4",
                                        children: stories.map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActiveStory(idx),
                                                className: "jsx-9d46210212716eb8" + " " + `h-3 w-3 rounded-full transition-all duration-300 ${activeStory === idx ? "bg-gold w-8" : "bg-zinc-300"}`
                                            }, idx, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 212,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/redesign/vip",
                                        className: "jsx-9d46210212716eb8" + " " + "rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-gold transition-all duration-300 inline-block text-center",
                                        children: "START YOUR JOURNEY"
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 199,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 185,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                    lineNumber: 184,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 183,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-9d46210212716eb8" + " " + "bg-white py-24 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9d46210212716eb8" + " " + "mb-16 px-6 max-w-7xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "jsx-9d46210212716eb8" + " " + "text-3xl font-serif font-bold text-primary",
                                children: "Patient Video Diaries"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 233,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-9d46210212716eb8" + " " + "h-1 w-20 bg-gold mt-4"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                lineNumber: 234,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 232,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-9d46210212716eb8" + " " + "relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-9d46210212716eb8" + " " + "animate-scroll",
                            children: [
                                videos.map((video, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoTestimonial, {
                                        video: video
                                    }, `v1-${i}`, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 29
                                    }, this)),
                                videos.map((video, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoTestimonial, {
                                        video: video
                                    }, `v2-${i}`, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 29
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                            lineNumber: 238,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 237,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 231,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-9d46210212716eb8" + " " + "bg-gold py-20 px-6 text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "jsx-9d46210212716eb8" + " " + "mb-8 text-4xl font-serif font-bold",
                        children: "Ready for Your Own Transformation?"
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 253,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/redesign/vip",
                        className: "jsx-9d46210212716eb8" + " " + "rounded-full bg-primary px-12 py-4 text-lg font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-xl inline-block",
                        children: "FREE VIRTUAL CONSULTATION"
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                        lineNumber: 254,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 252,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "jsx-9d46210212716eb8" + " " + "bg-primary py-12 text-white/50 px-6 text-center text-sm",
                children: "© 2025 Dental Solutions Cancun. Luxury results for life."
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
                lineNumber: 259,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/stories/page.tsx",
        lineNumber: 133,
        columnNumber: 9
    }, this);
}
_s1(StoriesPage, "am39NhL/o0DyTJOdH7/272x2pyE=");
_c1 = StoriesPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "VideoTestimonial");
__turbopack_context__.k.register(_c1, "StoriesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=DentalSolutions_Calculator_apps_marketing_app_stories_page_tsx_6a62cd88._.js.map