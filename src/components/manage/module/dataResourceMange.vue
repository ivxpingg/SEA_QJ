<template>
    <div class="dataResourceMange-container">
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
                        <label class="label" for="userOrder_date">时间</label>
                        <div class="value">
                            <DatePicker element-id="userOrder_date"
                                        :value="datePicker_default"
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

                <div class="hd">
                    <Button type="primary" @click="onClick_add_modal">发布数据</Button>
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

        <Modal v-model="modal_add_dataResource"
               title="添加服务器">
            <div>
                <Form ref="add_dataResource_form"
                      :modal="add_dataResource_info"
                      :rules="dataResourceInfo_rules"
                      :label-width="80">
                    <FormItem label="数据名称:">
                        <Input type="text" placeholder="请输入数据名称" />
                    </FormItem>
                    <FormItem label="数据时效:">
                        <DatePicker :value="datePicker_add_default"
                                    :clearable="true"
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    placeholder="日期选择"
                                    @on-change="datePicker_onChange"
                                    style="width: 220px"></DatePicker>
                    </FormItem>
                    <FormItem label="描述:">
                        <Input type="textarea" placeholder="请输入数据描述" />
                    </FormItem>
                    <FormItem label="上传文件:">
                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="位置选择">
                        <Select style="width: 180px" placeholder="">
                            <Option :value="11" label="行业服务中心"></Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_add_dataResource">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "dataResourceMange",
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
                        title: '数据名称',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '数据数量',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '数据时效',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '价格',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '格式',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '发布日期',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '申请次数',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        width: 220,
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
                                            that.onClick_detail_dataResource();
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_del_dataResource();
                                        }
                                    }
                                }, '删除'),

                            ]);
                        }
                    }

                ],
                tableData: [{name: 'test'}],

                // 发布数据
                modal_add_dataResource: false,
                datePicker_add_default: [],
                add_dataResource_info: {},
                dataResourceInfo_rules: {}
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
            // this.getTableData();
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
                    url: '',
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

            /**
             * 发布数据弹出窗
             */
            onClick_add_modal() {
                this.modal_add_dataResource = true;
            },

            /**
             *  新增发布数据
             */
            onClick_add_dataResource() {

            },

            /**
             *  删除发布数据
             */
            onClick_del_dataResource(row) {

            },

            /**
             *  详情-发布数据
             */
            onClick_detail_dataResource(row) {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .dataResourceMange-container {
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