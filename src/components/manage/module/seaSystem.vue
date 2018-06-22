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
            return {};
        },
        components: {
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
                    key: 'dataName',
                    align: 'center'
                },{
                    title: '设备名称',
                    key: 'dataNumber',
                    align: 'center'
                },{
                    title: '设备编号',
                    align: 'center',
                },{
                    title: '地点',
                    key: 'price',
                    align: 'center'
                },{
                    title: '设备状态',
                    key: 'format',
                    align: 'center'
                },{
                    title: '设备测评分析状态',
                    key: 'publishTime',
                    align: 'center'
                },{
                    title: '操作',
                    align: 'center',
                    width: 220,
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
                                        that.onClick_detail_dataResource(params.row);
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
                                        that.onClick_del_dataResource(params.row);
                                    }
                                }
                            }, '删除'),

                        ]);
                    }
                }

            ],
            tableData: [],
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
            this.getDict();
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
                    url: '/panoramic/industryData/list',
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
                    name: ''
                });
            }
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