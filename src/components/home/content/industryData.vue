<template>
    <div class="industryData-container">
        <div class="industryData-inner">
            <div class="industry-title">行业数据申请 · 所有类别</div>
            <div class="sub-title">
                <span>生物</span>
                <span>水质</span>
                <span>科研</span>
            </div>

            <div class="list-panel">

                <div class="item">
                    <div class="img"></div>
                    <div class="info-panel">
                        <div class="title">台湾海峡海洋生物数据</div>
                        <div class="attr">数据数量: <span>10000</span>条</div>
                        <div class="attr">数据时效: <span>2018年1月1日-2018年5月5日</span></div>
                        <div class="attr">数据格式: <span>EXCEL</span></div>
                        <div class="attr">数据内容: <span>名称、分布、描述、数量</span></div>
                    </div>
                    <div class="apply-panel">
                        <div class="num">申请数: <span>999</span></div>
                    </div>
                    <div class="btn-panel">
                        <Button size="large" style="width: 150px">免费申请</Button>
                    </div>
                </div>

                <div class="item">
                    <div class="img"></div>
                    <div class="info-panel">
                        <div class="title">台湾海峡海洋生物数据</div>
                        <div class="attr">数据数量: <span>10000</span>条</div>
                        <div class="attr">数据时效: <span>2018年1月1日-2018年5月5日</span></div>
                        <div class="attr">数据格式: <span>EXCEL</span></div>
                        <div class="attr">数据内容: <span>名称、分布、描述、数量</span></div>
                    </div>
                    <div class="apply-panel">
                        <div class="num">申请数: <span>999</span></div>
                    </div>
                    <div class="btn-panel">
                        <Button size="large" style="width: 150px">免费申请</Button>
                    </div>
                </div>

                <div class="item">
                    <div class="img"></div>
                    <div class="info-panel">
                        <div class="title">台湾海峡海洋生物数据</div>
                        <div class="attr">数据数量: <span>10000</span>条</div>
                        <div class="attr">数据时效: <span>2018年1月1日-2018年5月5日</span></div>
                        <div class="attr">数据格式: <span>EXCEL</span></div>
                        <div class="attr">数据内容: <span>名称、分布、描述、数量</span></div>
                    </div>
                    <div class="apply-panel">
                        <div class="num">申请数: <span>999</span></div>
                    </div>
                    <div class="btn-panel">
                        <Button size="large" style="width: 150px">免费申请</Button>
                    </div>
                </div>

            </div>
            <div class="list-page-panel">
                <Page :total="100"></Page>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "industryData",
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .industryData-container {
        .industryData-inner {
            margin: 0 auto;
            width: 1200px;

            .industry-title {
                padding-top: 75px;
                color: #323232;
                font-size: 33px;
                line-height: 33px;
                text-align: center;
            }
            .sub-title {
                padding-top: 35px;
                padding-bottom: 60px;
                color: #808080;
                font-size: 18px;
                line-height: 18px;
                text-align: center;

                span {
                    position: relative;
                    padding: 0 25px;
                    &:after {
                        position: absolute;
                        content: " ";
                        width: 1px;
                        height: 18px;
                        top: 3px;
                        right: 0;
                        background-color: #727171;
                        border-width: 0 0 0 1px;
                        border-style: solid;
                        border-color: #727171;
                    }

                    &:last-child {
                        &:after {
                            display: none;
                        }
                    }
                }
            }

            .list-panel {
                .item {
                    margin-bottom: 17px;
                    padding: 50px;
                    display: flex;
                    border: 2px solid #f5f5f5;

                    .img {
                        margin-right: 48px;
                        width: 230px;
                        height: 197px;
                        background: url('./images/industry-img.png') no-repeat center;
                        background-size: 100% 100%;
                    }
                    .info-panel {
                        flex: 1;
                        .title {
                            color: #1a1a1a;
                            font-size: 18px;
                            line-height: 40px;
                        }
                        .attr {
                            color: #1a1a1a;
                            font-size: 14px;
                            line-height: 38px;
                        }
                    }
                    .apply-panel {
                        position: relative;
                        .num {
                            padding-top: 165px;
                            padding-right: 48px;
                            color: #808080;
                            font-size: 14px;
                        }
                    }

                    .btn-panel {
                        position: relative;
                        padding-left: 60px;
                        padding-top: 80px;
                        border-left: 1px solid #efefef;

                        .ivu-btn {

                            &:hover, &:active {
                                color: #FFF;
                                border-color: #00c0dd;
                                background-color: #00c0dd;
                            }
                        }
                    }
                }
            }
            .list-page-panel {
                text-align: right;
                padding: 50px 16px 100px;
            }

        }
    }
</style>