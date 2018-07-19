<template>
    <div class="industryData-container">
        <div class="industryData-inner">
            <div class="industry-title">行业数据申请 · 所有类别</div>
            <div class="sub-title">
                <span>生物</span>
                <span>水质</span>
                <span>科研</span>
            </div>

            <div class="search-bar">
                <div class="handle-bar">

                    <div class="hd">
                        <div class="form-item">
                            <!--<label class="label" for="userOrder_keyword"></label>-->
                            <div class="value">
                                <Input id="userOrder_keyword" v-model="searchParams.keyword" placeholder="输入关键字查询"></Input>
                            </div>
                        </div>
                    </div>

                    <div class="hd">
                        <Button type="primary" @click="getData">查询</Button>
                    </div>

                </div>
            </div>

            <div class="list-panel">

                <div v-for="item in dataResourceList" class="item">
                    <div class="img"
                         @click="onClick_detail_dataResource(item.dataType, item.industryDataId)"></div>
                    <div class="info-panel">
                        <div class="title">{{item.dataName}}</div>
                        <div class="attr">数据数量: <span>{{item.dataNumber}}</span>条</div>
                        <div class="attr">数据时效: <span>{{transformFormat(item)}}</span></div>
                        <div class="attr">数据格式: <span>{{item.format}}</span></div>
                        <div class="attr">数据内容: <span>{{item.dataContent}}</span></div>
                    </div>
                    <div class="apply-panel">
                        <div class="num">申请数: <span>{{item.applyTimes}}</span></div>
                    </div>
                    <div class="btn-panel">
                        <Button size="large" style="width: 150px" @click="onClick_freeApply_modal(item)">免费申请</Button>
                    </div>
                </div>

            </div>
            <div class="list-page-panel">
                <Page :total="searchParams.count" @on-change="onPageNo_change"></Page>
            </div>

        </div>

        <Modal v-model="modal_freeApply"
               title="行业数据申请">
            <div>
                <Form ref="freeApplyInfo" :model="freeApplyInfo" :label-width="85" :rules="freeApplyInfo_rules">
                    <FormItem label="申请单位：" prop="applyUnit">
                        <Input v-model="freeApplyInfo.applyUnit" placeholder="请输入申请单位"></Input>
                    </FormItem>

                    <FormItem label="申请人：" prop="applyPerson">
                        <Input v-model="freeApplyInfo.applyPerson" placeholder="请输入申请人"></Input>
                    </FormItem>

                    <FormItem label="附件信息：" prop="certificate">
                        <vImgUpload
                                :onSuccess="upload_add_img_eidt"></vImgUpload>
                    </FormItem>

                    <FormItem label="联系电话：" prop="phone">
                        <Input v-model="freeApplyInfo.phone" placeholder="请输入联系电话"></Input>
                    </FormItem>

                    <FormItem label="联系邮箱：" prop="mail">
                        <Input v-model="freeApplyInfo.mail" placeholder="请输入邮箱"></Input>
                    </FormItem>

                    <FormItem label="申请内容：" prop="bannerName">
                        <Input type="textarea"
                               v-model="freeApplyInfo.content"
                               :rows="3"

                               readonly></Input>
                    </FormItem>
                    <FormItem label="用途说明与特殊要求：" prop="useDescription">
                        <Input type="textarea"
                               v-model="freeApplyInfo.useDescription"
                               :rows="3"></Input>
                    </FormItem>

                </Form>
            </div>
            <div slot="footer">
                <Button type="primary"
                        size="large"
                        @click="onClick_freeApply">申请</Button>
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
    import vImgUpload from '../../upload/imgUpload';
    import Config from '../../../libs/appConfig/config';
    import Moment from 'moment';
    export default {
        name: "industryData",
        data() {
            return {
                searchParams: {
                    pageNo: 1, // 当前页
                    pageSize: 10, // 每页几行
                    count: 0,     // 总页数
                    keyword: ''
                },
                dataResourceList: [],

                // 免费申请弹窗
                modal_freeApply: false,
                freeApplyInfo: {
                    industryDataId: '',
                    userId: '',
                    applyUnit: '',
                    applyPerson: '',
                    certificate: '',
                    phone: '',
                    mail: '',
                    useDescription: '',

                    content: ''
                },
                freeApplyInfo_rules: {
                    applyUnit: [
                        { required: true, message: '申请单位不能为空', trigger: 'blur'}
                    ],
                    applyPerson: [
                        { required: true, message: '申请人不能为空', trigger: 'blur'}
                    ],
                    certificate: [
                        { required: true, message: '附件信息不能为空', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur'}
                    ],
                    mail: [
                        { required: true, message: '联系邮箱不能为空', trigger: 'blur'}
                    ],
                    useDescription: [
                        { required: true, message: '用途说明与特殊要求不能为空', trigger: 'blur'}
                    ]
                },

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
                tableColumns_detail_water: [
                    { title: '采集时间', key: 'collectionTime', align: 'center', width: 200, fixed: "left" },
                    { title: '供电电压', key: 'battVolt', align: 'center', width: 120 },
                    { title: 'tempEnc', key: '电子仓的温度', align: 'center', width: 120 },
                    { title: '电子仓湿度', key: 'rhEnc', align: 'center', width: 120 },
                    { title: '纬度时', key: 'latDeg', align: 'center', width: 120 },
                    { title: '纬度分', key: 'longDeg', align: 'center',  width: 120 },
                    { title: '经度分', key: 'longMin', align: 'center',  width: 120 },
                    { title: '北斗经度时', key: 'bdLongDeg', align: 'center',  width: 120 },
                    { title: '北斗经度分', key: 'bdLongMin', align: 'center',  width: 120 },
                    { title: '北斗经度秒', key: 'bdLongSec', align: 'center',  width: 120 },
                    { title: '北斗经度保留字段', key: 'bdLongSec1', align: 'center',  width: 120 },
                    { title: '北斗纬度时', key: 'bdLatDeg', align: 'center',  width: 120 },
                    { title: '北斗纬度分', key: 'bdLatMin', align: 'center',  width: 120 },
                    { title: '北斗纬度秒', key: 'bdLatSec', align: 'center',  width: 120 },
                    { title: '北斗纬度保留字段', key: 'bdLatSec1', align: 'center',  width: 120 },
                    { title: '北斗精度', key: 'bdAccuracy', align: 'center',  width: 120 },
                    { title: '温度', key: 'tempC', align: 'center',  width: 120 },
                    { title: '相对电导', key: 'spCond', align: 'center',  width: 120 },
                    { title: '电导', key: 'cond', align: 'center',  width: 120 },
                    { title: '盐度', key: 'sal', align: 'center',  width: 120 },
                    { title: 'TDS', key: 'tds', align: 'center',  width: 120 },
                    { title: 'pH', key: 'ph', align: 'center',  width: 120 },
                    { title: 'PH_mV', key: 'phMv', align: 'center',  width: 120 },
                    { title: '溶解氧_百分比', key: 'doPer', align: 'center',  width: 120 },
                    { title: '溶解氧', key: 'doPpm', align: 'center',  width: 120 },
                    { title: '浊度', key: 'turbNtu', align: 'center',  width: 120 },
                    { title: '叶绿素', key: 'chlPpb', align: 'center',  width: 120 },
                    { title: '叶绿素Chl_RFU', key: 'chlRfu', align: 'center',  width: 120 },
                    { title: '蓝绿藻', key: 'bgaPePpb', align: 'center',  width: 120 },
                    { title: 'BGA_PE_RFU', key: 'bgaPeRfu', align: 'center',  width: 120 },
                    { title: '磷酸盐', key: 'po4', align: 'center',  width: 120 },
                    { title: '氨氮', key: 'nh3', align: 'center',  width: 120 },
                    { title: '亚硝酸盐', key: 'no2', align: 'center',  width: 120 },
                    { title: '硝酸盐', key: 'no3', align: 'center',  width: 120 },
                    { title: '电子仓内温度', key: 'npaTemp', align: 'center',  width: 120 },
                    { title: '电子仓内湿度', key: 'npaHumid', align: 'center',  width: 120 },
                    { title: '气压', key: 'airPressure', align: 'center',  width: 120 },
                    { title: '气温', key: 'airTemp', align: 'center',  width: 120 },
                    { title: '湿度', key: 'humidness', align: 'center',  width: 120 },
                    { title: '风速', key: 'windSpeed', align: 'center',  width: 120 },
                    { title: '风向', key: 'windDir', align: 'center',  width: 120 }
                ],
                tableData_detail: [ ],
                ajaxData_detail: [],
            };
        },
        components: {vImgUpload},
        updated() {
            if (this.$store.state.homeScroll) {
                this.$store.state.homeScroll.refresh();
            }
        },
        watch: {
            'searchParams.pageNo': {
                handler(val) {
                    this.getData();
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
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
            getData() {
                var that = this;
                that.$Spin.show();
                this.$http({
                    method: 'post',
                    url: '/panoramic/industryData/list',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    data: JSON.stringify(this.searchParams)
                }).then(function (response) {

                    that.$Spin.hide();
                    if (response.status === 1) {
                        that.searchParams.count =  response.result.page.count;
                        that.dataResourceList = response.result.page.list;
                    }
                    else {
                    }
                }).catch(function (e) {
                    that.$Spin.hide();
                })
            },

            transformFormat(item) {
                return Moment(item.beginTime).format('YYYY年MM月DD日') + ' - ' + Moment(item.endTime).format('YYYY年MM月DD日');
            },

            // 数据免费申请弹窗
            onClick_freeApply_modal(item) {
                var that = this;
                this.modal_freeApply = true;
                this.freeApplyInfo.industryDataId = item.industryDataId;
                this.freeApplyInfo.userId = this.$store.state.uid;

                this.freeApplyInfo.content = item.dataName
                    + ' 数据量:'
                    + item.dataNumber + '条'
                    + '; 数据时效:'
                    + this.transformFormat(item)
                    + '; 数据格式:'
                    + item.format
                    + '; 数据内容:'
                    + (item.description || '')


                this.$http({
                    method: 'get',
                    url: '/panoramic/industryData/detail',
                    params: {
                        industryDataId: item.industryDataId
                    }
                }).then(function (response) {
                    if (response.status === 1) {

                    }
                    else {
                    }
                }).catch(function (e) {
                })
            },
            // 附件上传成功
            upload_add_img_eidt(fileList) {
                if (fileList.length > 0) {
                    this.freeApplyInfo.certificate = fileList[0].pictureId;
                }
                else {
                    this.freeApplyInfo.certificate = '';
                }
            },
            // 数据免费申请
            onClick_freeApply() {
                var that = this;

                that.$refs['freeApplyInfo'].validate((valid) => {
                    if(valid) {

                        this.$http({
                            method: 'post',
                            url: '/panoramic/dataOrder/applyData',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(this.freeApplyInfo)
                        }).then(function (response) {
                            that.modal_freeApply = false;
                            if (response.status === 1) {
                                that.$Message.success({
                                    content: '申请成功！'
                                });
                            }
                            else {
                                that.$Message.error({
                                    content: '申请失败！'
                                });
                            }
                        }).catch(function (e) {
                            that.$Message.error({
                                content: '请求失败！'
                            });
                        })

                    }
                    else{}
                })

            },


            /**
             *  查看数据资源详情-发布数据
             */
            onClick_detail_dataResource(dataType, industryDataId) {
                var that = this;
                that.modal_dataResource_detail = true;
                that.tableLoading_detail = true;
                that.dataType = dataType;

                that.$http({
                    method: 'get',
                    url: '/panoramic/industryData/detail',
                    params: {
                        industryDataId: industryDataId
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

            .search-bar {
                overflow: hidden;
                .handle-bar {
                    float: right;
                    padding: 17px 11px 20px 11px;

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
                        cursor: pointer;

                        &:hover {
                            background-image: url('./images/industry-img-active.png');
                        }
                        &:active, &:focus {
                            background-image: url('./images/industry-img-active.png');
                        }
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