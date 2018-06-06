<template>
    <div class="invoiceManage-container">
        <vMenuTitle name="发票管理"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd hd-money">
                    <span class="label">金额：</span>
                    <span class="value">{{invoiceInfo.invoiceMoney}}</span>
                    <span class="unit">元</span>
                </div>
                <div class="hd hd-datePicker">
                    <DatePicker :value="datePicker_default"
                                :clearable="false"
                                format="yyyy-MM-dd"
                                size="large"
                                type="daterange"
                                placeholder="日期选择"
                                @on-change="datePicker_onChange"
                                style="width: 220px"></DatePicker>
                </div>
                <div class="hd">
                    <Button type="primary" size="large" @click="onClick_modal_invoice">申请开票</Button>
                </div>
                <div class="hd">
                    <Button type="primary" size="large" @click="onClick_modal_invoiceInfo">开票信息</Button>
                </div>
            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>

        </div>

        <Modal v-model="modal_invoiceInfo"
               title="开票信息">
            <div>
                <Form ref="formValidate_invoice" :model="invoiceInfo" :label-width="100" :rules="ruleInvoiceInfo">
                    <FormItem label="发票抬头:" prop="invoiceTitle">
                        <Input type="text" v-model="invoiceInfo.invoiceTitle" placeholder="请填写有效企业全称" />
                    </FormItem>
                    <FormItem label="纳税人识别号:" prop="taxpayerNumber">
                        <Input type="text" v-model="invoiceInfo.taxpayerNumber" placeholder="请填写18位有效社会统一信用代码" />
                    </FormItem>
                    <FormItem label="开户银行:" prop="accountOpenBank">
                        <Input type="text" v-model="invoiceInfo.accountOpenBank" placeholder="开户银行及支行，例：招商银行湖里支行"/>
                    </FormItem>
                    <FormItem label="开户账号:" prop="openAccount">
                        <Input type="text" v-model="invoiceInfo.openAccount" placeholder="请填写贵司开户许可证登记银行账号"/>
                    </FormItem>
                    <FormItem label="注册地址:" prop="registerAddress">
                        <Input type="textarea" v-model="invoiceInfo.registerAddress" placeholder="请填写税务登记证上的地址或经营场所地址" />
                    </FormItem>
                    <FormItem label="公司电话:" prop="companyPhone">
                        <Input type="text" v-model="invoiceInfo.companyPhone" placeholder="公司注册电话" />
                    </FormItem>
                    <FormItem label="发票邮寄地址:" prop="mailAddress">
                        <Input type="text" v-model="invoiceInfo.mailAddress" placeholder="请填写有效地址" />
                    </FormItem>
                    <FormItem label="收件人姓名:" prop="addresseeName">
                        <Input type="text" v-model="invoiceInfo.addresseeName" placeholder="请填写2-25个字符以内的有效姓名" />
                    </FormItem>
                    <FormItem label="邮编:" prop="zipCode">
                        <Input type="text" v-model="invoiceInfo.zipCode" placeholder="请填写有效邮政编码" />
                    </FormItem>
                    <FormItem label="手机号码:" prop="phone">
                        <Input type="text" v-model="invoiceInfo.phone" placeholder="请填写有效手机号码" />
                    </FormItem>
                </Form>
            </div>

            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_updateInvoice">提交申请</Button>
            </div>

        </Modal>

        <Modal v-model="modal_add_invoice" title="核对发票信息">
            <div class="add-invoice">
                <Form v-model="invoiceInfo" :label-width="100">
                    <FormItem label="开票金额:"> {{invoiceInfo.invoiceMoney}}</FormItem>
                    <FormItem label="发票抬头:">{{invoiceInfo.invoiceTitle}}</FormItem>
                    <FormItem label="纳税人识别号:">{{invoiceInfo.taxpayerNumber}}</FormItem>
                    <FormItem label="开户银行:">{{invoiceInfo.accountOpenBank}}</FormItem>
                    <FormItem label="开户账号:">{{invoiceInfo.openAccount}} </FormItem>
                    <FormItem label="注册地址:">{{invoiceInfo.registerAddress}}</FormItem>
                    <FormItem label="公司电话:">{{invoiceInfo.companyPhone}}</FormItem>
                    <FormItem label="发票邮寄地址:">{{invoiceInfo.mailAddress}}</FormItem>
                    <FormItem label="收件人姓名:">{{invoiceInfo.addresseeName}}</FormItem>
                    <FormItem label="邮编:">{{invoiceInfo.zipCode}}</FormItem>
                    <FormItem label="手机号码:">{{invoiceInfo.phone}}</FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long  @click="onClick_addInvoice">提交申请</Button>
            </div>
        </Modal>

        <Modal v-model="modal_table_invoiceInfo" title="发票详情信息">
            <div class="add-invoice">
                <Form v-model="tableInvoiceInfo" :label-width="100">
                    <FormItem label="开票金额:"> {{tableInvoiceInfo.invoiceMoney}}</FormItem>
                    <FormItem label="发票抬头:">{{tableInvoiceInfo.invoiceTitle}}</FormItem>
                    <FormItem label="纳税人识别号:">{{tableInvoiceInfo.taxpayerNumber}}</FormItem>
                    <FormItem label="开户银行:">{{tableInvoiceInfo.accountOpenBank}}</FormItem>
                    <FormItem label="开户账号:">{{tableInvoiceInfo.openAccount}} </FormItem>
                    <FormItem label="注册地址:">{{tableInvoiceInfo.registerAddress}}</FormItem>
                    <FormItem label="公司电话:">{{tableInvoiceInfo.companyPhone}}</FormItem>
                    <FormItem label="发票邮寄地址:">{{tableInvoiceInfo.mailAddress}}</FormItem>
                    <FormItem label="收件人姓名:">{{tableInvoiceInfo.addresseeName}}</FormItem>
                    <FormItem label="邮编:">{{tableInvoiceInfo.zipCode}}</FormItem>
                    <FormItem label="手机号码:">{{tableInvoiceInfo.phone}}</FormItem>
                </Form>
            </div>

        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    import Moment from 'moment';
    export default {
        name: "invoiceManage",
        data() {
            var that = this;
            return {
                datePicker_default: [Moment().subtract(1, 'month'), Moment()],

                searchParams: {
                    keyword: '',
                    startTime: '',
                    endTime: ''
                },

                // 表格
                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '申请开票时间',
                        key: 'applyTime',
                        align: 'center'
                    },{
                        title: '开票金额(元)',
                        key: 'invoiceMoney',
                        align: 'center'
                    },{
                        title: '发票抬头',
                        key: 'invoiceTitle',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'applyStatus',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params){
                            return h('Button', {
                                props: {
                                    type: 'text'
                                },
                                style: {
                                    textDecoration: 'underline'
                                },
                                on: {
                                    click() {
                                        that.getInvoiceApplyBy_id(params.row.invoiceApplyId);


                                    }
                                }
                            }, '详情');
                        }
                    }
                ],
                tableData: [],

                // 开票信息
                invoiceInfo: {
                    invoiceMoney: 0.00,            // 可开发票金额

                    issueInvoiceId: "1",     //    开票信息的标识ID

                    accountOpenBank: "1",    // 开户银行
                    addresseeName: "1",      // 收件人姓名
                    companyPhone: "1",       // 公司电话
                    invoiceTitle: "1",       // 发票抬头
                    mailAddress: "1",        // 发票邮寄地址
                    openAccount: "1",        // 开户账号
                    phone: "1",              // 手机号码
                    registerAddress: "1",    // 注册地址
                    taxpayerNumber: "1",     // 纳税人识别号
                    userId: "1",             // 用户ID
                    zipCode: "1"             // 邮编
                },
                ruleInvoiceInfo: {
                    invoiceTitle: [
                        { required: true, message: '发票抬头不能为空', trigger: 'blur' }
                    ],
                    taxpayerNumber: [
                        { required: true, message: '纳税人识别号不能为空', trigger: 'blur'}
                    ],
                    accountOpenBank: [
                        { required: true, message: '开户银行不能为空', trigger: 'blur'}
                    ],
                    openAccount: [
                        { required: true, message: '开户账号不能为空', trigger: 'blur'}
                    ],
                    registerAddress: [
                        { required: true, message: '注册地址不能为空', trigger: 'blur'}
                    ],
                    companyPhone: [
                        { required: true, message: '公司电话不能为空', trigger: 'blur'}
                    ],
                    mailAddress: [
                        { required: true, message: '发票邮寄地址不能为空', trigger: 'blur'}
                    ],
                    addresseeName: [
                        { required: true, message: '收件人姓名不能为空', trigger: 'blur'}
                    ],zipCode: [
                        { required: true, message: '邮编不能为空', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: '手机号码不能为空', trigger: 'blur'}
                    ],
                },
                modal_invoiceInfo: false,
                modal_add_invoice: false,


                // modal 查看选择的开票详情信息
                modal_table_invoiceInfo: false,
                tableInvoiceInfo: {
                    invoiceMoney: 0.00,            // 可开发票金额

                    issueInvoiceId: "1",     //    开票信息的标识ID

                    accountOpenBank: "1",    // 开户银行
                    addresseeName: "1",      // 收件人姓名
                    companyPhone: "1",       // 公司电话
                    invoiceTitle: "1",       // 发票抬头
                    mailAddress: "1",        // 发票邮寄地址
                    openAccount: "1",        // 开户账号
                    phone: "1",              // 手机号码
                    registerAddress: "1",    // 注册地址
                    taxpayerNumber: "1",     // 纳税人识别号
                    userId: "1",             // 用户ID
                    zipCode: "1"             // 邮编
                }
            };
        },
        components: {vMenuTitle},
        created() {
            this.searchParams.startTime = this.datePicker_default[0].format('YYYY-MM-DD');
            this.searchParams.endTime = this.datePicker_default[1].format('YYYY-MM-DD');
        },
        mounted() {
            this.getTableData();
            this.getInvoiceData();
        },
        methods: {
            datePicker_onChange() {
                this.searchParams.startTime = val[0];
                this.searchParams.endTime = val[1];
                this.getTableData();
            },
            onClick_modal_invoice() {
                this.modal_add_invoice = true;
            },
            onClick_modal_invoiceInfo() {
                this.modal_invoiceInfo = true;
            },

            // 获取可开发票金额
            getMoney() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/panoramic/invoice/getIssueInvoice',
                    params: {
                        userId: '1'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.invoiceInfo.invoiceMoney = response.result.invoiceMoney || 0;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    // that.$Modal.error({
                    //     content: JSON.stringify(e)
                    // });
                })
            },

            // 获取开票信息
            getInvoiceData() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/panoramic/invoice/getIssueInvoice',
                    params: {
                        userId: '1'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.invoiceInfo.accountOpenBank = response.result.accountOpenBank || '';
                        that.invoiceInfo.addresseeName = response.result.addresseeName || '';
                        that.invoiceInfo.companyPhone = response.result.companyPhone || '';
                        that.invoiceInfo.invoiceTitle = response.result.invoiceTitle || '';
                        that.invoiceInfo.issueInvoiceId = response.result.issueInvoiceId || '';
                        that.invoiceInfo.mailAddress = response.result.mailAddress || '';
                        that.invoiceInfo.openAccount = response.result.openAccount || '';
                        that.invoiceInfo.phone = response.result.phone || '';
                        that.invoiceInfo.registerAddress = response.result.registerAddress || '';
                        that.invoiceInfo.taxpayerNumber = response.result.taxpayerNumber || '';
                        that.invoiceInfo.userId = response.result.userId || '';
                        that.invoiceInfo.zipCode = response.result.zipCode || '';
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    // that.$Modal.error({
                    //     content: JSON.stringify(e)
                    // });
                })
            },

            // 获取表格数据
            getTableData() {
                var that = this;
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/invoice/applyInvoiceList',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        userId: '1',
                        keyword: this.searchParams.keyword,
                        beginDate: this.searchParams.startTime,
                        endDate: this.searchParams.endTime
                    })
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
                    that.$Modal.error({
                        content: JSON.stringify(e)
                    });
                })
            },

            // 更新开票信息
            onClick_updateInvoice() {
                var that = this;

                this.$refs['formValidate_invoice'].validate((valid) => {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '/panoramic/invoice/updateIssueInvoice',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(this.invoiceInfo)
                        }).then(function (response) {
                            that.tableLoading = false;
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '更新成功！'
                                });
                                that.modal_invoiceInfo = false;
                            }
                            else {
                                that.$Modal.error({
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {
                            that.tableLoading = false;
                            that.$Modal.error({
                                content: JSON.stringify(e)
                            });
                        })

                    }
                    else {}
                })
            },

            // 申请开票
            onClick_addInvoice() {
                var that = this;
                this.$http({
                    method: 'post',
                    url: '/panoramic/invoice/applyInvoice',
                    data: {
                        issueInvoiceId: this.invoiceInfo.issueInvoiceId,
                        userId: '1'
                    }
                }).then(function (response) {
                    debugger
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.$Message.success({
                            content: '申请成功！'
                        });
                        that.modal_add_invoice = false;
                    }
                    else {
                        that.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
                    // that.$Modal.error({
                    //     content: JSON.stringify(e)
                    // });
                })
            },

            // 获取详细的发票申请信息
            getInvoiceApplyBy_id (invoiceApplyId) {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/panoramic/invoice/getInvoiceApply',
                    params: {
                        invoiceApplyId: invoiceApplyId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.tableInvoiceInfo.invoiceMoney = response.result.invoiceMoney || 0;
                        that.tableInvoiceInfo.accountOpenBank = response.result.accountOpenBank || '';
                        that.tableInvoiceInfo.addresseeName = response.result.addresseeName || '';
                        that.tableInvoiceInfo.companyPhone = response.result.companyPhone || '';
                        that.tableInvoiceInfo.invoiceTitle = response.result.invoiceTitle || '';
                        that.tableInvoiceInfo.issueInvoiceId = response.result.issueInvoiceId || '';
                        that.tableInvoiceInfo.mailAddress = response.result.mailAddress || '';
                        that.tableInvoiceInfo.openAccount = response.result.openAccount || '';
                        that.tableInvoiceInfo.phone = response.result.phone || '';
                        that.tableInvoiceInfo.registerAddress = response.result.registerAddress || '';
                        that.tableInvoiceInfo.taxpayerNumber = response.result.taxpayerNumber || '';
                        that.tableInvoiceInfo.userId = response.result.userId || '';
                        that.tableInvoiceInfo.zipCode = response.result.zipCode || '';


                        that.modal_table_invoiceInfo = true;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    // that.$Modal.error({
                    //     content: JSON.stringify(e)
                    // });
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .invoiceManage-container {

        .content-panel {
            margin-top: 23px;

            .handle-bar {
                padding: 17px 11px 20px 11px;
                border: 1px solid #e1e1e1;
                overflow: hidden;

                .hd {
                    margin-right: 4px;
                    float: left;

                    &.hd-money {
                        margin-right: 72px;
                        line-height: 34px;
                        font-weight: 700;

                        .label {
                            font-size: 12px;
                        }
                        .value {
                            font-size: 16px;
                        }
                        .unit {
                            font-size: 16px;
                        }
                    }

                    &.hd-datePicker {
                        margin-right: 20px;
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