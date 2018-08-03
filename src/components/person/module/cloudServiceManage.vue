<template>
    <div class="cloudServiceManage-container">
        <vMenuTitle name="云服务"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd">
                    <DatePicker :value="datePicker_default"
                                transfer
                                format="yyyy-MM-dd"
                                size="large"
                                type="daterange"
                                placeholder="日期选择"
                                @on-change="datePicker_onChange"
                                style="width: 220px"></DatePicker>
                </div>
                <div class="hd"><Button type="primary" size="large" @click="onClick_goto">新增</Button></div>

            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count" @on-change="onPageNo_change"></Page>
            </div>
        </div>


        <Modal v-model="modal_pay_serve_account"
               title="服务器信息">

            <div>
                <Table border
                       no-data-text="没有账号数据"
                       no-filtered-data-text="没有账号数据"
                       :columns="table_pay_columns_account"
                       :data="orderServerAccount">

                </Table>
            </div>

        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "cloudServiceManage",
        data() {
            var that = this;
            return {
                datePicker_default: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    startDate: '',
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
                        title: '订单编号',
                        key: 'orderNum',
                        align: 'center'
                    },{
                        title: '监控/状态',
                        key: 'monitorStatus',
                        align: 'center'
                    },{
                        title: '可用存储',
                        key: 'hardDisk',
                        align: 'center'
                    },
                    {
                        title: '主机配置',
                        align: 'center',
                        render(h, params) {
                            var text = (params.row.serverName || '')
                                + ';CPU：' + (params.row.cpu || '')
                                + ';内存：' + (params.row.memory || '')
                                + ';系统盘：' + (params.row.systemDisk || '')
                                + ';存储盘：' + (params.row.hardDisk || '')
                                + ';宽带：' + (params.row.bandWidth || '')
                            return h('div', text);
                        }
                    },
                    {
                        title: 'IP地址',
                        key: 'ip',
                        align: 'center'
                    },
                    {
                        title: '剩余使用时间',
                        key: 'remainDays',
                        align: 'center',
                        render(h, params) {
                            return h('div', (params.row.remainDays || '') + '天');
                        }
                    },
                    {
                        title: '到期时间',
                        key: 'expiryTime',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 250,
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
                                            alert('未对接');
                                        }
                                    }
                                }, '续费'),
                                h('Button', {
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
                                }, '详情')
                            ]);
                        }
                    }
                ],
                tableData: [
                //     {
                //     serverName: '服务器',
                //     orderNum: '1',
                //     monitorStatus: '1',
                //     hardDisk: '1',
                //     ip: '192.168.1.1',
                //     remainDays: '5',
                //     expiryTime: '1',
                //     cpu: '2核',
                //     memory: '4G',
                //     systemDisk: '500G',
                //     bandWidth: '10Mbps'
                // }
                ],

                // 详情
                modal_pay_serve_account: false,
                table_pay_columns_account: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '登陆IP',
                        width: 160,
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
                orderServerAccount: []
            };
        },
        components: {vMenuTitle},
        mounted() {
            this.getTableData();
        },
        methods: {
            // 日期变化
            datePicker_onChange(val) {
                this.searchParams.startTime = val[0];
                this.searchParams.endTime = val[1];
                this.getTableData();
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change(pageNo) {
                this.searchParams.pageNo = pageNo;
            },
            onClick_goto(){
                this.$router.push({
                    name: 'cloudService'
                })
            },
            /**
             * 获取表格数据
             */
            getTableData() {
                var that = this;
                this.tableLoading = true;
                this.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/getServerListInConsole',
                    params: {
                        userId: this.$store.state.uid
                    }
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result;
                        // that.searchParams.count = response.result.page.count;
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

            // 获取服务器账号
            onClick_pay_detail(row) {
                var that = this;
                that.modal_pay_serve_account = true;
                that.orderServerAccount = row.accountList || [];
            }

        }
    }
</script>

<style lang="scss" scoped>
    .cloudServiceManage-container {
        .content-panel {
            margin-top: 23px;

            .handle-bar {
                padding: 17px 11px 20px 11px;
                border: 1px solid #e1e1e1;
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