<template>
    <div class="cloudServiceManage-container">
        <vMenuTitle name="云服务"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd">
                    <Button type="default">删除</Button>
                </div>
            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count" @on-change="onPageNo_change"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "cloudServiceManage",
        data() {
            return {};
        },
        components: {vMenuTitle}
    }
</script>

<style lang="scss" scoped>
    .cloudServiceManage-container {
    }
</style>