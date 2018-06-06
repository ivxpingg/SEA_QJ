<template>
    <div class="seaSystem-container">
        <vMenuTitle :menuName="menuName"></vMenuTitle>
    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "seaSystem",
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
    .seaSystem-container {
    }
</style>