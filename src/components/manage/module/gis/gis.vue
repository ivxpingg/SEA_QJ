<template>
    <div ref="gis_container" class="gis-container">
        <div class="gis-box"
             id="gis_box"
             :style="{'cursor': addState ? 'pointer': ''}" ></div>

        <div class="left-panel" :class="{'show': showPanel}">
            <div class="equipment-name">{{equipmentInfo.equipmentName}}</div>
            <div class="equipment-image">
                <img class="image" :src="equipment_pictureUrl" alt="设备图片">
            </div>
            <div class="equipment-state">
                <span class="text">{{equipmentStatus_label}}</span>
            </div>
            <div class="info-list">
                <div class="item">
                    <span>单位：</span>
                    <span>{{equipmentInfo.unit}}</span>
                </div>
                <div class="item">
                    <span>位置：</span>
                    <span>{{equipmentInfo.position}}</span>
                </div>
                <div class="item">
                    <span>设备监测内容：{{equipmentInfo.observationContent}}</span>
                </div>
                <div class="item">
                    <span>设备评级：</span>
                    <span><Rate disabled v-model="parseInt_starLevel"></Rate></span>
                </div>
            </div>

            <div class="my-btn-panel">


                <a class="my-btn ivu-btn ivu-btn-info ivu-btn-small"
                   :href="equipmentInfo.serviceLink" target="_blank"><span>获取服务</span></a>
            </div>

        </div>
        <div class="right-panel"  :class="{'show': showPanel}">
            <div class="equipment-name">设备实时检测数据</div>
            <div ref="chart1"
                 class="chart"></div>

            <div class="equipment-name">人工分析对比情况</div>
            <div ref="chart2"
                 class="chart"></div>

            <div class="my-btn-panel">
                <Button class="my-btn" type="info" v-if="edit">添加人工数据对比</Button>
            </div>
        </div>

        <div class="goback"
             @click="onClick_goback"
             :class="{'show': showPanel}">
            <Icon type="chevron-left"></Icon>返回
        </div>

        <div class="search-bar">
            <div v-for="item in dict_equipmentType"
                 :key="item.id"
                 @click="onClick_switch_equipmentType(item.value)"
                 :class="{'active': item.value === filterType}"
                 class="my-btn ivu-btn" >{{item.label}}</div>

            <!--<div class="my-btn ivu-btn" :class="'active'" >水质在线监测设备</div>-->
            <!--<div class="my-btn ivu-btn">大型科研仪器</div>-->
        </div>

        <div class="toolbox" v-if="edit"  :class="{'show': showPanel}">


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

        <Modal v-model="modal_equipment_add"
               title="新增">
            <div>
                <Form ref="ref_addEquipment" :model="equipment_add_info" :label-width="85" :rules="rule_equipment_add_info">
                    <FormItem label="名称：" prop="equipmentName">
                        <Input v-model="equipment_add_info.equipmentName" placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="所属单位：" prop="unit">
                        <Input v-model="equipment_add_info.unit" placeholder="请输入所属单位"></Input>
                    </FormItem>

                    <FormItem label="类型：" prop="equipmentType">
                        <Select v-model="equipment_add_info.equipmentType"
                                style="width: 180px" placeholder="">
                            <Option v-for="item in dict_equipmentType"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.label"></Option>
                        </Select>
                    </FormItem>

                    <FormItem label="编号：" prop="equipmentNo">
                        <Input v-model="equipment_add_info.equipmentNo" placeholder="请输入设备编号"></Input>
                    </FormItem>

                    <FormItem label="位置：" prop="position">
                        <Input v-model="equipment_add_info.position" placeholder="请输入位置名称"></Input>
                    </FormItem>

                    <FormItem label="观测内容：" prop="observationContent">
                        <Input v-model="equipment_add_info.observationContent" placeholder="请输入观测内容"></Input>
                    </FormItem>

                    <FormItem label="设置链接：" prop="serviceLink">
                        <Input v-model="equipment_add_info.serviceLink" placeholder="请输入链接地址"></Input>
                    </FormItem>

                    <FormItem label="设备图片：" prop="uploadId">
                        <vImgUpload :onSuccess="upload_add_img" key="2"></vImgUpload>
                    </FormItem>


                </Form>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="onClick_equipment_add">提交</Button>
            </div>
        </Modal>

        <Modal v-model="modal_equipment_edit"
               title="编辑">
            <div>
                <Form ref="ref_editEquipment" :model="equipment_edit_info" :label-width="85" :rules="rule_equipment_add_info">
                    <FormItem label="名称：" prop="equipmentName">
                        <Input v-model="equipment_edit_info.equipmentName" placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="所属单位：" prop="unit">
                        <Input v-model="equipment_edit_info.unit" placeholder="请输入所属单位"></Input>
                    </FormItem>

                    <FormItem label="类型：" prop="equipmentType">
                        <Select v-model="equipment_edit_info.equipmentType"
                                style="width: 180px" placeholder="">
                            <Option v-for="item in dict_equipmentType"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.label"></Option>
                        </Select>
                    </FormItem>

                    <FormItem label="编号：" prop="equipmentNo">
                        <Input v-model="equipment_edit_info.equipmentNo" placeholder="请输入设备编号"></Input>
                    </FormItem>

                    <FormItem label="位置：" prop="position">
                        <Input v-model="equipment_edit_info.position" placeholder="请输入位置名称"></Input>
                    </FormItem>

                    <FormItem label="观测内容：" prop="observationContent">
                        <Input v-model="equipment_edit_info.observationContent" placeholder="请输入观测内容"></Input>
                    </FormItem>

                    <FormItem label="设置链接：" prop="serviceLink">
                        <Input v-model="equipment_edit_info.serviceLink" placeholder="请输入链接地址"></Input>
                    </FormItem>

                    <FormItem label="设备图片：" prop="uploadId">
                        <vImgUpload :onSuccess="upload_edit_img"
                                    :defaultList="edit_defaultList"
                                    key="3"></vImgUpload>
                    </FormItem>


                </Form>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="onClick_equipment_edit">提交</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vImgUpload from '../../../upload/imgUpload';
    import Echarts from 'echarts';
    import Config from '../../../../libs/appConfig/config';
    export default {
        name: "gis",
        data() {
            return {
                // ************ stat地图信息 **************
                map: null,               // 百度地图对象。
                mapDefaultCursor: '',    // 百度地图默认鼠标样式
                map_equipment_dom: {},   // 存放百度地图元素
                // marker_active: null,
                // marker_current: null,  // 当前选中的设备(百度地图对象)
                marker_info_active: null,  // 当前选中设备的信息
                // ************ end地图信息 **************

                // 左右两个面板是否展示
                showPanel: false,
                // 设备详情信息
                equipmentInfo: {
                    analysisStatus: "",
                    equipmentId: "",
                    equipmentName: "",
                    equipmentNo: "",
                    equipmentStatus: "",
                    equipmentType: "",
                    insTime: "",
                    lat: 0,
                    lon: 0,
                    observationContent: "",
                    pictureUrl: "",
                    position: "",
                    serviceLink: "",
                    starLevel: "0",
                    unit: ""
                },

                chart1: null,
                chart2: null,

                // static图片路径
                staticImgBaseUrl: window.location.origin + Config[Config.env].staticUrl,

                // 当前选中的设备类型
                equipment_type: '',

                // 字典-设备类型
                dict_equipmentType: [],

                /**
                 * 是否是添加状态;
                 * @type [Boolean]
                 **/
                addState: false,
                addPoint: [],

                // 添加
                modal_equipment_add: false,
                equipment_add_info: {
                    equipmentName: '',
                    unit: '',
                    equipmentType: 'equipment',
                    equipmentNo: '',
                    position: '',
                    lon: '',
                    lat: '',
                    observationContent: '',
                    serviceLink: '',
                    uploadId: '',
                    starLevel: '0'
                },
                rule_equipment_add_info: {
                    equipmentName: [
                        { required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    unit: [
                        { required: true, message: '单位不能为空', trigger: 'blur'}
                    ],
                    equipmentNo: [
                        { required: true, message: '设备编号不能为空', trigger: 'blur'}
                    ],
                    position: [
                        { required: true, message: '位置名称不能为空', trigger: 'blur'}
                    ]
                },

                // 编辑
                modal_equipment_edit: false,
                edit_defaultList: [],
                equipment_edit_info: {
                    equipmentId: "",
                    equipmentName: "",
                    equipmentNo: "",
                    equipmentType: "",
                    lat: 0,
                    lon: 0,
                    observationContent: "",
                    pictureUrl: "",
                    position: "",
                    serviceLink: "",
                    starLevel: "0",
                    unit: ""
                },

                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 99999, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                },
                dataList: [],
                filterDataList: [],
                filterType: 'equipment'

            };
        },
        computed: {
            equipment_pictureUrl() {
                return window.location.origin + Config[Config.env].imgUrl + this.equipmentInfo.pictureUrl;
            },
            parseInt_starLevel() {
                return parseInt(this.equipmentInfo.starLevel);
            },
            equipmentStatus_label() {
                return this.equipmentInfo.equipmentStatus === '0'? '已关闭': '运行中';
            }
        },
        components: {vImgUpload},
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
                        this.map.setDefaultCursor(this.mapDefaultCursor);
                        this.equipment_add_info.lon = val[0];
                        this.equipment_add_info.lat = val[1];
                        this.modal_equipment_add = true;
                        this.addState = false;
                    }
                }
            },
            dataList: {
                deep: true,
                handler(val) {
                    this.onClick_switch_equipmentType(this.filterType);
                }
            },
            filterDataList: {
                deep: true,
                handler(val) {
                    this.setEquipmentPoint(val);
                }
            }
        },
        mounted() {
            this.gisInit();
            this.setChart();
            this.getDict();
        },
        methods: {
            gisInit() {
                var that = this;
                this.map = new BMap.Map('gis_box', {enableMapClick:false, minZoom:12,maxZoom:18});    // 创建Map实例,关闭底图可点功能
                this.map.centerAndZoom(new BMap.Point(118.117348,24.552869), 13);  // 初始化地图,设置中心点坐标和地图级别
                this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放


                this.map.addEventListener("click",function(e){

                    if (that.addState) {
                        that.addPoint = [e.point.lng, e.point.lat];
                    }
                    else {
                        that.showPanel = false;
                    }
                });

                this.getTableData();
            },

            onClick_switch_equipmentType(value) {
                this.filterType = value;
                this.filterDataList = this.dataList.filter(function (val) {
                    return val.equipmentType === value;
                });
            },

            /**
             * 图表初始化
             */
            setChart() {
                this.chart1 = Echarts.init(this.$refs.chart1);
                var option1 = {
                    color: ['#00c0dd','#ff931e'],
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
                            normal: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0, 192, 221, 0.8)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(0, 192, 221,0)'
                                }])
                            }
                        }
                    },{
                        name: '图二',
                        data: [820, 932, 901, 934],
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            normal: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(255,147,30, 0.8)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(255,147,30,0)'
                                }])
                            }
                        }
                    }]
                };

                this.chart1.setOption(option1);

                this.chart2 = Echarts.init(this.$refs.chart2);
                var option2 = {
                    color: ['#00c0dd','#ff931e'],
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
                        areaStyle: {
                            normal: {
                                color: 'rgba(0, 192, 221, 0.5)'
                            }
                        },

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
             * 获取字典数据
             */
            getDict() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/sys/dict/listData',
                    params: {
                        type: 'equipmentType'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dict_equipmentType = response.result;
                    }
                    else {
                    }
                }).catch(function (e) {})
            },

            upload_add_img(fileList) {
                if (fileList.length > 0) {
                    this.equipment_add_info.uploadId = fileList[0].pictureId;
                }
                else {
                    this.equipment_add_info.uploadId = '';
                }
            },

            upload_edit_img(fileList) {
                if (fileList.length > 0) {
                    this.equipment_edit_info.uploadId = fileList[0].pictureId;
                }
                else {
                    this.equipment_edit_info.uploadId = '';
                }
            },

            // ajax添加设备
            onClick_equipment_add() {
                var that = this;

                this.$refs.ref_addEquipment.validate((valid) => {
                    if (valid) {
                        that.$http({
                            method: 'post',
                            url: '/panoramic/equipment/add',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.equipment_add_info)
                        }).then(function (response) {
                            if(response.status === 1) {
                                that.$Message.success({content: '添加成功！'});
                                that.modal_equipment_add = false;
                                that.getTableData();
                            }
                            else {
                                that.$Message.error({content: '添加失败！'});
                            }

                        }).catch(function (e) {
                            that.$Message.error({content: '添加失败！'});
                            console.log(e);
                        });
                    } else {

                        return false;
                    }
                });
            },

            // ajax更新设备
            onClick_equipment_edit() {
                var that = this;

                this.$refs.ref_editEquipment.validate((valid) => {
                    if (valid) {
                        that.$http({
                            method: 'post',
                            url: '/panoramic/equipment/update',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.equipment_edit_info)
                        }).then(function (response) {
                            if(response.status === 1) {
                                that.$Message.success({content: '更新成功！'});
                                that.modal_equipment_add = false;
                                that.getTableData();
                            }
                            else {
                                that.$Message.error({content: '更新失败！'});
                            }

                        }).catch(function (e) {});
                    } else {
                        return false;
                    }
                });
            },

            // 返回
            onClick_goback() {
                this.$router.push({
                   name: 'manage',
                    query: {
                        active_tab: 'seaSystem'
                    }
                });
            },

            /**
             * 地图按钮 - 添加设备
             */
            onClick_gis_add() {
                var that = this;

                if (this.mapDefaultCursor === '') {
                    this.mapDefaultCursor = this.map.getDefaultCursor();
                }

                this.map.setDefaultCursor('crosshair');

                this.addState = true;
            },
            /**
             * 地图按钮 - 编辑设备
             */
            onClick_gis_edit() {
                var that = this;
                if (!that.marker_info_active) {
                    that.$Message.info({
                        content: '请选择要编辑的设备!'
                    });
                }
                else {
                    that.equipment_edit_info.equipmentId = that.equipmentInfo.equipmentId;
                    that.equipment_edit_info.equipmentName = that.equipmentInfo.equipmentName;
                    that.equipment_edit_info.equipmentNo = that.equipmentInfo.equipmentNo;
                    that.equipment_edit_info.equipmentType = that.equipmentInfo.equipmentType;
                    that.equipment_edit_info.lat = that.equipmentInfo.lat;
                    that.equipment_edit_info.lon = that.equipmentInfo.lon;
                    that.equipment_edit_info.observationContent = that.equipmentInfo.observationContent;
                    that.equipment_edit_info.pictureUrl = that.equipmentInfo.pictureUrl;
                    that.equipment_edit_info.position = that.equipmentInfo.position;
                    that.equipment_edit_info.serviceLink = that.equipmentInfo.serviceLink;
                    that.equipment_edit_info.starLevel = that.equipmentInfo.starLevel;
                    that.equipment_edit_info.unit = that.equipmentInfo.unit;

                    that.edit_defaultList = [];
                    that.edit_defaultList.push({
                        url: window.location.origin + Config[Config.env].imgUrl + that.equipment_edit_info.pictureUrl,
                        name: that.equipment_edit_info.equipmentName
                    });

                    this.modal_equipment_edit = true;
                }
            },
            /**
             * 地图按钮 - 删除设备
             */
            onClick_gis_del() {
                var that = this;
                if (!that.marker_info_active) {
                    that.$Message.info({
                       content: '请选择要删除的设备!'
                    });
                }
                else {

                    that.$Modal.confirm({
                        title: '提示',
                        content: '确定要删除<'+ that.marker_info_active.equipmentName +'>设备？',
                        onOk() {
                            that.$http({
                                method: 'get',
                                url: '/panoramic/equipment/delete',
                                params: {
                                    equipmentIds: that.marker_info_active.equipmentId
                                }
                            }).then(function (response) {
                                if (response.status === 1) {
                                    that.$Message.success({
                                        content: '删除成功!'
                                    });
                                    that.getTableData();
                                }
                                else {
                                    that.$Message.error({
                                        content: '删除失败!'
                                    });
                                }
                            }).catch(function (e) {})
                        }
                    })

                }
            },

            /**
             * 获取表格数据
             */
            getTableData() {
                var that = this;
                this.$http({
                    method: 'post',
                    url: '/panoramic/equipment/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams)
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dataList = response.result.page.list;
                    }
                    else {}
                }).catch(function (e) {
                })
            },

            // 设置设备地图标点
            setEquipmentPoint(list) {
                var that = this;

                that.clearMarker_map();

                list.forEach(function (val, idx) {

                    var lon = val.lon;
                    var lat = val.lat;

                    var nameLeng = val.equipmentName.length * 2;

                    var opts = {
                        position : new BMap.Point(lon, lat),    // 指定文本标注所在的地理位置
                        offset   : new BMap.Size( -nameLeng - 26, -60)    //设置文本偏移量
                    };

                    var label = new BMap.Label(val.equipmentName, opts);  // 创建文本标注对象
                    label.setStyle({
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        paddingLeft: '11px',
                        paddingRight: '11px',
                        borderWidth: 0,
                        borderRadius: '8px',
                        backgroundColor: 'rgba(92,95,97,0.75)',
                        color : "#fff",
                        fontSize : "12px",
                        height : "34px",
                        lineHeight : "",
                        fontFamily:"微软雅黑"
                    });
                    that.map.addOverlay(label);

                    var myIcon = new BMap.Icon(that.staticImgBaseUrl + "/images/gis/point_icon.png", new BMap.Size(30,43));
                    var myOffset = new BMap.Size(0, 0);
                    var marker = new BMap.Marker(new BMap.Point(lon, lat),{icon:myIcon, offset: myOffset});  // 创建标注

                    marker.mInfo = val;
                    that.map.addOverlay(marker);              // 将标注添加到地图中

                    marker.addEventListener('mouseover', function (e) {
                        //setStationList(this.mStationId, 'up');
                        // setTwinkle();
                        marker.setIcon(new BMap.Icon(that.staticImgBaseUrl + "/images/gis/point_icon_active.png", new BMap.Size(30,43)));

                    });

                    marker.addEventListener('mouseout', function (e) {
                        if (that.marker_info_active && that.marker_info_active.equipmentId === this.mInfo.equipmentId) {
                            marker.setIcon(new BMap.Icon(that.staticImgBaseUrl + "/images/gis/point_icon_active.png", new BMap.Size(30,43)));
                        }
                        else {
                            marker.setIcon(new BMap.Icon(that.staticImgBaseUrl + "/images/gis/point_icon.png", new BMap.Size(30,43)));
                        }

                        // stopTwinkle();
                    });

                    marker.addEventListener('click', function (e) {
                        e.domEvent.stopPropagation();
                        that.marker_info_active = this.mInfo;
                        that.getEquipmentInfo_detail();
                        that.showPanel = true;
                        that.marker_active_update();
                        // stopTwinkle();
                    });

                    that.map_equipment_dom[val.equipmentId] = {
                        label: label,
                        marker: marker
                    };
                });
            },
            // 清除设备地图标点
            clearMarker_map() {
                var that = this;
                that.map_equipment_dom = {};
                that.showPanel = false;
                that.marker_info_active = null;

                this.map.clearOverlays();

                // that.map_equipment_dom.forEach(function (val) {
                //     val.label
                // });
            },

            // 更新设备标点选中状态
            marker_active_update() {
                var that = this;

                for(var key in that.map_equipment_dom) {
                    if (key !== that.marker_info_active.equipmentId) {
                        that.map_equipment_dom[key].marker.setIcon(new BMap.Icon(that.staticImgBaseUrl + "/images/gis/point_icon.png", new BMap.Size(30,43)));
                    }
                }
            },

            // 获取设备详情信息
            getEquipmentInfo_detail() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/panoramic/equipment/getEquipment',
                    params: {
                        equipmentId: that.marker_info_active.equipmentId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.equipmentInfo.analysisStatus = response.result.analysisStatus;
                        that.equipmentInfo.equipmentId = response.result.equipmentId;
                        that.equipmentInfo.equipmentName = response.result.equipmentName;
                        that.equipmentInfo.equipmentNo = response.result.equipmentNo;
                        that.equipmentInfo.equipmentStatus = response.result.equipmentStatus;
                        that.equipmentInfo.equipmentType = response.result.equipmentType;
                        that.equipmentInfo.insTime = response.result.insTime;
                        that.equipmentInfo.lat = response.result.lat;
                        that.equipmentInfo.lon = response.result.lon;
                        that.equipmentInfo.observationContent = response.result.observationContent;
                        that.equipmentInfo.pictureUrl = response.result.pictureUrl;
                        that.equipmentInfo.position = response.result.position;
                        that.equipmentInfo.serviceLink = response.result.serviceLink;
                        that.equipmentInfo.starLevel = response.result.starLevel;
                        that.equipmentInfo.unit = response.result.unit;
                    }
                    else {}
                }).catch(function (e) {
                })
            }

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
            transition: all 0.5s;
            transform:translate(-314px, 0px);

            &.show {
                transform:translate(0px, 0px);
            }


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
            transition: all 0.5s;
            transform: translate(314px, 0px);

            &.show {
                transform:translate(0px, 0px);
            }

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
                width: 128px;
                &.active {
                    color: #FFF;
                    background-color: rgba(45,140,240,1);
                }
            }
        }

        .goback{
            position: absolute;
            padding: 6px 12px;
            top: 20px;
            left: 20px;
            z-index: 1;
            color: rgba(51,51,51, 0.8);
            font-size: 14px;
            background-color: rgba(255,255,255,0.4);
            box-shadow: 1px 2px 1px rgba(0,0,0,.15);
            transition: all 0.5s;
            transform: translate(0px, 0px);
            cursor: pointer;

            &:hover {
                background-color: rgba(255,255,255,0.9);
                color: rgba(51,51,51, 1);
                .ivu-icon {
                    color: rgba(51,51,51, 1);
                }
            }

            &.show {
                transform:translate(314px, 0px);
            }

            .ivu-icon {
                padding-right: 5px;
                color: rgba(51,51,51, 0.9);
                font-size: 14px;
            }
        }

        .toolbox {
            position: absolute;
            padding: 6px 12px;
            top: 20px;
            right: 20px;
            background-color: #FFF;
            z-index: 1;
            box-shadow: 1px 2px 1px rgba(0,0,0,.15);
            transition: all 0.5s;
            transform: translate(0px, 0px);

            &.show {
                transform:translate(-314px, 0px);
            }

            .my-btn {
                margin: 0 5px;
            }
        }

    }
</style>

<style lang="scss" rel="stylesheet/scss">
    .gis-container {
        // 去掉百度地图Logo
        .anchorBL {
            display: none;
        }
    }
</style>