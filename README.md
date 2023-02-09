[toc]

# 搭建express后台

```bash
npm i express-generator -g
express --version
express -e demo
npm i

# 监控你 node.js 源代码的任何变化和自动重启你的服务器
npm i nodemon -g
# 一般安装后会单独配个脚本npm run watch

# 连接数据库、解决跨域
npm i mongoose cors -S
```

使用mongodb
```bash
# 查看版本，是否安装mongodb
mongo -version

# 启动
mongo
```

这是报错啦
```txt
MongoDB shell version v5.0.9
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed: SocketException: Error connecting to 127.0.0.1:27017 :: caused by :: ����Ŀ�����������ܾ����޷����ӡ� :
connect@src/mongo/shell/mongo.js:372:17
@(connect):2:6
exception: connect failed
exiting with code 1
```

以上意思是mongoDB的服务的没打开
使用管理员权限打开cmd，打开服务
```bash
net start mongoDB
```

再次在另外一个powershell或者终端启动mongo
```bash
mongo
```

当然上面那个mongoDB服务也可以关闭
```bash
net stop mongoDB
```

省略创建db文件夹，connect.js、model.js

```bash
# 查看所有的数据库列表
show dbs

# use切换数据库时，若库存在则切换，如果数据库不存在则创建并切换
# use创建的数据库只是一个空的数据库，没有集合，所以`show dbs`不显示空数据库。
use scorecms

# 空数据库，列表中没有scorecms
show dbs

# 当前所在数据库
db

# 插入一条数据
# db.表名/集合名.insert(JSON格式数据)
db.ids.insert({id:1,name:"测试1"})

# 有了一条数据，数据库列表中就有scorecms
show dbs

# 查看当前数据库中的集合列表
show tables
# 或
show collections

# db.表名/集合名.find();    # 获取全部（推荐）
# db.表名/集合名.find({});  # 获取全部[可以写条件]
db.ids.find()
```

connect.js配置，然后连接数据库...

插入json数据，插入成功会显示多少条，建议先只用左括号，粘贴进去后再补右括号
```bash
db.goods.insert(JSON格式数据)
```

定义表结构
。。。

