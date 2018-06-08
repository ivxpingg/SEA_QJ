<template>
    <div class="dataResourceMange-container">
        <!--<vMenuTitle :menuName="menuName"></vMenuTitle>-->
    </div>
</template>

<script>
    // import vMenuTitle from './menuTitle/menuTitle';
    export default {
        name: "dataResourceMange",
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
        components: {}
    }
</script>

<style lang="scss" scoped>
    .dataResourceMange-container {
    }
</style>