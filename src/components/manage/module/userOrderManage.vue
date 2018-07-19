<template>
    <div class="userOrderManage-container">

        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="工单、用户、电话"></Input>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <div class="form-item">
                        <label class="label">时间</label>
                        <div class="value">
                            <DatePicker :value="datePicker_default"
                                        :clearable="false"
                                        transfer
                                        format="yyyy-MM-dd"
                                        type="daterange"
                                        placeholder="日期选择"
                                        @on-change="datePicker_onChange"
                                        style="width: 220px"></DatePicker>
                        </div>
                    </div>
                </div>
                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">状态</label>
                        <div class="value">
                            <Select v-model="searchParams.workOrderStatus">
                                <Option value="">全部</Option>
                                <Option v-for="item in dict_workOrderStatus"
                                        :value="item.value"
                                        :label="item.label"
                                        :key="item.id"></Option>
                            </Select>
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

        <Modal title="处理结果"
               v-model="modal_finish">

            <div>
                 <Input type="textarea"
                        v-model="workOrderFinish.handleResult"
                        :rows="10"
                        placeholder="请输入处理结果" />
            </div>

            <div slot="footer">
                <Button type="primary" long size="large" @click="onClick_finish">结单</Button>
            </div>
        </Modal>

        <Modal title="详情"
               :width="450"
               v-model="modal_detail">

            <div>
                <Form class="detail-form" v-model="workOrderDetail" :label-width="80">
                    <FormItem label="工单号:">
                        <Input v-model="workOrderDetail.workOrderNum" type="text" readonly></Input>
                    </FormItem>

                    <FormItem label="创建时间:">
                        <Input v-model="workOrderDetail.insTime" type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="状态:">
                        <Input v-model="workOrderDetail.workOrderStatus" type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="主机名称:">
                        <Input v-model="workOrderDetail.serverName" type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="IP:">
                        <Input v-model="workOrderDetail.ip" type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="问题描述:">
                        <Input type="textarea"
                               readonly
                               v-model="workOrderDetail.applyContent"
                               placeholder="4"
                               :rows="3"></Input>
                    </FormItem>
                    <FormItem label="联系人:">
                        <Input v-model="workOrderDetail.applyName" type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="联系电话:">
                        <Input v-model="workOrderDetail.phone"  type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="结单时间:">
                        <Input v-model="workOrderDetail.finishTime" type="text" readonly></Input>
                    </FormItem>
                    <FormItem label="结单描述">
                        <Input type="textarea" readonly v-model="workOrderDetail.handleResult" :rows="3"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "userOrderManage",
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
                    workOrderStatus: ''
                },
                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    }, {
                        title: '工单号',
                        key: 'workOrderNum',
                        align: 'center'
                    },{
                        title: 'IP',
                        key: 'ip',
                        align: 'center'
                    },{
                        title: '主机名称',
                        key: 'serverName',
                        align: 'center'
                    },{
                        title: '申请人名称',
                        key: 'applyName',
                        align: 'center'
                    },{
                        title: '联系电话',
                        key: 'phone',
                        align: 'center'
                    },{
                        title: '提交时间',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'workOrderStatusStr',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            var text = '';
                            switch (params.row.workOrderStatus) {
                                case 'WaitHandle': text = '接受处理'; break;
                                case 'InHandle': text =  '完成结单'; break;
                                case 'Finish': text = '详情'; break;
                                case 'Cancel': text = '详情'; break;
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
                                            case 'WaitHandle': that.onClick_accept(params.row); break;
                                            case 'InHandle':
                                                that.modal_finish = true;
                                                that.workOrderFinish.workOrderId = params.row.workOrderId;
                                                break;
                                            case 'Finish': that.getWorkOrderDetail(params.row); break;
                                            case 'Cancel': that.getWorkOrderDetail(params.row); break;
                                        }
                                    }
                                }
                            }, text);
                        }
                    }
                ],
                tableData: [],

                // 状态字典
                dict_workOrderStatus: [],

                // 结单弹窗
                modal_finish: false,
                workOrderFinish: {
                    workOrderId: '',
                    handleResult: '',
                    account: ''
                },

                // 查看工单详情
                modal_detail: false,
                workOrderDetail: {
                    workOrderNum: '',
                    insTime: '',
                    workOrderStatus: '',
                    serverName: '',
                    ip: '',
                    applyContent: '',
                    applyName: '',
                    phone: '',
                    finishTime: '',
                    handleResult: ''
                }
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
        mounted() {
            this.getDict();
            this.getTableData();
            this.getUserInfo();
        },
        methods: {
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
                    }
                    else {
                        console.dir(response.errMsg);
                    }
                }).catch(function (err) {
                    console.dir(err);
                })
            },
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

            getUserInfo() {

                var that = this;
                that.$http({
                    method: 'get',
                    url: '/auth/getUserInfoById',
                    params: {
                        token: that.$store.state.token,
                        uid: that.$store.state.uid,
                        type: that.$store.state.type
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.workOrderFinish.account = response.result.account || '';
                    }
                    else {}
                }).catch(function (e) {

                });
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
                        endDate: this.searchParams.endTime
                    })
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result.page.list;
                        that.searchParams.count = response.result.page.count;
                    }
                    else {
                        this.$Message.error({
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

            // 接受处理工单
            onClick_accept(row) {
                var that = this;

                that.$Modal.confirm({
                    title: '提示',
                    content: '确定要接受处理《'+ row.workOrderNum +'》工单?',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/workOrder/receiveHandle',
                            params: {
                                workOrderIds: row.workOrderId
                            }
                        }).then(function (response) {
                            if (response.status === 1) {

                                that.getTableData();
                            }
                            else {}
                        }).catch(function (e) {

                        });
                    }
                })

            },

            // 结单
            onClick_finish() {
                var that = this;

                that.$http({
                    method: 'post',
                    url: '/panoramic/workOrder/completeHandle',
                    data: {
                        workOrderId: that.workOrderFinish.workOrderId,
                        finishAccount: that.workOrderFinish.account,
                        handleResult: that.workOrderFinish.handleResult
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.$Message.success({
                            content: '结单成功！'
                        });
                        that.getTableData();
                        that.modal_finish = false;
                    }
                    else {
                        that.$Message.success({
                            content: '结单失败！'
                        });
                    }
                }).catch(function (e) {

                });
            },

            // 获取结单详情
            getWorkOrderDetail(row) {

                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/workOrder/detail',
                    params: {
                        workOrderId: row.workOrderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {

                        that.workOrderDetail.workOrderNum = response.result.workOrderNum;
                        that.workOrderDetail.insTime = response.result.insTime;
                        that.workOrderDetail.workOrderStatus = response.result.workOrderStatus;
                        that.workOrderDetail.serverName = response.result.serverName;
                        that.workOrderDetail.ip = response.result.ip;
                        that.workOrderDetail.applyContent = response.result.applyContent;
                        that.workOrderDetail.applyName = response.result.applyName;
                        that.workOrderDetail.phone = response.result.phone;
                        that.workOrderDetail.finishTime = response.result.finishTime;
                        that.workOrderDetail.handleResult = response.result.handleResult;

                        that.modal_detail = true;

                    }
                    else {}
                }).catch(function (e) {

                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .userOrderManage-container {
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