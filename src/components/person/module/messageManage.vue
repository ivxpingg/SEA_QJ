<template>
    <div class="messageManage-container">
        <vMenuTitle name="消息通知"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">

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
        name: "messageManage",
        data() {
            return {};
        },
        components: {vMenuTitle}
    }
</script>

<style lang="scss" scoped>
    .messageManage-container {
        .content-panel {
            margin-top: 23px;
            .handle-bar {
                padding: 17px 11px 20px 11px;
                border: 1px solid #e1e1e1;
                overflow: hidden;
            }
        }
    }
</style>