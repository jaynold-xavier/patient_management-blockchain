<?php
	// Design initial table header 
	$data = '<table class="table table-bordered table-striped">
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Age</th>
							<th>isDischarged</th>
						</tr>';

	$query = "SELECT * FROM `ambulances`";

	if (!$result = mysqli_query($conn, $query)) {
        	exit(mysqli_error($conn));
    	}

    // if query results contains rows then featch those rows 
    if(mysqli_num_rows($result) > 0)
    {
    	while($row = mysqli_fetch_assoc($result))
    	{
    		$data .= '<tr>
				<td>'.$row['plate_no'].'</td>
				<td>'.$row['hp_id'].'</td>
				<td>
					<button onclick="GetUserDetails('.$row['plate_no'].')" class="btn btn-warning">Update</button>
				</td>
				<td>
					<button onclick="DeleteUser('.$row['plate_no'].')" class="btn btn-danger">Delete</button>
				</td>
    		</tr>';
    	}
    }
    else
    {
    	// records now found 
    	$data .= '<tr><td colspan="4">Records not found!</td></tr>';
    }

    $data .= '</table>';

    echo $data;
?>