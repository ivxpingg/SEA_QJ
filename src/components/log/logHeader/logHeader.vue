<template>
    <div class="logHeader-container">
        <div class="header-inner">
            <h2 class="logo-title"></h2>

        </div>
    </div>
</template>

<script>
    export default {
        name: "logHeader",
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .logHeader-container {
        position: relative;
        height: 82px;
        transition: all 1s;
        background: url('./images/header-bg.png') no-repeat center center;
        background-size: 100% auto;
        border-bottom: 0px solid #bbc1ce;

        .header-inner {
            margin: 0 20px;
            /*width: 1200px;*/
            height: 100%;

            .logo-title {
                display: inline-block;
                float: left;
                padding-left: 68px;
                width: 820px;
                height: 100%;
                color: #FFF;
                background: url('./images/logo-title.png') no-repeat left center;
                cursor: pointer;
            }
        }


    }
</style>