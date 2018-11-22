
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
    .myHeader > span {
        font-size: 20px;
        font-weight: bold;
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
            <span>EnMicroMsgDBExporter</span>
            <a
                href="https://github.com/gstok/EnMicroMsgDBExporter"
                target="_blank">
                给我点赞
            </a>
        </el-header>
        <el-main class="myMain">
            <el-steps :active="1">
                <el-step title="填写解密信息" description="填写IMEI以及微信UIN"></el-step>
                <el-step title="上传数据库" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="选择导出类型" description="这是一段很长很长很长的描述性文字"></el-step>
                <el-step title="导出完成" description="这是一段很长很长很长的描述性文字"></el-step>
            </el-steps>
            <router-view></router-view>
            <div class="buttonWarp">
                <el-button>上一步</el-button>
                <el-button>下一步</el-button>
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
                //#endregion

                //#region 页面样式绑定数据
                //#endregion
            };
        },
        watch: {

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


