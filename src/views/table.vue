
<!--局部样式-->
<style scoped>
    .viewTable {
        display: flex;
        justify-content: center;
        align-content: flex-start;
        flex-wrap: wrap;
        padding: 20px;
        overflow-y: auto;
    }

    .myCard {
        width: 240px;
        margin-bottom: 20px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .tableTitle {
        display: flex;
        justify-content: space-between;
    }
    .tableTitle a {
        font-size: 14px;
        font-weight: bold;
        color: #409EFF;
        text-decoration: none;
    }
    .tableSql {
        height: 120px;
        overflow-y: auto;
        font-size: 12px;
    }
</style>

<!--全局局部覆盖样式-->
<style>

</style>

<template>
    <div class="viewTable">
        <el-card
            v-for="(table, index) in tables"
            :key="index"
            class="myCard">
            <div slot="header" class="tableTitle">
                <router-link :to="`/table/${ table.name }`">{{ table.name }}</router-link>
                <el-checkbox v-model="table.selected"></el-checkbox>
            </div>
            <div class="tableSql">
                {{ table.sql }}
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
                    tables: [],
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
        async mounted () {
            let result = await this.$fetch("/api/table");
            this.tables = result.data;
        },
        components: {

        },
    };
</script>

