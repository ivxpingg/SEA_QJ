<template>
    <div class="industryDataManage-container">
        <vMenuTitle name="行业数据"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd">
                    <DatePicker :value="datePicker_default"
                                :clearable="false"
                                transfer
                                format="yyyy-MM-dd"
                                size="large"
                                type="daterange"
                                placeholder="日期选择"
                                @on-change="datePicker_onChange"
                                style="width: 220px"></DatePicker>
                </div>

            </div>
            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count" @on-change="onPageNo_change"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    import Moment from 'moment';
    export default {
        name: "industryDataManage",
        data() {
            return {
                datePicker_default: [Moment().subtract(1, 'month'), Moment()],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                    timeInterval: ''
                },
                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '订单号',
                        key: 'industryDataId',
                        align: 'center'
                    },{
                        title: '商品名称',
                        key: 'dataName',
                        align: 'center'
                    },{
                        title: '商品内容',
                        key: 'description',
                        align: 'center'
                    },{
                        title: '申请时间',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'workOrderStatus',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            var text = '';
                            switch (params.row.workOrderStatus) {
                                case '待处理': text = '取消工单'; break;
                                case '处理中': text =  '取消工单'; break;
                                case '已结单': text = '查看结果'; break;
                                case '已取消': text = '重新开单'; break;
                            }

                            return h('Button', {
                                props: {
                                    type: 'text'
                                },
                                style: {
                                    textDecoration: 'underline'
                                },
                                on: {
                                    click() {
                                        switch (params.row.workOrderStatus) {
                                            case '待处理': that.onClick_cancelWorkOrder(params.row); break;
                                            case '处理中': that.onClick_cancelWorkOrder(params.row); break;
                                            case '已结单': that.onClick_viewDetail(params.row); break;
                                            case '已取消': that.onClick_reOrder(params.row); break;
                                        }
                                    }
                                }
                            }, text);
                        }
                    }],
                tableData: [],
            };
        },
        components: {vMenuTitle},
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getTableData();
                }
            }
        },
        created() {
            this.searchParams.beginDate = this.datePicker_default[0].format('YYYY-MM-DD');
            this.searchParams.endDate = this.datePicker_default[1].format('YYYY-MM-DD');
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            // 日期变化
            datePicker_onChange(val) {
                this.searchParams.beginDate = val[0];
                this.searchParams.endDate = val[1];
                this.searchParams.timeInterval = '';
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
                    method: 'get',
                    url: '/panoramic/dataOrder/getApplyDataList',
                    params: {
                        userId: that.$store.state.uid
                    }
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
        }
    }
</script>

<style lang="scss" scoped>
    .industryDataManage-container {
        .content-panel {
            margin-top: 23px;
            width: 100%;

            .handle-bar {
                padding: 0;
                overflow: hidden;

                .hd {
                    margin-right: 4px;
                    float: left;
                }

                .my-btn {
                    display: inline-block;
                    padding: 0 14px;
                    font-size: 13px;
                    line-height: 36px;
                    background-color: #d9dee4;
                    cursor: pointer;

                    &:hover {
                        color: #FFF;
                        background-color: #2b85e4;
                    }

                    &.active {
                        color: #FFF;
                        background-color: #2b85e4;
                    }
                }
            }

            .table-panel {
                margin-top: 13px;
            }

            .list-page-panel {
                text-align: center;
                padding: 20px 16px 100px;
            }
        }
    }
</style>