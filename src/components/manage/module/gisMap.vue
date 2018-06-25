<template>
    <div class="gisMap-container">
        <vHeader class="p-header"></vHeader>
        <vGis :edit="true"></vGis>
    </div>
</template>

<script>
    import vHeader from '../header/p-header';
    import vGis from './gis/gis';
    export default {
        name: "gisMap",
        data() {
            return {};
        },

        components: {vHeader, vGis},
    }
</script>

<style lang="scss" scoped>
    .gisMap-container {
        position: relative;
    }
</style>