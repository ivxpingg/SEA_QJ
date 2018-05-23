<template>
    <div class="header-container">
         <div class="header-inner">
             <h2 class="logo-title">海洋装备全景分析</h2>
             <div class="header-menu-panel">
                 <ul class="menu-ul">
                     <li class="menu-li active">首页</li>
                     <li class="menu-li">云服务器</li>
                     <li class="menu-li">行业数据</li>
                 </ul>
             </div>
             <div class="user-menu-panel">

                 <ul class="user-ul">
                     <li class="user-li">
                         <Button type="text" icon="ios-bell">站内信</Button>
                     </li>
                     <li class="user-li">
                         <!--<div class="ivu-btn ivu-btn-text">-->
                             <!--<i class="ivu-icon ivu-icon-android-person"></i>-->
                             <!--<span>个人中心</span>-->
                         <!--</div>-->
                          <Button type="text" icon="android-person">个人中心</Button>
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
        name: "h-header",
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .header-container {
        position: relative;
        height: 64px;
        transition: all 0.2s;
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
                overflow: hidden;
                .menu-ul {
                    height: 100%;
                    list-style-type: none;
                    overflow: hidden;
                    .menu-li {
                        position: relative;
                        padding: 0 30px;
                        float: left;
                        height: 100%;
                        line-height: 64px;
                        color: #FFF;
                        font-size: 14px;
                        cursor: pointer;

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
                            &:after {
                                background-color: #FFF;
                            }
                        }

                        &.active {

                            &:after {
                                background-color: #FFF;
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
                        padding-right: 18px;
                        float: left;
                        height: 100%;
                        line-height: 64px;
                        color: #FFF;
                        font-size: 14px;
                        
                        .ivu-btn {
                            color: rgba(255,255,255,0.8);
                            
                            &:hover{
                                color: #FFF;
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