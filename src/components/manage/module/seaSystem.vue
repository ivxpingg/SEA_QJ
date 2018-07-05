<template>
    <div class="seaSystem-container">
        <div class="content-panel">

            <div class="handle-bar">

                <div class="hd">
                    <div class="form-item">
                        <label class="label" for="userOrder_keyword">关键字</label>
                        <div class="value">
                            <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="数据名称"></Input>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <div class="form-item">
                        <label class="label">时间</label>
                        <div class="value">
                            <DatePicker
                                    :value="datePicker_default"
                                    :clearable="true"
                                    transfer
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    placeholder="日期选择"
                                    @on-change="datePicker_onChange"
                                    style="width: 220px"></DatePicker>
                        </div>
                    </div>
                </div>

                <div class="hd">
                    <Button type="primary" @click="onClick_search">查询</Button>
                </div>

                <div class="hd">
                    <Button type="primary" @click="onClick_goto">进入试验分析GIS系统</Button>
                </div>

            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading_sea" :columns="tableColumns_sea" :data="tableData_sea"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count"
                      show-total
                      @on-change="onPageNo_change"></Page>
            </div>

        </div>


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
                                                @on-change="datePicker_onChange_2"
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

        <Modal v-model="modal_look_comparison"
               :width="1000"
               title="查看分析">

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
                                            @on-change="datePicker_onChange_2"
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
                       :columns="tableColumns2"
                       :data="tableData2"></Table>
            </div>

        </Modal>

    </div>
</template>

<script>
    import MOMENT from 'moment';
    export default {
        name: "seaSystem",
        data() {
            var that = this;
            return {
                datePicker_default_sea: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                },

                tableLoading_sea: false,
                tableColumns_sea: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '日期',
                        key: 'insTime',
                        align: 'center'
                    },{
                        title: '设备名称',
                        key: 'equipmentName',
                        align: 'center'
                    },{
                        title: '设备编号',
                        key: 'equipmentNo',
                        align: 'center',
                    },{
                        title: '地点',
                        key: 'position',
                        align: 'center'
                    },{
                        title: '设备状态',
                        key: 'equipmentStatus',
                        align: 'center',
                        render(h, params) {
                            return h('div', params.row.equipmentStatus === '0'? '已关闭': '运行中');
                        }
                    },{
                        title: '设备测评分析状态',
                        key: 'analysisStatus',
                        align: 'center',
                        render(h, params) {
                            return h('div', params.row.analysisStatus === '0'? '未分析': '已分析');
                        }
                    },{
                        title: '操作',
                        align: 'center',
                        width: 300,
                        render(h, params) {

                            return h('div', [
                                // h('Button', {
                                //     props: {
                                //         type: 'text'
                                //     },
                                //     style: {
                                //         textDecoration: 'underline'
                                //     },
                                //     on: {
                                //         click() {
                                //             that.onClick_table_edit(params.row);
                                //         }
                                //     }
                                // }, '编辑'),

                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_table_add_analyze(params.row);
                                        }
                                    }
                                },  '开始分析'),

                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_table_look_analyze(params.row);
                                        }
                                    }
                                }, '查看分析'),

                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_table_del(params.row);
                                        }
                                    }
                                }, '删除')

                            ]);
                        }
                    }

                ],
                tableData_sea: [],

                // 添加人工数据对比
                modal_data_comparison: false,
                datePicker_default: [MOMENT('2018-06-29 00:00:00'), MOMENT('2018-07-01 00:00:00')],
                tableLoading: false,
                searchParams_equipData: {
                    equipmentId: '',       // 设备标识
                    equipId: '',           // 设备编号
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

                // 查看分析
                modal_look_comparison: false,
                datePicker_default_look: [],
                tableLoading_look: false,
                searchParams_equipData_look: {
                    equipmentId: '',       // 设备标识
                    equipId: '',           // 设备编号
                    beginDate: '',
                    endDate: ''
                },


            };
        },
        computed: {
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
            }
        },
        components: {},
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getTableData();
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
            }
        },
        mounted() {
            this.getTableData();
            this.searchParams_equipData.beginDate = this.datePicker_default[0].format('YYYY-MM-DD HH:mm:ss');
            this.searchParams_equipData.endDate = this.datePicker_default[1].format('YYYY-MM-DD HH:mm:ss');
        },
        methods: {
            datePicker_onChange(val) {
                this.searchParams.beginDate = val[0];
                this.searchParams.endDate = val[1];
            },
            onClick_search() {
                this.getTableData();
            },
            /**
             * 页码切换
             * @param pageNo
             */
            onPageNo_change(pageNo) {
                this.searchParams.pageNo = pageNo;
            },
            /**
             * 获取表格数据
             */
            getTableData() {
                var that = this;
                this.tableLoading_sea = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/equipment/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams)
                }).then(function (response) {
                    that.tableLoading_sea = false;
                    if (response.status === 1) {
                        that.tableData_sea = response.result.page.list;
                        that.searchParams.count = response.result.page.count;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading_sea = false;
                })
            },

            // 进入试验分析GIS系统
            onClick_goto() {
                this.$router.push({
                    name: 'gisMap'
                });
            },

            /**
             * 编辑
             */
            onClick_table_edit(row) {},

            /**
             * 开始分析
             */
            onClick_table_add_analyze(row) {
                this.searchParams_equipData.equipId = row.equipmentNo;
                this.searchParams_equipData.equipmentId = row.equipmentId;
                this.isAnalysisResult = false;
                this.modal_data_comparison = true;
                this.getEquipData();
            },

            /**
             * 查看分析
             */
            onClick_table_look_analyze(row) {
                this.searchParams_equipData.equipId = row.equipmentNo;
                this.modal_look_comparison = true;
                this.getEquipData();
            },
            datePicker_onChange_2(val) {
                this.searchParams_equipData.beginDate = val[0];
                this.searchParams_equipData.endDate = val[1];
            },
            // 添加人工数据对比
            onClick_modal_search() {
                this.getEquipData();
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
                    that.tableData = response.result;

                }).catch(function (e) {
                    that.tableLoading = false;
                })
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
                            endDate: that.searchParams_equipData.endDate
                        })
                    }).then(function (response) {
                        if (response.status === 1) {
                            that.getEquipData();
                            that.isAnalysisResult = true;
                        }
                        else {}

                    }).catch(function (e) {
                    })
                }
            },
            //
            onClick_modal_analyze_ok() {
                var that = this;
                that.$http({
                    method: 'get',
                    url: '/panoramic/equipment/updateStarLevel',
                    params: {
                        equipmentId: that.searchParams_equipData.equipmentId,
                        starLevel: that.starLevel
                    }
                }).then(function (response) {
                    if(response.status === 1) {
                        that.$Message.success({
                            content: '添加成功！'
                        });

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
            },

            /**
             * 删除分析
             */
            onClick_table_del(row) {
                var that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '确定要删除<'+ row.equipmentName +'>设备？',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/equipment/delete',
                            params: {
                                equipmentIds: row.equipmentId
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
            },
        }
    }
</script>

<style lang="scss" scoped>
    .seaSystem-container {
        .content-panel {
            .handle-bar {
                padding: 17px 11px 20px 11px;
                border: {
                    width: 0 0 1px 0;
                    style: solid;
                    color: #e1e1e1;
                };
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

            .table-panel {
                margin: 13px ;
            }

            .list-page-panel {
                text-align: center;
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

    .ivu-table .table-info-row td{
        /*background-color: #2db7f5;*/
        /*color: #2db7f5;*/
        font-weight: 700;
    }
</style>