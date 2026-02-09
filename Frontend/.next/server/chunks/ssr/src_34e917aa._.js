module.exports = {

"[project]/src/lib/mock-data.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mockProjects": (()=>mockProjects),
    "mockUsers": (()=>mockUsers)
});
const mockUsers = [
    {
        id: 'user-admin-1',
        name: 'Usuario Administrador',
        email: 'admin@cozcyt.dev',
        password: 'password123',
        role: 'administrator',
        avatarUrl: 'https://placehold.co/100x100',
        phone: '4921234567'
    },
    {
        id: 'user-solicitante-1',
        name: 'Dra. Elena Rodríguez',
        email: 'elena.r@uaz.edu',
        password: 'password123',
        role: 'solicitante',
        avatarUrl: 'https://placehold.co/100x100',
        phone: '4929876543',
        company: 'Universidad Autónoma de Zacatecas',
        jobTitle: 'Investigadora Titular',
        activity: 'Investigación Biotecnológica'
    },
    {
        id: 'user-student-1',
        name: 'Emiliano De Santiago',
        email: 'emidsm2005@gmail.com',
        password: 'password123',
        role: 'estudiante',
        avatarUrl: 'https://placehold.co/100x100',
        phone: '4921112233',
        municipality: 'Zacatecas',
        academicInstitution: 'Instituto Tecnológico de Zacatecas',
        career: 'Ingeniería en Sistemas Computacionales'
    },
    {
        id: 'user-solicitante-2',
        name: 'Ing. Jorge Ramírez',
        email: 'jorge.r@itszac.edu.mx',
        password: 'password123',
        role: 'solicitante',
        avatarUrl: 'https://placehold.co/100x100',
        phone: '4923334455',
        company: 'ITSZ',
        jobTitle: 'Docente',
        activity: 'Educación Superior'
    }
];
const mockProjects = [
    {
        id: 'proj-001',
        title: 'Plataforma con IA para Agricultura Sostenible',
        description: 'Plataforma web para monitoreo de cultivos usando sensores IoT y análisis predictivo.',
        generalObjective: 'Desarrollar una herramienta accesible para pequeños agricultores que optimice el uso de agua.',
        expectedActivities: '1. Investigación de sensores. 2. Desarrollo de API. 3. Diseño de Dashboard.',
        category: 'Tecnología',
        status: 'En desarrollo',
        solicitante: mockUsers[1],
        requiredSkills: [
            'Python',
            'React',
            'IoT'
        ],
        timeline: '6 meses',
        studentLimit: 4,
        studentsEnrolled: [
            mockUsers[2]
        ],
        createdAt: '2025-01-15T10:00:00Z'
    },
    {
        id: 'proj-004',
        title: 'Módulo Interactivo de Física',
        description: 'Módulo web con simulaciones de física para nivel secundaria.',
        generalObjective: 'Facilitar el aprendizaje de leyes de Newton mediante gamificación.',
        expectedActivities: 'Diseño de niveles, programación de físicas en JS, pruebas con usuarios.',
        category: 'Educación',
        status: 'En revisión',
        solicitante: mockUsers[1],
        requiredSkills: [
            'JavaScript',
            'Canvas',
            'Física Básica'
        ],
        timeline: '5 meses',
        studentLimit: 3,
        studentsEnrolled: [],
        createdAt: '2025-02-05T11:45:00Z'
    },
    {
        id: 'proj-005',
        title: 'Análisis de Contaminación Acústica',
        description: 'Mapa de calor de ruido urbano.',
        generalObjective: 'Identificar zonas críticas de ruido en el centro histórico.',
        expectedActivities: 'Toma de muestras, limpieza de datos, visualización con D3.js.',
        category: 'Planificación Urbana',
        status: 'Rechazado con retroalimentación',
        solicitante: mockUsers[3],
        requiredSkills: [
            'Data Science',
            'Python'
        ],
        timeline: '6 meses',
        studentLimit: 4,
        studentsEnrolled: [],
        feedback: 'El alcance es demasiado amplio para el tiempo propuesto.',
        createdAt: '2025-01-10T16:20:00Z'
    },
    {
        id: 'proj-007',
        title: 'Invernadero IoT',
        description: 'Sistema de riego automatizado.',
        generalObjective: 'Automatizar el cuidado de plantas domésticas.',
        expectedActivities: 'Circuitos con Arduino, App móvil simple.',
        category: 'IoT',
        status: 'Finalizado',
        solicitante: mockUsers[1],
        requiredSkills: [
            'Arduino',
            'C++'
        ],
        timeline: '2 meses',
        studentLimit: 1,
        studentsEnrolled: [
            mockUsers[2]
        ],
        createdAt: '2024-11-01T10:00:00Z'
    }
];
}}),
"[project]/src/app/(app)/dashboard/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DashboardPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cookie$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cookie-utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function DashboardPage() {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cookie$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserFromCookies"])();
    const finishedProjects = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mockProjects"].filter((p)=>p.status === 'Finalizado').slice(0, 3);
    const isSolicitante = user?.role === 'solicitante';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "w-full py-12 md:py-24 bg-card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container px-4 md:px-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col justify-center space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline",
                                                children: "Sistema de desarrollo de proyectos"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                                lineNumber: 22,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "max-w-[600px] text-muted-foreground md:text-xl",
                                                children: "Plataforma integral para la gestión y vinculación de proyectos tecnológicos."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                                lineNumber: 25,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                        lineNumber: 21,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-2 min-[400px]:flex-row",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            asChild: true,
                                            size: "lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: isSolicitante ? "/solicitante/solicitudes/crear" : "/estudiante/proyectos",
                                                children: isSolicitante ? "Subir un proyecto" : "Inscribirme en un proyecto"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                                lineNumber: 31,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                            lineNumber: 30,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                        lineNumber: 29,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                lineNumber: 20,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: "https://placehold.co/600x400.png",
                                width: "600",
                                height: "400",
                                alt: "Hero",
                                className: "mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "w-full py-12 md:py-24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container px-4 md:px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center space-y-4 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-3xl font-bold tracking-tighter sm:text-5xl font-headline",
                                        children: "Explora"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                        lineNumber: 53,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "max-w-[900px] text-muted-foreground md:text-xl/relaxed",
                                        children: "Algunos proyectos finalizados recientemente"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3",
                            children: finishedProjects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: project.studentsEnrolled.length > 0 ? project.studentsEnrolled[0].avatarUrl : "https://placehold.co/400x225.png",
                                            alt: project.title,
                                            width: 400,
                                            height: 225,
                                            className: "rounded-lg object-cover mb-4 shadow-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-bold font-headline mb-2",
                                            children: project.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                            lineNumber: 69,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground line-clamp-2",
                                            children: project.abstract
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                            lineNumber: 70,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, project.id, true, {
                                    fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(app)/dashboard/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(app)/dashboard/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_34e917aa._.js.map