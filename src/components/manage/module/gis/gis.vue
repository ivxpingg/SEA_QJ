<template>
    <div ref="gis_container" class="gis-container">
        <div class="gis-box"
             id="gis_box"
             :style="{'cursor': addState ? 'pointer': ''}" ></div>

        <div class="left-panel">
            <div class="equipment-name">仪器名称</div>
            <div class="equipment-image">
                <img class="image" src="../../../home/homeSwiper/images/sw-slide-1.png" alt="设备图片">
            </div>
            <div class="equipment-state">
                <span class="text">运行中</span>
            </div>
            <div class="info-list">
                <div class="item">
                    <span>单位：</span>
                    <span>厦门斯坦道</span>
                </div>
                <div class="item">
                    <span>位置：</span>
                    <span>集美区杏林湾园博园水上花园</span>
                </div>
                <div class="item">
                    <span>设备健侧内容：氨氮、亚硝酸盐、叶绿素 溶解氧、PH、水温</span>
                </div>
                <div class="item">
                    <span>设备评级：</span>
                    <span><Rate disabled v-model="equipmentInfo.valueText"></Rate></span>
                </div>
            </div>

            <div class="my-btn-panel">
                <Button class="my-btn" type="info" size="small">获取服务</Button>
            </div>

        </div>
        <div class="right-panel">
            <div class="equipment-name">设备实时检测数据</div>
            <div ref="chart1"
                 class="chart"></div>

            <div class="equipment-name">人工分析对比情况</div>
            <div ref="chart2"
                 class="chart"></div>

            <div class="my-btn-panel">
                <Button class="my-btn" type="info" >添加人工数据对比</Button>
            </div>
        </div>

        <div class="search-bar">
            <div class="my-btn ivu-btn" :class="'active'">水质在线监测设备</div>
            <div class="my-btn ivu-btn">大型科研仪器</div>
        </div>

        <div class="toolbox">


            <Poptip title="提示" content="请在地图点击选择添加的位置">
                <Button class="my-btn"
                        size="small"
                        @click="onClick_gis_add"
                        icon="plus-round">添加</Button>
            </Poptip>

            <Button class="my-btn"
                    size="small"
                    @click="onClick_gis_edit"
                    icon="edit">编辑</Button>

            <Button class="my-btn"
                    size="small"
                    @click="onClick_gis_del"
                    icon="trash-a">删除</Button>
        </div>

    </div>
</template>

<script>
    import Echarts from 'echarts';
    export default {
        name: "gis",
        data() {
            return {
                map: null,
                equipmentInfo: {
                    valueText: 4
                },

                chart1: null,
                chart2: null,

                // 当前选中的设备类型
                equipment_type: '',

                /**
                 * 是否是添加状态;
                 * @type [Boolean]
                 **/
                addState: false,
                addPoint: {
                    lg: 0,   // 精度
                    lt: 0,   // 维度
                }
            };
        },
        props: {
            /**
             * 是否是编辑状态，默认false
             */
            edit: {
                type: Boolean,
                required: false,
                default() {
                    return false;
                }
            }
        },
        watch: {
            addPoint: {
                deep: true,
                handler(val) {
                    if (this.addState) {
                        alert(0);

                        this.addState = false;
                    }
                }
            }
        },
        mounted() {
            this.gisInit();
            this.setChart();
        },
        methods: {
            gisInit() {
                var that = this;


                this.map = GPSMap.InitMap('gis_box', {
                    mapSource: 'onLine',
                    mapType: 'map',
                    center: [118.18462, 24.49499],
                    zoom: 12
                });


                this.map.on('click', function(e) {
                    that.addPoint.lg = e.coordinate[0];
                    that.addPoint.lt = e.coordinate[1];
                });

            },

            /**
             * 图表初始化
             */
            setChart() {
                this.chart1 = Echarts.init(this.$refs.chart1);
                var option1 = {
                    color: ['#ff931e', '#00c0dd'],
                    legend: {
                        align: 'left',
                        right: 20,
                        data: ['图一','图二']
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu'],
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#6a87cc'
                            }
                        },
                        axisTick: {
                            length: 0
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: '#FFF'
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#6a87cc'
                            }
                        },
                        axisTick: {
                            length: 0
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            color: '#FFF'
                        }
                    },
                    series: [{
                        name: '图一',
                        data: [820, 932, 901, 934],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            // normal: {
                            //     color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            //         offset: 0,
                            //         color: 'rgba(0, 192, 221, 0.8)'
                            //     }, {
                            //         offset: 1,
                            //         color: 'rgba(255,255,255,0)'
                            //     }])
                            // }
                        }
                    },{
                        name: '图二',
                        data: [820, 932, 901, 934],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            // normal: {
                            //     color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            //         offset: 0,
                            //         color: 'rgba(0, 192, 221, 0.8)'
                            //     }, {
                            //         offset: 1,
                            //         color: 'rgba(255,255,255,0)'
                            //     }])
                            // }
                        }
                    }]
                };

                this.chart1.setOption(option1);

                this.chart2 = Echarts.init(this.$refs.chart2);
                var option2 = {
                    title: {
                        show: false,
                        text: '基础雷达图'
                    },
                    tooltip: {},
                    legend: {
                        show: false,
                        data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
                    },
                    radar: {
                        shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        indicator: [
                            { name: '销售', max: 6500},
                            { name: '管理', max: 16000},
                            { name: '信息技术', max: 30000},
                            { name: '客服', max: 38000},
                            { name: '研发', max: 52000},
                            { name: '市场', max: 25000}
                        ],
                        splitArea: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#333'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#333'
                            }
                        },

                    },
                    series: [{
                        name: '预算',
                        type: 'radar',
                        areaStyle: {},

                        data : [
                            {
                                value : [4300, 10000, 28000, 35000, 50000, 19000],
                                name : '预算分配（Allocated Budget）'
                            }
                        ]
                    }]

                };

                this.chart2.setOption(option2);
            },

            /**
             * 添加
             */
            onClick_gis_add() {
                this.addState = true;
            },
            /**
             * 编辑
             */
            onClick_gis_edit() {},
            /**
             * 删除
             */
            onClick_gis_del() {}
        }
    }
