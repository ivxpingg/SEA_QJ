<template>
    <div class="footer-container">
        <div class="footer-inner">
            <div class="link-box">
                <div class="link-panel link-panel-1">
                    <div class="title">支持与服务</div>
                    <a class="link" href="#">联系我们</a>
                    <a class="link" href="#">优化与提升</a>
                    <a class="link" href="#">提交建议</a>
                </div>
                <div class="link-panel link-panel-2">
                    <div class="title">支持与服务</div>
                    <a class="link" href="#">管理控制台</a>
                    <a class="link" href="#">域名管理</a>
                    <a class="link" href="#">账号管理</a>
                </div>
                <div class="link-panel link-panel-3">
                    <div class="title">支持与服务</div>
                    <a class="link" href="#">客户案例</a>
                    <a class="link" href="#">分析报告</a>
                    <a class="link" href="#">举报中心</a>
                </div>
                <div class="link-panel link-panel-4">
                    <div class="title">支持与服务</div>
                    <span class="text">电话：400-123-1234</span>
                    <span class="text">邮箱：123456789@qq.com</span>
                    <span class="text">地址：厦门市思明区软件园二期125号</span>
                </div>

                <div class="link-panel link-panel-5">
                    <div class="qr-title">关注海洋全景</div>
                    <div class="qr-img"></div>
                </div>
            </div>
            <div class="cop">Copyright@-2018版权归属haiyang</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "h-footer",
        data() {
            return {};
        }
    }
</script>

<style lang="scss" scoped>
    .footer-container {
        background-color: #373d41;
        border-top: 1px solid #96999c;

        .footer-inner {
            margin: 0 auto;
            padding-bottom: 85px;
            width: 1200px;
            height: 330px;

            .link-box {
                display: flex;

                .link-panel {
                    padding-top: 20px;
                    width: 170px;

                    .title {
                        color: #FFF;
                        font-size: 14px;
                        line-height: 28px;
                    }
                    .link {
                        display: block;
                        margin-top: 16px;
                        color: #9a9d9f;
                        font-size: 12px;
                        line-height: 16px;
                    }
                    .text {
                        display: block;
                        margin-top: 16px;
                        color: #9a9d9f;
                        font-size: 12px;
                        line-height: 16px;
                    }

                    .qr-title {
                        text-align: center;
                        width: 97px;
                        color: #FFF;
                        font-size: 14px;
                        line-height: 28px;
                    }
                    .qr-img {
                        width: 97px;
                        height: 97px;
                        background: url('./images/qr-code-img.png') no-repeat center;
                    }

                    &.link-panel-4 {
                        width: auto;
                        flex: 1;
                    }

                    &.link-panel-5 {
                        margin-right: 70px;
                        width: auto;
                    }
                }
            }
            
            .cop {
                margin-top: 86px;
                text-align: center;
                color: #9a9d9f;
                font-size: 12px;
            }
        }
    }
</style>