# /bin/bash

# YApi内网部署流程

# 安装Nnode.js(7.6+)

# 安装MongoDB(2.6+)

# 安装YApi

cd /root
mkdir yapi
cd yapi

# 或者下载 zip 包解压到 vendors 目录
# clone 整个仓库大概 140+ M
# 可以通过 $(git clone --depth=1 https://github.com/YMFE/yapi.git vendors) 命令减少，大概 10+ M
git clone https://github.com/YMFE/yapi.git vendors

# 复制完成后请修改相关配置
# .config.json中db的配置示例：
# "db": {
#     "servername": "192.168.10.31",
#     "DATABASE": "admin",
#     "port": 27017,
#     "user": "xxx",
#     "pass": "xxx",
#     "authSource": ""
#   }
cp vendors/config_example.json ./config.json

cd vendors
npm install --production --registry https://registry.npm.taobao.org

# 安装程序会初始化数据库索引和管理员账号，管理员账号名可在 config.json 配置
# 初始化后，控制台会显示初始的账户名、密码
npm run install-server

# 启动服务器后，请访问 127.0.0.1:{config.json配置的端口}，初次运行会有个编译的过程，请耐心等候
node server/app.js
