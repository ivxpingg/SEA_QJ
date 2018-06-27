<template>
    <div class="mapShow-container">
        <vGis :edit="false"></vGis>
    </div>
</template>

<script>
    import vGis from '../../manage/module/gis/gis';
    export default {
        name: "mapShow",
        data() {
            return {};
        },
        components: {vGis},
    }
</script>

<style lang="scss" scoped>
    .mapShow-container {
        height: 100%;
    }
</style>