<template>
    <div class="serverManage-container">
        <!--<vMenuTitle :menuName="menuName"></vMenuTitle>-->
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "serverManage",
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
    .serverManage-container {
    }
</style>