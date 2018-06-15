<template>
    <div class="cloudServeManage-container">

        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">支付购买订单(2)</label>
                        <div class="value"> </div>
                    </div>
                </div>

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">免费申请订单(27)</label>
                        <div class="value"></div>
                    </div>
                </div>

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

    </div>
</template>

<script>
    export default {
        name: "cloudServeManage",
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
                        key: 'name',
                        align: 'center'
                    },{
                        title: '购买内容',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '创建时间',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '方式',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '购买单位',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '联系方式',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '实际支付价格',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        width: 220,
                        render(h, params) {

                            var text = '';

                            switch (params.row.applyStatus){
                                case '已发布': text = '下架'; break;
                                case '未发布': text = '上架'; break;
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
                                            if(text === '下架') {

                                            }
                                            else {

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
                                        click() {}
                                    }
                                }, '导入'),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {}
                                    }
                                }, '详情')
                            ]);
                        }
                    }

                ],
                tableData: [],
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
</style>