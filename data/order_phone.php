<?php
header("Content-Type:application/json");

@$phone = $_REQUEST['phone'];
if(empty($phone))
{
    echo '[]';
    return;
}

require('init.php');

$sql = "select t_order.user_name,t_order.did,t_order.oid,t_order.order_time,t_order.addr,t_product.img from t_product,t_order where t_order.did=t_product.did AND t_order.phone='$phone'";
$result = mysqli_query($conn,$sql);
$output = [];
while(true)
{
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }
    $output[] = $row;
}

echo json_encode($output);



?>