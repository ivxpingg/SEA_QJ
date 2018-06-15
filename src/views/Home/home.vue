<template>
    <div class="home-container">
        <vHeader class="home-header" :class="{headerBg: headerBg}" @parentIScroll="refreshIScroll"></vHeader>
        <div class="wrapper" id="wrapper">
            <div class="home-scroll">
                <vHSwiper class="home-swiper iscrollP"></vHSwiper>
                <router-view class="iscrollP"></router-view>
                <!--<vContent class="home-content"></vContent>-->
                <vFooter class="home-footer iscrollP"></vFooter>
            </div>
        </div>

    </div>
</template>

<script>
    import vHeader from '../../components/home/header/header';
    import vHSwiper from  '../../components/home/homeSwiper/hSwiper';
    import vContent from '../../components/home/content/content';
    import vFooter from '../../components/home/footer/footer';
    import IScroll from  'iscroll/build/iscroll-probe';
    export default {
        name: "home",
        data() {
            return {
                headerBg: false,

                myScroll: null,

            };
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
                var that = this;

                this.myScroll = new IScroll('#wrapper', {
                    mouseWheel: true,
                    probeType: 2,
                    keyBindings: {
                        pageUp: 33,
                        pageDown: 34,
                        end: 35,
                        home: 36,
                        left: 37,
                        up: 38,
                        right: 39,
                        down: 40
                    }
                    // snap: '.iscrollP'
                });

                this.myScroll.on('scroll', function () {
                   if (this.y < -60 || this.y > 5) {
                       that.headerBg = true;
                   }
                   else {
                       that.headerBg = false;
                   }
                });
                this.myScroll.on('scrollEnd', function () {
                    if (this.y < -60 || this.y > 5) {
                        that.headerBg = true;
                    }
                    else {
                        that.headerBg = false;
                    }
                });

            },
            refreshIScroll(name) {
                var that = this;
                setTimeout(function(){
                    that.myScroll.refresh();
                }, 100);

                if (name === '/home/index') {
                    this.myScroll.scrollTo(0, 0, 300);
                    this.headerBg = false;
                }
                else if(name === '/home/mapShow') {
                    this.myScroll.scrollTo(0, 0, 300);
                    this.headerBg = false;
                }
                else {
                    this.myScroll.scrollTo(0, -556,300);
                    this.headerBg = true;
                }

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
            /*position: absolute;*/
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 99;

            &.headerBg {
                background-color: rgba(0,0,0,0.8);
            }
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