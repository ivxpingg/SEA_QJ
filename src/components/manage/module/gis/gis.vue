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
                <span class="text" :class="{running: equipmentStatus_label === '运行中'}">{{equipmentStatus_label}}</span>
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
                    <span :title="parseInt_starLevel + '星'"><Rate disabled v-model="parseInt_starLevel"></Rate></span>
                </div>
            </div>

            <div class="my-btn-panel">


                <a class="my-btn ivu-btn ivu-btn-info ivu-btn-small"
                   :href="equipmentInfo.serviceLink" target="_blank"><span>获取服务</span></a>
            </div>

        </div>
        <div class="right-panel"  :class="{'show': showPanel}">
            <div class="equipment-name">设备实时检测数据</div>
            <div class="factor-select"
                 v-if="equipmentInfo.equipmentType === 'equipment'">
                <Select v-model="factor_select_value"
                        size="small" style="width: 120px;">
                    <Option v-for="item in chart1_selectData"
                            :value="item.itemId"
                            :key="item.itemId">{{item.itemName}}</Option>
                </Select>
            </div>
            <div ref="chart1"
                 class="chart"></div>

            <div class="equipment-name">
                {{equipmentInfo.equipmentType === 'equipment'? '人工分析对比情况' : '设备分析'}}
            </div>

            <div ref="chart2"
                 class="chart"></div>

            <div class="my-btn-panel" v-show="equipmentInfo.equipmentType === 'equipment'">
                <Button class="my-btn" type="info" v-if="edit" @click="onClick_modal_addComparison">添加人工数据对比</Button>
            </div>
        </div>

        <div class="goback"
             @click="onClick_goback"
             :class="{'show': showPanel}"
             v-if="edit">
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


            <Poptip title="提示" placement="bottom-start" content="请在地图点击选择添加的位置">
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
                <Form ref="ref_addEquipment"
                      :model="equipment_add_info"
                      :label-width="85"
                      :rules="rule_equipment_add_info">
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

                    <FormItem label="经度：" prop="lat">
                        <Input number v-model="equipment_add_info.lat" placeholder="请输入经度"></Input>
                    </FormItem>

                    <FormItem label="纬度：" prop="lon">
                        <Input number v-model="equipment_add_info.lon" placeholder="请输入纬度"></Input>
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
                <Form ref="ref_editEquipment"
                      :model="equipment_edit_info"
                      :label-width="85"
                      :rules="rule_equipment_add_info">
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

                    <FormItem label="经度：" prop="lat">
                        <Input v-model="equipment_edit_info.lat" number placeholder="请输入经度"></Input>
                    </FormItem>

                    <FormItem label="纬度：" prop="lon">
                        <Input v-model="equipment_edit_info.lon" number placeholder="请输入纬度"></Input>
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

        <Modal class="modal_add_comparison-container" v-model="modal_data_comparison"
               :width="1000"
               :title="isAnalysisResult? '分析结果':'人工数据对比分析'">

            <template  v-if="!isAnalysisResult">
                <div class="modal_comparison">
                    <div class="handle-bar">
                        <div class="hd">
                            <div class="form-item">
                                <label class="label">时间: </label>
                                <div class="value">
                                    <DatePicker :value="datePicker_default"
                                                :clearable="true"
                                                transfer
                                                format="yyyy-MM-dd HH:mm:ss"
                                                type="datetimerange"
                                                placeholder="日期选择"
                                                @on-change="datePicker_onChange"
                                                style="width: 300px"></DatePicker>
                                </div>
                            </div>
                        </div>

                        <div class="hd">
                            <Button type="primary" @click="onClick_modal_search">查询</Button>
                        </div>

                    </div>
                    <Table :height="400"
                           border
                           :loading="tableLoading"
                           :columns="tableColumns"
                           :data="tableData"></Table>

                </div>
                <div slot="footer">
                    <Button type="primary" size="large" @click="onClick_modal_analyze">开始分析评测</Button>
                </div>
            </template>
            <template v-else>
                <div class="modal_comparison">
                    <div class="handle-bar">
                        <div class="hd">
                            <div class="form-item">
                                <label class="label">时间: </label>
                                <div class="value" style="line-height: 32px;">
                                    {{searchParams_equipData.beginDate}}
                                    ~
                                    {{searchParams_equipData.endDate}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table :height="400"
                           border
                           :row-class-name="rowClassName"
                           :loading="tableLoading"
                           :columns="tableColumns2"
                           :data="tableData2"></Table>


                    <div class="handle-bar" style="padding-top: 20px; padding-bottom: 10px;">
                        <div class="hd">
                            <div class="form-item">
                                <label class="label">装备评级: </label>
                                <div class="value">
                                    <Rate v-model="starLevel" show-text></Rate>
                                </div>
                            </div>
                        </div>
                        <div class="hd" style="margin-left: 580px;">
                            <div class="form-item">
                                <label class="label">平均偏差值: </label>
                                <div class="value" style="line-height: 32px;">
                                    {{average}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div slot="footer">
                    <Button type="primary" size="large" @click="onClick_modal_analyze_ok">确定</Button>
                </div>
            </template>


        </Modal>

    </div>
</template>

<script>
    import vImgUpload from '../../../upload/imgUpload';
    import Echarts from 'echarts';
    import Config from '../../../../libs/appConfig/config';
    import MOMENT from 'moment';
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
                    lat: 0,     //纬度
                    lon: 0,
                    observationContent: "",
                    pictureUrl: "",
                    position: "",
                    serviceLink: "",
                    starLevel: "0",
                    unit: ""
                },

                // *************  图表  *************
                chart1: null,    // 折线图
                chart1_option: {
                    xAxis: {
                        data: []
                    },
                    series: [{
                        name: '',
                        data: [],
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
                    }]
                },
                chart1_selectData: [
                    // {itemId: '001', itemName: '叶绿素'}
                ],  // 分析因子选择数据
                factor_select_value: '',
                chart_data1: [],

                chart2: null,  // 雷达图
                chart2_option: {
                    legend: {
                        data: []
                    },
                    tooltip: {
                        position: []
                    },
                    radar: {
                        indicator: [
                            // {name: '', max: 0}
                        ]
                    },
                    series: [
                        {
                            name: '分析',
                            type: 'radar',
                            areaStyle: {
                                normal: {
                                    color: 'rgba(0, 192, 221, 0.5)'
                                }
                            },
                            data: [
                                {
                                    value: [],
                                    name: '设备采集'
                                },
                                {
                                    value: [],
                                    name: '人工采集'
                                }
                            ]
                        }
                    ]
                },
                chart_data2: [],


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
                    ],
                    lat: [
                        { required: true, type: 'number', message: '经度不能为空', trigger: 'blur'}
                    ],
                    lon: [
                        { required: true, type: 'number', message: '纬度不能为空', trigger: 'blur'}
                    ],
                    observationContent: [
                        { required: true, message: '观测内容不能为空', trigger: 'blur'}
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
                filterType: 'equipment',

                // 添加人工数据对比
                modal_data_comparison: false,
                datePicker_default: [],
                tableLoading: false,
                searchParams_equipData: {
                    equipId: '',
                    equipmentId: '',       // 设备标识
                    equipmentNo: '',       // 设备编号
                    beginDate: '',
                    endDate: ''
                },
                tableLoading_data: false,
                ajaxEquipmentData: [],    // 后台返回的设备的数据和人工数据，用于转化为表格
                tableColumns: [],
                tableColumns2: [],       // 分析结果表头
                tableData: [],
                updateDataList: {},      // 人工输入的开始分析的数据，用于提交
                isAnalysisResult: false,  // 是否是分析结果，用于切换添加人工数据分析的和分析结果
                starLevel: 0,       // 装备评级
                average: 0,         // 平均偏差值'
                oDeviation: {},     // 因子偏差值

                contrastRecordId: '',   //分析记录ID
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
            },

            tableData2() {
                var col_data_avg = {
                    collectionTime: '平均偏差值'
                };
                var col_data_max = {
                    collectionTime: '最大偏差值'
                };

                for(var k in this.oDeviation) {
                    var sum_value = 0, max_value = 0;
                    this.oDeviation[k].forEach(function (val) {
                        sum_value += parseFloat(val);
                        if(parseFloat(val) > max_value) {
                            max_value = parseFloat(val);
                        }
                    });

                    if (this.oDeviation[k].length === 0) {
                        col_data_avg[k] = '';
                        col_data_max[k] = '';
                    }
                    else {
                        col_data_avg[k] = (sum_value / this.oDeviation[k].length).toFixed(2);
                        col_data_max[k] = max_value;
                    }

                }


                return this.tableData.concat([col_data_avg, col_data_max]);
            },
            // 数据分析记录详情(平均值和最大值)
            contrastDetail() {
                var list = [];
                for(var k in this.oDeviation) {
                    var sum_value = 0, max_value = 0;
                    this.oDeviation[k].forEach(function (val) {
                        sum_value += parseFloat(val);
                        if(parseFloat(val) > max_value) {
                            max_value = parseFloat(val);
                        }
                    });

                    if (this.oDeviation[k].length === 0) {
                    }
                    else {
                        list.push({
                            itemName: k.replace(/'/g, ''),
                            averageDeviation: (sum_value / this.oDeviation[k].length).toFixed(2),
                            maxDeviation: max_value
                        });
                    }
                }

                return list;
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
            },
            tableData: {
                deep: true,
                handler(val) {
                    var that = this;
                    that.tableColumns = [];
                    that.tableColumns2 = [];
                    var keyList = [];

                    // 解析最大偏差值、平均偏差值
                    that.oDeviation = {};

                    val.forEach(function (v, idx) {
                        for(var key in v) {
                            if (keyList.indexOf(key) < 0) {

                                keyList.push(key);
                                if (key === 'collectionTime') {
                                    that.tableColumns.push({
                                        title: '时间',
                                        key: key,
                                        width: 160,
                                        fixed: "left",
                                        align: 'center'
                                    });

                                    that.tableColumns2.push({
                                        title: '时间',
                                        key: key,
                                        width: 160,
                                        fixed: "left",
                                        align: 'center'
                                    });
                                }
                                else {
                                    that.oDeviation[key] = [];

                                    that.tableColumns.push({
                                        title: key.replace(/'/g, ''),
                                        key: key,
                                        width: 120,
                                        align: 'center',
                                        render(h, params) {
                                            var text = '';
                                            if (!params.row[params.column.key]) {
                                                text = '未采集';
                                            }
                                            else {
                                                text = params.row[params.column.key].split('|')[0];
                                            }

                                            return h('div', text);
                                        }
                                    });
                                    that.tableColumns.push({
                                        title:  key.replace(/'/g, '') + '(人工)',
                                        key: key,
                                        width: 120,
                                        align: 'center',
                                        render(h, params) {
                                            var text = '', colid = '';
                                            var Input_dom = null;
                                            if (!params.row[params.column.key]) {
                                                Input_dom = h('Input', {
                                                    props: {
                                                        disabled: true
                                                    }
                                                })
                                            }
                                            else {
                                                text = params.row[params.column.key].split('|')[1];
                                                colid = params.row[params.column.key].split('|')[2];

                                                Input_dom = h('Input', {
                                                    props: {
                                                        value: text
                                                    },
                                                    on: {
                                                        'on-change'(e) {
                                                            that.updateDataList[colid] = {
                                                                artificalData: e.target.value,
                                                                id: colid
                                                            }
                                                        }
                                                    }
                                                })

                                            }
                                            return h('div', [Input_dom]);
                                        }
                                    });

                                    that.tableColumns2.push({
                                        title: key.replace(/'/g, ''),
                                        key: key,
                                        width: 120,
                                        align: 'center',
                                        render(h, params) {
                                            var text = '';

                                            if (params.row.collectionTime === '平均偏差值' || params.row.collectionTime === '最大偏差值'){
                                                return h('div', params.row[params.column.key]);
                                            }

                                            if (!params.row[params.column.key]) {
                                                text = '未采集';
                                            }
                                            else {
                                                text = params.row[params.column.key].split('|')[0];
                                            }

                                            return h('div', text);
                                        }
                                    });
                                    that.tableColumns2.push({
                                        title: key.replace(/'/g, '') + '(人工)',
                                        key: key,
                                        width: 120,
                                        align: 'center',
                                        render(h, params) {
                                            var text = '';

                                            if (params.row.collectionTime === '平均偏差值' || params.row.collectionTime === '最大偏差值'){
                                                return h('div', '');
                                            }

                                            if (!params.row[params.column.key]) {
                                                text = '';
                                            }
                                            else {
                                                text = params.row[params.column.key].split('|')[1];
                                            }

                                            return h('div', text);
                                        }
                                    });

                                }

                            }

                            if(key !== 'collectionTime' && !!v[key]) {
                                var v1 = v[key].split('|')[0];
                                var v2 = v[key].split('|')[1];

                                console.log(v1 + '  -- ' + v2);

                                if (v2 !== '') {
                                    that.oDeviation[key].push(Math.abs(v1 - v2).toFixed(2));
                                }
                            }


                        }
                    })

                    // 计算平均偏差值
                    that.average = 0;
                    var len = 0;
                    for(var k in that.oDeviation){
                        that.oDeviation[k].forEach(function (val) {
                            ++len;
                            that.average += parseFloat(val);
                        });
                    }

                    console.dir(this.oDeviation);

                    that.average = (that.average / len).toFixed(2);
                }
            },

            chart_data1: {
                deep: true,
                handler(val) {
                    var that = this;
                    that.chart1_option.xAxis.data = [];
                    that.chart1_option.series[0].data = [];
                    that.chart1_option.tooltip = {};

                    if (that.equipmentInfo.equipmentType === 'equipment') {
                        val.forEach(function (v) {
                            that.chart1_option.tooltip.formatter = '{a}:{c}';
                            that.chart1_option.xAxis.data.push(v.collectionTime);
                            that.chart1_option.series[0].data.push(parseFloat(v.quantValue));
                        });

                        for (var i = 0; i < that.chart1_selectData.length; i++) {

                            if (that.chart1_selectData[i].itemId === that.factor_select_value) {

                                that.chart1_option.series[0].name = that.chart1_selectData[i].itemName;
                                break;
                            }
                        }
                    }
                    else if(that.equipmentInfo.equipmentType === 'instrument') {
                        val.forEach(function (v) {
                            that.chart1_option.xAxis.data.push(v.collectionTime);
                            that.chart1_option.series[0].data.push(parseFloat(v.electric));
                            that.chart1_option.series[0].name = '电流';
                            that.chart1_option.tooltip.formatter = '{a}(mA):{c}';
                        });
                    }

                    that.chart1.setOption(that.chart1_option);
                }
            },
            // 图表1 因子选择变化重新获取数据
            factor_select_value(val) {
                this.getChart1_data();
            },
            chart_data2: {
                deep: true,
                handler(val) {
                    var that = this;

                    that.chart2_option.radar.indicator = [];
                    that.chart2_option.series[0].data[0].value = [];
                    that.chart2_option.series[0].data[1].value = [];

                    if (that.equipmentInfo.equipmentType === 'equipment') {
                        that.chart2_option.tooltip.position = 'left';
                        that.chart2_option.legend.data = ['设备采集', '人工采集'];

                        val.forEach(function (v) {
                            that.chart2_option.radar.indicator.push({
                                name: v.itemName,
                                max: parseFloat(v.standardMax)
                            });

                            that.chart2_option.series[0].data[0].value.push(parseFloat(v.quantValue || 0));
                            that.chart2_option.series[0].data[0].name = '设备采集';
                            that.chart2_option.series[0].data[1].value.push(parseFloat(v.artificialData || 0));
                            that.chart2_option.series[0].data[1].name = '人工采集';
                        })
                    }
                    else if (that.equipmentInfo.equipmentType === 'instrument') {

                        that.chart2_option.tooltip.position = 'left';
                        that.chart2_option.legend.data = ['设备运行时长'];
                        that.chart2_option.radar.indicator = [
                                                                { name: '24', max: 60},
                                                                { name: '23', max: 60},
                                                                { name: '22', max: 60},
                                                                { name: '21', max: 60},
                                                                { name: '20', max: 60},
                                                                { name: '19', max: 60},
                                                                { name: '18', max: 60},
                                                                { name: '17', max: 60},
                                                                { name: '16', max: 60},
                                                                { name: '15', max: 60},
                                                                { name: '14', max: 60},
                                                                { name: '13', max: 60},
                                                                { name: '12', max: 60},
                                                                { name: '11', max: 60},
                                                                { name: '10', max: 60},
                                                                { name: '09', max: 60},
                                                                { name: '08', max: 60},
                                                                { name: '07', max: 60},
                                                                { name: '06', max: 60},
                                                                { name: '05', max: 60},
                                                                { name: '04', max: 60},
                                                                { name: '03', max: 60},
                                                                { name: '02', max: 60},
                                                                { name: '01', max: 60}
                                                            ];

                        that.chart2_option.series[0].data[0].value = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
                        that.chart2_option.series[0].data[0].name = '设备运行时长';

                        that.chart2_option.series[0].data[1].value = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,];
                        that.chart2_option.series[0].data[1].name = '设备使用时长';

                        // 测试数据
                       // that.chart2_option.series[0].data[0].value = [60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60,60];
                       // that.chart2_option.series[0].data[1].value = [0,0,0,30,30,0,0,30,60,60,0,0,0,30,60,30,0,0,0,0,0,0,0,0];

                        val.forEach(function (v, idx) {


                           that.chart2_option.series[0].data[0].value[24-parseInt(MOMENT(v.collectionTime).format('H'))] = parseFloat(v.runTime || 0);
                           that.chart2_option.series[0].data[1].value[24-parseInt(MOMENT(v.collectionTime).format('H'))] = parseFloat(v.useTime || 0);

                        })
                    }

                    that.chart2.setOption(that.chart2_option);
                }
            },


        },
        mounted() {
            this.gisInit();
            this.setChart();
            this.getDict();

            // this.searchParams_equipData.beginDate = this.datePicker_default[0].format('YYYY-MM-DD HH:mm:ss');
            // this.searchParams_equipData.endDate = this.datePicker_default[1].format('YYYY-MM-DD HH:mm:ss');
        },
        methods: {
            gisInit() {
                var that = this;
                this.map = new BMap.Map('gis_box', {enableMapClick:false, minZoom:3,maxZoom:24});    // 创建Map实例,关闭底图可点功能
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
                var chart1_option = {
                    color: ['#00c0dd','#ff931e'],
                    legend: {
                        show: false,
                        align: 'left',
                        right: 20,
                        data: []
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 20,
                        left: 40,
                        bottom: 60
                    },
                    xAxis: {
                        type: 'category',
                        data: [],
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
                            show:false,
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
                    series: [
                    //     {
                    //     name: '图一',
                    //     data: [820, 932, 901, 934],
                    //     type: 'line',
                    //     smooth: true,
                    //     areaStyle: {
                    //         normal: {
                    //             color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //                 offset: 0,
                    //                 color: 'rgba(0, 192, 221, 0.8)'
                    //             }, {
                    //                 offset: 1,
                    //                 color: 'rgba(0, 192, 221,0)'
                    //             }])
                    //         }
                    //     }
                    // }, {
                    //         name: '图二',
                    //         data: [820, 932, 901, 934],
                    //         type: 'line',
                    //         smooth: true,
                    //         areaStyle: {
                    //             normal: {
                    //                 color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    //                     offset: 0,
                    //                     color: 'rgba(255,147,30, 0.8)'
                    //                 }, {
                    //                     offset: 1,
                    //                     color: 'rgba(255,147,30,0)'
                    //                 }])
                    //             }
                    //         }
                    //     }
                    ]
                };

                this.chart1.setOption(chart1_option);

                this.chart2 = Echarts.init(this.$refs.chart2);
                var chart2_option = {
                    color: ['#00c0dd','#ff931e'],
                    title: {
                        show: false,
                        text: '基础雷达图'
                    },
                    tooltip: {
                        postion: []
                    },
                    legend: {
                        show: false,
                        data: ['设备采集', '人工采集']
                    },
                    radar: {
                        shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        indicator: [
                            // { name: '销售', max: 6500},
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
                    series: [
                        // {
                        //     name: '预算',
                        //     type: 'radar',
                        //     areaStyle: {
                        //         normal: {
                        //             color: 'rgba(0, 192, 221, 0.5)'
                        //         }
                        //     },
                        //
                        //     data: [
                        //         {
                        //             value: [4300, 10000, 28000, 35000, 50000, 19000],
                        //             name: '预算分配（Allocated Budget）'
                        //         }
                        //     ]
                        // }
                    ]

                };

                this.chart2.setOption(chart2_option);
            },

            // 获取图表数据
            getChartData() {
                var that = this;
                // 获取折线图因子选择数据


                if (that.equipmentInfo.equipmentType === 'equipment') {
                    that.$http({
                        method: 'get',
                        url: '/panoramic/equipment/getItemIdInOneDay',
                        params: {
                            equipmentNo: that.equipmentInfo.equipmentNo
                        }
                    }).then(function (response) {
                        if(response.status === 1) {
                            
                            if(response.result.length > 0) {
                                that.chart1_selectData = response.result;
                                that.factor_select_value = response.result[0].itemId;
                            }
                            else {
                                that.chart1_selectData = response.result;
                                that.chart_data1 = [];
                            }

                        }

                    }).catch(function (e) {

                    })
                }
                else {
                    that.getChart1_data();
                }


                // 获取雷达图数据

                that.$http({
                    method: 'get',
                    url: '/panoramic/equipment/getRadarChartData',
                    params: {
                        equipmentNo: that.equipmentInfo.equipmentNo,
                        equipmentType: that.equipmentInfo.equipmentType
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.chart_data2 = response.result.radarChartData || [];

                    }
                }).catch(function (e) {

                })
            },
            // 获取折线图数据
            getChart1_data() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/equipment/getLineChartData',
                    params: {
                        equipmentNo: that.equipmentInfo.equipmentNo,
                        equipmentType: that.equipmentInfo.equipmentType,
                        itemId: that.factor_select_value
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.chart_data1 = response.result.lineChartData || [];
                    }

                }).catch(function (e) {

                })
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
                                that.modal_equipment_edit = false;
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

                        that.searchParams_equipData.equipId = response.result.equipmentNo;
                        that.searchParams_equipData.equipmentNo = response.result.equipmentNo;
                        that.searchParams_equipData.equipmentId = response.result.equipmentId;

                        that.getChartData(); // 获取图表数据
                    }
                    else {}
                }).catch(function (e) {
                })
            },


            //  *********************  添加人工数据对比***********
            // 打开弹出矿
            onClick_modal_addComparison() {
                this.isAnalysisResult = false;
                this.modal_data_comparison = true;
                this.getEquipData();
            },
            datePicker_onChange(val) {
                this.searchParams_equipData.beginDate = val[0];
                this.searchParams_equipData.endDate = val[1];
            },
            // 获取设备采集和人工数据
            getEquipData() {
                var that = this;
                that.tableLoading = true;
                that.$http({
                    method: 'post',
                    url: '/panoramic/equipment/queryCollectionData',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams_equipData)
                }).then(function (response) {
                    that.tableLoading = false;
                    that.tableData = response.result.list;

                    if (that.datePicker_default.length === 0) {
                        that.datePicker_default = [new Date(response.result.beginDate),new Date(response.result.endDate)];
                        that.searchParams_equipData.beginDate = response.result.beginDate;
                        that.searchParams_equipData.endDate = response.result.endDate;
                    }

                    if (that.isAnalysisResult) {
                        that.saveContrastDetail();
                    }

                }).catch(function (e) {
                    that.tableLoading = false;
                })
            },

            // 添加人工数据对比
            onClick_modal_search() {
                this.getEquipData();
            },
            // 开始分析
            onClick_modal_analyze() {
                var that = this;

                var attrList = [];
                for(var key in that.updateDataList){
                    attrList.push(that.updateDataList[key]);
                }

                if (attrList.length === 0) {
                    that.isAnalysisResult = true;
                }
                else {
                    that.$http({
                        method: 'post',
                        url: '/panoramic/equipment/saveArtificialData',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        data: JSON.stringify({
                            artificalData: attrList,
                            beginDate: that.searchParams_equipData.beginDate,
                            endDate: that.searchParams_equipData.endDate,
                            equipmentNo: that.searchParams_equipData.equipmentNo
                        })
                    }).then(function (response) {
                        if (response.status === 1) {
                            that.contrastRecordId = response.result.contrastRecordId;
                            that.getEquipData();
                            that.isAnalysisResult = true;
                        }
                        else {}

                    }).catch(function (e) {
                    })
                }
            },

            // 保存分析详情
            saveContrastDetail() {
                var that = this;
                that.$http({
                    method: 'post',
                    url: '/panoramic/equipment/saveContrastDetail',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        contrastRecordId: that.contrastRecordId,
                        contrastDetail: that.contrastDetail,
                        equipmentNo: that.searchParams_equipData.equipmentNo
                    })
                }).then(function (response) {
                    if (response.status === 1) {

                    }
                    else {
                        that.$Message.error({
                            content: '保存分析失败！'
                        })
                    }

                }).catch(function (e) {

                })
            },
            //
            onClick_modal_analyze_ok() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/equipment/updateStarLevel',
                    // headers: {
                    //     'Content-Type': 'application/json;charset=utf-8'
                    // },
                    params: {
                        equipmentId: that.equipmentInfo.equipmentId,
                        starLevel: that.starLevel
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.$Message.success({
                            content: '添加成功！'
                        });

                        that.getEquipmentInfo_detail();

                        that.modal_data_comparison = false;
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
                })
            },

            rowClassName (row, index) {
                if (row.collectionTime === '平均偏差值' || row.collectionTime === '最大偏差值') {
                    return 'table-info-row';
                }
                return '';
            }

        }
    }
</script>

<style lang="scss" scoped>
    .gis-container {
        position: relative;
        height: 100%;

        overflow-y: auto;
        overflow-x: hidden;
        .gis-box {
            min-height: 800px;
            height: 100%;
        }

        .left-panel {
            position: absolute;
            padding: 0 30px;
            top: 0;
            left: 0;
            bottom: 0;
            width: 314px;
            min-height: 820px;
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

                    &.running {
                        color: #FFF;
                        background-color: #2b85e4;
                    }
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
            min-height: 820px;
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

            .factor-select {
                padding-left: 150px;
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

    .modal_comparison {
        .handle-bar {
            padding: 0px 11px 20px 11px;
            overflow: hidden;

            .hd {
                margin-right: 12px;
                float: left;

                .form-item {

                    .label {
                        text-align: right;
                        vertical-align: middle;
                        float: left;
                        font-size: 12px;
                        color: #495060;
                        line-height: 1;
                        padding: 10px 12px 10px 0;
                        box-sizing: border-box;
                    }
                    .value {
                        float: right;
                    }
                }
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

    .ivu-table .table-info-row td{
        /*background-color: #2db7f5;*/
        /*color: #2db7f5;*/
        font-weight: 700;
    }
</style>