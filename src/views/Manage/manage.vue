<template>
    <div class="manage-container">
        <vHeader class="p-header"></vHeader>
        <div class="content-box">
            <div class="left-panel">
                <!--<div class="menu-title">后台管理</div>-->

                <Menu ref="menuManage"
                      theme="light"
                      :open-names="open_names"
                      :active-name="active_name"
                      @on-select="onSelect_menu"
                      @on-open-change="onOpenChange_menu"
                      accordion>

                      <Submenu v-for="(itemSub, idx) in menuData"
                               :name="itemSub.menuId"
                               :key="itemSub.menuId">

                          <template slot="title">
                              <Icon type="ios-paper"></Icon>
                              {{itemSub.menuName}}
                          </template>

                          <MenuItem v-for="item in itemSub.subMenu"
                                    :name="item.menuId"
                                    :key="item.menuId">{{item.menuName}}</MenuItem>
                      </Submenu>
                </Menu>

            </div>
            <div class="right-panel">

                <vTabs :active-tab="active_tab"></vTabs>

                <!--<router-view :menuName="name"></router-view>-->
            </div>
        </div>
    </div>
</template>

<script>
    import vHeader from '../../components/manage/header/p-header';
    import vTabs from '../../components/manage/tabs/tabs';
    export default {
        name: "manage",
        data() {
            return {
                name: '',
                menuData: [],
                menuUrl: {},
                open_names: [],
                active_name: '',
                menu_nameInName: {},

                active_tab: 'userManage'
            };
        },
        watch: {
            menuData: {
                deep: true,
                handler(val) {
                    this.menuUrl = {};
                    this.getMenuUrl(val);

                    this.open_names = [ this.menu_nameInName[this.active_tab].parentName ];
                    this.active_name = this.menu_nameInName[this.active_tab].name;

                    this.$nextTick(function () {
                        this.$refs.menuManage.updateOpened();
                        this.$refs.menuManage.updateActiveName();
                    })
                }
            }
        },
        computed: {},
        components: {vHeader, vTabs},
        created() {
            if (this.$route.query && this.$route.query.active_tab) {
                this.active_tab = this.$route.query.active_tab;
            }
        },
        mounted() {
            this.getMenuData();
        },
        methods: {
            onSelect_menu(name) {

                this.active_tab = this.menuUrl[name].url;
                // this.name = this.menuUrl[name].url;
                // this.$router.push({
                //     name: this.menuUrl[name].url
                // });
            },
            onOpenChange_menu(name) {
                // console.dir(name);
                // this.$router.push({
                //     name: this.menu[name].name
                // });
            },
            getMenuData() {
                var that = this;

                this.menuData = [{
                    parentId: '0',
                    menuId: '01',
                    menuName: '用户管理',
                    menuUrl: '',
                    menuOrder: '1',
                    subMenu: [{
                        parentId: '01',
                        menuId: '1001',
                        menuName: '用户管理',
                        menuUrl: 'userManage',
                        menuOrder: '1',
                    }]
                },{
                    parentId: '0',
                    menuId: '02',
                    menuName: '服务器管理',
                    menuUrl: '',
                    menuOrder: '2',
                    subMenu: [{
                        parentId: '02',
                        menuId: '2001',
                        menuName: '服务器管理',
                        menuUrl: 'serverManage',
                        menuOrder: '1',
                    }]
                },{
                    parentId: '0',
                    menuId: '03',
                    menuName: '数据资源管理',
                    menuUrl: '',
                    menuOrder: '3',
                    subMenu: [{
                        parentId: '03',
                        menuId: '3001',
                        menuName: '数据资源管理',
                        menuUrl: 'dataResourceMange',
                        menuOrder: '1',
                    }]
                },{
                    parentId: '0',
                    menuId: '04',
                    menuName: '用户订单管理',
                    menuUrl: '',
                    menuOrder: '4',
                    subMenu: [{
                        parentId: '04',
                        menuId: '4001',
                        menuName: '云服务器订单',
                        menuUrl: 'cloudServeManage',
                        menuOrder: '1',
                    },{
                        parentId: '04',
                        menuId: '4002',
                        menuName: '行业数据订单',
                        menuUrl: 'industryDataManage',
                        menuOrder: '2',
                    },{
                        parentId: '04',
                        menuId: '4003',
                        menuName: '发票申请管理',
                        menuUrl: 'invoiceApplyManage',
                        menuOrder: '3',
                    },{
                        parentId: '04',
                        menuId: '4004',
                        menuName: '用户工单管理',
                        menuUrl: 'userOrderManage',
                        menuOrder: '4',
                    }]
                },{
                    parentId: '0',
                    menuId: '05',
                    menuName: '轮播图管理',
                    menuUrl: '',
                    menuOrder: '5',
                    subMenu: [{
                        parentId: '05',
                        menuId: '5001',
                        menuName: '轮播图管理',
                        menuUrl: 'slideshowManage',
                        menuOrder: '1',
                    }]
                },{
                    parentId: '0',
                    menuId: '06',
                    menuName: '全景观测分析系统',
                    menuUrl: '',
                    menuOrder: '6',
                    subMenu: [{
                        parentId: '06',
                        menuId: '6001',
                        menuName: '全景观测分析系统',
                        menuUrl: 'seaSystem',
                        menuOrder: '1',
                    }]
                }];

                // that.$http({
                //     method: 'get',
                //     url: '/auth/userMenu',
                //     params: {
                //         type: this.$store.state.usertype,
                //         uid: this.$store.state.uid,
                //         syscode: 'QJFX',
                //         token: that.$store.state.token
                //     }
                // }).then(function (response) {
                //     console.dir(response);
                // }).catch(function (e) {
                //    console.dir(e);
                // });
            },
            getMenuUrl(attr, menuId) {
                var that = this;
                attr.forEach(function (val) {
                    that.menuUrl[val.menuId] = {};
                    that.menuUrl[val.menuId].url = val.menuUrl;
                    that.menuUrl[val.menuId].name = val.menuName;

                    that.menu_nameInName[val.menuUrl] = {};
                    that.menu_nameInName[val.menuUrl].name = val.menuId;
                    that.menu_nameInName[val.menuUrl].parentName = menuId;

                    if (val.subMenu) {
                        that.getMenuUrl(val.subMenu, val.menuId);
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .manage-container {
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
            padding-top: 82px;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;

            .left-panel {
                width: 241px;
                height: 100%;
                border-right: 1px solid #dddee1;
                /*background-color: #495060;*/

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
            }
        }
    }
</style>

<style lang="scss">
    .manage-container {
        .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
            color: #FFF;
            border-right: 2px solid #2d8cf0;
            background-color: #2d8cf0;
        }

        .ivu-menu {

            .ivu-menu-submenu {
                position: relative;

                &:after {
                    content: ' ';
                    position: absolute;
                    display: block;
                    height: 1px;
                    top: 49px;
                    left: 24px;
                    right: 0;
                    background-color: #e4e6eb;
                }
            }

            .ivu-menu-item {
                position: relative;

                &:after {
                    content: ' ';
                    position: absolute;
                    display: block;
                    height: 1px;
                    top: 49px;
                    left: 43px;
                    right: 0;
                    background-color: #e4e6eb;
                }
            }
        }
    }

</style>