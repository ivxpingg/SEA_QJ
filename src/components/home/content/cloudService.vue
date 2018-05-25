<template>
    <div class="cloudService-container">
        <div class="cloudService-inner">

            <div class="cloud-title">云服务器申请</div>

            <div class="box-panel area-panel">
                <div class="title">地域</div>
                <ul class="area-list-ul">
                   <li class="area-li">厦门</li>
                </ul>
            </div>

            <div class="box-panel type-panel">
                <div class="title">机型</div>
                <div class="type-list">

                    <div class="item">
                        <div class="type-name">
                            <div>云服务器普及型</div>
                            <div>(2核4GB)</div>
                        </div>
                        <div class="type-desc">
                            并发适中的APP或普通数据处理
                        </div>
                    </div>

                    <div class="item">
                        <div class="type-name">
                            <div>云服务器专业型</div>
                            <div>(4核8GB)</div>
                        </div>
                        <div class="type-desc">
                            使用于并发要求较高的APP
                        </div>
                    </div>

                    <div class="item">
                        <div class="type-name">
                            <div>云服务器高计算型</div>
                            <div>(8核16GB)</div>
                        </div>
                        <div class="type-desc">
                            适用于机器学习，基因工程等
                        </div>
                    </div>

                </div>
            </div>

            <div class="box-panel config-panel">
                <div class="title">配置信息</div>
                <div class="config-list">
                    <div class="attr">
                        <span class="label">主机名称 : </span>
                        <span class="value">云服务器专业型</span>
                    </div>
                    <div class="attr">
                        <span class="label">镜像 : </span>
                        <span class="value">windows 2008 R2 企业版</span>
                    </div>
                    <div class="attr">
                        <span class="label">CPU : </span>
                        <span class="value">4核</span>
                    </div>
                    <div class="attr">
                        <span class="label">内存 : </span>
                        <span class="value">8G</span>
                    </div>
                    <div class="attr">
                        <span class="label">系统盘 : </span>
                        <span class="value">100G</span>
                    </div>
                    <div class="attr">
                        <span class="label">存储盘 : </span>
                        <span class="value">200G</span>
                    </div>
                    <div class="attr">
                        <span class="label">宽带 : </span>
                        <span class="value">5Mbps</span>
                    </div>
                </div>
                <div class="remark">注：如果列表中没有您想要的服务器配置，您可以通过电话0592-987462联系管理员。  或是购买菜单配置服务器后在个人中心>工单管理>向管理员申请升级 </div>
            </div>

            <div class="box-panel other-panel">
                <div class="title">其它</div>
                <div class="param-list">
                    <div class="attr">
                        <span class="label">购买数量</span>
                        <span class="value">
                            <Input v-model="num" number readonly style="width:150px; text-align: center">
                                <span class="btn" slot="prepend" @click="onClick_subtract_num"> - </span>
                                <span class="btn" slot="append" @click="onClick_add_num"> + </span>
                            </Input>
                        </span>
                    </div>

                    <div class="attr">
                        <span class="label">购买时长</span>
                        <span class="value">
                            <Select v-model="duration" style="width:200px">
                                <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </span>
                    </div>

                </div>
            </div>

            <div class="box-panel pay-panel">
                <div class="notice">购买须知：本平台所提供服务器无法提供备案端口，仅作为企业或高校部署项目测试等用途，如果需要入网，可通过代理服务器来实现域名与服务器空间部署的项 目进行端口映射。</div>

                <div class="agreement-p"><Checkbox v-model="single" size="large">用户服务器使用协议</Checkbox></div>

                <div class="cost-b">
                    <span class="label">费用</span>
                    <span class="value">377元</span>
                </div>

                <div class="btn-box">
                    <Button class="btn-1" size="large">立即购买</Button>
                    <Button class="btn-2" size="large">向管理员申请</Button>
                </div>

            </div>

        </div>

        <Modal v-model="modal2"
               title="服务申请表"
               width="360">
            <!--<p slot="header" style="color:#f60;text-align:center">-->
            <!--<Icon type="information-circled"></Icon>-->
            <!--<span>Delete confirmation</span>-->
            <!--</p>-->
            <div style="text-align:center">

            </div>
            <div slot="footer">
                <Button type="info" size="large" >提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "cloudService",
        data() {
            return {
                num: 1,
                duration: '1',
                single: false,

                modal2: false,

                timeList: [{
                    label: '一个月',
                    value: '1'
                },{
                    label: '两个月',
                    value: '2'
                },{
                    label: '三个月',
                    value: '3'
                }]
            };
        },

        methods: {
            onClick_subtract_num() {
                if (this.num <= 1) {
                    this.num = 1;
                }
                else {
                    this.num -= 1;
                }
            },
            onClick_add_num() {
                this.num += 1;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cloudService-container {

        .cloudService-inner {
            margin: 0 auto;
            width: 1200px;

            .cloud-title {
                color: #323232;
                font-size: 33px;
                line-height: 185px;
                text-align: center;
            }

            .box-panel {
                margin-bottom: 12px;
                padding: 20px 32px 30px;
                border: 2px solid #f5f5f5;

                .title {
                    color: #1a1a1a;
                    font-size: 22px;
                }

                .area-list-ul {
                    margin-top: 19px;
                    list-style-type: none;
                    padding: 0;

                    .area-li {
                        margin: 0 8px;
                        display: inline-block;
                        padding: 6px 19px;
                        color: #666666;
                        font-size: 18px;
                        line-height: 20px;
                        border: 1px solid #f7f7f7;
                    }
                }

                .type-list {
                    overflow: hidden;
                    .item {
                        margin-top: 12px;
                        margin-right: 110px;
                        padding: 0 0 20px 0;
                        float: left;
                        width: 304px;
                        border: 1px solid #f7f7f7;
                        cursor: pointer;

                        &:last-child {
                            margin-right: 0;
                        }

                        &:hover {
                            .type-name {
                                color: #FFF;
                                background-color: #00c0dd;
                            }
                        }
                        &.active {
                            .type-name {
                                color: #FFF;
                                background-color: #00c0dd;
                            }
                        }

                        .type-name {
                            padding-top: 12px;
                            padding-bottom: 6px;
                            color: #1a1a1a;
                            font-size: 18px;
                            line-height: 26px;
                            text-align: center;
                            transition: all 0.2s;
                        }

                        .type-desc {
                            margin-top: 18px;
                            color: #666666;
                            font-size: 18px;
                            line-height: 26px;
                            text-align: center;
                        }
                    }
                }

                .config-list {
                    margin-top: 20px;
                    .attr{
                        color: #1a1a1a;
                        font-size: 18px;
                        line-height: 38px;
                    }
                }

                .remark {
                    margin-top: 18px;
                    color: #666666;
                    font-size: 18px;
                    line-height: 36px;
                }

                .param-list {
                    margin-top: 16px;
                    .attr {
                        display: flex;
                        height: 40px;
                        margin-bottom: 40px;

                        .label {
                            padding-right: 23px;
                            color: #1a1a1a;
                            font-size: 16px;
                            line-height: 40px;

                        }
                        .value {
                            flex: 1;
                            padding: 4px 0;

                            .btn {
                                cursor: pointer;
                                padding: 0 5px;
                            }
                        }
                    }
                }
                
                .notice {
                    color: #1a1a1a;
                    font-size: 16px;
                    line-height: 32px;
                }

                .agreement-p {
                    margin-top: 30px;
                }

                .cost-b {
                    margin-top: 35px;
                    color: #1a1a1a;
                    .label {
                        padding-right: 45px;
                        font-size: 22px;
                    }

                    .value {
                        font-size: 32px;
                    }
                }

                .btn-box {
                    margin-top: 50px;

                    .ivu-btn {
                        margin-right: 35px;
                    }

                    .btn-1 {
                        color: #FFF;
                        background-color: #00c0dd;
                        border-color: #00c0dd;

                        &:hover {
                            background-color: rgba(0,192,221, 0.8);
                            border-color: rgba(0,192,221, 0.8);
                        }
                    }

                    .btn-2 {
                        color: #FFF;
                        background-color: #546478;
                        border-color: #546478;

                        &:hover {
                            background-color: rgba(84,100,120, 0.8);
                            border-color: rgba(84,100,120, 0.8);
                        }
                    }
                }
            }
        }
    }
</style>