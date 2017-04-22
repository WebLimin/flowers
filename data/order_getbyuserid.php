<?php
header('content-type:application/json;charset=utf-8');

@$userid = $_REQUEST['userid'];

if(empty($userid)){
    echo "[]";
    return;
}

//访问数据库
require('init.php');

$sql = "SELECT t_order.oid,t_order.userid,t_order.phone,t_order.addr,t_order.totalprice,t_order.user_name,t_order.order_time, ";
$sql .= " t_orderdetails.did,t_orderdetails.fCount,t_orderdetails.price, t_product.name,t_product.img from t_order,t_orderdetails, ";
$sql .= " t_product  WHERE t_order.oid = t_orderdetails.oid and t_orderdetails.did = t_product.did and t_order.userid=$userid ";
$result = mysqli_query($conn, $sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($output);
?>
