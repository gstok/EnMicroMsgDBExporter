
<!--局部样式-->
<style scoped>
    .viewType {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<!--全局局部覆盖样式-->
<style>

</style>

<template>
    <div class="viewType">
        <label>导出类型：</label>
        <el-select v-model="type" placeholder="请选择导出类型">
            <el-option label="Excel" value="excel"></el-option>
            <el-option label="JSON" value="json"></el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "viewType",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    type: "excel",
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

