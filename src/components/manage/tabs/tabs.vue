<template>
    <div class="mtabs-container">
        <Tabs class="my-ivu-tabs"
              v-model="currentTab"
              type="card"
              :animated="false"
              closable
              @on-tab-remove="handleTabRemove">
            <TabPane label="云服务器订单" name="cloudServeManage" v-if="tabs.cloudServeManage"> <vCloudServeManage></vCloudServeManage> </TabPane>
            <TabPane label="数据资源管理" name="dataResourceMange" v-if="tabs.dataResourceMange"> <vDataResourceMange></vDataResourceMange> </TabPane>
            <TabPane label="行业数据订单" name="industryDataManage" v-if="tabs.industryDataManage"> <vIndustryDataManage></vIndustryDataManage> </TabPane>
            <TabPane label="发票申请管理" name="invoiceApplyManage" v-if="tabs.invoiceApplyManage"><vInvoiceApplyManage></vInvoiceApplyManage></TabPane>
            <TabPane label="全景观测分析" name="seaSystem" v-if="tabs.seaSystem"><vSeaSystem></vSeaSystem></TabPane>
            <TabPane label="服务器管理" name="serverManage" v-if="tabs.serverManage"><vServerManage></vServerManage></TabPane>
            <TabPane label="轮播图管理" name="slideshowManage" v-if="tabs.slideshowManage"><vSlideshowManage></vSlideshowManage></TabPane>
            <TabPane label="用户管理" name="userManage" v-if="tabs.userManage"><vUserManage></vUserManage></TabPane>
            <TabPane label="用户工单管理" name="userOrderManage" v-if="tabs.userOrderManage"><vUserOrderManage></vUserOrderManage></TabPane>
        </Tabs>
    </div>
</template>

<script>
    import vCloudServeManage from '../module/cloudServeManage';
    import vDataResourceMange from '../module/dataResourceMange';
    import vIndustryDataManage from '../module/industryDataManage';
    import vInvoiceApplyManage from '../module/invoiceApplyManage';
    import vSeaSystem from '../module/seaSystem';
    import vServerManage from '../module/serverManage';
    import vSlideshowManage from '../module/slideshowManage';
    import vUserManage from '../module/userManage';
    import vUserOrderManage from '../module/userOrderManage';
    export default {
        name: "mtabs",
        data() {
            return {
                currentTab: 'userManage',
                tabs: {
                    cloudServeManage: false,
                    dataResourceMange: false,
                    industryDataManage: false,
                    invoiceApplyManage: false,
                    seaSystem: false,
                    serverManage: false,
                    slideshowManage: false,
                    userManage: false,
                    userOrderManage: false
                },
            };
        },
        components: {
            vCloudServeManage,
            vDataResourceMange,
            vIndustryDataManage,
            vInvoiceApplyManage,
            vSeaSystem,
            vServerManage,
            vSlideshowManage,
            vUserManage,
            vUserOrderManage
        },
        props: {
            activeTab: {
                type: String,
                default() {
                    return ''
                }
            }
        },
        watch: {
            activeTab:{
                immediate: true,
                handler(val) {
                    if (val !== '') {
                        this.tabs[val] = true;
                        this.currentTab = val;
                    }
                }
            }
        },
        mounted() {},
        methods: {
            handleTabRemove(name) {
                this.tabs[name] = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mtabs-container {
        padding-top: 3px;

    }
</style>

<style lang="scss">
    .mtabs-container {

        >.my-ivu-tabs {

            >.ivu-tabs-bar {
                padding-left: 1px;
                margin-bottom: 0;
            }
        }
    }
</style>