<template>
    <div class="p-header-container">
        <div class="header-inner">
            <h2 class="logo-title" @click="onGotoHome">海洋装备全景分析</h2>

            <div class="user-menu-panel">
                <ul class="user-ul">
                    <li class="user-li">

                        <Button type="text">
                            <Badge class="my-badge" count="1">
                                <Avatar icon="ios-bell" size="small" />
                            </Badge>
                            站内信
                        </Button>
                    </li>
                    <li class="user-li" :class="{'active_person': active_person}" @mouseover="onmousemove_person" @mouseleave="onmouseleave_person">
                        <!--<div class="ivu-btn ivu-btn-text">-->
                        <!--<i class="ivu-icon ivu-icon-android-person"></i>-->
                        <!--<span>个人中心</span>-->
                        <!--</div>-->

                        <div class="person-box">
                            <ul class="person-list-menu">
                                <li>账号名</li>
                                <li>账号ID</li>
                                <li>订单管理</li>
                                <li>工单管理</li>
                                <li>账号管理</li>
                            </ul>
                        </div>

                        <Button class="m-btn" type="text" icon="android-person">个人中心</Button>

                    </li>
                    <li class="user-li user-li-login">
                        <Button type="text">登录</Button>
                    </li>
                    <li class="user-li user-li-sign">
                        <Button type="text">注册</Button>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "p-header",
        data() {
            return {
                active_person: false
            };
        },
        methods: {
            onmousemove_person() {
                console.log('over');
                this.active_person = true;
            },

            onmouseleave_person() {
                console.log('leave');
                this.active_person = false;
            },
            onGotoHome() {
                this.$router.push('/home');
            }
        }
    }
</script>

<style lang="scss">
    .p-header-container {
        position: relative;
        height: 64px;
        transition: all 1s;
        background-color: #1e1e1e;
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