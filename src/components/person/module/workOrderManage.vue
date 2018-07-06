<template>
    <div class="workOrderManage-container">
        <vMenuTitle name="工单管理"></vMenuTitle>
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
                                :clearable="false"
                                transfer
                                format="yyyy-MM-dd"
                                size="large"
                                type="daterange"
                                placeholder="日期选择"
                                @on-change="datePicker_onChange"
                                style="width: 220px"></DatePicker>
                </div>
                <div class="hd"><Button type="primary" size="large" @click="onClick_modal_add_workOrder">创建工单</Button></div>

            </div>
            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count" @on-change="onPageNo_change"></Page>
            </div>
        </div>

        <Modal v-model="modal_add_workOrder"
               title="添加工单" >
            <div>
                <Form v-model="workOrderInfo" :label-width="80">
                    <FormItem label="选择产品" prop="orderId">
                        <Select v-model="workOrderInfo.orderId" placeholder="请选择产品">
                            <Option v-for="item in serverList_bought"
                                    :key="item.orderId"
                                    :value="item.orderId">{{item.serverName}}</Option>
                        </Select>
                    </FormItem>

                    <FormItem label="问题描述" prop="applyContent">
                        <Input type="textarea" v-model="workOrderInfo.applyContent" />
                    </FormItem>

                    <FormItem label="联系人" prop="applyName">
                        <Input type="text" v-model="workOrderInfo.applyName" />
                    </FormItem>

                    <FormItem label="联系电话" prop="phone">
                        <Input type="text" v-model="workOrderInfo.phone" />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_addWorkOrder">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    import Moment from 'moment';
    export default {
        name: "workOrderManage",
        data() {
            var that = this;
            return {
                datePicker_default: [Moment().subtract(1, 'month'), Moment()],

                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    startTime: '',
                    endTime: '',
                    timeInterval: ''
                },

                dict_workOrderStatus: [],

                tableLoading: false,
                tableColumns: [
                    {
                    type: 'index',
                    width: 80,
                    title: '序号',
                    align: 'center'
                },{
                    title: '工单号',
                    key: 'workOrderNum',
                    align: 'center'
                },{
                    title: '申请产品',
                    key: 'serverName',
                    align: 'center'
                },{
                    title: '创建时间',
                    key: 'insTime',
                    align: 'center'
                },{
                    title: '申请内容',
                    key: 'applyContent',
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

                // 已购买的服务器产品列表
                serverList_bought: [],

                // 添加工单
                modal_add_workOrder: false,
                workOrderInfo: {
                    orderId: '',
                    ip: '',
                    applyContent: '',
                    applyName: '',
                    phone: '',
                    serverName: ''
                }
            };
        },
        components: {vMenuTitle},
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getTableData();
                }
            },
            'workOrderInfo.orderId': {
                handler(val) {
                    for(var i = 0; i < this.serverList_bought.length; i++){
                        if(val === this.serverList_bought[i].orderId) {
                            this.workOrderInfo.ip = this.serverList_bought[i].remoteAddress || '';
                            this.workOrderInfo.serverName = this.serverList_bought[i].serverName || '';
                            return;
                        }
                    }

                }
            }
        },
        created() {
            this.searchParams.startTime = this.datePicker_default[0].format('YYYY-MM-DD');
            this.searchParams.endTime = this.datePicker_default[1].format('YYYY-MM-DD');
        },
        mounted() {
            this.getDict();
            this.getOrderList();
        },
        methods: {
            // 日期变化
            datePicker_onChange(val) {
                this.searchParams.startTime = val[0];
                this.searchParams.endTime = val[1];
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

            getDict() {
                var that = this;
                // 获取订单状态字典
                this.$http({
                    method: "get",
                    url: '/sys/dict/listData',
                    params: {
                        type: 'workOrderStatus'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dict_workOrderStatus = response.result;
                        that.getTableData();
                    }
                    else {
                        console.dir(response.errMsg);
                    }
                }).catch(function (err) {
                    console.dir(err);
                })
            },

            /**
             * 获取表格数据
             */
            getTableData() {
                var that = this;
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/workOrder/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        pageNo: this.searchParams.pageNo,
                        pageSize: this.searchParams.pageSize,
                        keyword: this.searchParams.keyword,
                        beginDate: this.searchParams.startTime,
                        endDate: this.searchParams.endTime,
                        timeInterval: this.searchParams.timeInterval
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

            /**
             * 获取已购买的产品列表
             */
            getOrderList() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/panoramic/workOrder/getPaidServerList',
                    params: {
                        userId: this.$store.state.uid
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.serverList_bought = response.result;
                    }
                    else {}
                }).catch(function (e) {
                    
                })
            },

            // 添加工单
            onClick_addWorkOrder() {
                var that = this;
                this.$http({
                    method: 'post',
                    url: '/panoramic/workOrder/add',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.workOrderInfo)
                }).then(function (response) {
                    if (response.status === 1) {
                        that.modal_add_workOrder = false;
                        that.$Message.success({
                            content: '添加成功！'
                        });

                        that.getTableData();
                    }
                    else {
                        that.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {})
            },

            onClick_modal_add_workOrder() {
                this.modal_add_workOrder = true;
            },

            // 取消工单
            onClick_cancelWorkOrder(row) {
                var that = this;
                this.$Modal.confirm({
                    title: '取消工单',
                    content: '确定要取消<'+ row.workOrderNum +'>工单？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/workOrder/cancelWorkOrder',
                            params: {
                                workOrderId: row.workOrderId
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
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {})
                    }
                });
            },
            // 查看详情
            onClick_viewDetail(row) {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/workOrder/detail',
                    params: {
                        workOrderId: row.workOrderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {

                        that.$Modal.info({
                            title: '服务结果',
                            content: response.result.handleResult
                        });

                    }
                    else {}
                }).catch(function (e) {

                });


            },
            // 重新下单
            onClick_reOrder(row) {
                var that = this;
                this.$Modal.confirm({
                    title: '重新下单',
                    content: '确定要对<'+ row.workOrderNum +'>工单重新下单？',
                    onOk() {
                        that.workOrderInfo.orderId = row.orderId;
                        that.workOrderInfo.applyContent = row.applyContent;
                        that.workOrderInfo.applyName = row.applyName;
                        that.workOrderInfo.phone = row.phone;
                        that.modal_add_workOrder = true;
                    }
                });
            },

            // 本月、上月、近半年、近一年
            onClick_timeInterval(e, value) {
                this.searchParams.timeInterval = value;
                this.searchParams.startTime = '';
                this.searchParams.endTime = '';
                this.datePicker_default = [];
                this.getTableData();
            }

        }
    }
</script>

<style lang="scss" scoped>
    .workOrderManage-container {
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

        .viewDetail {
            padding: 12px;
            font-size: 13px;
            line-height: 13px;
        }
    }
</style>