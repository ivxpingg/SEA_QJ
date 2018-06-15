<template>
    <div class="orderManage-container">
        <vMenuTitle name="订单管理"></vMenuTitle>
        <div class="content-panel">
            <Tabs type="card">
                <TabPane label="购买订单">
                        <div class="handle-bar">
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_paid.timeInterval === 'ThisMonth'}"
                                 @click="onClick_timeInterval_paid($event,'ThisMonth')">本月</div>
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_paid.timeInterval === 'LastMonth'}"
                                 @click="onClick_timeInterval_paid($event,'LastMonth')">上月</div>
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_paid.timeInterval === 'NearHalfYear'}"
                                 @click="onClick_timeInterval_paid($event,'NearHalfYear')">近半年</div>
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_paid.timeInterval === 'NearAYear'}"
                                 @click="onClick_timeInterval_paid($event,'NearAYear')">近一年</div>
                            <div class="hd">
                                <DatePicker :value="datePicker_default_paid"
                                            :clearable="false"
                                            format="yyyy-MM-dd"
                                            size="large"
                                            type="daterange"
                                            placeholder="日期选择"
                                            @on-change="datePicker_onChange_paid"
                                            style="width: 220px"></DatePicker>
                            </div>

                        </div>
                        <div class="table-panel">
                            <Table border
                                   :loading="tableLoading_paid"
                                   :columns="tableColumns_paid"
                                   :data="tableData_paid"></Table>
                        </div>
                        <div class="list-page-panel">
                            <Page :total="searchParams_paid.count" @on-change="onPageNo_change_paid"></Page>
                        </div>
                </TabPane>
                <TabPane label="申请订单">
                        <div class="handle-bar">
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_apply.timeInterval === 'ThisMonth'}"
                                 @click="onClick_timeInterval_apply($event,'ThisMonth')">本月</div>
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_apply.timeInterval === 'LastMonth'}"
                                 @click="onClick_timeInterval_apply($event,'LastMonth')">上月</div>
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_apply.timeInterval === 'NearHalfYear'}"
                                 @click="onClick_timeInterval_apply($event,'NearHalfYear')">近半年</div>
                            <div class="hd my-btn"
                                 :class="{'active': searchParams_apply.timeInterval === 'NearAYear'}"
                                 @click="onClick_timeInterval_apply($event,'NearAYear')">近一年</div>
                            <div class="hd">
                                <DatePicker :value="datePicker_default_apply"
                                            :clearable="false"
                                            format="yyyy-MM-dd"
                                            size="large"
                                            type="daterange"
                                            placeholder="日期选择"
                                            @on-change="datePicker_onChange_apply"
                                            style="width: 220px"></DatePicker>
                            </div>

                        </div>
                        <div class="table-panel">
                            <Table border
                                   :loading="tableLoading_apply"
                                   :columns="tableColumns_apply"
                                   :data="tableData_apply"></Table>
                        </div>
                        <div class="list-page-panel">
                            <Page :total="searchParams_apply.count" @on-change="onPageNo_change_apply"></Page>
                        </div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "orderManage",
        data() {
            return {
                datePicker_default_paid: [],
                tableLoading_paid: false,
                searchParams_paid: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    startDate: '',
                    endDate: '',
                    timeInterval: '',
                    orderType: 'ServerOrder'
                },
                datePicker_default_apply: [],
                tableLoading_apply: false,
                searchParams_apply: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    startDate: '',
                    endDate: '',
                    timeInterval: '',
                    orderType: 'FreeServerOrder'
                },

                tableColumns_paid: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '订单号',
                        key: 'orderNum',
                        align: 'center'
                    },{
                        title: '商品名称',
                        key: 'serverName',
                        align: 'center'
                    },{
                        title: '商品内容',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '数量',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '购买时间',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '费用',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'orderStatus',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            return '222';
                        }
                    }
                ],

                tableColumns_apply: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '订单号',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '商品名称',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '商品内容',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '数量',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '申请时间',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            return '222';
                        }
                    }
                ],

                tableData_paid: [{
                    name: '33'
                }],
                tableData_apply: [{
                    name: '33'
                }]

            };
        },
        components: {vMenuTitle},
        mounted() {
            this.getPayOrderData();
            this.getApplyOrderData();
        },
        methods: {
            /**
             * 已付订单时间选择
             */
            datePicker_onChange_paid() {
                this.searchParams_paid.startTime = val[0];
                this.searchParams_paid.endTime = val[1];
                this.searchParams_paid.timeInterval = '';
                this.getPayOrderData();
            },
            /**
             * 申请订单时间选择
             */
            datePicker_onChange_apply() {
                this.searchParams_apply.startTime = val[0];
                this.searchParams_apply.endTime = val[1];
                this.searchParams_apply.timeInterval = '';
                this.getApplyOrderData();
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change_paid(pageNo) {
                this.searchParams_paid.pageNo = pageNo;
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change_apply(pageNo) {
                this.searchParams_apply.pageNo = pageNo;
            },
            // 本月、上月、近半年、近一年
            onClick_timeInterval_paid(e, value) {
                this.searchParams_paid.timeInterval = value;
                this.searchParams_paid.startTime = '';
                this.searchParams_paid.endTime = '';
                this.datePicker_default_paid = [];
                this.getPayOrderData();
            },
            // 本月、上月、近半年、近一年
            onClick_timeInterval_apply(e, value) {
                this.searchParams_apply.timeInterval = value;
                this.searchParams_apply.startTime = '';
                this.searchParams_apply.endTime = '';
                this.datePicker_default_paid = [];
                this.getApplyOrderData();
            },

            getPayOrderData() {
                var that = this;
                this.tableLoading_paid = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/serverOrder/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams_paid)
                }).then(function (response) {
                    that.tableLoading_paid = false;
                    if (response.status === 1) {
                        that.tableData_paid = response.result.page.list;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading_paid = false;
                })
            },
            getApplyOrderData() {
                var that = this;
                this.tableLoading_apply = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/workOrder/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams_paid)
                }).then(function (response) {
                    that.tableLoading_apply = false;
                    if (response.status === 1) {
                        that.tableData_apply = response.result.page.list;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading_apply = false;
                })
            },


        }
    }
</script>

<style lang="scss" scoped>
    .orderManage-container {

        .content-panel {
            margin-top: 23px;

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