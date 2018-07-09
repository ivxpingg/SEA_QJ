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
                    <div class="img"></div>
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
                <Page :total="searchParams.count"></Page>
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

                    <FormItem label="附件信息：" prop="uploadId">
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
                    <FormItem label="用途说明与特殊要求：" prop="bannerName">
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
                    phone: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur'}
                    ],
                    mail: [
                        { required: true, message: '联系邮箱不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        components: {vImgUpload},
        updated() {
            if (this.$store.state.homeScroll) {
                this.$store.state.homeScroll.refresh();
            }
        },
        watch: {},
        mounted() {
            this.getData();
        },
        methods: {
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