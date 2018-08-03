<template>
    <div class="industryDataManage-container">
        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="单位名称、订单编号"></Input>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_date">时间</label>
                        <div class="value">
                            <DatePicker element-id="userOrder_date"
                                        :value="datePicker_default"
                                        :clearable="true"
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

        <!--免费申请订单详情-->
        <Modal v-model="modal_freeApply_detail"
               :width="1000"
               title="详情">
            <div class="modal_pay_detail">
                <div class="text-info">
                    <span class="text-k">申请时间：<span>{{table_freeApply_data_detail.applyTime}}</span></span>
                    <span class="text-k">订单状态：<span>{{table_freeApply_data_detail.orderStatusStr}}</span></span>
                    <span class="text-k">通过时间：<span>{{table_freeApply_data_detail.applySuccTime}}</span></span>
                </div>

                <Table border
                       :columns="table_freeApply_columns_detail"
                       :data="[table_freeApply_data_detail]"></Table>

                <div class="ft-bottom">
                    <Button @click="onClick_lookImage" >查看附件</Button>
                </div>

            </div>
        </Modal>

        <!--驳回原因-->
        <Modal v-model="modal_freeApply_reject"
               @on-ok="onClick_reject"
               ok-text="驳回"
               title="驳回原因" >
            <div>
                <Input type="textarea"
                       :rows="5"
                       v-model="rejectReason"
                       placeholder="请输入驳回原因" />
            </div>

        </Modal>

        <Modal v-model="modal_look_image" title="附件">
            <img :src="fileimgUrl" alt="" style="width: 100%">
        </Modal>

    </div>
</template>

<script>
    import Config from '../../../libs/appConfig/config';
    export default {
        name: "industryDataManage",
        data() {
            var that = this;
            return {
                datePicker_default: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
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
                        title: '订单编号',
                        key: 'orderNum',
                        align: 'center'
                    },{
                        title: '申请服务名称',
                        key: 'dataName',
                        align: 'center'
                    },{
                        title: '创建时间',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '申请单位',
                        key: 'applyUnit',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'orderStatusStr',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        width: 260,
                        render(h, params) {

                            var button1, button2, button3, array_list = [];

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
                                                    content: '确定要通过该用户的产品申请吗？ 《审核通过后用户可以直接下载数据文件》',
                                                    onOk() {
                                                        that.$http({
                                                            method: 'get',
                                                            url: '/panoramic/dataOrder/auditSuccess',
                                                            params: {
                                                                orderIds: params.row.orderId
                                                            }
                                                        }).then(function (response) {
                                                            if (response.status === 1) {
                                                                that.$Message.success({
                                                                    content: '审核通过成功！'
                                                                });

                                                                that.getTableData();
                                                            }
                                                            else {
                                                                that.$Message.error({
                                                                    content: '审核通过失败！'
                                                                });
                                                            }
                                                        }).catch(function (e) {
                                                        })
                                                    }
                                                });
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
                                    break;

                                case 'TurnDown':  // 已驳回
                                    break;
                            }

                            array_list.push(button3);

                            return h('div', array_list);
                        }
                    }

                ],
                tableData: [],

                // 免费详情
                modal_freeApply_detail: false,
                table_freeApply_columns_detail: [
                    {
                        title: '订单号',
                        key: 'orderNum',
                        width: 130,
                        align: 'center'
                    },{
                        title: '申请单位名称',
                        key: 'applyUnit',
                        align: 'center'
                    },{
                        title: '申请人',
                        key: 'applyPerson',
                        align: 'center'
                    },{
                        title: '联系电话',
                        key: 'phone',
                        align: 'center'
                    },{
                        title: '联系邮箱',
                        key: 'mail',
                        align: 'center'
                    },{
                        title: '商品内容',
                        key: 'dataContent',
                        align: 'center',
                    },{
                        title: '用途说明与特殊需求',
                        key: 'useDescription',
                        align: 'center'
                    }
                ],
                table_freeApply_data_detail: {
                    orderNum: '',
                    applyUnit: '',
                    applyPerson: '',
                    phone: '',
                    mail: '',
                    dataContent: '',
                    useDescription: '',
                    insTime:'',
                    orderStatusStr: '',
                    applyTime: '',
                    applySuccTime: '',
                    pictureUrl: '',
                    accountList: []
                },

                // 驳回
                modal_freeApply_reject: false,
                rejectOrderId: '',
                rejectReason: '',

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
            this.getTableData();
        },
        methods: {
            datePicker_onChange(val) {
                this.searchParams.beginDate = val[0];
                this.searchParams.endDate = val[1];
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
                    that.$Modal.error({
                        content: JSON.stringify(e)
                    });
                })
            },

            // 打开详情窗口
            onClick_freeApply_detail(row) {
                var that = this;
                this.modal_freeApply_detail = true;

                that.$http({
                    method: 'get',
                    url: '/panoramic/dataOrder/detail',
                    params: {

                        orderId: row.orderId
                    }
                }).then(function (response) {
                    if (response.status === 1) {

                        that.table_freeApply_data_detail.orderNum = response.result.orderNum || '';
                        that.table_freeApply_data_detail.applyUnit = response.result.applyUnit || '';
                        that.table_freeApply_data_detail.applyPerson = response.result.applyPerson || '';
                        that.table_freeApply_data_detail.phone = response.result.phone || '';
                        that.table_freeApply_data_detail.mail = response.result.mail || '';
                        that.table_freeApply_data_detail.dataContent = response.result.dataContent || '';
                        that.table_freeApply_data_detail.useDescription = response.result.useDescription || '';
                        that.table_freeApply_data_detail.insTime = response.result.insTime || '';
                        that.table_freeApply_data_detail.orderStatusStr = response.result.orderStatusStr || '';
                        that.table_freeApply_data_detail.applyTime = response.result.applyTime || '';
                        that.table_freeApply_data_detail.applySuccTime = response.result.applySuccTime || '';


                        that.table_freeApply_data_detail.pictureUrl = response.result.certificate || '';


                    }
                    else {
                    }
                }).catch(function (e) {})
            },

            // 驳回
            onClick_reject() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/dataOrder/reject',
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
                        that.getTableData();
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

            // 查看附件图片
            onClick_lookImage() {
                this.modal_look_image = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .industryDataManage-container {
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