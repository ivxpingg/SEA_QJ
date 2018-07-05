<template>
    <div class="dataResourceMange-container">
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
                    <Button type="primary" @click="onClick_add_modal">发布数据</Button>
                </div>

            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count"
                      show-total
                      @on-change="onPageNo_change"></Page>
            </div>

        </div>

        <Modal v-model="modal_add_dataResource"
               title="发布数据">
            <div>
                <Form ref="add_dataResource_form"
                      :model="add_dataResource_info"
                      :rules="dataResourceInfo_rules"
                      :label-width="80">
                    <FormItem label="数据名称:" prop="dataName">
                        <Input type="text"
                               v-model="add_dataResource_info.dataName"
                               placeholder="请输入数据名称" />
                    </FormItem>
                    <FormItem label="数据时效:" prop="addTime">
                        <DatePicker v-model="datePicker_default_add"
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    placeholder="日期选择"
                                    @on-change="datePicker_onChange_add_dataResource"
                                    style="width: 220px"></DatePicker>
                    </FormItem>
                    <FormItem label="描述:">
                        <Input type="textarea"
                               v-model="add_dataResource_info.description"
                               placeholder="请输入数据描述" />
                    </FormItem>

                    <FormItem label="数据类型">
                        <Select v-model="add_dataResource_info.dataType"
                                transfer
                                style="width: 180px" placeholder="">
                            <Option v-for="item in dict_dataType"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="上传数据资源文件:">
                        <Upload :action="add_dataResource_info.fileUploadUrl"
                                :on-success="onSuccess_file">
                            <Button type="ghost"
                                    icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="位置选择">
                        <Select v-model="add_dataResource_info.position"
                                transfer
                                style="width: 180px" placeholder="">
                            <Option v-for="item in dict_showPosition"
                                    :key="item.id"
                                    :value="item.value"
                                    :label="item.label"></Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="onClick_add_dataResource">保存</Button>
            </div>
        </Modal>

        <Modal v-model="modal_dataResource_detail"
               :width="1000"
               title="数据内容">
               <Table border
                      :height="400"
                      :loading="tableLoading_detail"
                      :columns="dataType === 'BiologyPolularScience' ? tableColumns_detail_kp : tableColumns_detail_water"
                      :data="tableData_detail"></Table>
        </Modal>

    </div>
</template>

