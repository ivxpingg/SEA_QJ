<template>
    <div class="personInfoMange-container">
        <vMenuTitle name="账号管理"></vMenuTitle>
        <div class="info-box">
            <div class="title">账户信息</div>
            <div class="content-box">
                <div class="item">
                    <span>账号：</span>
                    <span>{{personInfo.account}}</span>
                    <span class="edit" @click="onClick_edit_userInfo"><Icon type="edit"></Icon></span>
                    <!--<span class="edit"><Icon type="edit"></Icon></span>-->
                </div>
                <!--<div class="item">-->
                    <!--<span>账号ID：</span>-->
                    <!--<span>{{}}</span>-->
                <!--</div>-->
                <div class="item">
                    <span>所属单位：</span>
                    <span>{{personInfo.enterName}}</span>
                </div>
            </div>
        </div>

        <div class="info-box">
            <div class="title">安全设置</div>
            <div class="content-box">
                <!--<div class="item">-->
                    <!--<span>密码设置：</span>-->
                    <!--<span>********</span>-->
                    <!--<span class="edit"></span>-->
                <!--</div>-->
                <div class="item">
                    <span>绑定手机：</span>
                    <span>{{topThreeNum}}*****{{lastThreeNum}}</span>
                    <span class="edit" @click="onClick_edit_mobile"><Icon type="edit"></Icon></span>
                </div>
                <div class="item">
                    <span>安全邮箱：</span>
                    <span>{{personInfo.email}}</span>
                    <span class="edit"  @click="onClick_edit_email"><Icon type="edit"></Icon></span>
                </div>
            </div>
        </div>

        <Modal v-model="person_info_modal"
               title='账号信息'>
            <div>
                <Form v-model="personInfo" :label-width="80">
                    <FormItem label="选择产品" prop="orderId">
                        <!--<Select v-model="workOrderInfo.orderId" placeholder="请选择产品">-->
                            <!--<Option v-for="item in serverList_bought" value="item.value">{{item.name}}</Option>-->
                        <!--</Select>-->
                    </FormItem>

                    <FormItem label="问题描述" prop="applyContent">
                        <!--<Input type="textarea" v-model="personInfo.applyContent" />-->
                    </FormItem>

                    <FormItem label="联系人" prop="applyName">
                        <!--<Input type="text" v-model="personInfo.applyName" />-->
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large">保存修改</Button>
            </div>
        </Modal>



        <Modal title="更改手机"
               :width="450"
               v-model="model_mobile_edit">
            <div>
                <Form ref="detail_form_mobile"
                      :rules="mobile_rules"
                      :model="updateMobile" :label-width="80">
                    <FormItem label="手机号:" prop="mobile">
                        <Input v-model="updateMobile.mobile" type="text"></Input>
                    </FormItem>
                    <FormItem label="验证码:" prop="code">
                        <Input v-model="updateMobile.code" type="text">
                            <Button slot="append"
                                    type="primary"
                                    :loading="mloading"
                                    :disabled="times > 0"
                                    @click="onClick_getMobileCode">
                                <span v-if="times === 0">获取验证码</span>
                                <span v-else>获取验证码 {{times}}s</span>
                            </Button>
                        </Input>
                    </FormItem>
                </Form>
            </div>

            <div slot="footer">
                <Button type="primary" @click="onClick_updateMobile" size="large">保存</Button>
            </div>
        </Modal>

        <Modal title="更改邮箱"
               :width="450"
               v-model="model_email_edit">
            <div>
                <Form ref="detail_form_email"
                      :rules="email_rules"
                      :model="updateEmail"
                      :label-width="80">
                    <FormItem label="邮箱:" prop="email">
                        <Input v-model="updateEmail.email" type="text"></Input>
                    </FormItem>
                </Form>
            </div>

            <div slot="footer">
                <Button type="primary" @click="onClick_updateEmail" size="large">保存</Button>
            </div>
        </Modal>

        <Modal v-model="modal_edit_user"
               title="修改用户信息">
            <div>
                <Form ref="edit_user_form"
                      :model="editUserInfo"
                      :rules="userInfo_rules"
                      :label-width="80">
                    <FormItem label="用户名" prop="account">
                        <Input v-model="editUserInfo.account" disabled readonly type="text" placeholder="请输入用户名" />
                    </FormItem>
                    <FormItem label="真实姓名" prop="name">
                        <Input v-model="editUserInfo.name" type="text" placeholder="请输入真实姓名" />
                    </FormItem>
                    <!--<FormItem label="联系电话" prop="mobile">-->
                        <!--<Input  v-model="editUserInfo.mobile" type="text" placeholder="请输入联系电话" />-->
                    <!--</FormItem>-->
                    <FormItem label="单位名称" prop="enterName">
                        <Input  v-model="editUserInfo.enterName" type="text" placeholder="请输入单位名称" />
                    </FormItem>
                    <FormItem label="单位地址" prop="address">
                        <Input  v-model="editUserInfo.address" type="textarea" placeholder="请输入单位地址" />
                    </FormItem>
                    <FormItem label="邮箱" prop="email">
                        <Input  v-model="editUserInfo.email" type="text" placeholder="请输入邮箱地址" />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_edit_user">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "personInfoMange",
        data() {
            return {
                personInfo: {
                    userId: '',
                    account: '',
                    address: '',
                    email: '',
                    mobile: '',
                    name: '',
                    enterName: ''
                },

                // 账户信息
                person_info_modal: false,

                // 手机绑定
                model_mobile_edit: false,
                updateMobile: {
                    mobile: '',
                    code: ''
                },
                mobile_rules: {
                    mobile: [
                        { required: true, message: '手机号码不能为空', trigger: 'blur'}
                    ],
                    code: [
                        { required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                },
                mloading: false,
                times: 0,
                msetInterval: null,

                // 邮箱绑定
                model_email_edit: false,
                updateEmail: {
                    email: '',
                },
                email_rules: {
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur'}
                    ]
                },

                //修改用户
                modal_edit_user: false,
                editUserInfo: {
                    userId: '',
                    account: '',
                    name: '',
                    mobile: '',
                    email: '',
                    address: '',
                    enterName: ''
                },
                userInfo_rules: {
                    account: [
                        { required: true, message: '账号名称不能为空', trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '真实姓名不能为空', trigger: 'blur'}
                    ],
                    // mobile: [
                    //     { required: true, message: '联系电话不能为空', trigger: 'blur'}
                    // ],
                    enterName: [
                        { required: true, message: '单位名称不能为空', trigger: 'blur'}
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '单位地址不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            topThreeNum() {
                return this.personInfo.mobile.substring(0, 3);
            },
            lastThreeNum() {
                return this.personInfo.mobile.substring(this.personInfo.mobile.length - 3);
            }
        },
        components: {vMenuTitle},
        mounted() {
            this.getPersonInfo();
        },
        methods: {
            getPersonInfo() {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '/auth/getUserInfoById',
                    params: {
                        type: that.$store.state.usertype,
                        uid: that.$store.state.uid,
                        token: that.$store.state.token
                    }
                }).then(function(response) {
                    if(response.status === 1) {
                        that.personInfo.userId = response.result.userId;
                        that.personInfo.account = response.result.account || '';
                        that.personInfo.address = response.result.address || '';
                        that.personInfo.email = response.result.email || '';
                        that.personInfo.mobile = response.result.mobile || '';
                        that.personInfo.name = response.result.name || '';
                        that.personInfo.enterName = response.result.enterName || '';

                    }
                    
                }).catch(function (e) {
                    
                })
            },

            // 编辑用户弹出框
            onClick_edit_userInfo() {
                var that = this;
                that.editUserInfo.userId = that.personInfo.userId;
                that.editUserInfo.account = that.personInfo.account;
                that.editUserInfo.address = that.personInfo.address;
                that.editUserInfo.email = that.personInfo.email;
                that.editUserInfo.mobile = that.personInfo.mobile;
                that.editUserInfo.name = that.personInfo.name;
                that.editUserInfo.enterName = that.personInfo.enterName;
                that.modal_edit_user = true;
            },
            /**
             * 更新用户信息
             */
            onClick_edit_user() {
                var that = this;

                that.$refs['edit_user_form'].validate(function (valid) {
                    if (valid) {

                        that.$http({
                            method: 'post',
                            url: '/auth/updateUserInfo',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                uid: that.$store.state.uid,
                                type: that.$store.state.usertype,
                                token: that.$store.state.token
                            },
                            data: JSON.stringify(that.editUserInfo)
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '更新成功！'
                                });
                                that.modal_edit_user = false;
                                that.getPersonInfo();
                            }
                            else {
                                that.$Modal.error({
                                    content: response.errMsg
                                });
                            }
                        }).catch(function (e) {
                        })

                    }
                    else {}
                })
            },

            // 编辑手机弹出框
            onClick_edit_mobile() {
                var that = this;

                that.model_mobile_edit = true;

            },
            // 编辑邮箱弹出框
            onClick_edit_email() {
                var that = this;
                that.updateEmail.email = that.personInfo.email;
                that.model_email_edit = true;
            },

            // 获取手机验证码
            onClick_getMobileCode() {
                var that = this;

                that.mloading = true;
                that.$http({
                    method: 'get',
                    url: '/auth/sendCode',
                    params: {
                        mobile: that.updateMobile.mobile
                    }
                }).then(function(response) {
                    that.mloading = false;
                    if(response.status === 1) {
                        that.countDown_times();
                    }
                    else {
                        that.$Message.error({
                            content: '验证码获取失败！'
                        });
                        that.getPersonInfo();
                    }

                }).catch(function (e) {
                    that.$Message.error({
                        content: '验证码获取失败！'
                    });
                    that.mloading = false;
                })

                // this.$refs.detail_form_mobile.validate((valid) => {
                //     if (valid) {
                //
                //
                //     }
                //     else {
                //     }
                // });

            },
            // 获取验证码后按钮倒计时
            countDown_times() {
                var that = this;
                that.times = 30;
                that.msetInterval = setInterval(function () {
                    if (that.times > 0) {
                        --that.times;
                    }
                    else {
                        clearInterval(that.msetInterval);
                    }
                }, 1000);
            },

            // 保存手机号码
            onClick_updateMobile() {
                var that = this;

                this.$refs.detail_form_mobile.validate((valid) => {
                    if (valid) {

                        that.$http({
                            method: 'get',
                            url: '/auth/updateMobile',
                            params: {
                                mobile: that.updateMobile.mobile,
                                code: that.updateMobile.code,
                                type: that.$store.state.usertype,
                                uid: that.$store.state.uid,
                                token: that.$store.state.token
                            }
                        }).then(function(response) {
                            if(response.status === 1) {
                                that.$Message.success({
                                    content: '修改成功!'
                                });
                                that.model_mobile_edit = false;
                                that.getPersonInfo();
                            }
                            else {
                                that.$Message.error({
                                    content: response.errMsg
                                });
                            }

                        }).catch(function (e) {

                        })

                    }
                    else {
                    }
                });

            },
            // 更新邮箱
            onClick_updateEmail() {
                var that = this;

                this.$refs.detail_form_email.validate((valid) => {
                    if (valid) {
                        that.$http({
                            method: 'post',
                            url: '/auth/updateUserInfo',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                type: that.$store.state.usertype,
                                uid: that.$store.state.uid,
                                token: that.$store.state.token
                            },
                            data: JSON.stringify({
                                email: that.updateEmail.email
                            })
                        }).then(function (response) {
                            if(response.status === 1) {

                                that.$Message.success({content: '邮箱更新成功！'});
                                that.model_email_edit = false;
                                that.getPersonInfo();
                            }
                            else {
                                that.$Message.error({content: '邮箱更新失败！'});
                            }

                        }).catch(function (e) {
                            that.$Message.error({content: '邮箱更新失败！'});
                            console.log(e);
                        });
                    } else {

                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .personInfoMange-container {

        .info-box {
            margin-top: 23px;
            min-width: 510px;
            border: 1px solid #d9d9db;

            .title {
                padding-left: 8px;
                height: 62px;
                font-size: 16px;
                line-height: 62px;
                background-color: #f5f5f7;
            }

            .content-box {
                padding: 16px 8px;

                .item {
                    font-size: 14px;
                    line-height: 50px;
                    .edit {
                        padding-left: 16px;
                        cursor: pointer;

                        .ivu-icon-edit {
                            color: rgba(0,0,0, 0.5);
                            &:hover {
                                color: rgba(0,0,0, 1);
                            }
                        }

                    }
                }
            }
        }
    }
</style>