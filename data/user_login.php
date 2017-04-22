<?php
header("content-type:application/json;charset=utf-8");
/*获取用户输入的用户名和密码*/
$uname = $_REQUEST['uname'];
$upwd = $_REQUEST['upwd'];

/*连接数据库*/
require('init.php');

/*执行sql语句查询对应的用户名和密码*/
$sql = "SELECT id,u_name from t_users where u_name='$uname' and u_pwd='$upwd'";
$result = mysqli_query($conn,$sql);

/*抓取结果*/
$row = mysqli_fetch_assoc($result);
/*查询失败返回-1，查询成功返回id*/
$output='';
if($row==null){
  $output='-1';
}else{
  $output=$row['id'];
}
echo json_encode($output);
?>