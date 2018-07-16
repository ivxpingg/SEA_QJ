<template>
    <div class="invoiceApplyManage-container">

        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="公司名称、订单号"></Input>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_date">时间</label>
                        <div class="value">
                            <DatePicker element-id="userOrder_date"
                                        :value="datePicker_default"
                                        transfer
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

        <Modal v-model="modal_express"
               title="快递信息">
            <div>
                <Form :label-width="80">
                    <FormItem label="快递公司">
                        <Input type="text" v-model="expressInfo.expressCompany" placeholder="请填写快递公司" />
                    </FormItem>
                    <FormItem label="快递单号">
                        <Input type="text" v-model="expressInfo.expressNum" placeholder="请填写快递单号" />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_express">确定</Button>
            </div>
        </Modal>

        <Modal v-model="modal_detail_invoiceApply"
               :class="{'modal-invoice-se': modal_detail_invoiceApply}"

               title="发票详情信息">
            <div class="add-invoice">
                <Form v-model="detail_invoiceApply" class="detail-form"  :label-width="100">
                    <FormItem label="开票金额:"> {{detail_invoiceApply.invoiceMoney}}</FormItem>
                    <FormItem label="发票抬头:">{{detail_invoiceApply.invoiceTitle}}</FormItem>
                    <FormItem label="纳税人识别号:">{{detail_invoiceApply.taxpayerNumber}}</FormItem>
                    <FormItem label="开户银行:">{{detail_invoiceApply.accountOpenBank}}</FormItem>
                    <FormItem label="开户账号:">{{detail_invoiceApply.openAccount}} </FormItem>
                    <FormItem label="注册地址:">{{detail_invoiceApply.registerAddress}}</FormItem>
                    <FormItem label="公司电话:">{{detail_invoiceApply.companyPhone}}</FormItem>
                    <FormItem label="发票邮寄地址:">{{detail_invoiceApply.mailAddress}}</FormItem>
                    <FormItem label="收件人姓名:">{{detail_invoiceApply.addresseeName}}</FormItem>
                    <FormItem label="邮编:">{{detail_invoiceApply.zipCode}}</FormItem>
                    <FormItem label="手机号码:">{{detail_invoiceApply.phone}}</FormItem>
                </Form>
            </div>

            <div slot="footer" >
                <Button v-if="modal_detail_invoiceApply_print" @click="onClick_print">打印</Button>
            </div>

        </Modal>


    </div>
</template>

