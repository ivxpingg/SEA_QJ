<template>
    <div class="serverManage-container">

        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="服务器名称"></Input>
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
                <Form ref="addServeForm"
                      :model="add_serve_info"
                      :rules="serveInfo_rules"
                      :label-width="80">
                    <FormItem label="机型名称:" prop="serverName">
                        <Input v-model="add_serve_info.serverName" placeholder="请输入机型名称" ></Input>
                    </FormItem>
                    <FormItem label="CPU:" prop="cpu">
                        <Select v-model="add_serve_info.cpu"
                                placeholder="CPU">
                            <Option value="2核" label="2核"></Option>
                            <Option value="4核" label="4核"></Option>
                            <Option value="8核" label="8核"></Option>
                            <Option value="16核" label="16核"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="内存:" prop="memory">
                        <Select v-model="add_serve_info.memory"
                                placeholder="内存">
                            <Option value="4G" label="4G" ></Option>
                            <Option value="8G" label="8G" ></Option>
                            <Option value="16G" label="16G" ></Option>
                            <Option value="32G" label="32G" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="镜像:" prop="mirror">
                        <Select v-model="add_serve_info.mirror" placeholder="镜像">
                            <Option value="Windows 2012 R2 标准版 64位中文版" label="Windows 2012 R2 标准版 64位中文版" ></Option>
                            <Option value="Windows 2008 R2 SP1 64位" label="Windows 2008 R2 SP1 64位" ></Option>
                            <Option value="Ubuntu Server 16.04.1 LTS 64位" label="Ubuntu Server 16.04.1 LTS 64位" ></Option>
                            <Option value="CentOS 7.2 64位" label="CentOS 7.2 64位" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="宽带:" prop="bandWidth">
                        <Input type="text"
                               v-model="add_serve_info.bandWidth"
                               placeholder="请输入宽带大小，如：10Mbps" />
                    </FormItem>
                    <FormItem label="系统盘:" prop="systemDisk">
                        <Input type="text"
                               v-model="add_serve_info.systemDisk"
                               placeholder="请输入系统盘大小，如：500G" />
                    </FormItem>
                    <FormItem label="存储硬盘:" prop="hardDisk">
                        <Input type="text"
                               v-model="add_serve_info.hardDisk"
                               placeholder="请输入存储硬盘大小,如：100G" />
                    </FormItem>
                    <FormItem label="收费标准:" prop="chargeStandard">
                        <Input type="textarea"
                               v-model="add_serve_info.chargeStandard"
                               placeholder="请输入金额，单位(元/月)" />
                    </FormItem>
                    <FormItem label="描述:" prop="description">
                        <Input type="textarea"
                               v-model="add_serve_info.description"
                               placeholder="描述" />
                    </FormItem>
                    <FormItem label="位置选择">
                        <Select v-model="add_serve_info.showPosition"
                                transfer
                                style="width: 180px" placeholder="">
                            <Option v-for="item in dict_showPosition"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="免费申请:" prop="freeApply">
                        <i-switch
                                v-model="add_serve_info.freeApply"
                                true-value="1" false-value="0">
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

        <Modal v-model="modal_update_serve"
               title="修改服务器">
            <div>
                <Form ref="updateServeForm"
                      :model="update_serve_info"
                      :rules="serveInfo_rules"
                      :label-width="80">
                    <FormItem label="机型名称:" prop="serverName">
                        <Input v-model="update_serve_info.serverName" placeholder="请输入机型名称" ></Input>
                    </FormItem>
                    <FormItem label="CPU:" prop="cpu">
                        <Select v-model="update_serve_info.cpu"
                                placeholder="CPU">
                            <Option value="2核" label="2核"></Option>
                            <Option value="4核" label="4核"></Option>
                            <Option value="8核" label="8核"></Option>
                            <Option value="16核" label="16核"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="内存:" prop="memory">
                        <Select v-model="update_serve_info.memory"
                                placeholder="内存">
                            <Option value="4G" label="4G" ></Option>
                            <Option value="8G" label="8G" ></Option>
                            <Option value="16G" label="16G" ></Option>
                            <Option value="32G" label="32G" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="镜像:" prop="mirror">
                        <Select v-model="update_serve_info.mirror" placeholder="镜像">
                            <Option value="Windows 2012 R2 标准版 64位中文版" label="Windows 2012 R2 标准版 64位中文版" ></Option>
                            <Option value="Windows 2008 R2 SP1 64位" label="Windows 2008 R2 SP1 64位" ></Option>
                            <Option value="Ubuntu Server 16.04.1 LTS 64位" label="Ubuntu Server 16.04.1 LTS 64位" ></Option>
                            <Option value="CentOS 7.2 64位" label="CentOS 7.2 64位" ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="宽带:" prop="bandWidth">
                        <Input type="text"
                               v-model="update_serve_info.bandWidth"
                               placeholder="请输入宽带大小，如：10Mbps" />
                    </FormItem>
                    <FormItem label="系统盘:" prop="systemDisk">
                        <Input type="text"
                               v-model="update_serve_info.systemDisk"
                               placeholder="请输入系统盘大小，如：500G" />
                    </FormItem>
                    <FormItem label="存储硬盘:" prop="hardDisk">
                        <Input type="text"
                               v-model="update_serve_info.hardDisk"
                               placeholder="请输入存储硬盘大小,如：100G" />
                    </FormItem>
                    <FormItem label="收费标准:" prop="chargeStandard">
                        <Input type="textarea"
                               v-model="update_serve_info.chargeStandard"
                               placeholder="请输入金额，单位(元/月)" />
                    </FormItem>
                    <FormItem label="描述:" prop="description">
                        <Input type="textarea"
                               v-model="update_serve_info.description"
                               placeholder="描述" />
                    </FormItem>
                    <FormItem label="位置选择">
                        <Select v-model="update_serve_info.showPosition"
                                transfer
                                style="width: 180px" placeholder="">
                            <Option v-for="item in dict_showPosition"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="免费申请:" prop="freeApply">
                        <i-switch
                                v-model="update_serve_info.freeApply"
                                true-value="1" false-value="0">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_update_serve">保存</Button>
            </div>
        </Modal>

        <Modal v-model="modal_upload"
               title="导入服务器账号">
            <div style="position: relative">

                <Upload :action="uploadFileUrl"
                        :headers="headers"
                        :data="upload_data"
                        :on-error="uploadHandleError"
                        :on-success="uploadHandleSuccess" >
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传服务器账号</Button>
                </Upload>

                <a :href="downloadUrl"
                   class="ivu-btn ivu-btn-ghost"
                   target="_blank"
                   style="width: 134px; position: absolute; right: 0; top: 0;"><!---->
                    <i class="ivu-icon ivu-icon-ios-cloud-download-outline"></i>
                    <span>下载模板</span>
                </a>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_upload_ok">确定</Button>
            </div>
        </Modal>

        <Modal v-model="modal_table_detail"
               :width="1200"
               title="服务器销售详情">
            <div>
                <div class="remain-server-number">服务器剩余数量：{{remainServerNumber}}</div>
                <Table border
                       height="500"
                       :loading="tableLoading_detail" :columns="tableColumns_detail" :data="tableData_detail"></Table>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_sell_detail_ok">确定</Button>
                <Button type="primary" size="large" @click="onClick_sell_detail_upload">导入服务器信息</Button>
            </div>
        </Modal>


    </div>
