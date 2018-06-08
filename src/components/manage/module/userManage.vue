<template>
    <div class="userManage-container">
        <!--<vMenuTitle :menuName="menuName"></vMenuTitle>-->
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "userManage",
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
    .userManage-container {
    }
</style>