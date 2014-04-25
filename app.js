

//create a board to shove into firebase
var myBoard=[];
var size=5;
	for(i=0;i<size*2+5;i++){
		myBoard.push([]);
		for(j=0;j<size*2+1;j++){
			if((i%2+j%2)==2){
				myBoard[i].push(0);
			}
			else{
				myBoard[i].push('');
			}
		}
	};
	console.log(myBoard);

//start of angular stuff and stuff and stuff
var GameApp = angular.module('GameApp', ['firebase'])

.controller('DotsController', function($scope, $firebase){

	
	//start of firebase stuff
	var dotsRef = new Firebase('https://dotsgame.firebaseio.com/games');
	var lastGame;
	var playerNum;

	dotsRef.once('value', function(gamesSnapshot){

		var games = gamesSnapshot.val();

		//if there aren't any games currently, do this
		if(games==null){
			//push a new game that starts as waiting
			lastGame = dotsRef.push( {waiting:true} );
			console.log(lastGame);
			playerNum=true;
		}
		//if there are games do this
		else{
			//Find the last game that was created
			var keys = Object.keys(games);
			var lastGameKey = keys[keys.length-1];
			var lastGame = games[lastGameKey];
			//If someone is waiting, create a game 
			if(lastGame.waiting){
				lastGame = dotsRef.child(lastGameKey);
				lastGame.set( {player1:'Player 1',player2:'Player 2',turn:true, player1score:0, player2score:0, player1wins:false, player2wins:false, board:myBoard} );
				playernum = false;

			}
			//else last game is waiting for someone else
			else{
				lastGame = dotsRef.push( {waiting:true } )
				playerNum = true;
			}
		//create a new firebase called game with the contents of lastGame
		$scope.game = $firebase(lastGame);

		}
		
	});

	//end of firebase stuff


	$scope.init=function(size){


	$scope.size=size;
	$scope.gameWidth=$scope.size*36+6;
	$scope.gameBoard ={width:$scope.gameWidth+'px',height:$scope.gameWidth+72+'px'};
	$scope.center ={width:$scope.gameWidth+20+'px'};
	$scope.wholeGame ={width:$scope.gameWidth+277+'px'};


	// $scope.game.board=[];
	// for(i=0;i<$scope.size*2+5;i++){
	// 	$scope.board.push([]);
	// 	for(j=0;j<$scope.size*2+1;j++){
	// 		if((i%2+j%2)==2){
	// 			$scope.board[i].push(0);
	// 		}
	// 		else{
	// 			$scope.board[i].push('');
	// 		}
	// 	}
	// };

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
}//end of init funciton


	$scope.click = function(row,col){

		if($scope.game.turn&&!playerNum){
			return;
		}

		if(!$scope.game.turn&&playerNum){
			return;
		}

		if($scope.game.player1wins||$scope.game.player2wins){
			return;
		}

		if($scope.game.board[row][col]=='H'){
			return;
		}

		if((row%2+col)%2==0){
			return;
		}

		$scope.game.board[row][col]='H';

		if(row%2===0){
			if(row>0){
				$scope.tempUp=$scope.game.board[row-1][col];
				for(i=0;i<4;i++){
					if($scope.game.board[row-1][col]==i){
						$scope.tempUp++;
						//console.log("up added");
					}
				}
				$scope.game.board[row-1][col]=$scope.tempUp;
				
			}
			if(row<$scope.size*2+3){
				$scope.tempDown=$scope.game.board[row+1][col];
				for(i=0;i<4;i++){
					if($scope.game.board[row+1][col]==i){
						$scope.tempDown++;
						//console.log("down added");
					}
				}
				$scope.game.board[row+1][col]=$scope.tempDown;
			}
		$scope.checkBox();
		}
		else{
			if (col<$scope.size*2) {
				$scope.tempRight=$scope.game.board[row][col+1];
				for(i=0;i<4;i++){
					if($scope.game.board[row][col+1]==i){
						$scope.tempRight++;
						//console.log("right added");
					}
				}
				$scope.game.board[row][col+1]=$scope.tempRight;
				
			};
			if (col>0) {
				$scope.tempLeft=$scope.game.board[row][col-1];
				for(i=0;i<4;i++){
					if($scope.game.board[row][col-1]==i){
						$scope.tempLeft++;
						//console.log("left added");
					}
				}
				$scope.game.board[row][col-1]=$scope.tempLeft;
				
			};
		$scope.checkBox();
		}
		$scope.game.$save();
	}//end of click function

	$scope.checkBox = function(row, col){
		if ($scope.game.turn&&playerNum) {
			var temp = 0;
			for(i=1;i<$scope.size*2+4;i++){
				for (j=1;j<$scope.size*2;j++) {
					if ($scope.game.board[i][j]==4) {
						$scope.game.player1score++;
						temp++;
						$scope.game.board[i][j]=8;
						console.log($scope.game.player1score);
						if ($scope.game.player1score>($scope.size*($scope.size+2))/2) {
							// console.log("Player 1 wins");
							$scope.game.player1wins=true;
						}
					}
				}
			}
			if (temp==0) {
				$scope.game.turn=false;
				// console.log("switched turns to p2");
				return;
			}
			else{
				return;
			}	
		}

		else if (!$scope.game.turn&&!playerNum) {
			var temp2 = 0;
			for(k=1;k<$scope.size*2+4;k++){
				for (l=1;l<$scope.size*2;l++) {
					if ($scope.game.board[k][l]==4) {
						$scope.game.player2score++;
						temp2++;
						$scope.game.board[k][l]=9;
						console.log($scope.game.player2score);
						if ($scope.game.player2score>($scope.size*($scope.size+2))/2) {
							// console.log("Player 2 wins");
							$scope.game.player2wins=true;

						}
					}
				}
			}
			if (temp2==0) {
				$scope.game.turn=true;
				// console.log("switched turns to p1");
				return;
			}
			else{
				return;
			}	
		}
		$scope.game.$save();
	}//end of checkBox

	$scope.reset = function(){
		$scope.game.board=myBoard;
		$scope.game.player1score=0;
		$scope.game.player2score=0;
		$scope.game.player1wins=false;
		$scope.game.player2wins=false;
		$scope.game.$save();


	}//end of reset

	$scope.changeName = function(){
		if(playerNum){
			$scope.game.player1 = $scope.name1;
			$scope.game.$save();
		}
	}

	$scope.changeName2 = function(){
		if(!playerNum){
			$scope.game.player2 = $scope.name2;
			$scope.game.$save();
		}
	}









});//end of DotsController