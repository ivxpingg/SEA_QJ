<template>
    <div class="cloudServeManage-container">
        <vMenuTitle :menuName="menuName"></vMenuTitle>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "cloudServeManage",
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
    .cloudServeManage-container {
    }
</style>