</template>

<script>
    import Config from '../../../libs/appConfig/config';
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
                        key: 'serverName',
                        align: 'center'
                    },{
                        title: '已卖出',
                        key: 'soldNumber',
                        align: 'center'
                    },{
                        title: '配置信息',
                        align: 'center',
                        render(h, params) {
                            var text = params.row.cpu + ',' + params.row.memory + ',' + params.row.bandWidth + ',' + params.row.handDisk;
                            return h('div', text);
                        }
                    },{
                        title: '价格/月',
                        key: 'chargeStandard',
                        align: 'center'
                    },{
                        title: '发布日期',
                        key: 'publishTime',
                        align: 'center'
                    },{
                        title: '状态',
                        key: 'serverStatus',
                        align: 'center'
                    },{
                        title: '位置',
                        key: 'showPosition',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        width: 220,
                        render(h, params) {

                            var text = '';
                            var buttom1, buttom2;

                            switch (params.row.serverStatus){
                                case '已发布':
                                    text = '下架';

                                    buttom1 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.onClick_updateServeStatus(params.row);
                                            }
                                        }
                                    }, '下架');

                                    buttom2 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.upload_data.cloudServerId = params.row.cloudServerId;
                                                that.modal_upload = true;
                                            }
                                        }
                                    }, '导入');

                                    break;
                                case '未发布':
                                    text = '上架';

                                    buttom1 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.onClick_updateServeStatus(params.row);
                                            }
                                        }
                                    }, '上架');

                                    buttom2 = h('Button', {
                                        props: {
                                            type: 'text'
                                        },
                                        style: {
                                            textDecoration: 'underline'
                                        },
                                        on: {
                                            click() {
                                                that.onClick_updateServe(params.row);
                                            }
                                        }
                                    }, '修改');

                                break;
                            }



                            return h('div', [
                                buttom1,
                                buttom2,
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_sell_detail(params.row);
                                        }
                                    }
                                }, '详情')
                            ]);
                        }
                    }

                ],
                tableData: [],

                // 字典 - 展示位置
                dict_showPosition: [],

                // 详情表格
                modal_table_detail: false,
                tableLoading_detail: false,
                tableColumns_detail: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: 'IP',
                        key: 'remoteAddress',
                        align: 'center'
                    },{
                        title: '账号',
                        key: 'account',
                        align: 'center'
                    },{
                        title: '密码',
                        key: 'password',
                        align: 'center'
                    },{
                        title: '购买人',
                        key: 'name',
                        align: 'center'
                    },{
                        title: '联系方式',
                        key: 'mobile',
                        align: 'center'
                    },{
                        title: '购买时间',
                        key: 'insTIme',
                        align: 'center'
                    },{
                        title: '获取方式',
                        key: 'insTIme',
                        align: 'center',
                        render(h, params) {
                            return h('div', params.row.isFree ==='0' ? '支付购买':'免费申请');
                        }
                    }
                ],
                tableData_detail: [],
                remainServerNumber: 0, // 剩余服务器数据量

                // 新增服务器
                modal_add_serve: false,
                add_serve_info: {
                    serverName: '',
                    cpu: '',
                    memory: '',
                    mirror: '',
                    bandWidth: '',
                    systemDisk: '',
                    hardDisk: '',
                    chargeStandard: '',
                    description: '',
                    freeApply: '0',
                    showPosition: 'ListPage'   // 位置固定是放在列表
                },
                serveInfo_rules: {
                    serverName: [
                        { required: true, message: '机型名称不能为空！', trigger: 'blur' }
                    ],
                    cpu: [
                        { required: true, message: 'CPU不能为空！', trigger: 'blur' }
                    ],
                    memory: [
                        { required: true, message: '内存不能为空！', trigger: 'blur' }
                    ],
                    mirror: [
                        { required: true, message: '镜像不能为空！', trigger: 'blur' }
                    ],
                    bandWidth: [
                        { required: true, message: '宽带不能为空！', trigger: 'blur' }
                    ],
                    systemDisk: [
                        { required: true, message: '系统盘不能为空！', trigger: 'blur' }
                    ],
                    hardDisk: [
                        { required: true, message: '存储硬盘不能为空！', trigger: 'blur' }
                    ],
                    chargeStandard: [
                        { required: true, message: '收费标准不能为空！', trigger: 'blur' }
                    ]
                },

                // 修改服务器
                modal_update_serve: false,
                update_serve_info: {
                    cloudServerId: '',
                    serverName: '',
                    cpu: '',
                    memory: '',
                    mirror: '',
                    bandWidth: '',
                    systemDisk: '',
                    hardDisk: '',
                    chargeStandard: '',
                    description: '',
                    freeApply: '0',
                    showPosition: ''
                },

                // 上传服务器信息
                modal_upload: false,
                uploadFileUrl: '',
                headers: {
                    Authorization: that.$store.state.token || ''
                },
                upload_data: {
                    cloudServerId: ''
                },

                // 账号模板下载地址
                downloadUrl: ''
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
            this.uploadFileUrl = window.location.origin + Config[Config.env].ajaxUrl  + '/panoramic/cloudServer/serverAccountImport';

            this.downloadUrl = window.location.origin + Config[Config.env].imgUrl + '/static/download/xlsx/服务器账号导入模板.xlsx';

            this.getTableData();
            this.getDict();
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

            getDict() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/sys/dict/listData',
                    params: {
                        type: 'showPosition'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dict_showPosition = response.result;
                    }
                    else {
                    }
                }).catch(function (e) {})
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

                that.$refs['addServeForm'].validate(function (valid) {

                    if (valid) {

                        that.$http({
                            method: 'post',
                            url: '/panoramic/cloudServer/add',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.add_serve_info)
                        }).then(function (response) {
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
                            that.$Modal.error({
                                content: JSON.stringify(e)
                            });
                        })

                    }
                    else {}
                })
            },

            /**
             * 修改服务器
             */
            onClick_update_serve() {
                var that = this;

                that.$refs['updateServeForm'].validate(function (valid) {

                    if (valid) {

                        that.$http({
                            method: 'post',
                            url: '/panoramic/cloudServer/update',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.update_serve_info)
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '更新成功！'
                                });
                                that.modal_update_serve = false;

                                that.getTableData();
                            }
                            else {
                                that.$Message.error({
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {
                            // that.$Modal.error({
                            //     content: JSON.stringify(e)
                            // });
                        })

                    }
                    else {}
                })
            },

            /**
             *  上传服务器信息窗口
             */
            onClick_upload_ok() {
                this.modal_upload = false;
            },
            /**
             * 上传服务器成功返回
             */
            uploadHandleSuccess(response) {
                if (response.status === 1) {
                    this.$Message.success({
                        content: '上传成功！'
                    });
                }
                else {
                    this.$Message.error({
                        content: response.errMsg
                    });
                }

            },
            /**
             * 上传服务器失败返回
             */
            uploadHandleError(res) {
                this.$Message.error({
                    content: '上传失败！'
                });
                console.dir(res);
            },

            /**
             * 更改服务器状态 上架/下架
             */
            onClick_updateServeStatus(row) {
                var that = this;

                var serverStatus = row.serverStatus === '已发布'? 'Unpublish' : 'Publish';

                that.$Modal.confirm({
                    title: '提示',
                    content: '确定要' + (row.serverStatus === '已发布'? '下架' : '上架' ) + '<'+ row.serverName +'>?',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/cloudServer/updateServerStatus',
                            params: {
                                cloudServerIds: row.cloudServerId,
                                serverStatus: serverStatus
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '更新成功！'
                                });
                                that.getTableData();
                            }
                            else {
                                that.$Modal.error({
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {
                            // that.$Modal.error({
                            //     content: JSON.stringify(e)
                            // });
                        })
                    }
                });
            },

            /**
             * 修改服务器信息
             * @param row
             */
            onClick_updateServe(row) {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '/panoramic/cloudServer/detail',
                    params: {
                        cloudServerId: row.cloudServerId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.update_serve_info.cloudServerId = response.result.cloudServerId;
                        that.update_serve_info.serverName = response.result.serverName;
                        that.update_serve_info.cpu = response.result.cpu;
                        that.update_serve_info.memory = response.result.memory;
                        that.update_serve_info.mirror = response.result.mirror;
                        that.update_serve_info.bandWidth = response.result.bandWidth;
                        that.update_serve_info.systemDisk = response.result.systemDisk;
                        that.update_serve_info.hardDisk = response.result.hardDisk;
                        that.update_serve_info.chargeStandard = response.result.chargeStandard + '';
                        that.update_serve_info.description = response.result.description;
                        that.update_serve_info.freeApply = response.result.freeApply || '0';
                        that.update_serve_info.showPosition = response.result.showPosition || '';

                        that.modal_update_serve = true;
                        that.getTableData();
                    }
                    else {
                        that.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    // that.$Modal.error({
                    //     content: JSON.stringify(e)
                    // });
                })

            },

            /**
             * 服务器销售详情
             * @param row
             */
            onClick_sell_detail(row) {
                var that = this;
                this.upload_data.cloudServerId = row.cloudServerId;
                this.modal_table_detail = true;
                this.tableLoading_detail = true;
                this.$http({
                   method: 'get',
                   url: '/panoramic/cloudServer/queryCloudServerAccountList',
                   params: {
                       cloudServerId: row.cloudServerId
                   }
                }).then(function (response) {
                    that.tableLoading_detail = false;
                    if(response.status === 1 ) {
                        that.tableData_detail = response.result;
                    }
                }).catch(function (e) {
                    that.tableLoading_detail = false;
                })

                this.$http({
                    method: 'get',
                    url: '/panoramic/cloudServer/getServerRemainNumber',
                    params: {
                        cloudServerId: row.cloudServerId
                    }
                }).then(function (response) {
                    if(response.status === 1 ) {
                        that.remainServerNumber = response.result;
                    }
                }).catch(function (e) {
                    that.tableLoading_detail = false;
                })


            },
            onClick_sell_detail_ok() {
                this.modal_table_detail = false;
            },
            onClick_sell_detail_upload() {
                this.modal_table_detail = false;
                this.modal_upload = true;
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

        @at-root .remain-server-number {
            font-size: 14px;
            line-height: 36px;
        }
    }
</style>