<template>
    <div class="personInfoMange-container">
        <vMenuTitle name="账号管理"></vMenuTitle>
        <div class="info-box">
            <div class="title">账户信息</div>
            <div class="content-box">
                <div class="item">
                    <span>管理人：</span>
                    <span>admin</span>
                    <!--<span class="edit"><Icon type="edit"></Icon></span>-->
                </div>
                <div class="item">
                    <span>账号ID：</span>
                    <span>132456789</span>
                </div>
                <div class="item">
                    <span>所属单位：</span>
                    <span></span>
                </div>
            </div>
        </div>

        <div class="info-box">
            <div class="title">安全设置</div>
            <div class="content-box">
                <div class="item">
                    <span>密码设置：</span>
                    <span>********</span>
                    <span class="edit"><Icon type="edit"></Icon></span>
                </div>
                <div class="item">
                    <span>绑定手机：</span>
                    <span>139*****196</span>
                    <span class="edit"><Icon type="edit"></Icon></span>
                </div>
                <div class="item">
                    <span>安全邮箱：</span>
                    <span>764341699@qq.com</span>
                    <span class="edit"><Icon type="edit"></Icon></span>
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

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "personInfoMange",
        data() {
            return {
                personInfo: {
                    account: '',
                    mobile: '',
                    email: '',
                    company: ''
                },

                // 账户信息
                person_info_modal: false,

                // 密码修改

                // 手机绑定

                // 邮箱绑定
            };
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

                    }
                    
                }).catch(function (e) {
                    
                })
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