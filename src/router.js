import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/input",
            name: "viewInput",
            component: () => import("./views/input"),
        },
        {
            path: "/upload",
            name: "viewUpload",
            component: () => import("./views/upload"),
        },
        {
            path: "/table",
            name: "viewTable",
            component: () => import("./views/table"),
        },
        {
            path: "/type",
            name: "viewType",
            component: () => import("./views/type"),
        },
        {
            path: "/export",
            name: "viewExport",
            component: () => import("./views/export"),
        },
    ]
})
