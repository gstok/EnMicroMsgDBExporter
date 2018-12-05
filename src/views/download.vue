
<!--局部样式-->
<style scoped>
    .viewDownload {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .download {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-decoration: none;
    }

    .download img {
        width: 80px;
        height: 80px;
        margin-bottom: 8px;
    }

    .download span {
        font-size: 12px;
        color: #409EFF;
    }
</style>

<!--全局局部覆盖样式-->
<style>

</style>

<template>
    <div class="viewDownload">
        <a class="download" :href="`/resource/${ dbKey }/${ fileName }`">
            <img src="../assets/images/zip.png" />
            <span>点此下载导出数据</span>
        </a>
    </div>
</template>

<script>
    export default {
        name: "viewDownload",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    dbKey: "",
                    fileName: "",
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
                    this.$router.push(`/type?db=${ this.dbKey }`);
                },

                handleRouteChange (nv) {
                    this.dbKey = this.$route.query.db;
                    this.fileName = localStorage.download;
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
            this.dbKey = this.$route.query.db;
            this.fileName = localStorage.download;
            BUS.on("back", () => {
                if (this.$route.name == "viewDownload") {
                    this.handleBackClick();
                }
            });
        },
        mounted () {

        },
        components: {

        },
    };
</script>

