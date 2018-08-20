<template>
    <div class="p-header-person-container">
        <div class="header-inner">
            <h2 class="logo-title" @click="onGotoHome">海洋装备全景观测试验分析组件</h2>

            <div class="user-menu-panel">
                <ul class="user-ul">
                    <!--<li class="user-li">-->

                        <!--<Button type="text">-->
                            <!--<Badge class="my-badge" :count="unReadMessage">-->
                                <!--<Avatar icon="ios-bell" size="small" />-->
                            <!--</Badge>-->
                            <!--站内信-->
                        <!--</Button>-->
                    <!--</li>-->
                    <li class="user-li"
                        :class="{'active_person': active_person}"
                        @mouseover="onmousemove_person"
                        @mouseleave="onmouseleave_person">
                        <!--<div class="ivu-btn ivu-btn-text">-->
                        <!--<i class="ivu-icon ivu-icon-android-person"></i>-->
                        <!--<span>个人中心</span>-->
                        <!--</div>-->

                        <!--<div class="person-box">-->
                            <!--<ul class="person-list-menu">-->
                                <!--<li @click="onClick_gotoPerson">个人中心</li>-->
                                <!--<li @click="onClick_gotoManage">后台管理</li>-->
                            <!--</ul>-->
                        <!--</div>-->

                        <Button class="m-btn" type="text" icon="android-person">{{userName}}</Button>

                    </li>
                    <li class="user-li user-li-logout">
                        <Button type="text" @click="onClick_logout">退出</Button>
                    </li>
                    <li class="user-li user-li-logout">
                        <Button type="text" icon="home" @click="onClick_backHome" title="返回首页"></Button>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script>
    import Cookie from '../../../libs/helpers/cookies';
    import Config from '../../../libs/appConfig/config';
    export default {
        name: "p-header",
        data() {
            return {
                active_person: false,
                unReadMessage: 0,

                userName: '',
                isLogin: false
            };
        },
        created() {

            if(!!this.$store.state.uid && !!this.$store.state.token && !!this.$store.state.usertype) {
            //if(!!Cookie.read('sea_qj_uid') && !!Cookie.read('sea_qj_token') && !!Cookie.read('sea_qj_usertype')) {
                this.userId = this.$store.state.uid;
                this.isLogin = true;
            }
            else {
                this.userId = '';
                this.isLogin = false;
            }

        },
        mounted() {
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                var that = this;
                if (this.isLogin) {
                    that.$http({
                        method: 'get',
                        url: '/auth/getUserInfoById',
                        params: {
                            token: that.$store.state.token,
                            uid: that.$store.state.uid,
                            type: that.$store.state.usertype
                        }
                    }).then(function (response) {
                        if (response.status === 1) {
                            that.userName = response.result.name || '';
                        }
                        else {
                            that.$router.push({
                                name: 'mapShow'
                            })
                        }
                    }).catch(function (e) {

                    });
                }
            },

            onmousemove_person() {
                this.active_person = true;
            },

            onmouseleave_person() {
                this.active_person = false;
            },
            onGotoHome() {
                this.$router.push('/home/index');
            },
            onClick_gotoPerson() {
                this.$router.push({
                    name: 'orderManage'
                });
            },
            onClick_gotoManage() {
                this.$router.push({
                    name: 'manage'
                });
            },
            onClick_logout() {
                var path = Config[Config.env].path;
                Cookie.write('sea_qj_uid', '', Date.now() - (86400000 * 7), path);
                Cookie.write('sea_qj_token', '', Date.now() - (86400000 * 7), path);
                Cookie.write('sea_qj_usertype', '', Date.now() - (86400000 * 7), path);

                this.$router.push({
                    name: 'index'
                });
            },

            onClick_backHome() {
                window.location.href = Config[Config.env].homeSeaBaseUrl_person + '/OCEAN/login_default';
            },

            // 获取未读消息数据量
            getUnReadMessage() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '',
                    params: {
                        userId: that.userId
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.unReadMessage = response.result;
                    }
                }).catch(function () {

                });
            },
        }
    }
</script>

<style lang="scss">
    .p-header-person-container {
        position: relative;
        height: 62px;
        transition: all 1s;
        background-color: #383d43;
        &:after {
            position: absolute;
            content: " ";
            height: 1px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255,255,255,0.1);
        }

        .header-inner {
            margin: 0 20px;
            /*width: 1200px;*/
            height: 100%;

            .logo-title {
                display: inline-block;
                float: left;
                padding-left: 68px;
                color: #FFF;
                font-size: 20px;
                line-height: 62px;
                background: url('./images/logo.png') no-repeat left center;
                cursor: pointer;
            }

            .user-menu-panel {
                float: right;
                height: 100%;

                .user-ul {
                    height: 100%;
                    list-style-type: none;
                    .user-li {
                        position: relative;
                        margin-right: 18px;
                        float: left;
                        height: 100%;
                        line-height: 62px;
                        color: #FFF;
                        font-size: 14px;

                        .my-badge {
                            .ivu-avatar {
                                background-color: transparent;
                            }

                            .ivu-badge-count {
                                right: 5px;
                                background: #ff931e;
                                border-width: 0;
                                box-shadow:none;
                            }
                        }

                        .ivu-btn {
                            color: rgba(255,255,255,0.8);
                            border-color: transparent;
                            box-shadow: none;
                            &:hover,&:active{
                                border-color: transparent;
                                box-shadow: none;
                                color: #FFF;
                            }
                        }

                        .person-box {
                            height: 0;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            overflow: hidden;
                            padding-left: 22px;
                            background-color: #272b2f;
                            color: #FFF;
                            transition: all 1s;
                            .person-list-menu {
                                padding-top: 5px;
                                padding-bottom: 10px;
                                list-style-type: none;
                                font-size: 14px;
                                line-height: 24px;

                                li {
                                    padding: 5px 0;
                                    cursor: pointer;

                                    &:hover {
                                        color: rgba(255,255,255,0.8);
                                    }
                                }
                            }
                        }

                        &.active_person {
                            background-color: #272b2f;

                            .person-box {
                                height: auto;
                            }

                        }

                        &.user-li-login {
                            &:after {
                                position: absolute;
                                content: " ";
                                top: 50%;
                                right: 0;
                                margin-top: -4.5px;
                                width: 1px;
                                height: 12px;
                                background-color: rgba(255,255,255,0.8);
                            }

                            .ivu-btn {
                                padding: 6px 6px 6px 5px;
                                &:hover{
                                    text-decoration: underline;
                                }
                            }
                        }
                        &.user-li-sign {
                            .ivu-btn {
                                padding: 6px 5px;
                                &:hover{
                                    text-decoration: underline;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>