<script>
    export default {
        name: "invoiceApplyManage",
        data() {
            var that = this;
            return {
                datePicker_default: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    startTime: '',
                    endTime: '',
                },

                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '订单编号',
                        key: 'orderNumber',
                        align: 'center'
                    },{
                        title: '发票抬头',
                        key: 'invoiceTitle',
                        align: 'center'
                    },{
                        title: '创建时间',
                        key: 'APPLY_TIME',
                        align: 'center'
                    },{
                        title: '申请金额',
                        key: 'invoiceMoney',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'applyStatus',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            var text = '';
                            
                            switch (params.row.applyStatus){
                                case '申请中': text = '填写快递信息'; break;
                                case '申请成功': text = '查看快递信息'; break;
                            }

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

                                            if (text === '填写快递信息') {
                                                that.getExpressDetailByID(params.row, 1);
                                            }
                                            else {
                                                that.getExpressDetailByID(params.row, 0);
                                            }
                                        }
                                    }
                                }, text),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_orderDetail(params.row);
                                        }
                                    }
                                }, '发票详情')
                            ]);
                        }
                    }

                ],
                tableData: [],

                // 填写快递信息
                modal_express: false,
                expressInfo: {
                    type: 1,
                    invoiceApplyId: '',
                    expressCompany: '',    // 快递公司
                    expressNum: ''         // 快递单号
                },

                // 查看发票申请详情
                modal_detail_invoiceApply_print: true,  // 打印
                modal_detail_invoiceApply: false,
                detail_invoiceApply: {
                    invoiceMoney: '',
                    invoiceTitle: '',
                    taxpayerNumber: '',
                    accountOpenBank: '',
                    openAccount: '',
                    registerAddress: '',
                    companyPhone: '',
                    mailAddress: '',
                    addresseeName: '',
                    zipCode: '',
                    phone: ''
                }
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
        mounted() {
            this.getTableData();
        },
        methods: {
            datePicker_onChange(val) {
                this.searchParams.startTime = val[0];
                this.searchParams.endTime = val[1];
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
                    url: '/panoramic/invoice/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        pageNo: this.searchParams.pageNo,
                        pageSize: this.searchParams.pageSize,
                        keyword: this.searchParams.keyword,
                        beginDate: this.searchParams.startTime,
                        endDate: this.searchParams.endTime
                    })
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
                    that.$Modal.error({
                        content: JSON.stringify(e)
                    });
                })
            },

            // 获取详细发票申请信息
            /**
             *
             * @param row
             * @param type {Number} 1 : 填写快递信息; 0: 查看快递信息
             */
            getExpressDetailByID(row, type) {
                var that = this;
                if(type === 1) {
                    that.expressInfo.type = 1;
                    that.expressInfo.invoiceApplyId = row.invoiceApplyId;
                    that.expressInfo.expressCompany = '';
                    that.expressInfo.expressNum = '';

                    that.modal_express = true;
                }
                else {
                    this.$http({
                        method: 'get',
                        url: '/panoramic/invoice/getInvoiceApply',
                        params: {
                            invoiceApplyId: row.invoiceApplyId
                        }
                    }).then(function (response) {
                        if (response.status === 1) {
                            that.expressInfo.type = 0;
                            that.expressInfo.invoiceApplyId = row.invoiceApplyId;
                            that.expressInfo.expressCompany = response.result.expressCompany;
                            that.expressInfo.expressNum = response.result.expressNum;

                            that.modal_express = true;
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

            },

            // 提交快递信息 或者 关闭快递信息弹窗
            onClick_express() {
                var that = this;

                 if (that.expressInfo.type === 1){
                     this.$http({
                         method: 'get',
                         url: '/panoramic/invoice/updateExpressInfo',
                         params: {
                             invoiceApplyId: that.expressInfo.invoiceApplyId,
                             expressCompany: that.expressInfo.expressCompany,
                             expressNum: that.expressInfo.expressNum
                         }
                     }).then(function (response) {
                         if (response.status === 1) {
                             that.$Message.success({
                                 content: '提交成功！'
                             });

                             that.modal_express = false;
                             that.getTableData();
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
                 else {
                     that.modal_express = false;
                 }
            },

            /**
             * 查看订单详情
             * @param row [Object]
             */
            onClick_orderDetail(row) {
                var that = this;
                
                that.$http({
                    method: 'get',
                    url: '/panoramic/invoice/getInvoiceApply',
                    params: {
                        invoiceApplyId: row.invoiceApplyId
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.detail_invoiceApply.invoiceMoney = response.result.invoiceMoney;
                        that.detail_invoiceApply.invoiceTitle = response.result.invoiceTitle;
                        that.detail_invoiceApply.taxpayerNumber = response.result.taxpayerNumber;
                        that.detail_invoiceApply.accountOpenBank = response.result.accountOpenBank;
                        that.detail_invoiceApply.openAccount = response.result.openAccount;
                        that.detail_invoiceApply.registerAddress = response.result.registerAddress;
                        that.detail_invoiceApply.companyPhone = response.result.companyPhone;
                        that.detail_invoiceApply.mailAddress = response.result.mailAddress;
                        that.detail_invoiceApply.addresseeName = response.result.addresseeName;
                        that.detail_invoiceApply.zipCode = response.result.zipCode;
                        that.detail_invoiceApply.phone = response.result.phone;

                        that.modal_detail_invoiceApply = true;
                        that.modal_detail_invoiceApply_print = true;
                    }
                    
                }).catch(function (e) {
                    console.dir(e);
                });
            },

            onClick_print() {
                var that = this;
                this.modal_detail_invoiceApply_print = false;
                setTimeout(function () {
                    window.print();
                    that.modal_detail_invoiceApply = false;
                },0)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .invoiceApplyManage-container {
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

    .detail-form {
        .ivu-form-item {
            margin-bottom: 8px;
        }
    }
</style>
<style lang="scss">
    .modal-invoice-se {
        .ivu-modal-close {
            display: none;
        }

        .ivu-modal-header {
            display: none;
        }

        .ivu-modal-footer {
            /*display: none;*/
        }
    }
</style>