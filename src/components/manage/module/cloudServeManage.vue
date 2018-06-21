<template>
    <div class="cloudServeManage-container">

        <div class="content-panel">
            <Tabs type="card" :animated="false">
                <TabPane label="购买订单">
                    <div class="handle-bar">
                        <div class="hd">
                            <div class="form-item">
                                <label class="label" for="userOrder_keyword1">关键字</label>
                                <div class="value">
                                    <Input id="userOrder_keyword1" v-model="searchParams_paid.keyword" placeholder="工单、用户、电话"></Input>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <div class="form-item">
                                <label class="label">时间</label>
                                <div class="value">
                                    <DatePicker :value="datePicker_default_paid"
                                                :clearable="true"
                                                format="yyyy-MM-dd"
                                                type="daterange"
                                                placeholder="日期选择"
                                                @on-change="datePicker_onChange_paid"
                                                style="width: 220px"></DatePicker>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <Button type="primary" @click="getPayOrderData">查询</Button>
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
                        <div class="hd">
                            <div class="form-item">
                                <label class="label" for="userOrder_keyword2">关键字</label>
                                <div class="value">
                                    <Input id="userOrder_keyword2" v-model="searchParams_apply.keyword" placeholder="工单、用户、电话"></Input>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <div class="form-item">
                                <label class="label">时间</label>
                                <div class="value">
                                    <DatePicker :value="datePicker_default_apply"
                                                :clearable="true"
                                                format="yyyy-MM-dd"
                                                type="daterange"
                                                placeholder="日期选择"
                                                @on-change="datePicker_onChange_apply"
                                                style="width: 220px"></DatePicker>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <Button type="primary" @click="getApplyOrderData">查询</Button>
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

        <!--付款订单详情-->
        <Modal v-model="modal_pay_detail"
               :width="1000"
               title="详情">
            <div class="modal_pay_detail">
                <div class="text-info">
                    <span class="text-k">购买人：<span>未绑定字段</span></span>
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

        <!--退款原因-->
        <Modal v-model="modal_pay_refund"
               @onOk="onClick_refund"
               ok-text="同意退款"
               title="用户退款原因" >
            <div>
                <Input type="textarea"
                       :rows="5"
                       readonly
                       :model="refund_result"
                       placeholder="用户没有退款说明" />
            </div>

        </Modal>

        <!--退款原因-->
        <Modal v-model="modal_pay_remark"
               @onOk="onClick_addRemark"
               ok-text="添加备注"
               title="备注" >
            <div>
                <Input type="textarea"
                       :rows="5"
                       readonly
                       :model="remark_content"
                       placeholder="请输入备注内容" />
            </div>

        </Modal>

        <!--驳回原因-->
        <Modal v-model="modal_freeApply_reject"
               @onOk="onClick_reject"
               ok-text="驳回"
               title="驳回原因" >
            <div>
                <Input type="textarea"
                       :rows="5"
                       :model="rejectReason"
                       placeholder="请输入驳回原因" />
            </div>

        </Modal>

        <!--发放账号-->
        <Modal v-model="modal_freeApply_provideAccount"
               title="发放账号" >
            <div ref="provideAccountForm" class="provide-account-form">
                <div class="account-th">
                    <div class="account-td">序号</div>
                    <div class="account-td">登陆IP</div>
                    <div class="account-td">账号</div>
                    <div class="account-td">密码</div>
                </div>
                <div v-for="(item, idx) in cloudServerAccountList" :key="idx" class="account-tr">
                    <div class="account-td">1</div>
                    <div class="account-td ivu-input-wrapper ivu-input-type">
                        <input type="text" class="ivu-input" :class="'remoteAddress_' + idx" />
                    </div>
                    <div class="account-td ivu-input-wrapper ivu-input-type">
                        <input type="text" class="ivu-input" :class="'account_' + idx" />
                    </div>
                    <div class="account-td ivu-input-wrapper ivu-input-type">
                        <input type="text" class="ivu-input" :class="'password_' + idx" />
                    </div>
                </div>
            </div>

            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="onClick_account_post">确认发送</Button>
            </div>

        </Modal>

        <!--免费申请订单详情-->
        <Modal v-model="modal_freeApply_detail"
               :width="1000"
               title="详情">
            <div class="modal_pay_detail">
                <div class="text-info">
                    <span class="text-k">订单时间：<span>{{table_freeApply_data_detail.insTime}}</span></span>
                    <span class="text-k">订单状态：<span>{{table_freeApply_data_detail.orderStatus}}</span></span>
                    <span class="text-k">通过时间：<span>{{table_freeApply_data_detail.payTime}}</span></span>
                </div>

                <Table border
                       :columns="table_freeApply_columns_detail"
                       :data="[table_freeApply_data_detail]"></Table>

                <div class="ft-bottom">
                    <Button @click="onClick_lookImage" >查看附件</Button>
                </div>

                <div class="other-title">账号信息</div>
                <Table border
                       :columns="table_accound_columns"
                       :data="table_freeApply_data_detail.orderServerAccount"></Table>

            </div>
        </Modal>

        <Modal v-model="modal_look_image" title="附件">
            <img :src="fileimgUrl" alt="">
        </Modal>

    </div>
