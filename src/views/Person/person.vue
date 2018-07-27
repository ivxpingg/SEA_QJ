<template>
    <div class="person-container">
        <vHeader class="p-header"></vHeader>
        <div class="content-box">
            <div class="left-panel">
                <div class="menu-title">个人中心</div>
                <Menu theme="dark"
                      :open-names="open_names"
                      :active-name= "active_name"
                      @on-select="onSelect_menu"
                      @on-open-change="onOpenChange_menu"
                      accordion>
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-paper"></Icon>
                            费用管理
                        </template>
                        <MenuItem name="1-1">服务器订单</MenuItem>
                        <MenuItem name="1-2">行业数据订单</MenuItem>
                        <MenuItem name="1-3">发票管理</MenuItem>
                        <MenuItem name="1-4">工单管理</MenuItem>
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
                menu: {
                    '1-1': { name: 'orderManage' },
                    '1-2': { name: 'dataOrderManage' },
                    '1-3': { name: 'invoiceManage' },
                    '1-4': { name: 'workOrderManage' },
                    '2-1': { name: 'cloudServiceManage' },
                    '2-2': { name: 'industryDataManage' },
                    '3-1': { name: 'personInfoMange' },
                    '4-1': { name: 'messageManage' }
                },
                open_names: ['1'],
                active_name: '1-1'
            };
        },
        components: {vHeader},
        created() {
            if (this.$route.name === 'person') {
                this.$router.replace({
                    name: 'orderManage'
                });
            }

            for (var key in this.menu) {
                if (this.menu[key].name === this.$route.name) {
                    this.active_name = key;
                    this.open_names = [key.split('-')[0]];
                    break;
                }
            }
        },
        methods: {
            onSelect_menu(name) {
                this.$router.push({
                    name: this.menu[name].name
                });
            },
            onOpenChange_menu(name) {
                // this.$router.push({
                //     name: this.menu[name].name
                // });
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
            z-index: 999;
        }

        .content-box {
            display: flex;
            padding-top: 62px;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;

            .left-panel {
                width: 241px;
                height: 100%;
                border-right: 1px solid #dddee1;
                background-color: #495060;

                .menu-title {
                    color: #FFF;
                    font-size: 20px;
                    text-align: center;
                    line-height: 45px;
                    font-weight: 700;
                    border-bottom: 1px solid #363e4f;
                }

                .ivu-menu {
                    &:after {
                        display: none;
                    }
                }
            }
            .right-panel {
                flex: 1;
                padding: 0 52px 0 22px;
                overflow-x: hidden;
            }
        }
    }
</style>