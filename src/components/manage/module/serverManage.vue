<template>
    <div class="serverManage-container">

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
                    <Button type="primary" @click="onClick_add_modal">新增服务器</Button>
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

        <Modal v-model="modal_add_serve"
               title="添加服务器">
            <div>
                <Form ref="add_serve_form"
                      :modal="add_serve_info"
                      :rules="serveInfo_rules"
                      :label-width="80">
                    <FormItem label="机型名称:">
                        <Input type="text" placeholder="请输入机型名称" />
                    </FormItem>
                    <FormItem label="机型配置:">
                        <Select style="width: 180px; margin-right: 12px;">
                            <Option :value="11" label="1"></Option>
                        </Select>

                        <Select style="width: 180px">
                            <Option :value="11" label="1" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="镜像:">
                        <Select style="width: 180px" placeholder="">
                            <Option :value="11" label="1" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="宽带:">
                        <Select style="width: 180px" placeholder="">
                            <Option :value="11" label="1" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="系统盘:">
                        <Select style="width: 180px" placeholder="">
                            <Option :value="11" label="1" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="存储硬盘:">
                        <Input type="text" placeholder="请输入存储硬盘大小,如：100G" />
                    </FormItem>
                    <FormItem label="收费标准:">
                        <Input type="textarea" placeholder="请输入金额，单位（元）" />
                    </FormItem>
                    <FormItem label="描述:">
                        <Input type="textarea" placeholder="描述" />
                    </FormItem>
                    <FormItem label="免费申请:">
                        <i-switch true-value="1" false-value="0">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_add_serve">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "serverManage",
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
                        title: '服务器名称',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '已卖出',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '配置信息',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '价格/月',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '发布日期',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '位置',
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
                tableData: [{name: 'test'}],

                // 新增服务器
                modal_add_serve: false,
                add_serve_info: {},
                serveInfo_rules: {}
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
             * 新增服务器弹出框
             */
            onClick_add_modal() {
                this.modal_add_serve = true;
            },

            /**
             * 新增服务器
             */
            onClick_add_serve() {
                var that = this;

                that.$refs['add_serve_form'].validate(function (valid) {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(this.add_serve_info)
                        }).then(function (response) {
                            that.tableLoading = false;
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '新增成功！'
                                });
                                that.modal_add_serve = false;

                                that.getTableData();
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .serverManage-container {
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