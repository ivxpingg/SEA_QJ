<template>
    <div class="cash-header-container">
        <div class="top-wrapper clearfix">
            <div class="logo">
                <!--<img src="/customizedPc/assets/images/logo.png" alt="易宝支付">-->
                <span class="sign">收银台</span></div>
            <div class="service-phone">
                <!--7X24小时客服电话：4001-500-800-->
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cash-header",
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .cash-header-container {
        height: 71px;
        background-color: #ffffff;
        border-bottom: #dadada solid 1px;
        overflow: hidden;

        .top-wrapper{
            margin: 0 auto;
            width: 1170px;

            .logo {
                float: left;
                margin-top: 16px;

                img {
                    vertical-align: middle;
                    height: 38px;
                }
                .sign {
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 22px;
                    padding: 5px 22px;
                    border-left: #d4d4d4 solid 1px;
                    font-size: 20px;
                    line-height: 18px;
                    color: #4c4948;
                }
            }

            .service-phone {
                float: right;
                max-width: 720px;
                margin-top: 40px;
                color: #6dca90;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
</style>