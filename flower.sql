SET NAMES 'utf8';
DROP DATABASE IF EXISTS flowers;
CREATE DATABASE flowers CHARSET=UTF8;
use flowers;

CREATE TABLE t_product(
	did INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(64),
	price FLOAT(6,2),
	img VARCHAR(64),
	detail VARCHAR(500),
	material VARCHAR(2048)
);

INSERT INTO t_product(did,name,price,img,material,detail) values
(null,"玫瑰",139.8,"img/0080.jpg","1玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0081.jpg","2玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0082.jpg","3玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0083.jpg","4玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0084.jpg","5玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0085.jpg","6玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0086.jpg","7玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0087.jpg","8玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0088.jpg","9玫瑰","送人玫瑰手留余香"),
(null,"玫瑰",139.8,"img/0089.jpg","10玫瑰","送人玫瑰手留余香"),
(null,"蛋糕",139.8,"img/0090.jpg","11玫瑰","情人蛋糕"),
(null,"百合",129.8,"img/0090.png","12玫瑰","什么跟什么"),
(null,"百合",129.8,"img/0091.png","13玫瑰","什么跟什么"),
(null,"百合",129.8,"img/0093.png","14玫瑰","什么跟什么"),
(null,"百合",129.8,"img/0094.png","15玫瑰","什么跟什么"),
(null,"百合",129.8,"img/0095.png","16玫瑰","什么跟什么");


CREATE TABLE t_users(
	userid INT PRIMARY KEY AUTO_INCREMENT,  /*购物车编号*/
	uname VARCHAR(32),    /*用户名*/
	pwd VARCHAR(32),      /*密码*/
	phone VARCHAR(32)     /*电话*/
);
INSERT INTO t_users VALUES
(NULL,'hmm','123','13512345678'),
(NULL,'lilei','123','13501234567'),
(NULL,'kaka','123','13523456789');



CREATE TABLE t_order(
    	oid INT PRIMARY KEY AUTO_INCREMENT,  /*订单ID*/
    	userid INT,      /*用户*/
	phone VARCHAR(16),   /*联系电话*/
	user_name VARCHAR(16),  /*收货方用户名*/
	order_time LONG,  /*下单时间*/
    	addr VARCHAR(256),   /*订单地址*/
	totalprice FlOAT(6,2)   /*订单总价*/
);

INSERT INTO t_order VALUES

(NULL,1,'13512345678','hmm',1445154859209,'深圳宝安',201.5),
(NULL,2,'13501234567','lilei',1445154859209,'深圳宝安',202.5),
(NULL,2,'13501234567','lilei',1445154859209,'深圳宝安',203.5),
(NULL,3,'13523456789','kaka',1445154859209,'深圳宝安',204.5),
(NULL,3,'13523456789','kaka',1445154859209,'深圳宝安',205.5);


CREATE TABLE t_cart(
    ctid INT PRIMARY KEY AUTO_INCREMENT,  /*购物车编号*/
    userid INT,   /*用户编号：假定有用户id为 1 和 3 的两个用户有数据*/
    did INT,    /*产品编号*/
    fCount INT   /*数量*/
);
INSERT INTO t_cart VALUES (1,1,1,1),
(2,1,2,4),
(3,1,5,2),
(4,3,3,6),
(5,3,4,1);
##SELECT * FROM t_order;
/**订单详情表**/
CREATE TABLE t_orderdetails(
    oid INT ,                /*订单编号*/
    did INT,                /*产品id*/
    fCount INT,           /*购买数量*/
    price FLOAT(8,2)    /*产品单价：需要记载，因为产品价格可能波动*/
);
INSERT INTO t_orderdetails VALUES
(1,1,2,5),
(1,2,1,10.5),
(2,3,1,12.5),
(3,1,3,5),
(3,2,4,10),
(4,2,7,5),
(5,3,5,4),
(5,3,2,12.5);
