
<!--局部样式-->
<style scoped>
    .viewInput {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .myForm {
        width: 320px;
    }
</style>

<!--全局局部覆盖样式-->
<style>

</style>

<template>
    <div class="viewInput">
        <el-form
            class="myForm"
            label-position="top"
            label-width="80px">
            <el-form-item label="IMEI号">
                <el-input v-model="imei" placeholder="请输入手机IMEI号" clearable></el-input>
            </el-form-item>
            <el-form-item label="微信UIN">
                <el-input v-model="uin" placeholder="请输入微信UIN" clearable></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import md5 from "blueimp-md5";

    export default {
        name: "viewInput",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    imei: "",
                    uin: "",
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
                autoKey () {
                    let text = `${ this.imei }${ this.uin }`;
                    let md5Text = md5(text);
                    return md5Text.substring(0, 7).toLowerCase();
                },
            //#endregion

            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
                handleNextClick () {
                    if (this.imei.trim() == "") {
                        this.$message({
                            type: "warning",
                            message: "请填写手机IMEI！",
                        });
                        return;
                    }
                    if (this.uin.trim() == "") {
                        this.$message({
                            type: "warning",
                            message: "请填写微信UIN！",
                        });
                        return;
                    }
                    else {
                        this.$router.push(`/upload?pwd=${ this.autoKey }`);
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
            BUS.on("next",() => {
                if (this.$route.name == "viewInput") {
                    this.handleNextClick();
                }
            });
        },
        mounted () {

        },
        components: {

        },
    };
</script>

