# /bin/bash

cd /root
# 下载安装包
curl -OL https://registry.npmmirror.com/-/binary/node/v16.10.0/node-v16.10.0-linux-x64.tar.gz
tar -zxvf node-v16.10.0-linux-x64.tar.gz
mv node-v16.10.0-linux-x64 /usr/node

# 修改文件权限
chown -R root: /usr/node

# 添加到PATH
cd /usr/bin
ln -s /usr/node/bin/node node
ln -s /usr/node/bin/npm npm
ln -s /usr/node/bin/npx npx

# 查看版本号
node -v

# 使用淘宝源更新
# npm install --production --registry https://registry.npm.taobao.org
