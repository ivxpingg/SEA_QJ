<template>
    <div class="orderInfo-container">
        <div class="merchant-info-wrapper">
            <div class="merchant-info">
                <p><span class="title">购买商品：</span><span>{{productName}}</span></p>
                <p><span class="title">订单号：</span><span :title="orderNum">{{orderNum}}</span></p>
            </div>
            <!--<input type="checkbox" id="order-details-handler">-->
            <div class="merchant-info details">
                <!--<p><span class="title">收款商家：</span><span></span></p>-->
                <p><span class="title">交易时间：</span><span>{{insTime}}</span></p>
            </div>

            <!--<label for="order-details-handler">-->
                <!--<span class="order-details-trigger icon"><i class="br-hack">详情</i></span>-->
            <!--</label>-->
        </div>

        <div class="amount">
            <span class="title">订单总额：</span>
            <span class="money" :title="totalPrice">{{totalPrice}}</span>元
        </div>
    </div>
</template>

<script>
    export default {
        name: "orderInfo",
        data() {
            return {
                orderId: '',

                orderNum: '',
                productName: '',
                totalPrice: '0.00',
                insTime: ''
            };
        },
        created() {
            this.orderId = this.$route.query.orderId || '';
        },
        mounted() {
            this.getOrderDetail();
        },
        methods: {
            getOrderDetail() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/pay',
                    params: {
                        orderId: that.orderId
                    }
                }).then(function (response) {

                    if (response.status === 1) {
                        that.orderNum = response.result.orderNum || '';
                        that.productName = response.result.serverName || '';
                        that.totalPrice = response.result.totalPrice || '0.00';
                        that.insTime = response.result.insTime || '';
                    }
                    else {
                        that.$Message.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .orderInfo-container {
        position: relative;
        padding: 20px 30px;
        background-color: #f9f9f9;
        border-top: #6dca90 solid 3px;
        border-bottom: #dfdfdf dotted 3px;
        color: #878787;

        .merchant-info-wrapper {
            float: left;

            input[type=checkbox] {
                position: absolute;
                left: -9999px;
            }

            #order-details-handler:checked ~ .merchant-info.details {
                opacity: 1;
            }

            .merchant-info.details {
                margin-top: 10px;
                // opacity: 0;
                transition: opacity .5s;
            }

            .merchant-info {
                p {
                    margin-left: 25px;
                    padding-left: 25px;
                    display: inline-block;
                    border-left: #dddddd solid 1px;
                    vertical-align: middle;

                    &:first-child {
                        margin-left: 0;
                        padding-left: 0;
                        border-left: none;
                    }

                    span {
                        display: inline-block;
                        vertical-align: middle;
                        max-width: 400px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }

            }
        }

        .amount {
            float: right;

            .money {
                display: inline-block;
                vertical-align: bottom;
                max-width: 200px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 28px;
                line-height: 28px;
                color: #ff4f01;

                .money {
                    display: inline-block;
                    vertical-align: bottom;
                    max-width: 200px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    font-size: 28px;
                    line-height: 28px;
                    color: #ff4f01;
                }
            }
        }

        .icon {
            font-family: "icon";
            font-size: 16px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -webkit-text-stroke-width: 0.2px;
            -moz-osx-font-smoothing: grayscale;
        }

        .order-details-trigger {
            position: absolute;
            right: 30px;
            top: 50px;
            font-size: 14px;
            color: #6dca90;
            cursor: pointer;
            -ms-user-select: none;
            -moz-user-select: none;
            user-select: none;

            .br-hack {
                display: inline-block;
                vertical-align: middle;
                font-style: normal;
            }
        }
    }
</style>