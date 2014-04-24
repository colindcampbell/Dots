
function DotsController($scope){

	$scope.turn=true;

	$scope.init=function(size){


	$scope.size=size;
	$scope.gameWidth=$scope.size*36+6;

	// $scope.colors1=["#f23d70","#ed002f","#ad153c","#dd0000","#ff3500","#ff5900","#ff8145","#ff9a40", "#ffc300","#fff345"];
	// $scope.colors2=["#00ff00","#0000ff","#ff00ff"];
	// $scope.cColor1=$scope.colors1[0];
	// $scope.cColor2=$scope.colors2[0];


	$scope.gameBoard ={width:$scope.gameWidth+'px',height:$scope.gameWidth+72+'px'};
	$scope.center ={width:$scope.gameWidth+20+'px'};
	$scope.wholeGame ={width:$scope.gameWidth+277+'px'};


	$scope.board=[];
	for(i=0;i<$scope.size*2+5;i++){
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

	$scope.player1score=0;
	$scope.player2score=0;
	$scope.player1wins=false;
	$scope.player2wins=false;
	
}//end of init funciton


	$scope.click = function(row,col){

		if($scope.player1wins||$scope.player2wins){
			return;
		}

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
						//console.log("up added");
					}
				}
				$scope.board[row-1][col]=$scope.tempUp;
				
			}
			if(row<$scope.size*2+3){
				$scope.tempDown=$scope.board[row+1][col];
				for(i=0;i<4;i++){
					if($scope.board[row+1][col]==i){
						$scope.tempDown++;
						//console.log("down added");
					}
				}
				$scope.board[row+1][col]=$scope.tempDown;
			}
		$scope.checkBox();
		}
		else{
			if (col<$scope.size*2) {
				$scope.tempRight=$scope.board[row][col+1];
				for(i=0;i<4;i++){
					if($scope.board[row][col+1]==i){
						$scope.tempRight++;
						//console.log("right added");
					}
				}
				$scope.board[row][col+1]=$scope.tempRight;
				
			};
			if (col>0) {
				$scope.tempLeft=$scope.board[row][col-1];
				for(i=0;i<4;i++){
					if($scope.board[row][col-1]==i){
						$scope.tempLeft++;
						//console.log("left added");
					}
				}
				$scope.board[row][col-1]=$scope.tempLeft;
				
			};
		$scope.checkBox();
		}
	}//end of click function

	$scope.checkBox = function(row, col){
		if ($scope.turn) {
			var temp = 0;
			for(i=1;i<$scope.size*2+4;i++){
				for (j=1;j<$scope.size*2;j++) {
					if ($scope.board[i][j]==4) {
						$scope.player1score++;
						temp++;
						$scope.board[i][j]=8;
						console.log($scope.player1score);
						if ($scope.player1score>($scope.size*($scope.size+2))/2) {
							// console.log("Player 1 wins");
							$scope.player1wins=true;
						}
					}
				}
			}
			if (temp==0) {
				$scope.turn=false;
				// console.log("switched turns to p2");
				return;
			}
			else{
				return;
			}	
		}

		else{
			var temp2 = 0;
			for(k=1;k<$scope.size*2+4;k++){
				for (l=1;l<$scope.size*2;l++) {
					if ($scope.board[k][l]==4) {
						$scope.player2score++;
						temp2++;
						$scope.board[k][l]=9;
						console.log($scope.player2score);
						if ($scope.player2score>($scope.size*($scope.size+2))/2) {
							// console.log("Player 2 wins");
							$scope.player2wins=true;

						}
					}
				}
			}
			if (temp2==0) {
				$scope.turn=true;
				// console.log("switched turns to p1");
				return;
			}
			else{
				return;
			}	
		}

	}//end of checkBox










}//end of DotsController