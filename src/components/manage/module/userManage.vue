<template>
    <div class="userManage-container">

        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder=""></Input>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <Button type="primary" @click="onClick_search">查询</Button>
                </div>

                <!--<div class="hd">-->
                    <!--<Button type="primary" @click="onClick_modal_add">添加用户</Button>-->
                <!--</div>-->

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

        <Modal v-model="modal_add_user"
               title="添加用户">
            <div>
                <Form ref="add_user_form"
                      :modal="addUserInfo"
                      :rules="userInfo_rules"
                      :label-width="80">
                    <FormItem label="用户名">
                        <Input type="text" placeholder="请输入用户名" />
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" placeholder="请输入密码" />
                    </FormItem>
                    <FormItem label="真实姓名">
                        <Input type="text" placeholder="请输入真实姓名" />
                    </FormItem>
                    <FormItem label="身份证号码">
                        <Input type="text" placeholder="请输入身份证号码" />
                    </FormItem>
                    <FormItem label="联系电话">
                        <Input type="text" placeholder="请输入联系电话" />
                    </FormItem>
                    <FormItem label="单位名称">
                        <Input type="text" placeholder="请输入单位名称" />
                    </FormItem>
                    <FormItem label="单位地址">
                        <Input type="textarea" placeholder="请输入单位地址" />
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input type="text" placeholder="请输入邮箱地址" />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_add_user">确定</Button>
            </div>
        </Modal>

        <Modal v-model="modal_edit_user"
               title="修改用户信息">
            <div>
                <Form ref="edit_user_form"
                      :modal="editUserInfo"
                      :rules="userInfo_rules"
                      :label-width="80">
                    <FormItem label="用户名">
                        <Input type="text" placeholder="请输入用户名" />
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" placeholder="请输入密码" />
                    </FormItem>
                    <FormItem label="真实姓名">
                        <Input type="text" placeholder="请输入真实姓名" />
                    </FormItem>
                    <FormItem label="身份证号码">
                        <Input type="text" placeholder="请输入身份证号码" />
                    </FormItem>
                    <FormItem label="联系电话">
                        <Input type="text" placeholder="请输入联系电话" />
                    </FormItem>
                    <FormItem label="单位名称">
                        <Input type="text" placeholder="请输入单位名称" />
                    </FormItem>
                    <FormItem label="单位地址">
                        <Input type="textarea" placeholder="请输入单位地址" />
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input type="text" placeholder="请输入邮箱地址" />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_edit_user">确定</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "userManage",
        data() {
            var that = this;
            return {
                datePicker_default: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: ''
                },

                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '用户名',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '真实姓名',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '联系电话',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '单位名称',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '电子邮件',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '创建日期',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        width: 250,
                        render(h, params) {
                            return h('div',[
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_getUserDetail(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_reset_password(params.row);
                                        }
                                    }
                                }, '重置密码'),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_del_user(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [{name: ''}],

                // 添加用户
                modal_add_user: false,
                addUserInfo: {

                },
                userInfo_rules: {},

                //修改用户
                modal_edit_user: false,
                editUserInfo: {

                },
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
                    url: '/panoramic/user/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        pageNo: this.searchParams.pageNo,
                        pageSize: this.searchParams.pageSize,
                        keyword: this.searchParams.keyword
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
             * 弹出添加用户的窗口
             */
            onClick_modal_add() {

                this.modal_add_user = true;

            },
            /**
             * 添加用户
             */
            onClick_add_user() {
                var that = this;

                that.$refs['add_user_form'].validate(function (valid) {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(this.editUserInfo)
                        }).then(function (response) {
                            that.tableLoading = false;
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '更新成功！'
                                });
                                that.modal_add_user = false;

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

            },

            /**
             * 更新用户信息
             */
            onClick_edit_user() {
                var that = this;

                that.$refs['edit_user_form'].validate(function (valid) {
                    if (valid) {

                        this.$http({
                            method: 'post',
                            url: '',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(this.editUserInfo)
                        }).then(function (response) {
                            that.tableLoading = false;
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '更新成功！'
                                });
                                that.modal_edit_user = false;
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
            },

            /**
             * 获取用户详情用于编辑
             */
            onClick_getUserDetail(row) {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '',
                    params: {
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        // 赋值修改用户的信息

                        // that.editUserInfo.name = response.result.name;

                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {});
            },

            /**
             * 重置用户密码
             */
            onClick_reset_password(row) {
                var that = this;

                that.$Modal.confirm({
                    title: '重置密码',
                    content: '确定要重置<>用户密码?',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '',
                            params: {
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '重置成功！'
                                });
                                that.getTableData();
                            }
                            else {
                                this.$Modal.error({
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {});
                    }
                });
            },
            /**
             * 删除用户
             */
            onClick_del_user(row) {
                var that = this;

                that.$Modal.confirm({
                    title: '删除',
                    content: '确定要删除<>用户?',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '',
                            params: {
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '删除成功！'
                                });
                                that.getTableData();
                            }
                            else {
                                this.$Modal.error({
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {});
                    }
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .userManage-container {
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