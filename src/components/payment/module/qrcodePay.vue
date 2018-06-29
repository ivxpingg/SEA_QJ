<template>
    <div class="qrcodePay-container">
        <div class="qrcode">

            <div class="tip">
                <div class="text">
                    <Icon type="qr-scanner"></Icon>
                    <span>{{tipMsg}}</span>
                </div>
            </div>

            <div class="qrcode-item-wrapper">
                <!--<img class="img"-->
                     <!--:src="imgSrc"-->
                     <!--v-show="showQrcode"-->
                     <!--alt="二维码">-->
                <img class="img"
                     src="./images/qr-code-img.png"
                     alt="二维码">
                <div v-show="!showQrcode" class="btn-qr">
                    <Button type="success"
                            icon="ios-refresh-outline"
                            size="large"
                            style="width: 170px"
                            @click="onClick_getQR">获取二维码</Button>
                </div>

                <div v-show="showQrcode" class="btn-qr">
                    <Button type="success"
                            icon="ios-refresh-outline"
                            size="large"
                            style="width: 170px"
                            @click="onClick_getQR">刷新获取二维码</Button>
                </div>
            </div>

            <div class="support-app">
                <i class="icon iconfont icon-weixinzhifu"
                   @click="onClick_qrcode('WECHAT')"
                   :class="{'active': qrcodeType === 'WECHAT'}"></i>
                <i class="icon iconfont icon-zhifubao"
                   @click="onClick_qrcode('ALIPAY')"
                   :class="{'active': qrcodeType === 'ALIPAY'}"></i>
                <!--<i class="icon iconfont icon-yinlian1193427easyiconnet"-->
                   <!--@click="onClick_qrcode('yinlian')"-->
                   <!--:class="{'active': qrcodeType === 'yinlian'}"></i>-->
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "qrcodePay",
        data() {
            return {
                qrcodeType: 'WECHAT',
                qrcodeApp: [
                    {
                        type: 'WECHAT',
                        tip: '打开微信扫一扫直接付款'
                    },
                    {
                        type: 'ALIPAY',
                        tip: '打开支付宝扫一扫直接付款'
                    },
                    {
                        type: 'yinlian',
                        tip: '打开银联钱包扫一扫直接付款'
                    }
                ],

                orderId: '',
                orderInfo: {},

                qrcodeUrl: {
                    WECHAT: '',
                    ALIPAY: '',
                    yinlian: ''
                },

                showQrcode: false
            };
        },
        created() {
            this.orderId = this.$route.query.orderId || ''; // 0f1cf85e28f545efb1071e80d52ef2a2
        },
        computed: {
            imgSrc() {
                return this.qrcodeUrl[this.qrcodeType];
            },
            tipMsg() {
                for(var i = 0; i < this.qrcodeApp.length; i++ ) {
                    if (this.qrcodeApp[i].type === this.qrcodeType) {
                        return this.qrcodeApp[i].tip;
                    }
                }
                return '';
            }
        },
        watch: {
            qrcodeType() {
                this.onClick_getQR();
            }
        },
        methods: {
            // 获取二维码
            onClick_getQR() {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/toPayment',
                    params: {
                        orderId: that.orderId,
                        directPayType: that.qrcodeType,
                        userId: that.$store.state.uid
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.qrcodeUrl[that.qrcodeType] = response.result.payUrl;
                        that.showQrcode = true;
                    }
                    else {}
                }).catch(function (e) {
                    
                })
            },

            // 切换支付
            onClick_qrcode(type) {
                if (this.qrcodeUrl[this.qrcodeType] !== '') {
                    this.showQrcode = true;
                }
                this.qrcodeType = type;

            },

            getOrderInfo() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .qrcodePay-container {

        .qrcode {
            width: 260px;
            margin: 30px auto 0;
            position: relative;
            overflow: hidden;
            .tip {
                margin-bottom: 30px;
                text-align: center;

                .text {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 14px;
                    line-height: 24px;
                    height: 24px;
                    .ivu-icon {
                        float: left;
                        font-size: 24px;
                        color: #6dca90;
                    }
                    span {
                        padding-left: 8px;
                        float: left;
                    }
                }
            }

            .support-app {
                text-align: center;

                .icon {
                    margin: 0 5px;
                    font-size: 26px;
                    cursor: pointer;
                    opacity: 0.8;

                    &.icon-weixinzhifu {
                        color: #27b43c;
                    }

                    &.icon-zhifubao{
                        color: #009fe8;
                    }

                    &.icon-yinlian1193427easyiconnet {
                        color: rgb(0,80,142);
                        font-size: 32px;
                    }


                    &:hover {
                        opacity: 1;
                        /*font-size: 40px;*/
                        /*&.icon-yinlian1193427easyiconnet {*/
                            /*font-size: 45px;*/
                        /*}*/
                    }

                    &.active {
                        opacity: 1;
                        font-size: 40px;
                        &.icon-yinlian1193427easyiconnet {
                            font-size: 45px;
                        }
                    }
                }
            }

            .qrcode-item-wrapper {
                padding: 30px 0;
                min-height: 216px;

                .img {
                    margin: 0 auto 20px;
                    display: block;
                    width: 130px;
                    height: auto;

                }
                .btn-qr {
                    text-align: center;
                }
            }


        }
    }
</style>