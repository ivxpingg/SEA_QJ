<template>
    <div class="home-container">

        <div class="wrapper" id="wrapper">
            <div class="home-scroll">
                <vHeader class="home-header"></vHeader>
                <vHSwiper class="home-swiper"></vHSwiper>
                <vContent class="home-content"></vContent>
                <vFooter class="home-footer"></vFooter>
            </div>
        </div>
    </div>
</template>

<script>
    import vHeader from '../../components/home/header/header';
    import vHSwiper from  '../../components/home/homeSwiper/hSwiper';
    import vContent from '../../components/home/content/content';
    import vFooter from '../../components/home/footer/footer';
    import IScroll from  'iscroll';
    export default {
        name: "home",
        data() {
            return {};
        },
        components: {vHeader, vFooter, vContent, vHSwiper},
        mounted() {
            var that = this;
            setTimeout(function() {
                that.initIscroll();
            },0)
        },
        methods: {
            initIscroll() {
                var myScroll = new IScroll('#wrapper', {
                    mouseWheel: true
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .home-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .home-header {
            position: absolute;
            top: 0;
            width: 100%;
            z-index: 9999;
        }

        .wrapper {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            .home-scroll {
                position: relative;


                .home-swiper {
                }

                .home-content {}
            }
        }

    }
</style>