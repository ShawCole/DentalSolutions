(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VIPLandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/DentalSolutions_Calculator/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function VIPLandingPage() {
    _s();
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(3600 * 24 * 2 + 1543); // 2 days example
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VIPLandingPage.useEffect": ()=>{
            const timer = setInterval({
                "VIPLandingPage.useEffect.timer": ()=>{
                    setTimeLeft({
                        "VIPLandingPage.useEffect.timer": (prev)=>prev > 0 ? prev - 1 : 0
                    }["VIPLandingPage.useEffect.timer"]);
                }
            }["VIPLandingPage.useEffect.timer"], 1000);
            return ({
                "VIPLandingPage.useEffect": ()=>clearInterval(timer)
            })["VIPLandingPage.useEffect"];
        }
    }["VIPLandingPage.useEffect"], []);
    const formatTime = (seconds)=>{
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = seconds % 60;
        return {
            d,
            h,
            m,
            s
        };
    };
    const { d, h, m, s } = formatTime(timeLeft);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white font-sans text-primary selection:bg-gold selection:text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed top-0 z-50 w-full border-b bg-white/90 py-4 backdrop-blur-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl items-center justify-between px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/redesign",
                            className: "text-2xl font-serif font-bold",
                            children: [
                                "DENTAL",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-gold",
                                    children: "SOLUTIONS"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 31,
                                    columnNumber: 31
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 30,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://wa.me/529841145997",
                                    className: "hidden text-sm font-bold text-primary hover:text-gold md:block",
                                    children: "WhatsApp: +52 984 114 5997"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 34,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-xl hover:bg-gold transition-all duration-300",
                                    children: "RESERVE NOW"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 37,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 33,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 28,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative min-h-[90vh] overflow-hidden bg-primary pt-32 pb-20 px-6 flex items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 z-0 opacity-40",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            autoPlay: true,
                            muted: true,
                            loop: true,
                            playsInline: true,
                            className: "h-full w-full object-cover",
                            poster: "/redesign/PHOTO-2025-12-17-21-07-18 2.jpg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("source", {
                                src: "https://storage.googleapis.com/msgsndr/f0ZNnBBOAnxnYbXCHsB5/media/69209581ec01c107be9e5f7a.mp4",
                                type: "video/mp4"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 55,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 47,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                        lineNumber: 46,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/80 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-20 mx-auto max-w-7xl grid gap-16 md:grid-cols-2 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-fade-up",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6 inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-bold tracking-widest text-gold uppercase border border-gold/30 backdrop-blur-sm",
                                        children: "VIP Smile Transformation"
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 62,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "mb-6 text-5xl font-serif font-bold leading-tight md:text-7xl text-white",
                                        children: [
                                            "A Smile Makeover that feels like a ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gold italic",
                                                children: "Five-Star Vacation"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 66,
                                                columnNumber: 64
                                            }, this),
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-10 text-xl font-light text-white/80 leading-relaxed max-w-xl",
                                        children: "We have reimagined dental tourism for discerning American patients who want world-class dentistry and a luxury travel experience — in one seamless journey."
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 68,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-8 flex gap-4",
                                        children: [
                                            {
                                                label: "Days",
                                                val: d
                                            },
                                            {
                                                label: "Hrs",
                                                val: h
                                            },
                                            {
                                                label: "Min",
                                                val: m
                                            },
                                            {
                                                label: "Sec",
                                                val: s
                                            }
                                        ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl bg-white/10 p-4 text-center backdrop-blur-md border border-white/10 w-20",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-serif font-bold text-gold",
                                                        children: item.val.toString().padStart(2, "0")
                                                    }, void 0, false, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 81,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[10px] uppercase tracking-widest text-white/40",
                                                        children: item.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 82,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 80,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 73,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 61,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-3xl bg-white p-10 text-primary shadow-2xl animate-fade-up delay-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mb-6 text-2xl font-serif font-bold",
                                        children: "Secure Your VIP Reservation"
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-8 text-sm text-zinc-500 font-light",
                                        children: "Join the elite program today and credit $397 toward your treatment deposit."
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-4 sm:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "First Name",
                                                        className: "rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Last Name",
                                                        className: "rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 94,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 92,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                placeholder: "Email Address",
                                                className: "w-full rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 96,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "tel",
                                                placeholder: "Phone Number",
                                                className: "w-full rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-gold outline-none transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 97,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "w-full rounded-xl bg-primary py-5 text-lg font-bold text-white shadow-xl hover:bg-gold transition-all duration-300 transform hover:scale-[1.02]",
                                                children: "JOIN THE VIP PROGRAM"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 98,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex items-center justify-center gap-4 text-xs text-zinc-400 font-light",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "🔒 Secure 256-bit Encryption"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 103,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "h-4 w-px bg-zinc-200"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 104,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "⭐️ High-Quality Guarantee"
                                            }, void 0, false, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 105,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 88,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                        lineNumber: 60,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 45,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-24 px-6 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-20 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-4xl font-serif font-bold text-primary",
                                    children: [
                                        "The Ultimate Smile Vacation ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 115,
                                            columnNumber: 112
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gold text-2xl italic font-light tracking-wide",
                                            children: "Everything is Included"
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 115,
                                            columnNumber: 118
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto mt-6 h-1 w-24 bg-gold"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 116,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 114,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
                            children: [
                                {
                                    title: "Roundtrip Flights",
                                    desc: "Coordinated travel tailored to your schedule.",
                                    icon: "✈"
                                },
                                {
                                    title: "5-Star Resort",
                                    desc: "Luxury accommodations and all-inclusive comfort.",
                                    icon: "🏨"
                                },
                                {
                                    title: "Private Transfers",
                                    desc: "Chauffeur service from airport to resort and clinic.",
                                    icon: "🚘"
                                },
                                {
                                    title: "Personal Concierge",
                                    desc: "Dedicated host for all logistics and local needs.",
                                    icon: "🤝"
                                },
                                {
                                    title: "Smile Design Appt",
                                    desc: "Complete assessment often done in a single visit.",
                                    icon: "✨"
                                },
                                {
                                    title: "German Materials",
                                    desc: "Premium Zirconia and E-Max manufactured in Germany.",
                                    icon: "🇩🇪"
                                },
                                {
                                    title: "Patient Preferred",
                                    desc: "Flexible financing options subject to approval.",
                                    icon: "💳"
                                },
                                {
                                    title: "Warranty Terms",
                                    desc: "Written plan and long-term security for procedures.",
                                    icon: "📜"
                                }
                            ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "group rounded-2xl border border-zinc-100 bg-zinc-50/50 p-8 transition-all hover:bg-white hover:shadow-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 text-3xl opacity-80",
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-2 font-bold text-primary",
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 132,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-zinc-500 font-light leading-relaxed",
                                            children: item.desc
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 133,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 119,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 112,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-24 px-6 bg-zinc-50 border-t border-zinc-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl grid gap-16 md:grid-cols-2 items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative aspect-video overflow-hidden rounded-3xl shadow-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/redesign/PHOTO-2025-12-17-21-07-18 3.jpg",
                                    alt: "State of the art technology",
                                    fill: true,
                                    className: "object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 144,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-primary/20"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 143,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mb-6 text-3xl font-serif font-bold text-primary",
                                            children: "World-Class Care and Trust"
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 154,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lg text-zinc-600 font-light leading-relaxed",
                                            children: "Treatment led by internationally experienced specialists using modern technology and premium materials commonly used in U.S. dentistry. We follow strict sterilization and safety protocols and provide written plan and warranty terms for qualifying procedures."
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 155,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 sm:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl border border-gold/20 bg-gold/5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold text-gold text-sm tracking-widest uppercase",
                                                    children: "Specialists"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-primary",
                                                    children: "Internationally Trained"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 160,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl border border-gold/20 bg-gold/5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold text-gold text-sm tracking-widest uppercase",
                                                    children: "Protocol"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-primary",
                                                    children: "Strict US-Standard Safety"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 152,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 142,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 141,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-24 px-6 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-5xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-16 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-3xl font-serif font-bold",
                                    children: "What happens after you reserve"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 177,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-zinc-500 font-light",
                                    children: "Three simple steps to your new smile."
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 178,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 176,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-8 md:grid-cols-3",
                            children: [
                                {
                                    step: "01",
                                    title: "Priority Scheduling",
                                    desc: "Your VIP priority status is secured. We begin blocks based on demand and seasonality."
                                },
                                {
                                    step: "02",
                                    title: "Concierge Coordination",
                                    desc: "We confirm your travel window, resort details, transfers, and clinical itinerary."
                                },
                                {
                                    step: "03",
                                    title: "Candidacy Review",
                                    desc: "Our specialists review your case and confirm your appropriate timeline and data."
                                }
                            ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative p-8 rounded-2xl bg-zinc-50 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-gold text-xl font-serif font-bold shadow-lg",
                                            children: item.step
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-3 font-bold text-primary",
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-zinc-500 font-light leading-relaxed",
                                            children: item.desc
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 191,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 180,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 175,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 174,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-24 px-6 bg-primary text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl grid gap-16 md:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "mb-8 text-4xl font-serif font-bold text-white",
                                    children: "How Payment Works"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-6 w-6 shrink-0 text-gold font-bold",
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white/80 font-light",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-white",
                                                            children: "30% Treatment Deposit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 73
                                                        }, this),
                                                        " is required for all patients to secure clinical time and materials."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 206,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 204,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-6 w-6 shrink-0 text-gold font-bold",
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white/80 font-light",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-white",
                                                            children: "$397 Reservation Credit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                            lineNumber: 210,
                                                            columnNumber: 73
                                                        }, this),
                                                        " is applied directly toward your 30% deposit."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-6 w-6 shrink-0 text-gold font-bold",
                                                    children: "✓"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-white/80 font-light",
                                                    children: "Remaining balance is calculated after clinical itinerary confirmation."
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 212,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 203,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-12 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "mb-4 font-bold text-gold uppercase tracking-widest text-xs",
                                            children: "Estimated Package Value"
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 219,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-5xl font-serif font-bold text-white",
                                            children: "$9,397"
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 220,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-xs text-white/50",
                                            children: "*Based on typical retail rates; may vary by season and availability."
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 221,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 218,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 201,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-2xl font-serif font-bold",
                                    children: "Choose how to pay the remaining balance"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 226,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 text-gold font-bold uppercase tracking-widest text-xs",
                                                    children: "Option A"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "mb-3 text-xl font-bold",
                                                    children: "Financing (Patient Preferred)"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-white/60 font-light leading-relaxed",
                                                    children: "Apply for a plan. Approval and APR (including 0% when available) depend on terms."
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 228,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 text-gold font-bold uppercase tracking-widest text-xs",
                                                    children: "Option B"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "mb-3 text-xl font-bold",
                                                    children: "Pay at the Clinic"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-white/60 font-light leading-relaxed",
                                                    children: "Pay at the time of treatment. Timing and accepted methods confirmed in written plan."
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 233,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 227,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 225,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 200,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 199,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-24 px-6 bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-5xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-16 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-3xl font-serif font-bold text-primary",
                                    children: "Smart Investment in Your Smile"
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 247,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-zinc-500 font-light max-w-2xl mx-auto",
                                    children: "Exact savings vary by treatment plan, materials, resort seasonality, and travel window."
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 248,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 246,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-hidden rounded-3xl border border-zinc-100 shadow-2xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-zinc-50 border-b border-zinc-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-6 font-bold text-primary text-sm uppercase tracking-widest",
                                                    children: "Treatment Package"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-6 font-bold text-primary text-sm uppercase tracking-widest",
                                                    children: "Approx. US Price"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-6 font-bold text-gold text-sm uppercase tracking-widest",
                                                    children: "VIP Cancun Price"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-zinc-100",
                                        children: [
                                            {
                                                t: "Non-Invasive Nanotech (20)",
                                                u: "$35,000",
                                                v: "$5,500"
                                            },
                                            {
                                                t: "Non-Invasive Porcelain (20)",
                                                u: "$45,000",
                                                v: "$6,500"
                                            },
                                            {
                                                t: "Non-Invasive Zirconia (20)",
                                                u: "$50,000",
                                                v: "$7,500"
                                            },
                                            {
                                                t: "All-on-4 (per arch)",
                                                u: "$35,000",
                                                v: "$12,500"
                                            }
                                        ].map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-zinc-50/50 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-bold text-primary",
                                                                children: row.t
                                                            }, void 0, false, {
                                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                                lineNumber: 268,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[10px] text-zinc-400 uppercase tracking-tighter",
                                                                children: "Full Mouth Reconstruction"
                                                            }, void 0, false, {
                                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-6 text-zinc-400 font-light",
                                                        children: row.u
                                                    }, void 0, false, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 271,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-6 font-bold text-primary text-xl",
                                                        children: row.v
                                                    }, void 0, false, {
                                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 251,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 250,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 245,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 244,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-24 px-6 bg-zinc-50 border-y border-zinc-100",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-5xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mb-12 text-4xl font-serif font-bold text-primary",
                            children: "Ready to elevate your experience?"
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 284,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center gap-8 md:flex-row md:text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl bg-white p-6 shadow-xl border border-zinc-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-48 w-48 bg-zinc-50 flex items-center justify-center border-2 border-dashed border-gold/30 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xl mb-2 text-gold",
                                                    children: "📱"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[10px] uppercase font-bold text-zinc-400",
                                                    children: "Scan for WhatsApp"
                                                }, void 0, false, {
                                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 289,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-2xl font-bold text-primary",
                                            children: "Book via WhatsApp"
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 296,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-zinc-500 font-light",
                                            children: "Message our VIP concierge directly for instant support."
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://wa.me/529841145997",
                                            className: "inline-flex items-center gap-4 rounded-full bg-[#25D366] px-10 py-4 text-white font-bold shadow-lg hover:brightness-110 transition-all",
                                            children: "+52 984 114 5997"
                                        }, void 0, false, {
                                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                            lineNumber: 298,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                    lineNumber: 295,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 285,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 283,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 282,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "https://wa.me/529841145997",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "fixed bottom-8 left-8 z-40 flex items-center gap-3 rounded-full bg-[#25D366] p-4 pr-6 text-white shadow-2xl hover:scale-105 transition-all duration-300 group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-10 w-10 items-center justify-center rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#25D366] transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6 fill-current",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 318,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                            lineNumber: 317,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                        lineNumber: 316,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] uppercase font-bold opacity-70 leading-none",
                                children: "VIP Access"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 322,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold",
                                children: "Chat with Concierge"
                            }, void 0, false, {
                                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                                lineNumber: 323,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                        lineNumber: 321,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 310,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-12 px-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-5xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$DentalSolutions_Calculator$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] text-zinc-400 font-light leading-relaxed text-center uppercase tracking-widest",
                        children: "Medical and financial information is general and not a guarantee of results. Treatment candidacy is required and varies by case. Travel, resort, and pricing are subject to availability and seasonal changes. Savings comparisons vary by procedure and region. © 2025 Dental Solutions Cancun - Puerto Cancun | VIP Smile Transformation Package."
                    }, void 0, false, {
                        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                        lineNumber: 330,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                    lineNumber: 329,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
                lineNumber: 328,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/DentalSolutions_Calculator/apps/marketing/app/vip/page.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
_s(VIPLandingPage, "Coe/7ubyE/ujA034/hMKXxHthFY=");
_c = VIPLandingPage;
var _c;
__turbopack_context__.k.register(_c, "VIPLandingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=DentalSolutions_Calculator_apps_marketing_app_vip_page_tsx_5fe3b922._.js.map