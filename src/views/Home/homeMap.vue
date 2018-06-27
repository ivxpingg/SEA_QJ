<template>
    <div class="homeMap-container">
        <vHeader class="home-header headerBg"
                 @parentIScroll="refreshIScroll"></vHeader>
        <vMapShow class="vMapShow"></vMapShow>
    </div>
</template>

<script>
    import vHeader from '../../components/home/header/header';
    import vMapShow from '../../components/home/content/mapShow';
    export default {
        name: "homeMap",
        data() {
            return {};
        },
        components: {vHeader, vMapShow},
        methods:{
            refreshIScroll(name) {}
        }
    }
</script>

<style lang="scss" scoped>
    .homeMap-container {
        height: 100%;
        .home-header {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 99;
            &.headerBg {
                background-color: rgba(0,0,0,0.8);
            }
        }

        .vMapShow {
            height: 100%;
            padding-top: 64px;
        }
    }
</style>