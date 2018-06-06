<template>
    <div class="invoiceApplyManage-container">
        <vMenuTitle :menuName="menuName"></vMenuTitle>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "invoiceApplyManage",
        data() {
            return {};
        },
        props: {
            menuName: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        components: {vMenuTitle}
    }
</script>

<style lang="scss" scoped>
    .invoiceApplyManage-container {
    }
</style>