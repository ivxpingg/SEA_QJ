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
                                    <DatePicker :value="datePicker_default"
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
                                    <DatePicker :value="datePicker_default"
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
                        title: '费用',
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
            this.$http({
                method: 'post',
                url: '/panoramic/serverOrder/distributionServerAccount',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    orderId: '1254'
                },
                data: JSON.stringify([
                        {
                            cloudServerId: '11',
                            remoteAddress: '192.168.1.1',
                            account: 'admin',
                            password: '123456'
                        },
                        {
                            cloudServerId: '12',
                            remoteAddress: '192.168.1.1',
                            account: 'admin1',
                            password: '1234561'
                        }
                    ])
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

            //this.getTableData();
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
                    url: '/panoramic/cloudServer/list',
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
        }
    }
</script>

<style lang="scss" scoped>
    .cloudServeManage-container {
        .content-panel {
            margin-top: 23px;
            width: 100%;
            .handle-bar {
                padding: 0;
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
    }
</style>