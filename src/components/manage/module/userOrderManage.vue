<template>
    <div class="userOrderManage-container">
        <vMenuTitle :menuName="menuName"></vMenuTitle>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "userOrderManage",
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
    .userOrderManage-container {
    }
</style>