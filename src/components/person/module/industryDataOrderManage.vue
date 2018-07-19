<template>
    <div class="industryDataOrderManage-container">
        <vMenuTitle name="行业数据订单管理"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd my-btn"
                     :class="{'active': searchParams.timeInterval === 'ThisMonth'}"
                     @click="onClick_timeInterval($event,'ThisMonth')">本月</div>
                <div class="hd my-btn"
                     :class="{'active': searchParams.timeInterval === 'LastMonth'}"
                     @click="onClick_timeInterval($event,'LastMonth')">上月</div>
                <div class="hd my-btn"
                     :class="{'active': searchParams.timeInterval === 'NearHalfYear'}"
                     @click="onClick_timeInterval($event,'NearHalfYear')">近半年</div>
                <div class="hd my-btn"
                     :class="{'active': searchParams.timeInterval === 'NearAYear'}"
                     @click="onClick_timeInterval($event,'NearAYear')">近一年</div>
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

            </div>
            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count" @on-change="onPageNo_change"></Page>
            </div>
        </div>





        <Modal v-model="modal_freeApply_result"
               title="查看原因" >
            <div>
                <Input type="textarea"
                       readonly
                       :rows="5"
                       v-model="freeApply_result"
                       placeholder="" />
            </div>

        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    import Moment from 'moment';
    export default {
        name: "industryDataOrderManage",
        data() {
            var that = this;
            return {
                datePicker_default: [Moment().subtract(1, 'month'), Moment()],

                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                    timeInterval: '',
                    userId: this.$store.state.uid,
                    orderType: 'FreeDataOrder'
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
                        key: 'orderNum',
                        align: 'center'
                    },{
                        title: '商品名称',
                        key: 'dataName',
                        align: 'center'
                    },{
                        title: '数据内容',
                        key: 'dataContent',
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
                                    return '';
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

                            if (button) {
                                return h('div', [button]);
                            }
                            else {
                                return '';
                            }

                        }
                    }],
                tableData: [],


                //免费申请- 查看原因
                modal_freeApply_result: false,
                freeApply_result: ''
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
            // 本月、上月、近半年、近一年
            onClick_timeInterval(e, value) {
                this.searchParams.timeInterval = value;
                this.searchParams.beginDate = '';
                this.searchParams.endDate = '';
                this.datePicker_default = [];
                this.getTableData();
            },

            /**
             * 获取表格数据
             */
            getTableData() {
                var that = this;
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/dataOrder/list',
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

            // 免费申请订单-表格-取消申请
            onClick_freeApply_cancel(row) {
                var that = this;

                that.$Modal.confirm({
                    title: '取消订单',
                    content: '确定要取消<'+ row.orderNum +'>订单？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/dataOrder/cancel',
                            params: {
                                orderId: row.orderId,
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '取消成功！'
                                });
                                that.getTableData();
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

            // 免费申请订单-表格-查看原因
            onClick_freeApply_lookResult(row) {
                var that = this;
                this.modal_freeApply_result = true;

                that.freeApply_result = row.rejectReason;

            },
        }
    }
</script>

<style lang="scss" scoped>
    .industryDataOrderManage-container {
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