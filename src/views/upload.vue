
<!--局部样式-->
<style scoped>
    .viewUpload {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<!--全局局部覆盖样式-->
<style>
    .viewUpload .el-upload__tip {
        text-align: center;
    }
</style>

<template>
    <div class="viewUpload">
        <el-upload
            drag
            action="/api/upload"
            :data="autoUploadData"
            :on-success="handleUploadSuccess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将数据库拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">请上传不超过1GB的数据库文件</div>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "viewUpload",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    pwd: "",
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
                autoUploadData () {
                    return {
                        pwd: this.pwd,
                    };
                },
            //#endregion

            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
                handleUploadSuccess (response, file, fileList) {
                    if (response.code == 200) {
                        let dbKey = response.data.dbkey;
                        if (dbKey) {
                            this.$router.push(`/table?db=${ dbKey }`);
                        }
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
            this.pwd = this.$route.query.pwd;
        },
        mounted () {

        },
        components: {

        },
    };
</script>

