<template>
    <div class="orderManage-container">
        <vMenuTitle name="服务器订单管理"></vMenuTitle>
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
               :width="1000"
               title="详情">
            <div class="modal_pay_detail">
                <div class="text-info">
                    <span class="text-k">购买人：<span>{{table_pay_data_detail.account}}</span></span>
                    <span class="text-k">订单时间：<span>{{table_pay_data_detail.insTime}}</span></span>
                    <span class="text-k">订单状态：<span>{{table_pay_data_detail.orderStatus}}</span></span>
                    <span class="text-k">付款时间：<span>{{table_pay_data_detail.payTime}}</span></span>
                </div>

                <Table border
                       :columns="table_pay_columns_detail"
                       :data="[table_pay_data_detail]"></Table>

                <div class="ft-bottom">
                    <div class="text-info-left">
                        <span>剩余时间：</span>
                        <span>{{table_pay_data_detail.remainDays}}天</span>
                    </div>

                    <div class="text-info-right">
                        <span>总计费用：</span>
                        <span class="count">{{table_pay_data_detail.totalPrice}}元</span>
                    </div>
                </div>

                <div class="other-title">其它信息</div>
                <div class="text-info">
                    <span class="text-k">订单备注</span>
                    <span class="text-k">备注时间：<span>{{table_pay_data_detail.remarkTime}}</span></span>

                    <span class="text-k">备注人：<span>{{table_pay_data_detail.remarkPerson}}</span></span>

                </div>

                <div class="area-text"> {{table_pay_data_detail.remark}} </div>

            </div>
        </Modal>


        <Modal v-model="modal_pay_serve_account"
               title="服务器信息">

            <div>
                <Table border
                       :columns="table_pay_columns_account"
                       :data="table_pay_data_detail.orderServerAccount">

                </Table>
            </div>

        </Modal>

        <Modal v-model="modal_pay_refund"
               @onOk="onClick_refund"
               title="退款" >
            <div>
                <Input type="textarea"
                       :rows="5"
                       :model="refund_result"
                       placeholder="请输入退款原因！" />
            </div>

        </Modal>

         <!--免费的服务器信息弹窗-->
        <Modal v-model="modal_pay_serve_account"
               title="服务器信息">

            <div>
                <Table border
                       :columns="table_freeApply_columns_account"
                       :data="table_freeApply_data_account.orderServerAccount">

                </Table>
            </div>

        </Modal>


        <Modal v-model="modal_freeApply_result"
               title="查看原因" >
            <div>
                <Input type="textarea"
                       readonly
                       :rows="5"
                       :model="freeApply_result"
                       placeholder="" />
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
                    orderType: 'ServerOrder',
                    userId: this.$store.state.uid
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
                        key: 'orderStatusStr',
                        align: 'center'
                    },{
                        title: '操作',
                        width: 260,
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
                            if (params.row.orderStatus === 'WaitPay') {
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
                            if (params.row.orderStatus === 'Pay') {

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
                            if (params.row.orderStatus === 'Refund') {
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
                            if (params.row.orderStatus === 'Refunded') {
                            }
                            // 已取消
                            if (params.row.orderStatus === 'Cancel') {

                            }

                            return h('div', btnList);
                        }
                    }
                ],
                tableData_paid: [],

                // 付费详情
                modal_pay_detail: false,
                table_pay_columns_detail: [
                    {
                        title: '订单号',
                        key: 'orderNum',
                        width: '130',
                        align: 'center'
                    },{
                        title: '商品名称',
                        key: 'serverName',
                        align: 'center'
                    },{
                        title: '商品内容',
                        key: 'name',
                        width: '220',
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
                        width: '340',
                        align: 'center',
                        render(h, params) {
                            var array_list = [], text = '';

                            params.row.orderServerAccount.forEach(function (val) {
                                text = 'IP：' + val.remoteAddress + '; '
                                    + '账号：' + val. account + '; '
                                    + '密码：' + val. password + ';';

                                array_list.push(h('div', text));
                            });

                            return h('div', array_list);
                        }
                    }
                ],
                table_pay_data_detail: {
                    account: '',

                    bandWidth: '',
                    chargeStandard: '',
                    cpu: '',
                    hardDisk: '',
                    insTime: '',
                    memory: '',
                    orderNum: '',
                    serverName: '',
                    serverNumber: '',
                    systemDisk: '',
                    remainDays: '',
                    remark: '',
                    remarkPerson: '',
                    remarkTime: '',
                    expiryTime: '',
                    payTime: '',
                    orderStatus: '',
                    totalPrice: '',

                    orderServerAccount: [
                        {
                            remoteAddress: '192.168.1.1', // IP
                            account: 'admin',   // 账号
                            password: '123456'    // 密码
                        },
                        {
                            remoteAddress: '192.168.1.1', // IP
                            account: 'admin',   // 账号
                            password: '123456'    // 密码
                        }
                    ]
                },

                // 付费账号信息
                modal_pay_serve_account: false,
                table_pay_columns_account: [
                    {
                        type: 'index',
                        title: '序号',
                        width: '80',
                        align: 'center'
                    },
                    {
                        title: '登陆IP',
                        key: 'remoteAddress',
                        align: 'center'
                    },
                    {
                        title: '账号',
                        key: 'account',
                        align: 'center'
                    },
                    {
                        title: '密码',
                        key: 'password',
                        align: 'center'
                    }
                ],

                //付费 退款
                modal_pay_refund: false,
                refund_orderNum: '',
                refund_result: '',       // 退款原因

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
                    orderType: 'FreeServerOrder',
                    userId: this.$store.state.uid
                },
                tableColumns_apply: [
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
                        title: '申请时间',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'orderStatusStr',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            var button;
                            
                            switch (params.row.orderStatus) {

                                case 'WaitAudit':  // 待审核
                                    button = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.onClick_freeApply_cancel(params.row);
                                            }
                                        }
                                    }, '取消申请');
                                    break;

                                case 'AuditSucc':  // 审核成功
                                    button = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.onClick_freeApply_getAccount(params.row);
                                            }
                                        }
                                    }, '获取');
                                    break;

                                case 'TurnDown':  // 已驳回
                                    button = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.onClick_freeApply_lookResult(params.row);
                                            }
                                        }
                                    }, '查看原因');
                                    break;
                            }

                            return h('div', [button]);
                        }
                    }
                ],
                tableData_apply: [],

                // 免费申请 - 查看账号信息
                modal_freeApply_serve_account: false,
                table_freeApply_columns_account: [
                    {
                        type: 'index',
                        title: '序号',
                        width: '80',
                        align: 'center'
                    },
                    {
                        title: '登陆IP',
                        key: 'remoteAddress',
                        align: 'center'
                    },
                    {
                        title: '账号',
                        key: 'account',
                        align: 'center'
                    },
                    {
                        title: '密码',
                        key: 'password',
                        align: 'center'
                    }
                ],
                table_freeApply_data_account: [],

                //免费申请- 查看原因
                modal_freeApply_result: false,
                freeApply_result: ''

            };
        },
        components: {vMenuTitle},
        mounted() {
            this.getPayOrderData();
            this.getApplyOrderData();
            this.getPersonInfo();
        },
        methods: {
            /**
             * 已付订单时间选择
             */
            datePicker_onChange_paid(val) {
                this.searchParams_paid.startTime = val[0];
                this.searchParams_paid.endTime = val[1];
                this.searchParams_paid.timeInterval = '';
                this.getPayOrderData();
            },
            /**
             * 申请订单时间选择
             */
            datePicker_onChange_apply(val) {
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
                    url: '/panoramic/serverOrder/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams_apply)
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

            // 获取用户信息
            getPersonInfo() {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '/auth/getUserInfoById',
                    params: {
                        type: that.$store.state.usertype,
                        uid: that.$store.state.uid,
                        token: that.$store.state.token
                    }
                }).then(function(response) {
                    if(response.status === 1) {
                        that.table_pay_data_detail.account = response.result.account;
                    }

                }).catch(function (e) {

                })
            },

            // 购买订单表格接口 - 详情
            onClick_pay_detail(row) {
                var that = this;
                this.modal_pay_detail = true;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/detail',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.table_pay_data_detail.bandWidth = response.result.bandWidth || '';
                        that.table_pay_data_detail.chargeStandard = response.result.chargeStandard || '';
                        that.table_pay_data_detail.cpu = response.result.cpu || '';
                        that.table_pay_data_detail.hardDisk = response.result.hardDisk || '';
                        that.table_pay_data_detail.insTime = response.result.insTime || '';
                        that.table_pay_data_detail.memory = response.result.memory || '';
                        that.table_pay_data_detail.orderNum = response.result.orderNum || '';
                        that.table_pay_data_detail.serverName = response.result.serverName || '';
                        that.table_pay_data_detail.serverNumber = response.result.serverNumber || '';
                        that.table_pay_data_detail.systemDisk = response.result.systemDisk || '';
                        that.table_pay_data_detail.remark = response.result.remark || '';
                        that.table_pay_data_detail.remarkPerson = response.result.remarkPerson || '';
                        that.table_pay_data_detail.remarkTime = response.result.remarkTime || '';
                        that.table_pay_data_detail.expiryTime = response.result.expiryTime || '';
                        that.table_pay_data_detail.payTime = response.result.payTime || '';
                        that.table_pay_data_detail.orderStatus = response.result.orderStatus || '';
                        that.table_pay_data_detail.totalPrice = response.result.totalPrice || '';

                        // that.table_pay_data_detail.orderServerAccount = response.result.orderServerAccount || [];
                    }
                    else {
                    }
                }).catch(function (e) {})

            },
            // 购买订单表格接口 - 付款
            onclick_pay_payOrder(row) {
                this.$router.push({
                    name: 'cashierDesk',
                    query: {
                        orderId: row.orderId
                    }
                });
            },
            // 购买订单表格接口 - 取消订单
            onclick_pay_cancelOrder(row) {
                var that = this;

                that.$Modal.confirm({
                   title: '取消订单',
                   content: '确定要取消<'+ row.orderNum +'>订单？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/serverOrder/cancel',
                            params: {
                                orderId: row.orderId,
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '取消成功！'
                                });
                                that.getPayOrderData();
                            }
                            else {
                                that.$Message.error({
                                    content: '取消失败！'
                                });
                            }
                        }).catch(function (e) {});
                    }
                });
            },
            // 购买订单表格接口 - 退款
            onclick_pay_refund(row) {
                this.modal_pay_refund = true;
                this.refund_orderNum = row.orderNum;
            },
            // 购买订单表格接口 - 获取账号信息
            onclick_pay_getInfo(row) {
                var that = this;
                this.modal_pay_serve_account = true;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/detail',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        // that.table_pay_data_detail.orderServerAccount = response.result.orderServerAccount || [];
                    }
                    else {
                    }
                }).catch(function (e) {})
            },
            // 购买订单表格接口 - 取消退款
            onclick_pay_cancelRefund(row) {
                var that = this;

                that.$Modal.confirm({
                    title: '取消退款',
                    content: '确定要取消退款<'+ row.orderNum +'>订单？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/serverOrder',
                            params: {
                                orderNum: row.orderNum,
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '取消退款成功！'
                                });
                            }
                            else {
                                that.$Message.error({
                                    content: '取消退款失败！'
                                });
                            }
                        }).catch(function (e) {

                        });
                    }
                });
            },

            // ****** 付费弹窗事件 ******

            // 退款
            onClick_refund() {
                var that = this;


                // 接口未实现

                that.$http({
                    method: 'post',
                    url: '/panoramic/serverOrder',
                    params: {
                        orderNum: that.refund_orderNum,
                        result: that.refund_result
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.$Message.success({
                            content: '申请退款成功！'
                        });
                    }
                    else {
                    }
                }).catch(function (e) {});
            },


            // 免费申请订单-表格-取消申请
            onClick_freeApply_cancel(row) {
                var that = this;

                that.$Modal.confirm({
                    title: '取消订单',
                    content: '确定要取消<'+ row.orderNum +'>订单？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/serverOrder/cancel',
                            params: {
                                orderId: row.orderId,
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '取消成功！'
                                });
                                that.getApplyOrderData();
                            }
                            else {
                                that.$Message.error({
                                    content: '取消失败！'
                                });
                            }
                        }).catch(function (e) {});
                    }
                });
            },
            // 免费申请订单-表格-获取
            onClick_freeApply_getAccount(row) {
                var that = this;
                this.modal_freeApply_serve_account = true;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/viewSeverAccount',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                         that.table_freeApply_data_account = response.result || [];
                    }
                    else {
                    }
                }).catch(function (e) {})
            },
            // 免费申请订单-表格-查看原因
            onClick_freeApply_lookResult(row) {
                var that = this;
                this.modal_freeApply_result = true;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.freeApply_result = response.result || [];
                    }
                    else {
                    }
                }).catch(function (e) {})
            },
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

        @at-root .modal_pay_detail {
            font-size: 13px;
            line-height: 53px;
            .text-info {
                padding-bottom: 14px;
                font-size: 13px;
                line-height: 26px;

                .text-k {
                    padding-right: 36px;
                }
            }

            .ft-bottom {
                overflow: hidden;
                line-height: 50px;

                .text-info-left {
                    float: left;
                    padding-left: 10px;
                }

                .text-info-right {
                    float: right;
                    padding-right: 10px;

                    .count {
                        font-size: 16px;
                    }
                }

            }

            .other-title {
                margin-bottom: 20px;
                font-weight: 700;
                line-height: 53px;
                border-bottom: 1px solid #cecece;
            }

            .area-text {
                padding: 10px;
                line-height: 19px;
                color: #6f6f6f;
                background-color: #efefef;
                min-height: 80px;
                border: 1px solid #d6d6d6;
            }
        }
    }
</style>