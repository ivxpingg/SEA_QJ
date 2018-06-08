<template>
    <div class="slideshowManage-container">
        <div class="content-panel">
            <div class="handle-bar">
                <div class="hd">
                    <Button type="primary" @click="onClick_modal_add">添加轮播图</Button>
                </div>
            </div>

            <div class="table-panel">
                <Table border :loading="tableLoading" :columns="tableColumns" :data="tableData"></Table>
            </div>
            <!--<div class="list-page-panel">-->
                <!--<Page :total="searchParams.count" @on-change="onPageNo_change"></Page>-->
            <!--</div>-->
        </div>

        <Modal v-model="modal_add"
               title="添加轮播图">
            <div class="">
               <Form ref="addSilderShow" :model="obj_add_silderShow" :label-width="85" :rules="add_rule">
                   <FormItem label="位置：">
                       首页轮播图
                   </FormItem>
                   <FormItem label="图片名称：" prop="bannerName">
                       <Input v-model="obj_add_silderShow.bannerName" placeholder="请输入图片名称"></Input>
                   </FormItem>

                   <FormItem label="广告图片：" prop="uploadId">
                       <vImgUpload :onSuccess="upload_add_img" key="1"></vImgUpload>
                   </FormItem>

                   <FormItem label="链接：" prop="link">
                       <Input v-model="obj_add_silderShow.link" placeholder="请输入链接"></Input>
                   </FormItem>

                   <FormItem label="是否启动：">
                       <i-switch v-model="obj_add_silderShow.isPublish" true-value="1" false-value="0">
                           <span slot="open">开</span>
                           <span slot="close">关</span>
                       </i-switch>
                   </FormItem>

               </Form>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="addSlideshow">添加</Button>
            </div>
        </Modal>

        <Modal v-model="modal_edit"
               title="编辑轮播图">
            <div class="">
                <Form ref="editSilderShow" :model="obj_edit_sliderShow" :label-width="85" :rules="add_rule">
                    <FormItem label="位置：">
                        首页轮播图
                    </FormItem>
                    <FormItem label="图片名称：" prop="bannerName">
                        <Input v-model="obj_edit_sliderShow.bannerName" placeholder="请输入图片名称"></Input>
                    </FormItem>

                    <FormItem label="广告图片：" prop="uploadId">
                        <vImgUpload :onSuccess="upload_add_img_eidt" :defaultList="edit_defaultList" key="2"></vImgUpload>
                    </FormItem>

                    <FormItem label="链接：" prop="link">
                        <Input v-model="obj_edit_sliderShow.link" placeholder="请输入链接"></Input>
                    </FormItem>

                    <FormItem label="是否启动：">
                        <i-switch v-model="obj_edit_sliderShow.isPublish" true-value="1" false-value="0">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </FormItem>

                </Form>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="editSlideshow">提交</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    import vImgUpload from '../../upload/imgUpload';
    import Config from '../../../libs/appConfig/config';
    export default {
        name: "slideshowManage",
        data() {
            var that = this;
            return {
                tableLoading: false,
                tableColumns: [
                    {
                        type: 'index',
                        width: 80,
                        title: '序号',
                        align: 'center'
                    }, {
                        title: '轮播图名称',
                        key: 'bannerName',
                        align: 'center'
                    }, {
                        title: '位置',
                        key: 'position',
                        align: 'center'
                    }, {
                        title: '状态',
                        key: 'isPublish',
                        align: 'center',
                        render(h, params) {
                            return h('span', params.row.isPublish === '1' ? '启用': '关闭');
                        }
                    }, {
                        title: '创建时间',
                        key: 'insTime',
                        align: 'center'
                    }, {
                        title: '操作',
                        align: 'center',
                        render(h, params) {
                            return h('div', [
                                h('i', {
                                    class: 'icon iconfont icon-bianji2 table-icon-btn table-icon-edit',
                                    on: {
                                        click() {
                                            that.onEdit_slideshow(params.row);
                                        }
                                    }
                                }),
                                h('i', {
                                    class: 'icon iconfont icon-shanchu table-icon-btn table-icon-del',
                                    on: {
                                        click() {
                                            that.onDel_slideshow(params.row);
                                        }
                                    }
                                })
                            ])
                        }
                    }
                ],
                tableData: [{
                    bannerName: '12',
                    position: '首页',
                    isPublish: '启用',
                    insTime: '2018-02-02 00:10:12'
                }],

                // 添加
                modal_add: false,
                obj_add_silderShow: {
                    bannerName: '',
                    position: 'HomePage',
                    isPublish: '1',
                    link: '',
                    uploadId: '',    // 图片ID
                },

                add_rule: {
                    bannerName: [
                        { required: true, message: '图片名称不能为空', trigger: 'blur'}
                    ],
                    uploadId: [
                        { required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                    link: [
                        { required: true, message: '链接不能为空', trigger: 'blur'}
                    ]
                },

                // 编辑
                modal_edit: false,
                edit_defaultList: [],
                obj_edit_sliderShow: {
                    bannerId: '',
                    uploadId: '',
                    bannerName: '',
                    position: 'HomePage',
                    isPublish: '1',
                    link: ''
                },

            };
        },
        components: {vImgUpload},
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                var that = this;

                that.$http({
                    method: 'get',
                    url: '/panoramic/banner/list'
                }).then(function (response) {
                    if(response.status === 1) {
                        that.tableData = response.result;
                    }

                }).catch(function (e) {
                   console.log(e);
                });
            },

            onClick_modal_add() {
                this.modal_add = true;
            },

            upload_add_img(fileList) {
                if (fileList.length > 0) {
                    this.obj_add_silderShow.uploadId = fileList[0].pictureId;
                }
                else {
                    this.obj_add_silderShow.uploadId = '';
                }
            },

            upload_add_img_eidt(fileList) {
                if (fileList.length > 0) {
                    this.obj_edit_sliderShow.uploadId = fileList[0].pictureId;
                }
                else {
                    this.obj_edit_sliderShow.uploadId = '';
                }
            },

            // 添加轮播图
            addSlideshow() {
                var that = this;

                this.$refs.addSilderShow.validate((valid) => {
                    if (valid) {
                        that.$http({
                            method: 'post',
                            url: '/panoramic/banner/add',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.obj_add_silderShow)
                        }).then(function (response) {
                            if(response.status === 1) {
                                that.tableData = response.result;

                                that.obj_add_silderShow.bannerName = '';
                                that.obj_add_silderShow.isPublish = '1';
                                that.obj_add_silderShow.link = '';
                                that.obj_add_silderShow.uploadId = '';

                                that.$Message.success({content: '添加成功！'});
                                that.modal_add = false;
                                that.getData();
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

            // 编辑轮播图
            onEdit_slideshow(row) {
                var that = this;

                this.obj_edit_sliderShow.bannerId = row.bannerId;
                this.obj_edit_sliderShow.bannerName = row.bannerName;
                this.obj_edit_sliderShow.uploadId = row.uploadId;
                this.obj_edit_sliderShow.isPublish = row.isPublish;
                this.obj_edit_sliderShow.link = row.link;
                
                this.$http({
                    method: 'get',
                    url: '/panoramic/banner/detail',
                    params: {
                        bannerId: row.bannerId
                    }
                }).then(function (response) {
                    if (response.status === 1) {
                        that.edit_defaultList = [];
                        that.edit_defaultList.push({
                            url: window.location.origin + Config[Config.env].imgUrl + response.result.pictureUrl,
                            name: response.result.bannerName
                        });
                    }
                    
                }).catch(function (e) {

                });

                this.modal_edit = true;
            },
            editSlideshow() {

                var that = this;

                this.$refs.editSilderShow.validate((valid) => {
                    if (valid) {
                        that.$http({
                            method: 'post',
                            url: '/panoramic/banner/update',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify(that.obj_edit_sliderShow)
                        }).then(function (response) {
                            if(response.status === 1) {
                                that.tableData = response.result;

                                that.$Message.success({content: '更新成功！'});
                                that.modal_edit = false;
                                that.getData();
                            }
                            else {
                                that.$Message.error({content: '更新失败！'});
                            }

                        }).catch(function (e) {
                            that.$Message.error({content: '更新失败！'});
                            console.log(e);
                        });
                    } else {

                        return false;
                    }
                });
            },
            // 删除轮播图
            onDel_slideshow(row) {
                var that = this;
                this.$Modal.confirm({
                    title: '删除',
                    content: '确定要删除《'+ row.bannerName +'》?',
                    onOk() {
                        that.$http({
                            method: 'get',
                            url: '/panoramic/banner/delete',
                            params: {
                                bannerId: row.bannerId
                            }
                        }).then(function (response) {
                            if (response.status === 1) {
                                that.$Message.success({content: '删除成功！'});
                                that.getData();
                            }
                            else{
                                that.$Message.error({content: '删除失败！'});
                            }
                        }).catch(function (e) {
                            that.$Message.success({content: JSON.stringify(e)});
                        })


                    }

                })
            },


        }
    }
</script>

<style lang="scss" src="./style/style.scss"></style>
<style lang="scss" scoped>
    .slideshowManage-container {
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
                    margin-right: 4px;
                    float: left;
                }
            }

            .table-panel {
                margin: 13px ;
            }

        }
    }
</style>