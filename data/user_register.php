<?php
header('content-type:application/json;charset=utf-8');
/*获取用户输入的用户名和密码*/
@$name = $_REQUEST['uName'];
@$phone = $_REQUEST['uPhone'];
@$pwd = $_REQUEST['uPwd'];

/*连接数据库*/
require('init.php');
$sql = "select * from t_users where phone='$phone'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
$output = [];
if($row!=null){
  $output[]='err';
}else{
  $sql = "INSERT INTO t_users VALUES(NULL,'$name','$pwd','$phone')";
  $result = mysqli_query($conn,$sql);
  if($result){
     $output[] ="succ";
  }else{
    $output[] = "err";
  }
}
echo json_encode($output);

?>