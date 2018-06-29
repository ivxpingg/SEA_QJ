<template>
    <div class="bankPay-container">
        <h2 class="tool-handler icon">网银支付<span class="tip">/需提前开通网银</span></h2>

        <Tabs class="tabs"
              :animated="false"
              @on-click="onClick_tabs"
              v-model="cardInfo.type">
            <TabPane label="个人支付" name="B2C">
                <ul class="bank-list">
                    <li v-for="item in b2cBanksList"
                        :class="{'active': item.bankCode === cardInfo.cardCode && cardInfo.type === 'B2C'}"
                        @click="onClick_b2c(item)">
                        <span class="back-logo" :class="item.bankCode"></span>
                        {{item.bankName}}
                        <p class="card-type"><span>{{getCardTypeName(item.cardType)}}</span></p>
                    </li>
                </ul>
            </TabPane>
            <TabPane label="企业支付" name="B2B">
                <ul class="bank-list">
                    <li v-for="item in b2bBanksList"
                        :class="{'active': item.bankCode === cardInfo.cardCode && cardInfo.type === 'B2B'}"
                        @click="onClick_b2c(item)">
                        <span class="back-logo" :class="item.bankCode"></span>
                        {{item.bankName}}
                        <p class="card-type"><span>{{getCardTypeName(item)}}</span></p>
                    </li>
                </ul>
            </TabPane>
        </Tabs>

        <div class="btn-panel">
            <Button type="success"
                    size="large"
                    style="width: 170px; height: 46px;"
                    :disabled="cardInfo.cardCode === ''"
                    @click="onClick_next" >下一步</Button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "bankPay",
        data() {
            return {
                // 个人卡
                b2cBanksList: [
                    {
                        "bankCode": "ICBC",
                        "bankName": "工商银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "ABC",
                        "bankName": "农业银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "CMBCHINA",
                        "bankName": "招商银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "CCB",
                        "bankName": "建设银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "GDB",
                        "bankName": "广发银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "BOC",
                        "bankName": "中国银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "SZPA",
                        "bankName": "平安银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "SPDB",
                        "bankName": "浦发银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "CEB",
                        "bankName": "光大银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "ECITIC",
                        "bankName": "中信银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "SHB",
                        "bankName": "上海银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "PSBC",
                        "bankName": "邮储银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "BCCB",
                        "bankName": "北京银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "SDB",
                        "bankName": "深发银行",
                        "cardType": "ONLOAN",
                        "needClient": false
                    },
                    {
                        "bankCode": "CMBC",
                        "bankName": "民生银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "BOCO",
                        "bankName": "交通银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "CIB",
                        "bankName": "兴业银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    }
                ],
                // 企业卡
                b2bBanksList: [
                    {
                        "bankCode": "HXB",
                        "bankName": "华夏银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "CIB",
                        "bankName": "兴业银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "BOC",
                        "bankName": "中国银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "ABC",
                        "bankName": "农业银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "CMBCHINA",
                        "bankName": "招商银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "CEB",
                        "bankName": "光大银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "SDB",
                        "bankName": "深发银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankAccountType": "B2B",
                        "bankCode": "SPDB",
                        "bankName": "浦发银行",
                        "cardType": "ONLYBY",
                        "needClient": true
                    },
                    {
                        "bankAccountType": "B2B",
                        "bankCode": "CMBC",
                        "bankName": "民生银行",
                        "cardType": "ONLYBY",
                        "needClient": true
                    },
                    {
                        "bankCode": "ECITIC",
                        "bankName": "中信银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "SZPA",
                        "bankName": "平安银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankAccountType": "B2B",
                        "bankCode": "BOCO",
                        "bankName": "交通银行",
                        "cardType": "ONLYBY",
                        "needClient": true
                    },
                    {
                        "bankCode": "GDB",
                        "bankName": "广发银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "ICBC",
                        "bankName": "工商银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    },
                    {
                        "bankCode": "CCB",
                        "bankName": "建设银行",
                        "cardType": "ONLYBY",
                        "needClient": false
                    }
                ],

                cardInfo: {
                    cardType: '',
                    cardCode: '',
                    type: 'B2C'
                },

                orderId: ''
            };
        },
        created() {
            this.orderId = this.$route.query.orderId || ''; // 0f1cf85e28f545efb1071e80d52ef2a2
        },
        methods: {
            getCardTypeName(type) {
                switch (type) {
                    case 'ONLOAN': return '储蓄卡';
                    case 'ONLYBY': return '信用卡';
                }
            },
            onClick_tabs(name) {
                this.cardInfo.cardType = '';
                this.cardInfo.cardCode = '';
            },

            onClick_b2c(card) {
                this.cardInfo.cardCode = card.bankCode;
                this.cardInfo.cardType = card.cardType;
            },

            onClick_next() {
                var that = this;
                that.$Spin.show();
                that.$http({
                    method: 'get',
                    url: '/panoramic/serverOrder/toPayment',
                    params: {
                        orderId: that.orderId,
                        directPayType: that.cardInfo.cardCode + '_' + that.cardInfo.type,
                        // cardType: that.cardInfo.cardType,
                        userId: that.$store.state.uid
                    }
                }).then(function (response) {

                    if (response.status === 1) {

                        window.location.href = response.result.payUrl;
                    }
                    else {
                        that.$Spin.hide();
                        that.$Message.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.$Spin.hide();
                });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .bankPay-container {
        .tool-handler {
            padding: 0 30px;
            line-height: 56px;
            background-color: #f9f9f9;
            background: 0 0;
            height: auto;
            filter: none;
            border-top: none;
            font-size: 24px;
            color: #494949;
            cursor: default;

            .tip {
                padding-left: 15px;
                font-size: 14px;
                color: #909090;
            }
        }

        .btn-panel {
            padding-left: 30px;
            padding-bottom: 60px;
        }

        .tabs {
            margin-left: 30px;

            .bank-list {
                margin-top: 20px;
                list-style-type: none;
                padding: 0;

                li {
                    position: relative;
                    float: left;
                    margin-bottom: 20px;
                    margin-right: 30px;
                    width: 170px;
                    height: 46px;
                    box-sizing: border-box;
                    line-height: 46px;
                    border: #e2e2e2 solid 1px;
                    text-align: center;
                    font-weight: bold;
                    cursor: pointer;

                    &:hover {
                        border-color: #6dca90;

                        .card-type {
                            display: block;
                        }
                    }

                    &.active {
                        border-color: #6dca90;
                        border-width: 2px;

                        &:before {
                            position: absolute;
                            content: " ";
                            right: 0;
                            bottom: 0;
                            width: 0;
                            height: 0;
                            border-width: 12px;
                            border-style: solid;
                            border-color: transparent #6dca90 #6dca90 transparent;
                            display: block;
                            z-index: 1;
                        }

                        &:after {
                            position: absolute;
                            right: 2px;
                            bottom: -2px;
                            content: "\F3FD";
                            font-size: 18px;
                            display: inline-block;
                            font-family: Ionicons;
                            speak: none;
                            color: #fff;
                            font-style: normal;
                            font-weight: 400;
                            font-variant: normal;
                            text-transform: none;
                            text-rendering: auto;
                            line-height: 1;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            z-index: 2;
                        }
                    }

                    .back-logo {
                        margin-right: 10px;
                        display: inline-block;
                        vertical-align: middle;
                        width: 26px;
                        height: 26px;
                        background-image: url(./images/bank-logo.png);
                        background-repeat: no-repeat;
                    }
                    .CMBCHINA {
                        /*招商银行*/
                        background-position: 0 0;
                    }

                    .ABC {
                        /*农业银行*/
                        background-position: 0 -56px;
                    }

                    .CCB {
                        /*建设银行*/
                        background-position: 0 -112px;
                    }

                    .ICBC {
                        /*工商银行*/
                        background-position: 0 -168px;
                    }

                    .BOC {
                        /*中国银行*/
                        background-position: 0 -224px;
                    }

                    .BOCO {
                        /*交通银行*/
                        background-position: 0 -278px;
                    }

                    .CMBC {
                        /*中国民生银行*/
                        background-position: 0 -336px;
                    }

                    .CIB {
                        /*兴业银行*/
                        background-position: 0 -391px;
                    }

                    .CEB {
                        /*光大银行*/
                        background-position: 0 -447px;
                    }

                    .ECITIC {
                        /*中信银行*/
                        background-position: 0 -504px;
                    }

                    .PSBC {
                        /*中国邮政*/
                        background-position: 0 -560px;
                    }

                    .BCCB {
                        /*北京银行*/
                        background-position: 0 -616px;
                    }

                    .GDB {
                        /*广发银行*/
                        background-position: 0 -672px;
                    }

                    .SDB {
                        /*深圳发展银行*/
                        background-position: 0 -727px;
                    }

                    .SPDB {
                        /*上海浦东发展银行*/
                        background-position: 0 -783px;
                    }

                    .HX, .HXB {
                        /*华夏银行*/
                        background-position: 0 -840px;
                    }

                    .SHB {
                        /*上海银行*/
                        background-position: 0 -895px;
                    }

                    .SZPA {
                        /*平安银行*/
                        background-position: 0 -952px;
                    }

                    .NBCB {
                        /*宁波银行*/
                        background-position: 0 -1008px;
                    }

                    .BJRCB {
                        /*北京农村商业银行*/
                        background-position: 0 -1064px;
                    }

                    .BOCD {
                        /*成都银行*/
                        background-position: 0 -1120px;
                    }

                    .CZ {
                        /*浙商银行*/
                        background-position: 0 -1176px;
                    }

                    .ZJRCU {
                        /*顺德信用社*/
                        background-position: 0 -1232px;
                    }

                    .JZBANK {
                        /*锦州银行*/
                        background-position: 0 -1288px;
                    }

                    .HFB {
                        /*恒丰银行*/
                        background-position: 0 -1344px;
                    }

                    .ZJTLCB {
                        /*浙江泰隆商业银行*/
                        background-position: 0 -1399px;
                    }

                    .CBHB {
                        /*渤海银行*/
                        background-position: 0 -1456px;
                    }

                    .HKBEA {
                        /*东亚银行*/
                        background-position: 0 -1512px;
                    }

                    .GDRCU {
                        /*广东农村信用社*/
                        background-position: 0 -1568px;
                    }

                    .GZCB {
                        /*广州市商业银行*/
                        background-position: 0 -1624px;
                    }

                    .NCB {
                        /*南洋商业银行*/
                        background-position: 0 -1680px;
                    }

                    .HEBBANK {
                        /*河北银行*/
                        background-position: 0 -1736px;
                    }

                    .HZB {
                        /*杭州银行*/
                        background-position: 0 -1793px;
                    }

                    .NJCB {
                        /*南京银行*/
                        background-position: 0 -1848px;
                    }

                    .SRCB {
                        /*上海农村商业银行*/
                        background-position: 0 -1904px;
                    }

                    .JSBC {
                        /*江苏银行*/
                        background-position: 0 -1960px;
                    }

                    .HZCCB {
                        /*湖州银行*/
                        background-position: 0 -2016px;
                    }

                    .QHD {
                        /*秦皇岛银行*/
                        background-position: 0 -2072px;
                    }

                    .HRB {
                        /*哈尔滨银行*/
                        background-position: 0 -2128px;
                    }

                    .CJCCB {
                        /*江苏长江银行*/
                        background-position: 0 -2184px;
                    }

                    .ORDOSB {
                        /*鄂尔多斯银行*/
                        background-position: 0 -2240px;
                    }

                    .GDNY {
                        /*广东南粤银行*/
                        background-position: 0 -2296px;
                    }

                    .BGZ {
                        /*贵州银行*/
                        background-position: 0 -2352px;
                    }

                    .CDRCB {
                        /*成都农商银行*/
                        background-position: 0 -2408px;
                    }

                    .TJB {
                        /*天津银行*/
                        background-position: 0 -2463px;
                    }

                    .DLB {
                        /*大连银行*/
                        background-position: 0 -2520px;
                    }

                    .SRB {
                        /*上饶银行*/
                        background-position: 0 -2576px;
                    }

                    .BSB {
                        /*包商银行*/
                        background-position: 0 -2632px;
                    }

                    .GZCB {
                        /*广州银行*/
                        background-position: 0 -2688px;
                    }

                    .CQRCB {
                        /*重庆农村商业银行*/
                        background-position: 0 -2744px;
                    }

                    .SJB {
                        /*盛京银行*/
                        background-position: 0 -2780px;
                    }

                    .SQBANK {
                        /*商丘市商业银行*/
                        background-position: 0 -2856px;
                    }

                    .UCCB {
                        /*乌鲁木齐市商业银行*/
                        background-position: 0 -2912px;
                    }

                    .YDHSH {
                        /*尧都农村商业银行*/
                        background-position: 0 -2968px;
                    }

                    .HKBC {
                        /*汉口银行*/
                        background-position: 0 -3024px;
                    }

                    .JRCB {
                        /*江苏江阴农村商业银行*/
                        background-position: 0 -3080px;
                    }

                    .KSRCB {
                        /*昆山农商银行*/
                        background-position: 0 -3135px;
                    }

                    .GSRCU {
                        /*甘肃省农村信用社*/
                        background-position: 0 -3242px;
                    }

                    .QHRCU {
                        /*青海省农村信用社*/
                        background-position: 0 -3242px;
                    }

                    .WEBANK {
                        /*微众银行*/
                        background-position: 0 -3188px;
                    }

                    .TRCB {
                        /*天津农商银行*/
                        background-position: 0 -3354px;
                    }

                    .CZRCB {
                        /*江南农村商业银行*/
                        background-position: 0 -3410px;
                    }

                    .HENRCU {
                        /*河南省农村信用社*/
                        background-position: 0 -3460px;
                    }

                    .LNRCU {
                        /*辽宁省农村信用社*/
                        background-position: 0 -3506px;
                    }

                    .URB {
                        /*联合村镇*/
                        background-position: 0 -3559px;
                    }

                    .JSRCU {
                        /*江苏省农村信用社*/
                        background-position: 0 -3616px;
                    }

                    .SCRCU,.SHXRCU {
                        /*四川省农村信用社*/
                        background-position: 0 -3672px;
                    }

                    .HUNRCU {
                        /*湖南省农村信用社*/
                        background-position: 0 -3727px;
                    }

                    .NXRCB {
                        /*黄河农商银行*/
                        background-position: 0 -3772px;
                    }

                    .WHB {
                        /*乌海银行*/
                        background-position: 0 -3829px;
                    }

                    .XJHHB {
                        /*汇合银行*/
                        background-position: 0 -3884px;
                    }

                    .RHCZBC {
                        /*长子县融汇村镇银行*/
                        background-position: 0 -3939px;
                    }

                    .FJRCU {
                        /*福建农村信用社*/
                        background-position: 0 -1232px;
                    }
                    .SCB {
                        /*渣打银行*/
                        background-position: 0 -3995px;
                    }
                    .HEBRCU {
                        /*河北省农村信用联合社*/
                        background-position: 0 -1232px;
                    }

                    .card-type {
                        display: none;
                        position: absolute;
                        left: -1px;
                        bottom: -22px;
                        width: 170px;
                        height: 20px;
                        line-height: 20px;
                        background-color: #f8f8f8;
                        font-weight: 100;
                        font-size: 12px;
                        color: #626262;
                    }
                }
            }
        }
    }
</style>