</script>

<style lang="scss" scoped>
    .gis-container {
        position: relative;
        height: 100%;
        .gis-box {
            height: 100%;
        }

        .left-panel {
            position: absolute;
            padding: 0 30px;
            top: 0;
            left: 0;
            bottom: 0;
            width: 314px;
            background-color: #272b2f;

            .equipment-name {
                margin-top: 43px;
                margin-bottom: 32px;
                position: relative;
                padding-left: 14px;
                color: #FFF;
                font-size: 18px;
                line-height: 20px;

                &:after {
                    position: absolute;
                    display: block;
                    top: 7px;
                    left: 0;
                    content: " ";
                    width: 0;
                    height: 0;
                    border: 3px solid #00c0dd;
                    border-radius: 50%;
                }
            }

            .equipment-image {
                height: 155px;
                background-color: #75777a;
                text-align: center;
                overflow: hidden;

                .image {
                    width: 100%;
                }
            }

            .equipment-state {
                margin-top: 35px;
                margin-bottom: 25px;
                text-align: center;
                .text {
                    display: inline-block;
                    padding: 0 10px;
                    font-size: 12px;
                    color: #b3b5b6;
                    line-height: 20px;
                    background-color: #6a6d6f;
                }
            }
            
            .info-list {
                color: #FFF;
                font-size: 14px;
                line-height: 34px;

                .item {
                    margin-bottom: 14px;
                }
            }

            .my-btn-panel {
                margin-top: 50px;
                text-align: center;
            }
        }

        .right-panel {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 314px;
            background-color: #272b2f;

            .equipment-name {
                margin-left: 14px;
                margin-top: 43px;
                margin-bottom: 32px;
                position: relative;
                padding-left: 14px;
                color: #FFF;
                font-size: 18px;
                line-height: 20px;

                &:after {
                    position: absolute;
                    display: block;
                    top: 7px;
                    left: 0;
                    content: " ";
                    width: 0;
                    height: 0;
                    border: 3px solid #00c0dd;
                    border-radius: 50%;
                }
            }

            .chart {
                margin: 0 15px 35px 15px;
                height: 220px;
            }

            .my-btn-panel {
                margin-top: 50px;
                text-align: center;
            }

        }

        .search-bar {
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 0;
            text-align: center;

            .my-btn {
                margin: 0 10px;

                &.active {
                    color: #FFF;
                    background-color: rgba(45,140,240,1);
                }
            }
        }

        .toolbox {
            position: absolute;
            padding: 6px 12px;
            top: 20px;
            right: 334px;
            background-color: #FFF;
            z-index: 1;
            box-shadow: 1px 2px 1px rgba(0,0,0,.15);

            .my-btn {
                margin: 0 5px;
            }
        }

    }
</style>