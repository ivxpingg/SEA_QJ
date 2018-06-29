<template>
    <div class="header-container">
         <div class="header-inner">
             <h2 class="logo-title">海洋装备全景分析</h2>
             <div class="header-menu-panel">
                 <ul class="menu-ul">
                     <li class="menu-li" ref="menu1" @click="goto($event, '/mapShow')">装备全景分析展示</li>
                     <li class="menu-li" ref="menu2" @click="goto($event, '/home/index')">行业服务中心
                         <div class="pull-down-box">
                             <ul class="pull-down-list-menu">
                                 <li @click.stop="goto2($event, '/home/cloudService')">云服务器</li>
                                 <li @click.stop="goto2($event, '/home/industryData')">行业数据</li>
                             </ul>
                         </div>
                     </li>
                     <!--<li class="menu-li" @click="goto($event, '/home/cloudService')">云服务器</li>-->
                     <!--<li class="menu-li" @click="goto($event, '/home/industryData')">行业数据</li>-->
                 </ul>
             </div>
             <div class="user-menu-panel">

                 <ul class="user-ul">
                     <li v-if="isLogin" class="user-li">

                         <Button type="text">
                             <Badge class="my-badge" :count="unReadMessage">
                                 <Avatar icon="ios-bell" size="small" />
                             </Badge>
                             站内信
                         </Button>
                     </li>
                     <li v-if="isLogin" class="user-li" :class="{'active_person': active_person}" @mouseover="onmousemove_person" @mouseleave="onmouseleave_person">
                         <!--<div class="ivu-btn ivu-btn-text">-->
                             <!--<i class="ivu-icon ivu-icon-android-person"></i>-->
                             <!--<span>个人中心</span>-->
                         <!--</div>-->

                         <div class="person-box">
                             <ul class="person-list-menu">
                                 <li @click="onClick_gotoPerson">个人中心</li>
                                 <li @click="onClick_layout">退出</li>
                             </ul>
                         </div>

                         <Button class="m-btn" type="text" icon="android-person" style="min-width: 100px">{{userName}}</Button>

                     </li>
                     <li v-if="!isLogin" class="user-li user-li-login">
                         <Button type="text" @click="onclick_login">登录</Button>
                     </li>
                     <li v-if="!isLogin" class="user-li user-li-sign">
                         <Button type="text">注册</Button>
                     </li>
                 </ul>

             </div>
         </div>
    </div>
</template>

<script>
    import Config from '../../../libs/appConfig/config';
    import Cookie from '../../../libs/helpers/cookies';
    export default {
        name: "h-header",
        data() {
            return {
                active: true,
                isLogin: false,
                active_person: false,
                unReadMessage: 0,
                userId: '',
                userName: '用户名'
            };
        },
        created() {

            if(!!Cookie.read('uid') && !!Cookie.read('token') && !!Cookie.read('usertype')) {
                this.userId = Cookie.read('uid');
                this.isLogin = true;
            }
            else {
                this.userId = '';
                this.isLogin = false;
            }

        },
        mounted() {
            if (this.$route.path === '/mapShow') {
                this.$refs.menu1.className += ' active';
            }
            else {
                this.$refs.menu2.className += ' active';
            }
            // this.getUnReadMessage();
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
                        else {}
                    }).catch(function (e) {

                    });
                }
            },
            goto(event, name) {
                var dom = event.target.parentNode.querySelector('.active');
                dom.className = dom.className.replace(' active', '');
                event.target.className += ' active';
                this.$router.push(name);

                this.$emit('parentIScroll', name);
            },

            goto2(event, name) {
                var dom = event.target.parentNode.parentNode.parentNode.parentNode.querySelector('.active');
                dom.className = dom.className.replace(' active', '');
                event.target.parentNode.parentNode.parentNode.className += ' active';
                this.$router.push(name);

                this.$emit('parentIScroll', name);
            },

            onClick_gotoPerson() {
                this.$router.push({
                    name: 'orderManage'
                });
            },
            onClick_layout() {
                Cookie.remove('uid');
                Cookie.remove('token');
                Cookie.remove('usertype');
                this.isLogin = false;
                this.userId = '';
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

            onmousemove_person() {
                this.active_person = true;
            },

            onmouseleave_person() {
                this.active_person = false;
            },

            onclick_login() {

                var pUrl = window.location.origin+ '/\%23' + Config[Config.env].baseUrl + this.$route.path.substring(1);
                var url = "http://218.5.80.6:8070/OCEAN/api/login?url=" + pUrl;
                window.location.href = url;
            }

        }
    }
</script>

<style lang="scss">
    .header-container {
        position: relative;
        height: 64px;
        transition: all 1s;
        /*background-color: ;*/

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
            margin: 0 auto;
            width: 1200px;
            height: 100%;

            .logo-title {
                display: inline-block;
                float: left;
                padding-left: 68px;
                color: #FFF;
                font-size: 20px;
                line-height: 64px;
                background: url('./images/logo.png') no-repeat left center;
            }

            .header-menu-panel {
                float: left;
                height: 100%;
                /*overflow: hidden;*/
                .menu-ul {
                    height: 100%;
                    list-style-type: none;
                    /*overflow: hidden;*/
                    .menu-li {
                        position: relative;
                        padding: 0 30px;
                        float: left;
                        height: 100%;
                        line-height: 64px;
                        color: #FFF;
                        font-size: 14px;
                        cursor: pointer;

                        .pull-down-box{
                            height: 0;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            right: 0;
                            overflow: hidden;
                            padding-left: 30px;
                            background-color: rgba(0, 0, 0, 0.8);
                            color: #FFF;
                            transition: all 0.2s;

                            .pull-down-list-menu {
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

                        &:first-child {
                            margin-left: 24px;
                        }

                        &:after {
                            position: absolute;
                            content: " ";
                            left: 30px;
                            right: 30px;
                            bottom: 0;
                            height: 2px;
                            transition: all 0.2s;
                            background-color: transparent;
                        }

                        &:hover {
                            background-color: rgba(0, 0, 0, 0.8);

                            .pull-down-box {
                                height: 83px;
                            }
                            &:after {
                                background-color: #FFF;
                            }
                        }

                        &.active {
                            color: #00c0dd;

                            &:after {
                                background-color: #00c0dd;
                            }
                        }



                    }
                }

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
                        line-height: 64px;
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