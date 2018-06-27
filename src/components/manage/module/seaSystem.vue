<template>
    <div class="seaSystem-container">
        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="数据名称"></Input>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <div class="form-item">
                        <label class="label">时间</label>
                        <div class="value">
                            <DatePicker
                                    :value="datePicker_default"
                                    :clearable="true"
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    placeholder="日期选择"
                                    @on-change="datePicker_onChange"
                                    style="width: 220px"></DatePicker>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <Button type="primary" @click="onClick_search">查询</Button>
                </div>

                <div class="hd">
                    <Button type="primary" @click="onClick_goto">进入试验分析GIS系统</Button>
                </div>

            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count"
                      show-total
                      @on-change="onPageNo_change"></Page>
            </div>

        </div>




    </div>
</template>

<script>
    export default {
        name: "seaSystem",
        data() {
            var that = this;
            return {
                datePicker_default: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                },

                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '日期',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center'
                    },{
                        title: '设备编号',
                        key: 'equipmentNo',
                        align: 'center',
                    },{
                        title: '地点',
                        key: 'position',
                        align: 'center'
                    },{
                        title: '设备状态',
                        key: 'equipmentStatus',
                        align: 'center',
                        render(h, params) {
                            return h('div', params.row.equipmentStatus === '0'? '已关闭': '运行中');
                        }
                    },{
                        title: '设备测评分析状态',
                        key: 'analysisStatus',
                        align: 'center',
                        render(h, params) {
                            return h('div', params.row.analysisStatus === '0'? '未分析': '已分析');
                        }
                    },{
                        title: '操作',
                        align: 'center',
                        width: 300,
                        render(h, params) {

                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_table_edit(params.row);
                                        }
                                    }
                                }, '编辑'),

                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            if (params.row.analysisStatus === '0') {
                                                that.onClick_table_add_analyze(params.row);
                                            }
                                            else {
                                                that.onClick_table_look_analyze(params.row);
                                            }
                                        }
                                    }
                                }, params.row.analysisStatus === '0' ? '开始分析' : '查看分析'),

                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_table_look_detail(params.row);
                                        }
                                    }
                                }, '详情'),

                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_table_del(params.row);
                                        }
                                    }
                                }, '删除')

                            ]);
                        }
                    }

                ],
                tableData: [],


            };
        },
        components: {

        },
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getTableData();
                }
            }
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            datePicker_onChange(val) {
                this.searchParams.beginDate = val[0];
                this.searchParams.endDate = val[1];
            },
            onClick_search() {
                this.getTableData();
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change(pageNo) {
                this.searchParams.pageNo = pageNo;
            },
            /**
             * 获取表格数据
             */
            getTableData() {
                var that = this;
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/equipment/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams)
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result.page.list;
                        that.searchParams.count = response.result.page.count;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
                })
            },

            // 进入试验分析GIS系统
            onClick_goto() {
                this.$router.push({
                    name: 'gisMap'
                });
            },

            /**
             * 编辑
             */
            onClick_table_edit(row) {},

            /**
             * 开始分析
             */
            onClick_table_add_analyze(row) {},

            /**
             * 查看分析
             */
            onClick_table_look_analyze(row) {},

            /**
             * 查看详情
             */
            onClick_table_look_detail(row) {},

            /**
             * 删除分析
             */
            onClick_table_del(row) {
                var that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除<'+ row.equipmentName +'>设备？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/equipment/delete',
                            params: {
                                equipmentIds: row.equipmentId
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '删除成功!'
                                });
                                that.getTableData();
                            }
                            else {
                                that.$Message.error({
                                    content: '删除失败!'
                                });
                            }
                        }).catch(function (e) {})
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .seaSystem-container {
        .content-panel {
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
    }
</style>