<script>
    import Moment from 'moment';
    import Config from '../../../libs/appConfig/config';
    export default {
        name: "dataResourceMange",
        data() {
            var that = this;
            return {
                datePicker_default: [],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    startTime: '',
                    endTime: '',
                },

                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '数据名称',
                        key: 'dataName',
                        align: 'center'
                    },{
                        title: '数据数量',
                        key: 'dataNumber',
                        align: 'center'
                    },{
                        title: '数据时效',
                        align: 'center',
                        render(h, params) {
                            var text = Moment(params.row.beginTime).format('YYYY-MM-DD') + ' 至 ' + Moment(params.row.endTime).format('YYYY-MM-DD');
                            return h('div', text);
                        }
                    },{
                        title: '价格',
                        key: 'price',
                        align: 'center'
                    },{
                        title: '格式',
                        key: 'format',
                        align: 'center'
                    },{
                        title: '发布日期',
                        key: 'publishTime',
                        align: 'center'
                    },{
                        title: '申请次数',
                        key: 'applyTimes',
                        align: 'center'
                    },{
                        title: '操作',
                        align: 'center',
                        width: 220,
                        render(h, params) {

                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_detail_dataResource(params.row);
                                        }
                                    }
                                }, '详情'),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style: {
                                        textDecoration: 'underline'
                                    },
                                    on: {
                                        click() {
                                            that.onClick_del_dataResource(params.row);
                                        }
                                    }
                                }, '删除'),

                            ]);
                        }
                    }

                ],
                tableData: [
                    {
                        // applyTimes: 100,
                        // beginTime:"2018-05-25 03:27:40",
                        // dataName:"海洋水质数据",
                        // dataNumber:1000,
                        // endTime:"2018-05-25 03:27;45",
                        // format: "execl",
                        // industryDataId:"1",
                        // price: 0,
                        // publishTime:"2018-05-25 03:28:16"
                    }
                ],

                // 发布数据
                modal_add_dataResource: false,
                datePicker_add_default: [],
                add_dataResource_info: {
                    dataName: '',
                    beginTime: '',
                    endTime: '',
                    description: '',
                    showPosition: 'ListPage',
                    dataType: 'WaterMonitor',
                    uploadId: '',
                    fileUploadUrl: window.location.origin + Config[Config.env].ajaxUrl + '/sys/upload/file'
                },
                datePicker_default_add: [],
                dataResourceInfo_rules: {
                    dataName: [{ required: true, message: '数据名称不能为空', trigger: 'blur'}],
                    // addTime: [{ required: true, message: '数据时效不能为空', trigger: 'blur'}]
                },

                // 位置字典数据
                dict_showPosition: [],
                dict_dataType: [],

                // 数据资源详情
                dataType: '',
                modal_dataResource_detail: false,
                tableLoading_detail: false,
                // 科普
                tableColumns_detail_kp: [
                    {
                        title: '中文学名',
                        key: 'chineseName',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '拉丁学名',
                        key: 'latinName',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '英文学名',
                        key: 'englishName',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '同种异名',
                        key: 'congenerDiffectName',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '中文俗名',
                        key: 'chineseCommonName',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '命名者',
                        key: 'namer',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '物种资源量',
                        key: 'quantity',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '形态特征',
                        key: 'formFeature',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '生态习性',
                        key: 'ecologicalHabit',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '地理分布',
                        key: 'geographyDistribution',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '经济意义',
                        key: 'economicMean',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '目',
                        key: 'item',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '科',
                        key: 'section',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '属',
                        key: 'genus',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '分类一',
                        key: 'classifyOne',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '分类二',
                        key: 'classifyTwo',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '形态分类',
                        key: 'formClassify',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '背面颜色',
                        key: 'backColor',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    },
                    {
                        title: '侧面颜色',
                        key: 'sideColor',
                        align: 'center',
                        width: 120,
                        ellipsis: true
                    }
                ],
                // 水质
                tableColumns_detail_water: [],
                tableData_detail: [],
                ajaxData_detail: [],


            };
        },
        components: {},
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getTableData();
                }
            },
            ajaxData_detail: {
                deep: true,
                handler(val) {
                    var that = this;
                    that.tableColumns_detail_water = [];
                    var keyList = [];

                    val.forEach(function (v, idx) {
                        for(var key in v) {
                            if (keyList.indexOf(key) < 0) {

                                keyList.push(key);
                                if (key === 'collectionTime') {
                                    that.tableColumns_detail_water.push({
                                        title: '时间',
                                        key: key,
                                        width: 160,
                                        fixed: "left",
                                        align: 'center'
                                    });
                                }
                                else {
                                    that.tableColumns_detail_water.push({
                                        title: key.replace(/'/g, ''),
                                        key: key,
                                        width: 120,
                                        align: 'center'
                                    });

                                }

                            }

                        }
                    })

                }
            }
        },
        mounted() {
            this.getTableData();
            this.getDict();
        },
        methods: {
            datePicker_onChange(val) {
                this.searchParams.startTime = val[0];
                this.searchParams.endTime = val[1];
            },
            datePicker_onChange_add_dataResource(val) {
                this.add_dataResource_info.beginTime = val[0];
                this.add_dataResource_info.endTime = val[1];
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
                this.tableLoading = true;
                this.$http({
                    method: 'post',
                    url: '/panoramic/industryData/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify({
                        pageNo: this.searchParams.pageNo,
                        pageSize: this.searchParams.pageSize,
                        keyword: this.searchParams.keyword,
                        beginDate: this.searchParams.startTime,
                        endDate: this.searchParams.endTime
                    })
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result.page.list;
                        that.searchParams.count = response.result.page.count;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
                    that.$Modal.error({
                        content: JSON.stringify(e)
                    });
                })
            },

            getDict() {
                var that = this;
                this.$http({
                    method: 'get',
                    url: '/sys/dict/listData',
                    params: {
                        type: 'showPosition'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dict_showPosition = response.result;
                    }
                    else {
                    }
                }).catch(function (e) {})

                this.$http({
                    method: 'get',
                    url: '/sys/dict/listData',
                    params: {
                        type: 'dataType'
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.dict_dataType = response.result;
                    }
                    else {
                    }
                }).catch(function (e) {})
            },

            /**
             * 发布数据弹出窗
             */
            onClick_add_modal() {
                this.modal_add_dataResource = true;
            },

            // 上传发布数据
            onSuccess_file(response) {
                if(response.status === 1) {
                    this.add_dataResource_info.uploadId = response.result.pictureId;
                }
            },


            /**
             *  新增发布数据
             */
            onClick_add_dataResource() {
                var that = this;
                that.$refs['add_dataResource_form'].validate((valid) => {
                    if(valid) {
                        that.$http({
                            method: 'post',
                            url: '/panoramic/industryData/add',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.add_dataResource_info)
                        }).then(function (response) {
                            if(response.status === 1) {
                                that.$Message.success({content: '添加成功！'});
                                that.modal_add_dataResource = false;
                                that.getTableData();
                            }
                            else {
                                that.$Message.error({content: '添加失败！'});
                            }

                        }).catch(function (e) {
                            that.$Message.error({content: '添加失败！'});
                            console.log(e);
                        });
                    }
                    else{}
                })
            },

            /**
             *  删除发布数据
             */
            onClick_del_dataResource(row) {
                var that = this;
                this.$Modal.confirm({
                    title: '删除',
                    content: '确定要删除《'+ row.dataName +'》数据资源?',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/industryData/delete',
                            params: {
                                industryDataIds: row.industryDataId
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({content: '删除成功！'});
                                that.getTableData();
                            }
                            else{
                                that.$Message.error({content: '删除失败！'});
                            }
                        }).catch(function (e) {
                        })


                    }

                })
            },

            /**
             *  查看数据资源详情-发布数据
             */
            onClick_detail_dataResource(row) {
                var that = this;
                that.modal_dataResource_detail = true;
                that.tableLoading_detail = true;
                that.dataType = row.dataType;

                that.$http({
                    method: 'get',
                    url: '/panoramic/industryData/detail',
                    params: {
                        industryDataId: row.industryDataId
                    }
                }).then(function (response) {
                    that.tableLoading_detail = false;
                    if(response.status === 1) {
                        that.tableData_detail = response.result;
                        // 生物科普
                        if (row.dataType === 'BiologyPolularScience') {

                        }
                        else {
                            that.ajaxData_detail = response.result;
                        }
                    }
                    else {
                    }

                }).catch(function (e) {
                    that.tableLoading_detail = false;
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dataResourceMange-container {
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
</style>