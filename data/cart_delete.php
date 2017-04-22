<?php

@$uid = $_REQUEST['uid'] or die('uid required');
@$did = $_REQUEST['did'] or die('did required');
@$count = $_REQUEST['count'] or die('did required');

require('init.php');

 $sql = "DELETE  from t_cart  where userid=$uid AND did=$did AND fCount=$count";

  $result=mysqli_query($conn,$sql);

$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);
?>