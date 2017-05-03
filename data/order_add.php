<?php
header("content-type:application/json;charset=utf-8");
$output = [];
@$userid = $_REQUEST['userid'];
@$phone = $_REQUEST['phone'];
@$user_name = $_REQUEST['user_name'];
@$addr = $_REQUEST['addr'];
@$totalprice = $_REQUEST['totalprice'];
@$cartDetail = $_REQUEST['cartDetail'];
$order_time = time()*1000;
if(empty($userid) || empty($user_name) || empty($phone) || empty($addr) || empty($totalprice) || empty($cartDetail)){
    echo "[]";
    return;
}
require('init.php');
$sql = "insert into t_order values(null,$userid,'$phone','$user_name',$order_time,'$addr',$totalprice)";
$result = mysqli_query($conn,$sql);
$arr = [];
if($result){
    $oid = mysqli_insert_id($conn);
    $cart = json_encode($cartDetail);
    $cart = json_decode($cart);
    foreach ($cart as $value) {
        $sql = "insert into t_orderdetails values('$oid','$value->did','$value->fCount','$value->price')";
        $result = mysqli_query($conn, $sql);
        $sql = "DELETE FROM t_cart WHERE ctid=$value->ctid";
        $result = mysqli_query($conn,$sql);
    }
    $arr['msg'] = 'succ';
    $arr['reason'] = "订单生成成功";
    $arr['oid'] = $oid;
}else{
    $arr['msg'] = 'error';
    $arr['reason'] = "订单生成失败";
}
$output[] = $arr;
echo json_encode($output);
?>
