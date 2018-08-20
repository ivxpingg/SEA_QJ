<template>
    <div class="cloudService-container">
        <div class="cloudService-inner">

            <div class="cloud-title">云服务器申请</div>

            <div class="box-panel area-panel">
                <div class="title">地域</div>
                <ul class="area-list-ul">
                   <li class="area-li">厦门</li>
                </ul>
            </div>

            <div class="box-panel type-panel">
                <div class="title">机型</div>
                <div class="type-list">

                    <div class="item"
                         :class="{'active': item.cloudServerId === query.cloudServerId}"
                         v-for="item in serverDataList"
                         :key="item.cloudServerId"
                         @click="onClick_select(item)">
                        <div class="type-name">
                            <div>{{item.serverName}}</div>
                            <div>({{item.cpu + item.memory}})</div>
                        </div>
                        <div class="type-desc">
                            {{item.description}}
                        </div>
                    </div>

                </div>
            </div>

            <div class="box-panel config-panel">
                <div class="title">配置信息</div>
                <div class="config-list">
                    <div class="attr">
                        <span class="label">主机名称 : </span>
                        <span class="value">{{select_serve_info.serverName}}</span>
                    </div>
                    <div class="attr">
                        <span class="label">镜像 : </span>
                        <span class="value">{{select_serve_info.mirror}}</span>
                    </div>
                    <div class="attr">
                        <span class="label">CPU : </span>
                        <span class="value">{{select_serve_info.cpu}}</span>
                    </div>
                    <div class="attr">
                        <span class="label">内存 : </span>
                        <span class="value">{{select_serve_info.memory}}</span>
                    </div>
                    <div class="attr">
                        <span class="label">系统盘 : </span>
                        <span class="value">{{select_serve_info.systemDisk}}</span>
                    </div>
                    <div class="attr">
                        <span class="label">存储盘 : </span>
                        <span class="value">{{select_serve_info.hardDisk}}</span>
                    </div>
                    <div class="attr">
                        <span class="label">宽带 : </span>
                        <span class="value">{{select_serve_info.bandWidth}}</span>
                    </div>
                </div>
                <div class="remark">注：如果列表中没有您想要的服务器配置，您可以通过电话0592-987462联系管理员。  或是购买菜单配置服务器后在个人中心>工单管理>向管理员申请升级 </div>
            </div>

            <div class="box-panel other-panel">
                <div class="title">其它</div>
                <div class="param-list">
                    <div class="attr">
                        <span class="label">购买数量</span>
                        <span class="value">
                            <Input v-model="select_serve_info.num" number readonly style="width:150px; text-align: center">
                                <span class="btn" slot="prepend" @click="onClick_subtract_num"> - </span>
                                <span class="btn" slot="append" @click="onClick_add_num"> + </span>
                            </Input>
                        </span>
                    </div>

                    <div class="attr">
                        <span class="label">购买时长</span>
                        <span class="value">
                            <Select v-model="select_serve_info.duration" style="width:200px">
                                <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </span>
                    </div>

                </div>
            </div>

            <div class="box-panel pay-panel">
                <div class="notice">购买须知：本平台所提供服务器无法提供备案端口，仅作为企业或高校部署项目测试等用途，如果需要入网，可通过代理服务器来实现域名与服务器空间部署的项 目进行端口映射。</div>

                <div class="agreement-p"><Checkbox v-model="single" @on-change="onClick_agreement_content" size="large">用户服务器使用协议</Checkbox></div>

                <div class="cost-b">
                    <span class="label">费用</span>
                    <span class="value">{{price}}元</span>
                </div>

                <div class="btn-box">
                    <Button class="btn-1" size="large" :disabled="!single || select_serve_info.cloudServerId === ''" @click="onClick_pay">立即购买</Button>
                    <Button class="btn-2" size="large" :disabled="!single || select_serve_info.cloudServerId === ''" @click="onClick_freeApply_modal">向管理员申请</Button>
                </div>

            </div>

        </div>

        <Modal v-model="modal_freeApply"
               title="服务申请表">
            <div>
                <Form ref="freeApplyServeForm"
                      :model="userInfo"
                      :rules="rules_userInfo"
                      :label-width="80">
                    <FormItem  label="申请单位" prop="applyUnit">
                        <Input v-model="userInfo.applyUnit" placeholder="" ></Input>
                    </FormItem>

                    <FormItem label="申请人" prop="applyPerson">
                        <Input v-model="userInfo.applyPerson"  placeholder="" ></Input>
                    </FormItem>
                    <FormItem label="证件信息" prop="">
                        <Upload :action="uploadUrl"
                                :headers="headers"
                                :before-upload="uploadHandleBeforeUpload"
                                :on-error="uploadHandleError"
                                :on-success="uploadHandleSuccess">
                            <Button type="ghost" icon="ios-cloud-upload-outline">上传证件信息</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="联系电话" prop="phone">
                        <Input v-model="userInfo.phone" placeholder="" ></Input>
                    </FormItem>
                    <FormItem label="联系邮箱" prop="mail">
                        <Input v-model="userInfo.mail"  placeholder="" ></Input>
                    </FormItem>
                    <FormItem label="申请内容" prop="">
                        <Input type="textarea"
                               readonly
                               :value="free_apply_content"
                               :rows="4"
                               placeholder="" ></Input>
                    </FormItem>
                    <FormItem label="用户说明与特殊需求" prop="">
                        <Input v-model="userInfo.useDescription" type="textarea"  placeholder="" ></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" @click="onClick_freeApply_ok" >提交</Button>
            </div>
        </Modal>

        <Modal v-model="model_agreement_content"
               :width="900"
               title="协议内容">
            <vAgreementConent></vAgreementConent>
        </Modal>

    </div>
