module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "authApi",
    ()=>authApi,
    "communityApi",
    ()=>communityApi,
    "default",
    ()=>__TURBOPACK__default__export__,
    "membershipApi",
    ()=>membershipApi,
    "notificationApi",
    ()=>notificationApi,
    "productApi",
    ()=>productApi,
    "programApi",
    ()=>programApi,
    "referralApi",
    ()=>referralApi,
    "stateHubApi",
    ()=>stateHubApi,
    "trainingApi",
    ()=>trainingApi,
    "uploadToCloudinary",
    ()=>uploadToCloudinary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
;
;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
class ApiClient {
    client;
    constructor(){
        this.client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use((config)=>{
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error)=>Promise.reject(error));
        // Response interceptor
        this.client.interceptors.response.use((response)=>response, (error)=>{
            if (error.response?.status === 401) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('auth_token');
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
            return Promise.reject(error);
        });
    }
    async get(url, params) {
        const response = await this.client.get(url, {
            params
        });
        return response.data;
    }
    async post(url, data) {
        const response = await this.client.post(url, data);
        return response.data;
    }
    async put(url, data) {
        const response = await this.client.put(url, data);
        return response.data;
    }
    async patch(url, data) {
        const response = await this.client.patch(url, data);
        return response.data;
    }
    async delete(url) {
        const response = await this.client.delete(url);
        return response.data;
    }
    // Upload file with multipart/form-data
    async upload(url, formData) {
        const response = await this.client.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
}
const apiClient = new ApiClient();
const authApi = {
    login: (credentials)=>apiClient.post('/api/auth/login', credentials),
    register: (data)=>apiClient.post('/api/auth/register', data),
    logout: ()=>apiClient.post('/api/auth/logout'),
    me: ()=>apiClient.get('/api/users/me'),
    updateProfile: (data)=>apiClient.put('/api/users/me', data),
    changePassword: (data)=>apiClient.post('/api/auth/change-password', data)
};
const membershipApi = {
    initiatePayment: ()=>apiClient.post('/api/payments/initiate-membership'),
    verifyPayment: (reference)=>apiClient.get(`/api/payments/verify/${reference}`),
    getStatus: ()=>apiClient.get('/api/membership/status')
};
const referralApi = {
    getStats: ()=>apiClient.get('/api/referrals/me'),
    getReferrals: (params)=>apiClient.get('/api/referrals', params),
    getLeaderboard: ()=>apiClient.get('/api/referrals/leaderboard')
};
const trainingApi = {
    getAll: (params)=>apiClient.get('/api/trainings', params),
    getById: (id)=>apiClient.get(`/api/trainings/${id}`),
    getProgress: ()=>apiClient.get('/api/trainings/progress'),
    updateProgress: (trainingId, progress)=>apiClient.post(`/api/trainings/${trainingId}/progress`, {
            progress
        })
};
const communityApi = {
    getPosts: (params)=>apiClient.get('/api/community/posts', params),
    getPostById: (id)=>apiClient.get(`/api/community/posts/${id}`),
    createPost: (data)=>apiClient.post('/api/community/posts', data),
    updatePost: (id, data)=>apiClient.put(`/api/community/posts/${id}`, data),
    deletePost: (id)=>apiClient.delete(`/api/community/posts/${id}`),
    likePost: (id)=>apiClient.post(`/api/community/posts/${id}/like`),
    getComments: (postId)=>apiClient.get(`/api/community/posts/${postId}/comments`),
    createComment: (postId, content)=>apiClient.post(`/api/community/posts/${postId}/comments`, {
            content
        })
};
const productApi = {
    getAll: (params)=>apiClient.get('/api/products', params),
    getById: (id)=>apiClient.get(`/api/products/${id}`),
    create: (data)=>apiClient.upload('/api/products', data),
    update: (id, data)=>apiClient.upload(`/api/products/${id}`, data),
    delete: (id)=>apiClient.delete(`/api/products/${id}`),
    like: (id)=>apiClient.post(`/api/products/${id}/like`)
};
const stateHubApi = {
    getAll: ()=>apiClient.get('/api/state-hubs'),
    getById: (id)=>apiClient.get(`/api/state-hubs/${id}`),
    getMembers: (id)=>apiClient.get(`/api/state-hubs/${id}/members`),
    getAnnouncements: (id)=>apiClient.get(`/api/state-hubs/${id}/announcements`)
};
const notificationApi = {
    getAll: (params)=>apiClient.get('/api/notifications', params),
    markAsRead: (id)=>apiClient.patch(`/api/notifications/${id}/read`),
    markAllAsRead: ()=>apiClient.patch('/api/notifications/read-all'),
    delete: (id)=>apiClient.delete(`/api/notifications/${id}`)
};
const programApi = {
    apply: (data)=>apiClient.post('/api/programs/apply', data),
    getApplications: ()=>apiClient.get('/api/programs/applications'),
    initiatePayment: (applicationId)=>apiClient.post(`/api/programs/${applicationId}/pay`)
};
const uploadToCloudinary = async (file, folder)=>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const response = await apiClient.upload('/api/upload', formData);
    if (!response.success || !response.data) {
        throw new Error(response.error || 'Upload failed');
    }
    return response.data.url;
};
const __TURBOPACK__default__export__ = apiClient;
}),
"[project]/src/context/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        user: null,
        isAuthenticated: false,
        isLoading: true
    });
    const refreshUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].me();
            if (response.success && response.data) {
                setState({
                    user: response.data,
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                throw new Error('Failed to fetch user');
            }
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('auth_token');
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('auth_token');
        if (token) {
            refreshUser();
        } else {
            setState((prev)=>({
                    ...prev,
                    isLoading: false
                }));
        }
    }, [
        refreshUser
    ]);
    const login = async (credentials)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].login(credentials);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Login failed');
        }
        const { user, token } = response.data;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('auth_token', token, {
            expires: 7,
            secure: true,
            sameSite: 'strict'
        });
        setState({
            user,
            isAuthenticated: true,
            isLoading: false
        });
    };
    const register = async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].register(data);
        if (!response.success || !response.data) {
            throw new Error(response.error || 'Registration failed');
        }
        const { user, token } = response.data;
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set('auth_token', token, {
            expires: 7,
            secure: true,
            sameSite: 'strict'
        });
        setState({
            user,
            isAuthenticated: true,
            isLoading: false
        });
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].logout();
        } catch  {
        // Ignore logout errors
        } finally{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove('auth_token');
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false
            });
            window.location.href = '/login';
        }
    };
    const updateUser = (user)=>{
        setState((prev)=>({
                ...prev,
                user: prev.user ? {
                    ...prev.user,
                    ...user
                } : null
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            ...state,
            login,
            register,
            logout,
            updateUser,
            refreshUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__839fb5fe._.js.map