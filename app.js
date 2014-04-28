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

//start of angular stuff and stuff and stuff
var GameApp = angular.module('GameApp', ['firebase'])

.controller('DotsController', function($scope, $firebase, $interval){

	//start of firebase stuff
	var dotsRef = new Firebase('https://dotsgame.firebaseio.com/games');
	var lastGame;
	$scope.playerNum;

	dotsRef.once('value', function(gamesSnapshot){

		var games = gamesSnapshot.val();

		//if there aren't any games currently, do this
		if(games==null){
			//push a new game that starts as waiting
			lastGame = dotsRef.push( {waiting:true} );
			console.log(lastGame);
			$scope.playerNum=true;
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
				lastGame.set( {player1:'Player 1',
							player2:'Player 2',
							turn:0,
							player1score:0, 
							player2score:0, 
							player1wins:false, 
							player2wins:false,
							player1state:'Not Ready',
							player2state:'Not Ready',
							startCount:11,
							player1count:0,
							player2count:0,
							ready1:false,
							ready2:false,
							board:myBoard} );

				$scope.playerNum = false;
			}
			//else last game is waiting for someone else
			else{
				lastGame = dotsRef.push( {waiting:true } )
				$scope.playerNum = true;
			}
		//create a new firebase called game with the contents of lastGame
		$scope.game = $firebase(lastGame);
		}
	});//end of firebase stuff

	$scope.init=function(size){

	$scope.size=size;
	$scope.gameWidth=$scope.size*36+6;
	$scope.gameBoard ={width:$scope.gameWidth+'px',height:$scope.gameWidth+72+'px'};
	$scope.center ={width:$scope.gameWidth+20+'px'};
	$scope.wholeGame ={width:$scope.gameWidth+277+'px'};

}//end of init funciton

	$scope.click = function(row,col){

		if($scope.game.startCount>0){
			return;
		}
		//No clicks until game is ready
		if(!$scope.game.ready1||!$scope.game.ready2){
			return;
		}
		//Player 2 cannot click when it is Player 1's turn
		if($scope.game.turn==1&&!$scope.playerNum){
			return;
		}
		//Player 1 cannot click when it is Player 2's turn
		if($scope.game.turn==2&&$scope.playerNum){
			return;
		}
		//You cannot click if someone has already won
		if($scope.game.player1wins||$scope.game.player2wins){
			return;
		}
		//You cannot click on a line that has already been clicked
		if($scope.game.board[row][col]=='H'){
			return;
		}
		//You cannot click on the dots or squares
		if((row%2+col)%2==0){
			return;
		}

		$scope.game.board[row][col]='H';
	//Everything below is to add one to the square above/below or left/right of th line that is being clicked
		//First is for the horizontal lines, adding to the square above and below
		//if row is even (to make sure its a horizontal line)
		if(row%2===0){
			//if not the very top row because there is nothing above the 
			//top row
			if(row>0){
				//create a temporary variable storing the current value above the clicked line
				$scope.tempUp=$scope.game.board[row-1][col];
				//loop through and see if that value is equal to 0-3. When it is, add one to the temp variable. I had to make a temp
				//value so that the actual value doesn't loop up with i
				for(i=0;i<4;i++){
					if($scope.game.board[row-1][col]==i){
						$scope.tempUp++;
					}
				}
				//Set the div value equal to the temp variable
				$scope.game.board[row-1][col]=$scope.tempUp;
				
			}
			//Same process for the square below (+row) the line that is clicked. Do not check below the last div becasue nothing is there
			if(row<$scope.size*2+3){
				$scope.tempDown=$scope.game.board[row+1][col];
				for(i=0;i<4;i++){
					if($scope.game.board[row+1][col]==i){
						$scope.tempDown++;
					}
				}
				$scope.game.board[row+1][col]=$scope.tempDown;
			}
		//Run the checkBox function to see if any values have changed to 4
		$scope.checkBox();
		}
		//Do the same thing but for left and right if a vertical div was clicked
		else{
			if (col<$scope.size*2) {
				$scope.tempRight=$scope.game.board[row][col+1];
				for(i=0;i<4;i++){
					if($scope.game.board[row][col+1]==i){
						$scope.tempRight++;
					}
				}
				$scope.game.board[row][col+1]=$scope.tempRight;
				
			};
			if (col>0) {
				$scope.tempLeft=$scope.game.board[row][col-1];
				for(i=0;i<4;i++){
					if($scope.game.board[row][col-1]==i){
						$scope.tempLeft++;
					}
				}
				$scope.game.board[row][col-1]=$scope.tempLeft;
			};
		$scope.checkBox();
		//Save all data to firebase
		$scope.game.$save();
		}
	}//end of click function
	//Scans the divs to see if any are equal to 4. If so, the player with the current turn gets one point added and they get to go again. If they did not score a point, the turn goes to the next player
	$scope.checkBox = function(){
		//If it is Player 1's turn
		if ($scope.game.turn==1&&$scope.playerNum) {
			var temp = 0;
			//Loop through all divs to see if any are equal to 4
			for(i=1;i<$scope.size*2+4;i++){
				for (j=1;j<$scope.size*2;j++) {
					if ($scope.game.board[i][j]==4) {
						//if it is equal to 4, that player scores and gets another turn
						$scope.game.player1score++;
						temp++;
						$scope.game.board[i][j]=8;
						console.log($scope.game.player1score);
						$scope.game.player1count=5;
						$scope.game.$save();
						
						if ($scope.game.player1score>($scope.size*($scope.size+2))/2) {
							//If the player's score is greater than half the board, they win. The next game is then queued up
							$scope.game.player1wins=true;
							$scope.game.player1count=1;
							$scope.game.turn=0;
							$scope.game.ready1=false;
							$scope.game.ready2=false;
							$scope.game.player2state='Not Ready';
							$scope.game.player1state='Not Ready';
							$scope.game.$save();
						}
					}
				}
			}
			//If they did not score, 
			if (temp==0) {
				//Switch turns
				$scope.game.turn=2;
				//console.log("switched turns to p2");
				$scope.game.player1count=0;
				$scope.game.$save();
				return;
			}
			else{
				return;
			}	
		}
		//Same process for player 2
		else if ($scope.game.turn==2&&!$scope.playerNum) {
			var temp2 = 0;
			for(k=1;k<$scope.size*2+4;k++){
				for (l=1;l<$scope.size*2;l++) {
					if ($scope.game.board[k][l]==4) {
						$scope.game.player2score++;
						temp2++;
						$scope.game.board[k][l]=9;
						console.log($scope.game.player2score);
						$scope.game.player2count=5;
						//restart count for player 2
						$scope.game.$save();
						if ($scope.game.player2score>($scope.size*($scope.size+2))/2) {
							// console.log("Player 2 wins");
							$scope.game.player2wins=true;
							$scope.game.player2count=1;
							$scope.game.turn=0;
							$scope.game.ready1=false;
							$scope.game.ready2=false;
							$scope.game.player2state='Not Ready';
							$scope.game.player1state='Not Ready';
							$scope.game.$save();
						}
					}
				}
			}
			if (temp2==0) {
				$scope.game.turn=1;
				console.log("switched turns to p1");
				$scope.game.player2count=0;
				//Start countdown for player 1
				$scope.game.$save();
				return;
			}
			else{
				return;
			}	
		}
		$scope.game.$save();
	}//end of checkBox

	$scope.reset = function(){
		//Do not reset until both players are ready
		if(!$scope.game.ready1||!$scope.game.ready2){
			return;
		}
		$scope.game.board=myBoard;
		$scope.game.player1score=0;
		$scope.game.player2score=0;
		$scope.game.player1wins=false;
		$scope.game.player2wins=false;
		$scope.game.$save();
	}//end of reset

	$scope.changeName = function(){
		if($scope.playerNum){
			$scope.game.player1 = $scope.name1;
			$scope.game.$save();
		}
	}

	$scope.changeName2 = function(){
		if(!$scope.playerNum){
			$scope.game.player2 = $scope.name2;
			$scope.game.$save();
		}
	}

	$scope.ready = function(){
		//When player clicks play, change their status to ready
		if($scope.playerNum&&!$scope.game.ready1){
			$scope.game.ready1=true;
			$scope.game.player1state='Ready';
			$scope.game.$save();
		}
		if(!$scope.playerNum&&!$scope.game.ready2){
			$scope.game.ready2=true;
			$scope.game.player2state='Ready';
			$scope.game.$save();
		}
		//Whoever clicks Play first gets to go first
		if($scope.game.ready1&&!$scope.game.ready2){
			$scope.game.turn=1;
			$scope.game.$save();
		}
		if($scope.game.ready2&&!$scope.game.ready1){
			$scope.game.turn=2;
			$scope.game.$save();
		}
		//When both players are ready, begin the countdown
		if($scope.game.ready1&&$scope.game.ready2){
			$scope.startCountdown();
		}
	};

	$scope.startCountdown = function(){
		//Counts down 10 seconds before game starts. After the 10 seconds, the turn countdown begins for whoever has the first turn
		$scope.game.startCount=10;
		var promise = $interval(function(){
			if ($scope.game.startCount>0) {
				$scope.game.startCount--;
				$scope.game.$save();
			}
			else{
				if($scope.game.turn==1){
				$scope.player1countdown();
				}
				else{
				$scope.player2countdown();
				}
				$interval.cancel(promise);
			}
		},1000);
	};

	//Loops between these two functions until someone wins. If you do not make a play within 5 seconds you lose your turn
	$scope.player1countdown = function(){
		if($scope.game.player2wins||$scope.game.player1wins){
			$scope.game.turn=0;
			$scope.game.$save();
			return;
		}
		$scope.game.player1count=6;
		$scope.promise1 = $interval(function(){
			if($scope.game.player1count>0){
				$scope.game.player1count--;
				$scope.game.$save();
			}
			else{
				$interval.cancel($scope.promise1);
				$scope.game.turn=2;
				$scope.player2countdown();
				$scope.game.$save();
			}
		},1000)
		//start player 1 countdown. if it reaches 0, switch
		//players and begin countdown for player 2 after X seconds
		//if they haven't played yet
	};

	$scope.player2countdown = function(){
		if($scope.game.player2wins||$scope.game.player1wins){
			$scope.game.turn=0;
			$scope.game.$save();
			return;
		}
		$scope.game.player2count=6;
		$scope.promise1 = $interval(function(){
			if($scope.game.player2count>0){
				$scope.game.player2count--;
				$scope.game.$save();
			}
			else{
				$interval.cancel($scope.promise1);
				$scope.game.turn=1;
				$scope.player1countdown();
				$scope.game.$save();
			}
		},1000)
		//start player 2 countdown. if it reaches 0, switch
		//players and begin countdown for player 1 after X seconds
		//if they haven't played yet
	};
});//end of DotsController