<template>
    <div class="industryDataManage-container">
        <vMenuTitle name="行业数据"></vMenuTitle>
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd">
                    <DatePicker :value="datePicker_default"
                                transfer
                                format="yyyy-MM-dd"
                                size="large"
                                type="daterange"
                                placeholder="日期选择"
                                @on-change="datePicker_onChange"
                                style="width: 220px"></DatePicker>
                </div>

            </div>
            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <div class="list-page-panel">
                <!--<Page :total="searchParams.count" @on-change="onPageNo_change"></Page>-->
            </div>
        </div>


        <Modal v-model="modal_dataResource_detail"
               :width="1000"
               title="数据内容">
            <Table border
                   :height="400"
                   :loading="tableLoading_detail"
                   :columns="dataType === 'BiologyPolularScience' ? tableColumns_detail_kp : tableColumns_detail_water"
                   :data="tableData_detail"></Table>
        </Modal>


        <Modal v-model="modal_dataResource_down"
               :width="550"
               title="获取数据">

              <Form :label-width="100">
                  <FormItem label="数据接口信息">
                      <Input v-model="interfaceUrl" readonly />
                  </FormItem>
                  <FormItem label="数据文档下载">
                      <a :href="downloadExcelUrl"
                         target="_blank"
                         class="ivu-btn ivu-btn-ghost">
                          <i data-v-53fcfc71="" class="ivu-icon ivu-icon-ios-cloud-download-outline"></i>
                          <span data-v-53fcfc71="">下载模板</span></a>
                  </FormItem>
              </Form>
        </Modal>

    </div>
</template>

<script>
    import vMenuTitle from './menuTitle/menuTitle';
    import MOMENT from 'moment';
    export default {
        name: "industryDataManage",
        data() {
            var that = this;
            return {
                datePicker_default: [MOMENT().subtract(1, 'month'), MOMENT()],
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: '',
                    beginDate: '',
                    endDate: '',
                    timeInterval: ''
                },
                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    },{
                        title: '订单号',
                        key: 'industryDataId',
                        align: 'center'
                    },{
                        title: '商品名称',
                        key: 'dataName',
                        align: 'center'
                    },{
                        title: '商品内容',
                        key: 'dataContent',
                        align: 'center'
                    },{
                        title: '时效',
                        align: 'center',
                        render(h, params) {
                            return h('div', MOMENT(params.row.beginTime).format('YYYY-MM-DD') + '-' + MOMENT(params.row.endTime).format('YYYY-MM-DD'))
                        }
                    },{
                        title: '操作',
                        align: 'center',
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
                                            that.$Spin.show();

                                            that.$http({
                                                method: 'get',
                                                url: '/panoramic/dataOrder/getIndustryData',
                                                params: {
                                                    orderId: params.row.orderId
                                                }
                                            }).then(function (response) {
                                                if(response.status === 1) {
                                                    that.$Spin.hide();
                                                    that.modal_dataResource_down = true;

                                                    that.downloadExcelUrl = response.result.downloadExcelUrl;
                                                    that.interfaceUrl = response.result.interfaceUrl;
                                                }
                                                
                                            }).catch(function (e) {
                                                that.$Spin.hide();
                                            })
                                        }
                                    }
                                }, '获取'),
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
                                }, '详情')
                            ]);
                        }
                    }],
                tableData: [],

                // ****************  数据资源详情  *********
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

                // ************ 数据获取下载***********
                modal_dataResource_down: false,
                downloadExcelUrl: '',
                interfaceUrl: ''

            };
        },
        components: {vMenuTitle},
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
        created() {
            this.searchParams.beginDate = this.datePicker_default[0].format('YYYY-MM-DD');
            this.searchParams.endDate = this.datePicker_default[1].format('YYYY-MM-DD');
        },
        mounted() {
            this.getTableData();
        },
        methods: {
            // 日期变化
            datePicker_onChange(val) {
                this.searchParams.beginDate = val[0];
                this.searchParams.endDate = val[1];
                this.searchParams.timeInterval = '';
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
                    method: 'get',
                    url: '/panoramic/dataOrder/getApplyDataList',
                    params: {
                        userId: that.$store.state.uid
                    }
                }).then(function (response) {
                    that.tableLoading = false;
                    if (response.status === 1) {
                        that.tableData = response.result;
                        // that.searchParams.count = response.result.page.count;
                    }
                    else {
                        this.$Modal.error({
                            content: response.errMsg
                        });
                    }
                }).catch(function (e) {
                    that.tableLoading = false;
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
    .industryDataManage-container {
        .content-panel {
            margin-top: 23px;
            width: 100%;

            .handle-bar {
                padding: 0;
                overflow: hidden;

                .hd {
                    margin-right: 4px;
                    float: left;
                }

                .my-btn {
                    display: inline-block;
                    padding: 0 14px;
                    font-size: 13px;
                    line-height: 36px;
                    background-color: #d9dee4;
                    cursor: pointer;

                    &:hover {
                        color: #FFF;
                        background-color: #2b85e4;
                    }

                    &.active {
                        color: #FFF;
                        background-color: #2b85e4;
                    }
                }
            }

            .table-panel {
                margin-top: 13px;
            }

            .list-page-panel {
                text-align: center;
                padding: 20px 16px 100px;
            }
        }
    }
</style>