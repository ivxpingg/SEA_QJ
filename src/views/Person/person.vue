<template>
    <div class="person-container">
        <vHeader class="p-header"></vHeader>
        <div class="content-box">
            <div class="left-panel">
                <div class="menu-title">个人中心</div>
                <Menu theme="light"
                      :open-names="['1']"
                      active-name="1-1"
                      @on-select="onSelect_menu"
                      @on-open-change="onOpenChange_menu"
                      accordion>
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-paper"></Icon>
                            费用管理
                        </template>
                        <MenuItem name="1-1">订单管理</MenuItem>
                        <MenuItem name="1-2">发票管理</MenuItem>
                        <MenuItem name="1-3">工单管理</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-people"></Icon>
                            控制台
                        </template>
                        <MenuItem name="2-1">云服务器</MenuItem>
                        <MenuItem name="2-2">行业数据</MenuItem>
                    </Submenu>
                    <Submenu name="3">
                        <template slot="title">
                            <Icon type="stats-bars"></Icon>
                            账号管理
                        </template>
                            <MenuItem name="3-1">账号管理</MenuItem>
                    </Submenu>

                    <Submenu name="4">
                        <template slot="title">
                            <Icon type="stats-bars"></Icon>
                            消息通知
                        </template>
                        <MenuItem name="4-1">消息通知</MenuItem>
                    </Submenu>
                </Menu>
            </div>
            <div class="right-panel">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import vHeader from '../../components/person/header/p-header';
    export default {
        name: "person",
        data() {
            return {
                menu: [{
                    '1-1': {}
                }]
            };
        },
        components: {vHeader},
        methods: {
            onSelect_menu(name) {
               // alert(name);
            },
            onOpenChange_menu(name) {
                // alert(name);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .person-container {
        position: relative;
        height: 100%;
        .p-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
        }

        .content-box {
            display: flex;
            padding-top: 64px;
            height: 100%;

            .left-panel {
                width: 241px;
                height: 100%;
                border-right: 1px solid #dddee1;

                .menu-title {
                    font-size: 20px;
                    text-align: center;
                    line-height: 45px;
                    font-weight: 700;
                    border-bottom: 1px solid #dddee1;
                }

                .ivu-menu {
                    &:after {
                        display: none;
                    }
                }
            }
            .right-panel {
                flex: 1;
            }
        }
    }
</style>