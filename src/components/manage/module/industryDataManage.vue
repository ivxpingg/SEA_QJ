<template>
    <div class="industryDataManage-container">
        <vMenuTitle :menuName="menuName"></vMenuTitle>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "industryDataManage",
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
    .industryDataManage-container {
    }
</style>