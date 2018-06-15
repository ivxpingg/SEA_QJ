<template>
    <div class="hSwiper-container" id="hSwiper">
        <div class="swiper-container" ref='hswiper'>
            <div class="swiper-wrapper">
                <div class="swiper-slide swiper-slide-1">
                    <div class="slide-panel slide-panel-1">

                        <div class="slide-info">
                            <div class="title">行业数据开放!</div>
                            <div class="desc">
                                XXX区水质数据 XXX区水质数据 XXX区水质数据
                            </div>
                            <div class="btn-panel">
                                <Button>立即申请</Button>
                            </div>
                        </div>

                        <div class="adorn">
                            <img src="./images/sw-slide-1.png" alt="">
                        </div>

                    </div>
                </div>
                <div class="swiper-slide swiper-slide-2">

                    <div class="slide-panel slide-panel-2">
                        <div class="slide-info">
                            <div class="title">服务器开放免费申请通道!</div>
                            <div class="btn-panel">
                                <Button>立即申请</Button>
                            </div>
                        </div>

                        <div class="adorn">
                            <img src="./images/sw-slide-2.png" alt="">
                        </div>

                    </div>
                </div>

                <div v-for="item in sliderListData" class="swiper-slide"
                     :style="{
                                backgroundImage: 'url(' + imgUrl_domain + item.pictureUrl +')',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center'
                             }">
                    <div class="slide-panel"></div>

                </div>

            </div>


            <!-- 如果需要分页器 -->
            <div class="swiper-pagination"></div>

        </div>
    </div>
</template>

<script>
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.min.css';
    import Config from '../../../libs/appConfig/config';
    export default {
        name: "hSwiper",
        data() {
            return {
                mySwiper: null,
                sliderListData: [],
                imgUrl_domain:
                // window.location.origin +
                'http://110.86.21.246:8088' + Config[Config.env].imgUrl
            };
        },
        mounted() {
            this.getData_slideshow();


        },
        methods: {
            initSwiper() {
                this.mySwiper = new Swiper (this.$refs.hswiper, {
                    direction: 'horizontal',
                    loop: true,

                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                    }
                })
            },

            getData_slideshow() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/banner/queryListForHomePage'
                }).then(function (response) {
                    if (response.status === 1) {
                        that.sliderListData = response.result;

                        setTimeout(function () {
                            that.initSwiper();
                        }, 200)
                    }

                }).catch(function (e) {
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .hSwiper-container {
        height: 620px;
        background-color: #0086b3;

        .swiper-container {
            height: 620px;

            .swiper-slide {

                &.swiper-slide-1 {
                    background: url('./images/slide-bg-1.png') no-repeat center;
                }

                &.swiper-slide-2 {
                    background: url('./images/slide-bg-2.png') no-repeat center;
                }
                .slide-panel {
                    position: relative;
                    margin: 0 auto;
                    height: 100%;
                    width: 1200px;

                    .slide-info {
                        position: absolute;
                        top: 189px;
                        left: 18px;
                        color: #FFF;
                        .title {
                            font-size: 56px;
                            line-height: 86px;
                        }
                        .desc {
                            font-size: 20px;
                            line-height: 30px;
                        }
                        .btn-panel {
                            margin-top: 25px;
                            .ivu-btn {
                                color: #FFF;
                                background-color: transparent;
                            }
                        }
                    }

                    &.slide-panel-1 {
                        .adorn {
                            position: absolute;
                            right: 0;
                            bottom: 87px;
                        }
                    }
                    &.slide-panel-2 {
                        .adorn {
                            position: absolute;
                            right: -210px;
                            bottom: 87px;
                        }
                    }
                }
            }
        }
    }
</style>