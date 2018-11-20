<template>
    <div class="content-container">
        <div class="content-panel content-panel-1">
            <div class="content-inner">
                <div class="text-1">提供国内顶尖、快速、稳定的云服务器</div>
                <div class="text-2">计算、存储、监控、安全、完善的云产品满足您的一切所需</div>

                <div class="item-panel">
                    <div class="item">
                        <div class="mbtn-box">
                            <div class="mbtn-icon mbtn-icon-1"></div>
                            <div class="mbtn-info">
                                <div class="mbtn-title">自定义配置</div>
                                <div class="mbtn-desc">稳定、安全、弹性、高性能的云端计算服务， 实时满足您的多样性业务需求</div>
                                <div class="mbtn-btn">
                                    <Button  @click="onClick_Buy()">直接购买</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="mbtn-box">
                            <div class="mbtn-icon mbtn-icon-2"></div>
                            <div class="mbtn-info">
                                <div class="mbtn-title">{{serverDataList[0].serverName}}</div>
                                <div class="mbtn-config">
                                    <div class="attr">
                                        <span class="label">CPU : </span>
                                        <span class="value">{{serverDataList[0].cpu}}</span>
                                    </div>
                                    <div class="attr">
                                        <span class="label">内存 : </span>
                                        <span class="value">{{serverDataList[0].memory}}</span>
                                    </div>
                                </div>
                                <div class="mbtn-config">
                                    <div class="attr">
                                        <span class="label">宽带 : </span>
                                        <span class="value">{{serverDataList[0].bandWidth}}</span>
                                    </div>
                                    <div class="attr">
                                        <span class="label">硬盘 : </span>
                                        <span class="value">{{serverDataList[0].hardDisk}}</span>
                                    </div>
                                </div>
                                <div class="mbtn-btn"><Button @click="onClick_Buy(serverDataList[0].cloudServerId)">直接购买</Button></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-panel">
                    <div class="item">
                        <div class="mbtn-box">
                            <div class="mbtn-icon mbtn-icon-3"></div>
                            <div class="mbtn-info">
                                <div class="mbtn-title">{{serverDataList[1].serverName}}</div>
                                <div class="mbtn-config">
                                    <div class="attr">
                                        <span class="label">CPU : </span>
                                        <span class="value">{{serverDataList[1].cpu}}</span>
                                    </div>
                                    <div class="attr">
                                        <span class="label">内存 : </span>
                                        <span class="value">{{serverDataList[1].memory}}</span>
                                    </div>
                                </div>
                                <div class="mbtn-config">
                                    <div class="attr">
                                        <span class="label">宽带 : </span>
                                        <span class="value">{{serverDataList[1].bandWidth}}</span>
                                    </div>
                                    <div class="attr">
                                        <span class="label">硬盘 : </span>
                                        <span class="value">{{serverDataList[1].hardDisk}}</span>
                                    </div>
                                </div>
                                <div class="mbtn-btn"><Button @click="onClick_Buy(serverDataList[1].cloudServerId)">直接购买</Button></div>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="mbtn-box">
                            <div class="mbtn-icon mbtn-icon-4"></div>
                            <div class="mbtn-info">
                                <div class="mbtn-title">{{serverDataList[2].serverName}}</div>
                                <div class="mbtn-config">
                                    <div class="attr">
                                        <span class="label">CPU : </span>
                                        <span class="value">{{serverDataList[2].cpu}}</span>
                                    </div>
                                    <div class="attr">
                                        <span class="label">内存 : </span>
                                        <span class="value">{{serverDataList[2].memory}}</span>
                                    </div>
                                </div>
                                <div class="mbtn-config">
                                    <div class="attr">
                                        <span class="label">宽带 : </span>
                                        <span class="value">{{serverDataList[2].bandWidth}}</span>
                                    </div>
                                    <div class="attr">
                                        <span class="label">硬盘 : </span>
                                        <span class="value">{{serverDataList[2].hardDisk}}</span>
                                    </div>
                                </div>
                                <div class="mbtn-btn"><Button @click="onClick_Buy(serverDataList[2].cloudServerId)">直接购买</Button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-panel content-panel-2 iscrollP">
            <div class="content-inner">
                <div class="text-1">中国海洋产业海量数据全方位开放</div>
                <div class="text-2">行业数据分享、接入、对比分析满足您的一切所需</div>

                <div class="item-panel">

                    <!--<div class="item">-->
                        <!--<div class="img img-1"></div>-->
                        <!--<div class="title">数据定制分析</div>-->
                        <!--<div class="desc">基于平台强大的云计算能力、 海量数据资源、为用户提供 数据分析服务，支持多种数 据上传分析对比，人工录入 对比分析</div>-->
                        <!--<div class="btn-panel">-->
                            <!--<Button size="large">数据分析</Button>-->
                        <!--</div>-->
                    <!--</div>-->

                    <div v-for="item in dataResourceList" class="item">
                        <div class="img img-2"></div>
                        <div class="title">{{item.dataName}}</div>
                        <div class="attr">
                            <span class="label">数据数量</span>
                            <span class="value">{{item.dataNumber}}条</span>
                        </div>
                        <div class="attr">
                            <span class="label">数据时效</span>
                            <span class="value">
                                {{transformFormat(item)}}
                            </span>
                        </div>
                        <div class="attr">
                            <span class="label">数据格式</span>
                            <span class="value">{{item.format}}</span>
                        </div>
                        <div class="btn-panel">
                            <Button size="large" @click="onClick_jump">前往申请</Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Moment from 'moment';
    export default {
        name: "h-content",
        data() {
            return {
                serverDataList: [
                    {
                        cloudServerId: '',
                        bandWidth: '',
                        cpu: '',
                        hardDisk: '',
                        memory: '',
                        serverName: ''
                    },
                    {
                        cloudServerId: '',
                        bandWidth: '',
                        cpu: '',
                        hardDisk: '',
                        memory: '',
                        serverName: ''
                    },
                    {
                        cloudServerId: '',
                        bandWidth: '',
                        cpu: '',
                        hardDisk: '',
                        memory: '',
                        serverName: ''
                    }
                ],

                dataResourceList: []
            };
        },
        updated() {
            if (this.$store.state.homeScroll) {
                this.$store.state.homeScroll.refresh();
            }
        },
        mounted() {
            this.getServeData();
            this.getDataResourceData();
        },
        methods: {
            /**
             * 获取首页服务器列表
             */
            getServeData() {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '/panoramic/cloudServer/homePageServerList'
                }).then(function (response) {
                    if (response.status === 1) {
                        response.result.forEach(function (val, idx) {
                            that.serverDataList[idx].cloudServerId = val.cloudServerId;
                            that.serverDataList[idx].bandWidth = val.bandWidth;
                            that.serverDataList[idx].cpu = val.cpu;
                            that.serverDataList[idx].hardDisk = val.hardDisk;
                            that.serverDataList[idx].memory = val.memory;
                            that.serverDataList[idx].serverName = val.serverName;
                        });
                    }

                }).catch(function (e) {
                })
            },
            /**
             * 获取首页数据资源列表
             */
            getDataResourceData() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/industryData/homePageIndustryDataList'
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dataResourceList = response.result;
                    }

                }).catch(function (e) {
                })
            },

            transformFormat(item) {
                return Moment(item.beginTime).format('YYYY.MM.DD') + ' - ' + Moment(item.endTime).format('YYYY.MM.DD');
            },

            /**
             * 购买服务器跳转
             * @param cloudServerId
             */
            onClick_Buy(cloudServerId) {
                this.$router.push({
                    name: 'cloudService',
                    query: {
                        cid: cloudServerId || ''
                    }
                })
            },

            /**
             * 跳转到数据资源申请列表
             */
            onClick_jump() {
                this.$router.push({
                    name: 'industryData'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content-container {
        /*background-color: #0086b3;*/

        .content-panel {

            .content-inner {
                margin: 0 auto;
                width: 1200px;
            }

            &.content-panel-1 {
                height: 773px;

                .text-1 {
                    padding-top: 70px;
                    color: #323232;
                    font-size: 32px;
                    line-height: 32px;
                    text-align: center;
                }

                .text-2 {
                    padding-top: 24px;
                    padding-bottom: 74px;
                    color: #5f6367;
                    font-size: 17px;
                    line-height: 17px;
                    text-align: center;
                }

                .item-panel {
                    display: flex;
                    margin-bottom: 35px;
                    .item {
                        flex: 1;

                        &:first-child{
                            margin-right: 88px;
                        }

                        .mbtn-box {
                            display: flex;
                            height: 210px;

                            &:hover {
                                background-color: #f8f8f8;
                            }
                            .mbtn-icon {
                                height: 194px;
                                width: 230px;
                                margin: 7px 9px 9px 7px;
                                background-color: #FFF;
                                box-shadow: 9px 0 9px #f0f0f0, 0 9px 9px #f0f0f0;

                                &.mbtn-icon-1 {
                                    background: #FFF url('./images/fwq-1.png') no-repeat center;
                                }
                                &.mbtn-icon-2 { background: #FFF url('./images/fwq-2.png') no-repeat center; }
                                &.mbtn-icon-3 { background: #FFF url('./images/fwq-3.png') no-repeat center; }
                                &.mbtn-icon-4 { background: #FFF url('./images/fwq-4.png') no-repeat center; }
                            }

                            .mbtn-info {
                                flex: 1;
                                margin-left: 25px;

                                .mbtn-title {
                                    padding-top: 26px;
                                    color: #323232;
                                    font-size: 18px;
                                    text-align: left;
                                    line-height: 45px;
                                }
                                .mbtn-desc {
                                    color: #909090;
                                    font-size: 15px;
                                    line-height: 28px;
                                }
                                .mbtn-config {
                                    display: flex;
                                    .attr {
                                        flex: 1;
                                        .label {
                                            color: #808080;
                                            font-size: 15px;
                                            line-height: 28px;
                                        }
                                        .value {
                                            color: #333333;
                                            font-size: 17px;
                                            line-height: 28px;
                                        }
                                    }
                                }
                                .mbtn-btn {
                                    margin-top: 10px;
                                }
                            }
                        }
                    }
                }
            }

            &.content-panel-2 {
                padding-bottom: 20px;
                /*height: 735px;*/
                background-color: #f5f5f6;

                .content-inner {
                    margin: 0 auto;
                    width: 1200px;

                    .text-1 {
                        padding-top: 70px;
                        color: #323232;
                        font-size: 32px;
                        line-height: 32px;
                        text-align: center;
                    }

                    .text-2 {
                        padding-top: 24px;
                        padding-bottom: 60px;
                        color: #5f6367;
                        font-size: 17px;
                        line-height: 17px;
                        text-align: center;
                    }

                    .item-panel {
                        /*display: flex;*/
                        /*height: 390px;*/
                        overflow: hidden;

                        .item {
                            position: relative;
                            float: left;
                            /*flex: 1;*/
                            margin-top: 20px;
                            margin-left: 12px;
                            padding:  24px 44px 42px;
                            width: 285px;
                            height: 390px;
                            border: 2px solid #ececec;

                            /*&:nth-child(3n + 4) {*/
                                /*margin-left: auto;*/
                            /*}*/

                            &:hover {
                                //box-shadow: 0 -5px 3px #e6e6e6, 0 5px 3px #e6e6e6, 5px 0 3px #e6e6e6, -5px 0 3px #e6e6e6;
                                box-shadow: 0 0 10px #e6e6e6;
                            }

                            .img {
                                margin: 0 auto;
                                width: 54px;
                                height: 54px;
                                &.img-1 { background: url('./images/fx-icon-1.png') no-repeat center; }
                                &.img-2 { background: url('./images/fx-icon-2.png') no-repeat center; }
                                &.img-3 { background: url('./images/fx-icon-2.png') no-repeat center; }
                                &.img-4 { background: url('./images/fx-icon-2.png') no-repeat center; }
                            }

                            .title {
                                padding: 22px 0 22px;
                                color: #323232;
                                font-size: 18px;
                                text-align: center;
                                line-height: 18px;
                            }
                            
                            .desc {
                                color: #808080;
                                font-size: 15px;
                                line-height: 28px;
                            }

                            .attr {
                                font-size: 15px;
                                line-height: 28px;
                                .label {
                                    padding-left: 20px;
                                    color: #808080;
                                }
                                .value {
                                    padding-left: 40px;
                                    color: #333333;
                                }
                            }

                            .btn-panel {
                                position: absolute;
                                bottom: 42px;
                                left: 0;
                                right: 0;
                                text-align: center;
                            }
                        }
                    }
                }
            }
        }
    }
</style>