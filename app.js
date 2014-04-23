
function DotsController($scope){

	

	$scope.init=function(size){


	$scope.size=size;
	$scope.gameWidth=$scope.size*36+6;
	$scope.gameBoard ={width:$scope.gameWidth+'px',height:$scope.gameWidth+'px'};
	$scope.board=[];
	for(i=0;i<$scope.size*2+1;i++){
		$scope.board.push([]);
		for(j=0;j<$scope.size*2+1;j++){
			if((i%2+j%2)==2){
				$scope.board[i].push(0);
			}
			else{
				$scope.board[i].push('');
			}
		}
	};

	// $scope.board=[
	
	// 	['','','','','','','','',''],
	// 	['',0,'',0,'',0,'',0,''],
	// 	['','','','','','','','',''],
	// 	['',0,'',0,'',0,'',0,''],
	// 	['','','','','','','','',''],
	// 	['',0,'',0,'',0,'',0,''],
	// 	['','','','','','','','',''],
	// 	['',0,'',0,'',0,'',0,''],
	// 	['','','','','','','','',''],
		
	// ];

	$scope.score1=0;
	$scope.score2=0;
	$scope.turn;
}//end of init funciton


	$scope.click = function(row,col){

		if($scope.board[row][col]=='H'){
			return;
		}

		if((row%2+col)%2==0){
			return;
		}

		$scope.board[row][col]='H';

		if(row%2===0){
			if(row>0){
				$scope.tempUp=$scope.board[row-1][col];
				for(i=0;i<4;i++){
					if($scope.board[row-1][col]==i){
						$scope.tempUp++;
						console.log("up added");
					}
				}
				$scope.board[row-1][col]=$scope.tempUp;
			}
			if(row<$scope.size*2){
				$scope.tempDown=$scope.board[row+1][col];
				for(i=0;i<4;i++){
					if($scope.board[row+1][col]==i){
						$scope.tempDown++;
						console.log("down added");
					}
				}
				$scope.board[row+1][col]=$scope.tempDown;
			}
		}
		else{
			if (col<$scope.size*2) {
				$scope.tempRight=$scope.board[row][col+1];
				for(i=0;i<4;i++){
					if($scope.board[row][col+1]==i){
						$scope.tempRight++;
						console.log("right added");
					}
				}
				$scope.board[row][col+1]=$scope.tempRight;
			};
			if (col>0) {
				$scope.tempLeft=$scope.board[row][col-1];
				for(i=0;i<4;i++){
					if($scope.board[row][col-1]==i){
						$scope.tempLeft++;
						console.log("left added");
					}
				}
				$scope.board[row][col-1]=$scope.tempLeft;
			};
		}
	}//end of click function








}//end of DotsController