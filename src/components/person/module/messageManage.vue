<template>
    <div class="messageManage-container">
        <vMenuTitle name="消息通知"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd"><Button type="primary" size="large" @click="onClick_del">删除</Button></div>
                <div class="hd"><Button type="primary" size="large" @click="onClick_read">标记为已读</Button></div>
                <!--<div class="hd"><Button type="primary" size="large" @click="onClick_modal_add_workOrder">创建工单</Button></div>-->
            </div>

            <div class="table-panel table-panel-message">
                <Table ref="myTable"
                       border
                       :height="500"
                       :loading="tableLoading"
                       :columns="tableColumns"
                       :data="tableData"></Table>
            </div>
        </div>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "messageManage",
        data() {
            return {
                tableLoading: false,
                tableColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '消息内容',
                        key: 'noticeContent',
                        align: 'left',
                        render (h, params) {
                            return h('div', {
                                style: {
                                    paddingLeft: '15px'
                                },
                                class: params.row.noticeStatus === 'unRead'? 'unread-message': ''
                            }, params.row.noticeContent)
                        }
                    },
                    {
                        title: '时间',
                        key: 'insTime',
                        align: 'center'
                    },
                    {
                        title: '消息类型',
                        key: 'noticeTypeStr',
                        align: 'center'
                    }
                ],
                tableData: [],

                selectData: []
            };
        },
        components: {vMenuTitle},
        mounted() {
           this.getMessageData();
        },
        methods:{
            /**
             * 表格数据
             */
            getMessageData() {
                var that = this;
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/notice/list',
                    params: {
                        userId: that.$store.state.uid
                    }
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result;
                    }
                    else {
                        that.Message.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
                })
            },

            /**
             * 删除消息
             */
            onClick_del() {
                var that = this;

                var selections = this.$refs['myTable'].getSelection();
                if (selections.length === 0) {
                    this.$Message.info({
                        content: '请选择要删除的消息！'
                    });
                }
                else {
                    var str_ids = '';

                    selections.forEach(function (val) {
                        str_ids += val.noticeId + ',';
                    });

                    str_ids = str_ids.slice(0, str_ids.length - 1);

                    this.$http({
                        method: 'post',
                        url: '/panoramic/notice/delete',
                        params: {
                            noticeIds: str_ids
                        }
                    }).then(function (response) {
                        if (response.status === 1) {
                            that.$Message.success({
                                content: '删除成功！'
                            });
                            that.getMessageData();
                        }
                        else {
                            that.$Message.error({
                                content: response.errMsg
                            });
                        }
                    }).catch(function (e) {});

                }
            },

            /**
             * 标记为已读
             */
            onClick_read() {
                var that = this;

                var selections = this.$refs['myTable'].getSelection();
                if (selections.length === 0) {
                    this.$Message.info({
                        content: '请选择要标记为已读的消息！'
                    });
                }
                else {
                    var str_ids = '';

                    selections.forEach(function (val) {
                        str_ids += val.noticeId + ',';
                    });

                    str_ids = str_ids.slice(0, str_ids.length - 1);

                    this.$http({
                        method: 'post',
                        url: '/panoramic/notice/updateStatus',
                        params: {
                            noticeIds: str_ids
                        }
                    }).then(function (response) {
                        if (response.status === 1) {
                            that.$Message.success({
                                content: '标记成功！'
                            });
                            that.getMessageData();
                        }
                        else {
                            that.$Modal.error({
                                content: response.errMsg
                            });
                        }
                    }).catch(function (e) {});

                }

            }

        }
    }
</script>

<style lang="scss" scoped>
    .messageManage-container {
        .content-panel {
            margin-top: 23px;

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
<style lang="scss">
    .table-panel-message {

        .unread-message {
            position: relative;

            &:after {
                position: absolute;
                display: block;
                content: " ";
                top: 6px;
                left: 0;
                width: 0;
                height: 0;
                border: 3px solid #2d8cf0;
                border-radius: 50%;
                z-index: 1;
            }
        }
    }
</style>