
<!--局部样式-->
<style scoped>
    .app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }
    .myHeader {
        background-color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
    }
    .myHeader > a {
        font-size: 12px;
        color: white;
        text-decoration: none;
    }

    .myMain > *[class^=view] {
        height: 400px;
    }

    .buttonWarp {
        display: flex;
        justify-content: space-between;
    }
    .appTitle {
        display: flex;
        align-items: center;
    }
    .appTitle > span {
        font-size: 20px;
        font-weight: bold;
    }
    .appTitle > i {
        margin-top: -7px;
        font-size: 34px;
        margin-right: 12px;
    }
    .appTitle > span {
        font-size: 18px;
    }
    .likeMe {
        display: flex;
        align-items: center;
    }
    .likeMe i {
        margin-right: 4px;
    }
</style>

<!--全局局部覆盖样式-->
<style>
    html, body {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
    }
</style>

<template>
    <el-container class="app">
        <el-header class="myHeader">
            <a class="appTitle" href="/">
                <i class="icon icon-mengbanhangkonghangtian-wangyuanjingtelescope"></i>
                <span>EnMicroMsgDBExporter</span>
            </a>
            <a
                class="likeMe"
                href="https://github.com/gstok/EnMicroMsgDBExporter"
                target="_blank">
                <i class="icon icon-githublogo"></i>
                <span>给我点赞</span>
            </a>
        </el-header>
        <el-main class="myMain">
            <el-steps :active="activeStep">
                <el-step title="填写解密信息" description="填写IMEI以及微信UIN"></el-step>
                <el-step title="上传数据库" description="上传未解密的EnMicroMsg.db"></el-step>
                <el-step title="选择导出表" description="选择需要导出的数据库表"></el-step>
                <el-step title="选择导出格式" description="选择导出格式"></el-step>
                <el-step title="导出完成" description="导出完成，浏览器将自动下载导出文件"></el-step>
            </el-steps>
            <router-view></router-view>
            <div class="buttonWarp">
                <el-button @click="handleBackClick">上一步</el-button>
                <el-button @click="handleNextClick">下一步</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "app",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    activeStep: 1,
                //#endregion

                //#region 页面样式绑定数据
                //#endregion
            };
        },
        watch: {
            "$route": "handleRouteChange",
        },
        computed: {
            //#region 常量计算属性
            //#endregion

            //#region 数据转换计算属性
            //#endregion

            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
                handleBackClick () {
                    BUS.emit("back");
                },

                handleNextClick () {
                    BUS.emit("next");
                },

                handleRouteChange (nv) {
                    let name = nv.name;
                    if (name == "viewInput") {
                        this.activeStep = 1;
                    }
                    else if (name == "viewUpload") {
                        this.activeStep = 2;
                    }
                    else if (name == "viewTable") {
                        this.activeStep = 3;
                    }
                    else if (name == "viewType") {
                        this.activeStep = 4;
                    }
                    else if (name == "viewExport") {
                        this.activeStep = 5;
                    }
                },
            //#endregion

            //#region 业务逻辑方法
            //#endregion

            //#region 接口访问方法
            //#endregion

            //#region 数据转换方法
            //#endregion

            //#region 自动样式方法
            //#endregion

            //#region 其他方法
            //#endregion
        },
        created () {

        },
        mounted () {

        },
        components: {

        },
    };
</script>


