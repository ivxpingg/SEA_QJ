<template>
    <div class="cashierDesk-container">
        <vHeader></vHeader>
        <div class="container clearfix">
            <vOrderInfo class="clearfix"></vOrderInfo>

            <div class="col-box">
                <div class="col col-left">
                    <vBankPay></vBankPay>
                </div>
                <div class="col col-right">
                    <vQrcodePay></vQrcodePay>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vHeader from '../../components/payment/header/header';
    import vOrderInfo from '../../components/payment/module/orderInfo';
    import vBankPay from '../../components/payment/module/bankPay';
    import vQrcodePay from '../../components/payment/module/qrcodePay';
    export default {
        name: "cashierDesk",
        data() {
            return {};
        },
        components: {vHeader, vOrderInfo, vBankPay, vQrcodePay}
    }
</script>

<style lang="scss" scoped>
    .cashierDesk-container {
        min-height: calc(100% - 100px);
        background-color: #e4e4e4;
        font-size: 14px;
        line-height: 18px;
        cursor: default;
        .container {
            margin: 0 auto;
            margin-top: 10px;
            min-height: 550px;
            position: relative;
            width: 1170px;
            background-color: #ffffff;
            border-bottom: #ffffff solid 1px;
            box-shadow: #d5d4d4 1px 1px 10px 3px;
        }

        .col-box {
            margin: 0 auto;
            position: relative;

            .col {
                display: inline-block;

                &.col-left {
                    width: 882px;
                    border-right: 1px solid #e8e8e8;
                }

                &.col-right {
                    position: absolute;
                    top: 0;
                    width: 285px;
                }
            }
        }
    }
</style>