</template>

<script>
    import Config from '../../../libs/appConfig/config';
    export default {
        name: "cloudServeManage",
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
                    keyword: '',
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
                        title: '支付金额',
                        key: 'totalPrice',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'orderStatusStr',
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

                            }
                            // 已支付
                            if (params.orderStatus === 'Pay') {

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
                                            that.onclick_pay_causeRrefund(params.row);
                                        }
                                    }
                                }, '查看退款原因');

                                btnList.push(button2);
                            }
                            // 已退款
                            if (params.orderStatus === 'Refunded') {
                            }
                            // 已取消
                            if (params.orderStatus === 'Cancel') {

                            }

                            button3 = h('Button', {
                                props: {
                                    type: 'text'
                                },
                                style: {
                                    textDecoration: 'underline'
                                },
                                on: {
                                    click() {
                                        that.modal_pay_remark = true;
                                        that.remarkOrderId = params.row.orderId;
                                    }
                                }
                            }, '备注');

                            btnList.push(button3);

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

                //付费 退款原因
                modal_pay_refund: false,
                refundOrderId: '',
                refund_result: '',       // 退款原因

                // 付费 备注
                modal_pay_remark: false,
                remarkOrderId: '',
                remark_content: '',

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
                    keyword: '',
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
                        key: 'orderNum',
                        align: 'center'
                    },{
                        title: '申请商品名称',
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
                        width: 250,
                        render(h, params) {
                            var button1,
                                button2,
                                button3,
                                array_list = [];

                            switch (params.row.orderStatus) {

                                case 'WaitAudit':  // 待审核
                                    button1 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.$Modal.confirm({
                                                    title: '审核确认',
                                                    content: '确定要通过该用户的产品申请吗？ 《审核通过后您需填写相关账号信息发送给用户使用》',
                                                    onOk() {
                                                        that.$http({
                                                            method: 'get',
                                                            url: '/panoramic/serverOrder/auditSuccess',
                                                            params: {
                                                                orderId: params.row.orderId
                                                            }
                                                        }).then(function (response) {
                                                            if (response.status === 1) {
                                                                that.$Message.success({
                                                                    content: '审核通过成功！'
                                                                });

                                                                that.getApplyOrderData();
                                                            }
                                                            else {
                                                                that.$Message.error({
                                                                    content: '审核通过失败！'
                                                                });
                                                            }
                                                        }).catch(function (e) {
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }, '审核通过');

                                    button2 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.modal_freeApply_reject = true;
                                                that.rejectOrderId = params.row.orderId;
                                            }
                                        }
                                    }, '驳回');

                                    array_list.push(button1);
                                    array_list.push(button2);
                                    break;

                                case 'AuditSucc':  // 审核成功
                                    button1 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.modal_freeApply_provideAccount = true;
                                                that.provideAccound_orderId = params.row.orderId;
                                                that.provideAccound_cloudServerId = params.row.cloudServerId;

                                                that.cloudServerAccountList = [];
                                               for(var i = 0; i < params.row.serverNumber; i++) {
                                                   that.cloudServerAccountList.push({
                                                       remoteAddress: '',
                                                       account: '',
                                                       password: ''
                                                   });
                                               }
                                            }
                                        }
                                    }, '发放账号');
                                    array_list.push(button1);
                                    break;

                                case 'TurnDown':  // 已驳回
                                    break;
                            }

                            button3 = h('Button', {
                                props: {
                                    type: 'text'
                                },
                                style: {
                                    textDecoration: 'underline'
                                },
                                on: {
                                    click() {
                                        that.onClick_freeApply_detail(params.row);
                                    }
                                }
                            }, '详情');
                            array_list.push(button3);

                            return h('div', array_list);
                        }
                    }
                ],
                tableData_apply: [],

                // 驳回
                modal_freeApply_reject: false,
                rejectOrderId: '',
                rejectReason: '',

                // 发放账号
                modal_freeApply_provideAccount: false,
                provideAccound_orderId: '',
                provideAccound_cloudServerId: '',
                cloudServerAccountList: [],

                // 免费详情
                modal_freeApply_detail: false,
                table_freeApply_columns_detail: [
                    {
                        title: '订单号',
                        key: 'orderNum',
                        width: '130',
                        align: 'center'
                    },{
                        title: '申请单位名称',
                        key: 'serverName',
                        align: 'center'
                    },{
                        title: '申请人',
                        key: 'remarkPerson',
                        align: 'center'
                    },{
                        title: '联系电话',
                        key: 'd',
                        align: 'center'
                    },{
                        title: '联系邮箱',
                        key: 'd',
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
                        title: '用途说明与特殊需求',
                        key: 'remark',
                        align: 'center'
                    }
                ],
                table_freeApply_data_detail: {
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
                    pictureUrl: '',

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

                table_accound_columns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: '80',
                        align: 'center'
                    },{
                        title: '登陆IP',
                        key: 'remoteAddress',
                        align: 'center'
                    },{
                        title: '账号',
                        key: 'account',
                        align: 'center'
                    },{
                        title: '密码',
                        key: 'password',
                        align: 'center'
                    }
                ],

                // 查看附件窗口
                modal_look_image: false

            };
        },
        components: {},
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getTableData();
                }
            }
        },
        computed: {
            fileimgUrl() {
                return window.location.origin + Config[Config.env].imgUrl + this.table_freeApply_data_detail.pictureUrl;
            }
        },
        mounted() {


            //this.getTableData();
            this.getPayOrderData();
            this.getApplyOrderData();
        },
        methods: {
            /**
             * 已付订单时间选择
             */
            datePicker_onChange_paid(val) {
                this.searchParams_paid.startTime = val[0];
                this.searchParams_paid.endTime = val[1];
                this.searchParams_paid.timeInterval = '';
            },
            /**
             * 申请订单时间选择
             */
            datePicker_onChange_apply(val) {
                this.searchParams_apply.startTime = val[0];
                this.searchParams_apply.endTime = val[1];
                this.searchParams_apply.timeInterval = '';
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

            /**
             * 获取表格数据
             */
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
            // 购买订单表格接口 - 查看退款原因
            onclick_pay_causeRrefund(row) {
                var that = this;
                this.modal_pay_refund = true;
                this.refundOrderId = row.refundOrderId;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/detail',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.refund_result = '未对接，接口还没有这个字段';
                    }
                    else {
                    }
                }).catch(function (e) {})
            },

            // 同意退款
            onClick_refund() {
                alert('还没有退款接口');
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/',
                    params: {
                        orderId: that.refundOrderId
                    }
                }).then(function (response) {
                    that.modal_pay_refund = false;
                    if (response.status === 1) {
                        that.$Message.success({
                            content: '退款成功！'
                        });
                    }
                    else {
                        that.$Message.error({
                            content: '退款失败！'
                        });
                    }
                }).catch(function (e) {
                    that.modal_pay_refund = false;
                })
            },

            // 添加备注
            onClick_addRemark() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/updateOrderRemark',
                    params: {
                        orderId: that.remarkOrderId,
                        remark: that.remark_content
                    }
                }).then(function (response) {
                    that.modal_pay_remark = false;
                    if (response.status === 1) {
                        that.$Message.success({
                            content: '添加备注成功！'
                        });
                    }
                    else {
                        that.$Message.error({
                            content: '添加备注失败！'
                        });
                    }
                }).catch(function (e) {
                    that.modal_pay_remark = false;
                })
            },

            // 驳回
            onClick_reject() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/reject',
                    params: {
                        orderId: that.rejectOrderId,
                        rejectReason: that.rejectReason
                    }
                }).then(function (response) {
                    that.modal_freeApply_reject = false;
                    if (response.status === 1) {
                        that.$Message.success({
                            content: '驳回成功！'
                        });
                    }
                    else {
                        that.$Message.error({
                            content: '驳回失败！'
                        });
                    }
                }).catch(function (e) {
                    that.modal_freeApply_reject = false;
                })
            },

            // 发送账号
            onClick_account_post() {
                var that = this;

                var doms = this.$refs['provideAccountForm'].querySelectorAll('.account-tr');

                for (var i = 0; i < doms.length; i++) {

                    that.cloudServerAccountList[i].remoteAddress = doms[i].querySelector('.remoteAddress_' + i).value;
                    that.cloudServerAccountList[i].account = doms[i].querySelector('.account_' + i).value;
                    that.cloudServerAccountList[i].password = doms[i].querySelector('.password_' + i).value;

                    if (that.cloudServerAccountList[i].remoteAddress.trim() === '') {
                        that.$Message.error({
                            content: '登陆IP不能为空'
                        });
                        return;
                    }
                    if (that.cloudServerAccountList[i].account.trim() === '') {
                        that.$Message.error({
                            content: '账号不能为空'
                        });
                        return;
                    }
                    if (that.cloudServerAccountList[i].password.trim() === '') {
                        that.$Message.error({
                            content: '密码不能为空'
                        });
                        return;
                    }
                }

                that.$http({
                    method: 'post',
                    url: '/panoramic/serverOrder/distributionServerAccount',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        orderId: that.provideAccound_orderId,
                        cloudServerId: that.provideAccound_cloudServerId
                    },
                    data: JSON.stringify(that.cloudServerAccountList)
                }).then(function (response) {
                    if (response.status === 1) {
                        that.modal_freeApply_provideAccount = false;
                        that.$Message.success({
                            content: '账号发放成功！'
                        });
                    }
                    else {
                        that.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.$Modal.error({
                        content: '请求失败！'
                    });
                })
            },

            // 打开详情窗口
            onClick_freeApply_detail(row) {
                var that = this;
                this.modal_freeApply_detail = true;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/detail',
                    params: {
                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.table_freeApply_data_detail.bandWidth = response.result.bandWidth || '';
                        that.table_freeApply_data_detail.chargeStandard = response.result.chargeStandard || '';
                        that.table_freeApply_data_detail.cpu = response.result.cpu || '';
                        that.table_freeApply_data_detail.hardDisk = response.result.hardDisk || '';
                        that.table_freeApply_data_detail.insTime = response.result.insTime || '';
                        that.table_freeApply_data_detail.memory = response.result.memory || '';
                        that.table_freeApply_data_detail.orderNum = response.result.orderNum || '';
                        that.table_freeApply_data_detail.serverName = response.result.serverName || '';
                        that.table_freeApply_data_detail.serverNumber = response.result.serverNumber || '';
                        that.table_freeApply_data_detail.systemDisk = response.result.systemDisk || '';
                        that.table_freeApply_data_detail.remark = response.result.remark || '';
                        that.table_freeApply_data_detail.remarkPerson = response.result.remarkPerson || '';
                        that.table_freeApply_data_detail.remarkTime = response.result.remarkTime || '';
                        that.table_freeApply_data_detail.expiryTime = response.result.expiryTime || '';
                        that.table_freeApply_data_detail.payTime = response.result.payTime || '';
                        that.table_freeApply_data_detail.orderStatus = response.result.orderStatus || '';
                        that.table_freeApply_data_detail.totalPrice = response.result.totalPrice || '';
                        that.table_freeApply_data_detail.pictureUrl = response.result.pictureUrl || '';


                        // that.table_pay_data_detail.orderServerAccount = response.result.orderServerAccount || [];
                    }
                    else {
                    }
                }).catch(function (e) {})
            },

            // 查看附件图片
            onClick_lookImage() {
                this.modal_look_image = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cloudServeManage-container {
        .content-panel {
            margin-top: 23px;
            width: 100%;
            .handle-bar {
                padding: 0px 11px 0px 11px;
                overflow: hidden;

                .hd {
                    margin-right: 4px;
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

        @at-root .provide-account-form {
            border: 1px solid #dddee1;

            .account-th, .account-tr {
                display: flex;

                .account-td {
                    flex: 1;
                    border-left: 1px solid #dddee1;

                    &:first-child {
                        flex: none;
                        width: 80px;
                        text-align: center;
                        line-height: 40px;
                        border-left-width: 0;
                    }
                }
            }

            .account-th {
                height: 40px;
                text-align: center;
                line-height: 40px;
                background-color: #f8f8f9;
            }

            .account-tr {
                border-top: 1px solid #dddee1;

                .account-td {
                    padding: 0 4px;
                    .ivu-input {
                        margin-top: 4px;
                    }
                }


            }
        }
    }
</style>