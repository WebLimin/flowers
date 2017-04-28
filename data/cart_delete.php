<?php
header("Content-Type:application/json");
@$uid = $_REQUEST['uid'] or die('uid required');
@$did = $_REQUEST['did'] or die('did required');
@$count = $_REQUEST['count'] or die('did required');
require('init.php');
$sql = "DELETE  from t_cart  where userid=$uid AND did=$did AND fCount=$count";
$result=mysqli_query($conn,$sql);
if($result){
  $sql = "SELECT t_cart.ctid,t_cart.did,t_cart.fCount,t_product.name,t_product.img,t_product.price FROM t_product,t_cart WHERE t_cart.did=t_product.did AND t_cart.userid='$uid'";
  $result = mysqli_query($conn,$sql);
  $output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
}else{
 $output="";
}
echo json_encode($output);
?>