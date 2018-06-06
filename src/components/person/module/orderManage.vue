<template>
    <div class="orderManage-container">
        <vMenuTitle name="订单管理"></vMenuTitle>
        <div class="content-panel">
            <Tabs type="card">
                <TabPane label="购买订单">

                </TabPane>
                <TabPane label="申请订单">标签二的内容</TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "orderManage",
        data() {
            return {};
        },
        components: {vMenuTitle}
    }
</script>

<style lang="scss" scoped>
    .orderManage-container {

        .content-panel {
            margin-top: 23px;
        }
    }
</style>