<?php
header("content-type:application/json");
@$id=$_REQUEST['id'];
if(empty($id))
{
    echo '[]';
    return;
}
require('init.php');

$sql="select * from t_product where did=$id";

$result = mysqli_query($conn,$sql);

$output=[];
$row = mysqli_fetch_assoc($result);
if(empty($row)){
  echo '[]';
}else{
  $output[]=$row;
  echo json_encode($output);
}
?>