</template>

<script>
    import Config from '../../../libs/appConfig/config';
    import vAgreementConent from './agreement_content';
    export default {
        name: "cloudService",
        data() {
            var that = this;
            return {
                redirectUrl: window.location.origin+ Config[Config.env].baseUrl + '#/person/orderManage',

                query: {
                    cloudServerId: ''  // 服务器ID
                },
                single: false,  // 用户服务器使用协议

                // 免费申请服务器器
                modal_freeApply: false,

                // 字典
                timeList: [
                    {
                    label: '一个月',
                    value: 1
                },{
                    label: '两个月',
                    value: 2
                },{
                    label: '三个月',
                    value: 3
                },{
                    label: '半年',
                    value: 6
                },{
                    label: '一年',
                    value: 12
                }],

                // 服务器列表数据
                serverDataList: [],
                select_serve_info: {
                    cloudServerId: '',
                    serverName: '',
                    mirror: '',
                    cpu: '',
                    memory : '',
                    systemDisk: '',
                    hardDisk: '',
                    bandWidth: '',
                    chageStandard: '',

                    num: 1,        // 购买个数
                    duration: 1    // 购买时间长度（月）
                },

                // 用户基础信息
                userInfo: {
                    applyUnit: '',
                    applyPerson: '',
                    certificate: '',
                    phone: '',
                    mail: '',
                    useDescription: ''
                },
                rules_userInfo: {
                    applyUnit: [
                        { required: true, message: '申请单位不能为空！', trigger: 'blur' }
                    ],
                    applyPerson: [
                        { required: true, message: '申请人不能为空！', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '联系电话不能为空！', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '联系邮箱不能为空！', trigger: 'blur' }
                    ]
                },

                // 上传证件
                uploadUrl: window.location.origin + Config[Config.env].ajaxUrl  + '/sys/upload/file',
                headers: {
                    Authorization: that.$store.state.token || ''
                },
                upload_data: {

                },

                // 协议内容
                model_agreement_content: false

            };
        },
        components: {
            vAgreementConent
        },
        created() {
            this.query.cloudServerId = this.$route.query.cid || '';
        },
        computed: {
            price() {
                return this.select_serve_info.num * this.select_serve_info.duration * this.select_serve_info.chageStandard;
            },
            free_apply_content() {
                return  this.select_serve_info.serverName
                    + '\n'
                    + '规格：' + this.select_serve_info.cpu + 'CPU;'
                    + this.select_serve_info.memory + '内存;'
                    + this.select_serve_info.systemDisk + '系统盘;'
                    + this.select_serve_info.hardDisk + '硬盘;'
                    + this.select_serve_info.bandWidth + '宽带;'
                    + '\n'
                    + '数量：' + this.select_serve_info.num
                    + '\n'
                    + '时间：' + this.select_serve_info.duration + '个月';
            }
        },
        mounted() {
            this.getServeData();
            this.$parent.refreshIScroll('cloudService');
        },
        methods: {
            onClick_subtract_num() {
                if (this.select_serve_info.num <= 1) {
                    this.select_serve_info.num = 1;
                }
                else {
                    this.select_serve_info.num -= 1;
                }
            },
            onClick_add_num() {
                this.select_serve_info.num += 1;
            },

            /**
             * 获取首页服务器列表
             */
            getServeData() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/cloudServer/getServerList'
                }).then(function (response) {
                    if (response.status === 1) {
                        that.serverDataList =  response.result;

                        that.serverDataList.forEach(function (val) {
                            if (val.cloudServerId === that.query.cloudServerId) {
                                that.onClick_select(val);
                            }
                        })
                    }

                }).catch(function (e) {
                })
            },

            /**
             * 选中服务器
             * @param item
             */
            onClick_select(item) {
                this.query.cloudServerId =  item.cloudServerId;

                this.select_serve_info.cloudServerId = item.cloudServerId;
                this.select_serve_info.serverName = item.serverName;
                this.select_serve_info.mirror = item.mirror;
                this.select_serve_info.cpu = item.cpu;
                this.select_serve_info.memory = item.memory;
                this.select_serve_info.systemDisk = item.systemDisk;
                this.select_serve_info.hardDisk = item.hardDisk;
                this.select_serve_info.bandWidth = item.bandWidth;
                this.select_serve_info.chageStandard = item.chageStandard || 0;
            },
            /**
             * 购买
             */
            onClick_pay() {
                var that = this;

                if (!!this.$store.state.uid) {

                    that.$Spin.show();

                    that.$http({
                        method: 'get',
                        url: '/panoramic/serverOrder/buyCloudServer',
                        params: {
                            cloudServerId: that.select_serve_info.cloudServerId,
                            serverNumber: that.select_serve_info.num,
                            months: that.select_serve_info.duration,
                            userId: that.$store.state.uid,
                            redirectUrl: that.redirectUrl
                        }
                    }).then(function (response) {
                        that.$Spin.hide();
                        if (response.status === 1) {
                            that.$router.push({
                                name: 'cashierDesk',
                                query: {
                                    orderId: response.result.order.orderId
                                }
                            })
                        }
                        else {
                            that.$Message.error({
                                content: response.errMsg
                            });
                        }
                    }).catch(function (e) {
                        that.$Spin.hide();
                    });
                }
                else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '请先登陆！',
                        onOk() {

                            var pUrl = window.location.origin+ '/\%23' + Config[Config.env].baseUrl + that.$route.path.replace('/', '');
                            var url = "http://218.5.80.6:8070/OCEAN/api/login?url=" + pUrl;
                            window.location.href = url;
                        }
                    })
                }
            },

            /**
             * 免费申请弹出窗口
             */
            onClick_freeApply_modal() {
                var that = this;

                if (!!this.$store.state.uid && !!this.$store.state.usertype) {

                    that.$http({
                        method: 'get',
                        url: '/auth/getUserInfoById',
                        params: {
                            token: that.$store.state.token,
                            uid: that.$store.state.uid,
                            type: that.$store.state.usertype
                        }
                    }).then(function (response) {

                        that.modal_freeApply = true;
                        if (response.status === 1) {
                            that.userInfo.applyUnit = response.result.enterName || '';
                            that.userInfo.applyPerson = response.result.name || '';
                            that.userInfo.phone = response.result.mobile || '';
                            that.userInfo.mail = response.result.email || '';
                        }
                        else {}
                    }).catch(function (e) {

                    });
                }
                else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '请先登陆！',
                        onOk() {

                            var pUrl = window.location.origin+ '/\%23' + Config[Config.env].baseUrl + that.$route.path.replace('/', '');
                            var url = "http://218.5.80.6:8070/OCEAN/api/login?url=" + pUrl;
                            window.location.href = url;
                        }
                    })
                }

            },

            /**
             * 上传服务器之前
             */
            uploadHandleBeforeUpload() { },

            /**
             * 上传服务器成功返回
             */
            uploadHandleSuccess(res) {
                this.userInfo.certificate = res.result.pictureId;
                this.$Message.success({
                    content: '上传成功！'
                });
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

            onClick_freeApply_ok() {
                var that = this;
                that.$Spin.show();
                that.$http({
                    method: 'post',
                    url: '/panoramic/serverOrder/applyCloudServer',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        cloudServerId: that.select_serve_info.cloudServerId,
                        serverNumber: that.select_serve_info.num,
                        months: that.select_serve_info.duration,
                        userId: that.$store.state.uid,

                        applyUnit: that.userInfo.applyUnit,
                        applyPerson: that.userInfo.applyPerson,
                        certificate: that.userInfo.certificate,
                        phone: that.userInfo.phone,
                        mail: that.userInfo.mail,
                        useDescription: that.userInfo.useDescription

                    })
                }).then(function (response) {
                    that.$Spin.hide();
                    if (response.status === 1) {
                        that.modal_freeApply = false;
                        that.$Message.success({
                            content: '申请成功！'
                        });
                    }
                    else {
                        that.$Message.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.$Spin.show();
                });
            },

            // 同意协议选择变化, 弹出协议内容
            onClick_agreement_content(value) {
                this.model_agreement_content = value;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cloudService-container {

        .cloudService-inner {
            margin: 0 auto;
            width: 1200px;

            .cloud-title {
                color: #323232;
                font-size: 33px;
                line-height: 185px;
                text-align: center;
            }

            .box-panel {
                margin-bottom: 12px;
                padding: 20px 32px 30px;
                border: 2px solid #e7e7e7;

                .title {
                    color: #1a1a1a;
                    font-size: 22px;
                }

                .area-list-ul {
                    margin-top: 19px;
                    list-style-type: none;
                    padding: 0;

                    .area-li {
                        margin: 0 8px;
                        display: inline-block;
                        padding: 6px 19px;
                        color: #FFF;
                        font-size: 18px;
                        line-height: 20px;
                        border: 1px solid #e7e7e7;
                        background-color: #00c0dd;
                    }
                }

                .type-list {
                    overflow: hidden;
                    .item {
                        margin-top: 12px;
                        margin-right: 110px;
                        padding: 0 0 20px 0;
                        float: left;
                        width: 304px;
                        border: 1px solid #e7e7e7;
                        cursor: pointer;


                        &:nth-child(3n) {
                            margin-right: 0;
                        }

                        &:hover {
                            .type-name {
                                color: #FFF;
                                background-color: #00c0dd;
                            }
                        }
                        &.active {
                            .type-name {
                                color: #FFF;
                                background-color: #00c0dd;
                            }
                        }

                        .type-name {
                            padding-top: 12px;
                            padding-bottom: 6px;
                            color: #1a1a1a;
                            font-size: 18px;
                            line-height: 26px;
                            text-align: center;
                            transition: all 0.2s;
                        }

                        .type-desc {
                            margin-top: 18px;
                            color: #666666;
                            font-size: 15px;
                            line-height: 26px;
                            text-align: center;
                        }
                    }
                }

                .config-list {
                    margin-top: 20px;
                    .attr{
                        color: #1a1a1a;
                        font-size: 18px;
                        line-height: 38px;
                    }
                }

                .remark {
                    margin-top: 18px;
                    color: #666666;
                    font-size: 18px;
                    line-height: 36px;
                }

                .param-list {
                    margin-top: 16px;
                    .attr {
                        display: flex;
                        height: 40px;
                        margin-bottom: 40px;

                        .label {
                            padding-right: 23px;
                            color: #1a1a1a;
                            font-size: 16px;
                            line-height: 40px;

                        }
                        .value {
                            flex: 1;
                            padding: 4px 0;

                            .btn {
                                cursor: pointer;
                                padding: 0 5px;
                            }
                        }
                    }
                }
                
                .notice {
                    color: #1a1a1a;
                    font-size: 16px;
                    line-height: 32px;
                }

                .agreement-p {
                    margin-top: 30px;
                }

                .cost-b {
                    margin-top: 35px;
                    color: #1a1a1a;
                    .label {
                        padding-right: 45px;
                        font-size: 22px;
                    }

                    .value {
                        font-size: 32px;
                    }
                }

                .btn-box {
                    margin-top: 50px;

                    .ivu-btn {
                        margin-right: 35px;
                    }

                    .btn-1 {
                        color: #FFF;
                        background-color: #00c0dd;
                        border-color: #00c0dd;

                        &:hover {
                            background-color: rgba(0,192,221, 0.8);
                            border-color: rgba(0,192,221, 0.8);
                        }
                    }

                    .btn-2 {
                        color: #FFF;
                        background-color: #546478;
                        border-color: #546478;

                        &:hover {
                            background-color: rgba(84,100,120, 0.8);
                            border-color: rgba(84,100,120, 0.8);
                        }
                    }
                }
            }
        }
    }
</style>