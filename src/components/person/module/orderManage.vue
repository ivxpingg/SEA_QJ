<template>
    <div class="orderManage-container">
        <vMenuTitle name="订单管理"></vMenuTitle>
        <div class="content-panel">
            <Tabs type="card" :animated="false">
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

        <Modal v-model="modal_pay_detail"
               :width="900"
               title="详情">
            <div>
                <div>
                    <span>购买人：</span> <span></span>
                    <span>订单时间：</span> <span></span>
                    <span>订单状态：</span> <span></span>
                    <span>付款时间：</span> <span></span>
                </div>

                <Table border
                       :loading="tableLoading_apply"
                       :columns="table_pay_columns_detail"
                       :data="table_pay_data_detail"></Table>

                <div>
                    <div>
                        <span>剩余时间</span>
                        <span>2250天</span>
                    </div>

                    <div>
                        <span>总计费用</span>
                        <span>600</span>
                    </div>
                </div>

                <div class="other-title">其它信息</div>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "orderManage",
        data() {
            var that = this;
            return {
                // ******* 付费申请 ******
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
                        align: 'center',
                        render(h, params){
                            var text = '';

                            text = '规格：' + params.row.cpu + 'CPU; '
                                + params.row.memory +'内存; '
                                + params.row.systemDisk + '; '
                                + params.row.hardDisk+ '; '
                                + params.row.bandWidth+ ';'

                            return h('div', text);
                        }
                    },{
                        title: '数量',
                        key: 'serverNumber',
                        align: 'center'
                    },{
                        title: '购买时间',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '费用',
                        key: 'totalPrice',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'orderStatus',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {

                            var button1, button2, button3, btnList = [];

                            button1 = h('Button', {
                                props: {
                                    type: 'text'
                                },
                                style: {
                                    textDecoration: 'underline'
                                },
                                on: {
                                    click() {
                                        that.onClick_pay_detail(params.row);
                                    }
                                }
                            }, '详情');

                            btnList.push(button1);

                            // 待支付
                            if (params.orderStatus === 'WaitPay') {
                                button2 = h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onclick_pay_payOrder(params.row);
                                        }
                                    }
                                }, '付款');

                                button3 = h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onclick_pay_cancelOrder(params.row);
                                        }
                                    }
                                }, '取消订单');

                                btnList.push(button2);
                                btnList.push(button3);
                            }
                            // 已支付
                            if (params.orderStatus === 'Pay') {

                                button2 = h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onclick_pay_getInfo(params.row);
                                        }
                                    }
                                }, '获取');

                                button3 = h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onclick_pay_refund(params.row);
                                        }
                                    }
                                }, '退款');

                                btnList.push(button2);
                                btnList.push(button3);

                            }
                            // 退款中
                            if (params.orderStatus === 'Refund') {
                                button2 = h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onclick_pay_cancelRefund(params.row);
                                        }
                                    }
                                }, '取消退款');

                                btnList.push(button2);
                            }
                            // 已退款
                            if (params.orderStatus === 'Refunded') {
                            }
                            // 已取消
                            if (params.orderStatus === 'Cancel') {

                            }

                            return h('div', btnList);
                        }
                    }
                ],
                tableData_paid: [],

                // 付费详情
                modal_pay_detail: true,
                table_pay_columns_detail: [
                    {
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
                        align: 'center',
                        render(h, params){
                            var text = '';

                            text = '规格：' + params.row.cpu + 'CPU; '
                                + params.row.memory +'内存; '
                                + params.row.systemDisk + '; '
                                + params.row.hardDisk+ '; '
                                + params.row.bandWidth+ ';'

                            return h('div', text);
                        }
                    },{
                        title: '数量',
                        key: 'serverNumber',
                        align: 'center'
                    },{
                        title: '单价',
                        key: 'totalPrice',
                        align: 'center'
                    },{
                        title: '账号信息',
                        key: 'totalPrice',
                        align: 'center',
                        render(h, params) {
                            return '';
                        }
                    }
                ],
                table_pay_data_detail: [],

                // ******* 免费申请 ******
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
                tableData_apply: [],

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

            // 购买订单表格接口 - 详情
            onClick_pay_detail(row) {

                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/detail',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {

                    }
                    else {
                    }
                }).catch(function (e) {})

            },
            // 购买订单表格接口 - 付款
            onclick_pay_payOrder(row) {},
            // 购买订单表格接口 - 取消订单
            onclick_pay_cancelOrder(row) {},
            // 购买订单表格接口 - 退款
            onclick_pay_refund(row) {},
            // 购买订单表格接口 - 获取账号信息
            onclick_pay_getInfo(row) {},
            // 购买订单表格接口 - 取消退款
            onclick_pay_cancelRefund(row) {},

            // ****** 付费弹窗事件 ******


        }
    }
</script>

<style lang="scss" scoped>
    .orderManage-container {

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