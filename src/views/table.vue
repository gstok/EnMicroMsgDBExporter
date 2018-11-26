
<!--局部样式-->
<style scoped>
    .viewTable {
        height: auto!important;
    }

    .pageContent {
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
        height: 80px;
        overflow-y: auto;
        font-size: 12px;
    }

    .pageTop {
        display: flex;
        justify-content: space-between;
        padding: 40px 40px 16px 40px;
    }
</style>

<!--全局局部覆盖样式-->
<style>

</style>

<template>
    <div class="viewTable">
        <div class="pageTop">
            <label>数据库结构</label>
            <el-checkbox
                @change="handleAllCheckChange"
                v-model="checkAll">
                全选
            </el-checkbox>
        </div>
        <div v-loading="loading" class="pageContent">
            <el-card
                v-for="(table, index) in tableList"
                :key="index"
                class="myCard">
                <div slot="header" class="tableTitle">
                    <router-link :to="`/table/${ table.name }`">{{ table.name }}</router-link>
                    <el-checkbox
                        v-model="table.selected"
                        @change="handleTableCheckChange">
                    </el-checkbox>
                </div>
                <div class="tableSql">
                    {{ table.sql }}
                </div>
            </el-card>
        </div>
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
                    dbKey: "",
                    tableList: [],
                    checkAll: true,
                    loading: false,
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
                //用户选择的导出表名
                autoExportTablesName () {
                    return this.tableList
                                .filter(item => item.selected)
                                .map(item => item.name);
                },
            //#endregion

            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
                //全选Check变化
                handleAllCheckChange (nv) {
                    if (nv) {
                        this.b_checkAll();
                    }
                    else {
                        this.b_clearCheckAll();
                    }
                },
                //表Check值变化
                handleTableCheckChange (nv) {
                    if (nv) {
                        let result = this.tableList.every(item => item.selected);
                        if (result) {
                            this.checkAll = true;
                        }
                    }
                    else {
                        this.checkAll = false;
                    }
                },
            //#endregion

            //#region 业务逻辑方法
                //更新表格列表
                async b_updateTableList () {
                    this.loading = true;
                    let params = {
                        db: this.dbKey,
                    };
                    let result = await this.i_getTableList(params);
                    if (result) {
                        result.forEach(item => {
                            item.selected = true;
                        });
                        this.tableList = result;
                    }
                    this.loading = false;
                },

                b_checkAll () {
                    this.tableList.forEach(item => {
                        item.selected = true;
                    });
                },

                b_clearCheckAll () {
                    this.tableList.forEach(item => {
                        item.selected = false;
                    });
                },
            //#endregion

            //#region 接口访问方法
                //获取表格列表接口
                async i_getTableList (params) {
                    let reqUrl = "/api/table";
                    let response = await this.$fetch(reqUrl, params);
                    if (response.code == 200) {
                        return response.data;
                    }
                    else {
                        return null;
                    }
                },
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
            this.b_updateTableList();
            BUS.on("next", () => {
                localStorage.setItem(this.dbKey, JSON.stringify(this.autoExportTablesName));
                this.$router.push(`/type?db=${ this.dbKey }`);
            });
        },
        mounted () {

        },
        components: {

        },
    };
</script>

