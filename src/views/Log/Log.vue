<template>
    <div class="Log-container">
        <vLogHeader class="v-log-header"></vLogHeader>

        <div class="log-panel">
            <Tabs v-model="tabName">
                <TabPane name="user" label="用户操作日志">
                    <div class="handle-bar">

                        <div class="hd">
                            <div class="form-item">
                                <label class="label">关键字</label>
                                <div class="value">
                                    <Input v-model="searchParams_user.keyword" placeholder=""></Input>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <div class="form-item">
                                <label class="label">时间</label>
                                <div class="value">
                                    <DatePicker :value="datePicker_default_user"
                                                :clearable="true"
                                                transfer
                                                format="yyyy-MM-dd"
                                                type="daterange"
                                                placeholder="日期选择"
                                                @on-change="datePicker_onChange_user"
                                                style="width: 220px"></DatePicker>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <Button type="primary" @click="onClick_search_user">查询</Button>
                        </div>

                    </div>
                    <div class="table-panel">
                        <Table border
                               :height="500"
                               :loading="tableLoading_user"
                               :columns="tableColumn_user"
                               :data="tableData_user"></Table>
                    </div>
                    <div class="list-page-panel">
                        <Page :total="searchParams_user.count"
                              show-total
                              @on-change="onPageNo_change_user"></Page>
                    </div>
                </TabPane>
                <TabPane name="system" label="操作运行日志">

                    <div class="handle-bar">

                        <div class="hd">
                            <div class="form-item">
                                <label class="label">关键字</label>
                                <div class="value">
                                    <Input v-model="searchParams_system.keyword" placeholder=""></Input>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <div class="form-item">
                                <label class="label">时间</label>
                                <div class="value">
                                    <DatePicker :value="datePicker_default_system"
                                                :clearable="true"
                                                transfer
                                                format="yyyy-MM-dd"
                                                type="daterange"
                                                placeholder="日期选择"
                                                @on-change="datePicker_onChange_system"
                                                style="width: 220px"></DatePicker>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <Button type="primary" @click="onClick_search_system">查询</Button>
                        </div>

                    </div>

                    <div class="table-panel">
                        <Table border
                               :height="500"
                               :loading="tableLoading_user"
                               :columns="tableColumn_system"
                               :data="tableData_system"></Table>
                    </div>
                    <div class="list-page-panel">
                        <Page :total="searchParams_system.count"
                              show-total
                              @on-change="onPageNo_change_system"></Page>
                    </div>

                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    import vLogHeader from '../../components/log/logHeader/logHeader';
    export default {
        name: "mLog",
        data() {
            return {
                tabName: 'user',

                datePicker_default_user: [],
                searchParams_user: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                },
                tableLoading_user: false,
                tableColumn_user: [
                    { type: 'index', title: '序号', width: 80, align: 'center' },
                    { title: '时间', key: 'insTime', align: 'center' },
                    { title: '账号', key: 'operateAccount', align: 'center' },
                    { title: 'IP', key: 'ip', align: 'center' },
                    { title: '系统名称', key: 'sysName', align: 'center' },
                    { title: '操作类型', key: 'operateType', align: 'center' },
                    { title: '操作结果', key: 'operateResult', align: 'center' },
                    { title: '描述', key: 'description', align: 'center' }
                ],
                tableData_user: [],

                datePicker_default_system: [],
                searchParams_system: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                },
                tableLoading_system: false,
                tableColumn_system: [
                    { type: 'index',  title: '序号', width: 80, align: 'center' },
                    { title: '级别', key: 'logLevel', align: 'center' },
                    { title: '时间', key: 'insTime', align: 'center' },
                    { title: '来源', key: 'sysName', align: 'center' },
                    { title: '关键节点', key: 'keyNode', align: 'center' },
                    { title: '错误描述', key: 'errorDescription', align: 'center' }
                ],
                tableData_system: [],
            };
        },
        components: {vLogHeader},
        watch: {
            'searchParams_user.pageNo': {
                handler(val) {
                    this.getTableData_user();
                }
            },
            'searchParams_system.pageNo': {
                handler(val) {
                    this.getTableData_system();
                }
            }
        },
        mounted() {
            this.getTableData_user();
            this.getTableData_system();
        },

        methods: {
            datePicker_onChange_user(val) {
                this.searchParams_user.beginDate = val[0];
                this.searchParams_user.endDate = val[1];
            },
            datePicker_onChange_system(val) {
                this.searchParams_system.beginDate = val[0];
                this.searchParams_system.endDate = val[1];
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change_user(pageNo) {
                this.searchParams_user.pageNo = pageNo;
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change_system(pageNo) {
                this.searchParams_system.pageNo = pageNo;
            },

            getTableData_user() {
                var that = this;
                this.tableLoading_user = true;
                this.$http({
                    method: 'post',
                    url: '/log/userOperateLog/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams_user)
                }).then(function (response) {
                    that.tableLoading_user = false;
                    if (response.status === 1) {
                        that.tableData_user = response.result.page.list;
                        that.searchParams_user.count = response.result.page.count;
                    }
                    else {
                        this.Message.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading_user = false;
                })
            },

            getTableData_system() {
                var that = this;
                this.tableLoading_system = true;
                this.$http({
                    method: 'post',
                    url: '/log/sysRunLog/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams_system)
                }).then(function (response) {
                    that.tableLoading_system = false;
                    if (response.status === 1) {
                        that.tableData_system = response.result.page.list;
                        that.searchParams_system.count = response.result.page.count;
                    }
                    else {
                        this.Message.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading_system = false;
                })
            },

            onClick_search_user() {
                this.getTableData_user();
            },
            onClick_search_system() {
                this.getTableData_system();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .Log-container {
        position: relative;
        height: 100%;

        .v-log-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999;
        }

        .log-panel {
            margin: 0 20px;
            padding-top: 82px;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .handle-bar {
            padding: 17px 11px 20px 11px;
            border: {
                width: 0 0 1px 0;
                style: solid;
                color: #e1e1e1;
            };
            overflow: hidden;

            .hd {
                margin-right: 12px;
                float: left;

                .form-item {

                    .label {
                        text-align: right;
                        vertical-align: middle;
                        float: left;
                        font-size: 12px;
                        color: #495060;
                        line-height: 1;
                        padding: 10px 12px 10px 0;
                        box-sizing: border-box;
                    }
                    .value {
                        float: right;
                    }
                }
            }
        }

        .table-panel {
            margin: 13px ;
        }

        .list-page-panel {
            text-align: center;
        }
    }
</style>