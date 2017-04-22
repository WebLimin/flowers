<?php

@$uid = $_REQUEST['uid'] or die('uid required');
@$did = $_REQUEST['did'] or die('did required');
@$count = $_REQUEST['count'] or die('did required');

require('init.php');

$sql = "SELECT ctid FROM t_cart WHERE userid=$uid AND did=$did";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
var_dump($row);
if($row){
  if($count == -1)
  {
    $sql = "update t_cart set fCount=fCount+1 where userid=$uid AND did=$did";
  }
  else
  {
    $sql = "update t_cart set fCount='$count' where userid=$uid AND did=$did";
  }

  mysqli_query($conn,$sql);
  $output['code'] = 2;
  $output['msg'] = 'succ';
}else {
  $sql = "INSERT INTO t_cart VALUES(NULL,$uid, $did,1)";
  mysqli_query($conn,$sql);
  $output['code'] = 1;
  $output['msg'] = 'succ';
}

echo json_encode($output);

?>