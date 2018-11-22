
<!--局部样式-->
<style scoped>
    .viewTable {
        display: flex;
        justify-content: center;
        align-content: flex-start;
        flex-wrap: wrap;
        padding: 20px;
    }

    .myCard {
        width: 240px;
        margin-bottom: 20px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
</style>

<!--全局局部覆盖样式-->
<style>

</style>

<template>
    <div class="viewTable">
        <el-card v-for="item in 10" :key="item" class="myCard">
            <div slot="header">
                <span>卡片名称</span>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "viewTable",
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

