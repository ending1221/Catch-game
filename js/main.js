//-------[類別] 遊戲物件

class GameObject {
	constructor(position, size, selector) {
		this.$el = $(selector);
		this.position = position;
		this.size = size;
		this.$el.css('position', 'absolute');
	}
	//更新遊戲物件(資料->實際的css)
	updateCss() {
		const $el = this.$el;
		$el.css('left', this.position.x + 'px');
		$el.css('top', this.position.y + 'px');
		$el.css('width', this.size.width + 'px');
		$el.css('height', this.size.height + 'px');
	}
	//偵測遊戲物件碰撞
	collide(otherObject) {
		let pos = otherObject.position;
		let inXrange = pos.x >= this.position.x && pos.x <= this.position.x + this.size.width
		let inYrange =  pos.y >= this.position.y && pos.y <= this.position.y + this.size.height
		return inXrange && inYrange
	}
}
//-------[類別] 球 -- //繼承遊戲物件

class Ball extends GameObject {
	constructor(position, size, selector) {
		super(position, size, selector);
		this.size = { width: 15, height: 15 };
		this.init();
	}
	init() {
		this.position = { x:250, y:250 };
		var randomDeg = Math.random()*2*Math.PI
		this.velocity = {
			x: Math.cos(randomDeg)*8,
			y: Math.sin(randomDeg)*8
		}
	}
	//將速度加上球的位置 / 反彈偵測 / 以及更新
	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.updateCss();
		if (this.position.x < 0 || this.position.x > 500) this.velocity.x = -this.velocity.x;
		if (this.position.y < 0 || this.position.y > 500) this.velocity.y = -this.velocity.y;
	}
}
let ball = new Ball({}, {}, '.ball')
ball.updateCss()

//-------[類別] 板子 -- //繼承遊戲物件

class Board extends GameObject {
	constructor(position, size, selector) {
		super(position, size, selector);
	}
	//檢查板子是否超出邊界與更新
	update() {
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.x + this.size.width > 500) this.position.x = 500 - this.size.width;
		this.updateCss();
	}
}

let board1 = new Board(
	{x: 0,y: 30},  {width: 100,height: 15},
	".b1"  
)
let board2 = new Board(
	{x: 0,y: 455},  {width: 100,height: 15},
	".b2"  
)

//-------[類別] 遊戲
class Game {
	constructor() {
		this.timer = null;
		this.initControl();
		this.control = {};
		this.grade = 0;
	}
	setComputer() {
		board1.position.x += ball.position.x > board1.position.x+board1.size.width/2 + 5 ? 8 : 0;
		board1.position.x += ball.position.x < board1.position.x+board1.size.width/2 - 5 ? -8 : 0;
	}
	startGame() {
		let time = 3;
		let game = this;
		$("button").hide();
		ball.init();
		$(".infoText").text("Ready");
		this.timer = setInterval(function(){
			$(".infoText").text(time);
			if (time <= 0){
				$(".info").hide();
				clearInterval( game.timer );
				game.startMain();
			}
			time--
		},1000)  
	}
	initControl() {
		let game = this
		$(window).keydown(function(evt){
			game.control[evt.key] = true
		})
		$(window).keyup(function(evt){
			game.control[evt.key] = false
		})
	}
	collideEvent() {
		// 碰撞事件
		if(board1.collide(ball)) {
			ball.velocity.y = Math.abs(ball.velocity.y);
			ball.velocity.x*=1.1;
			ball.velocity.y*=1.1;
			ball.velocity.x+=0.5-Math.random();
			ball.velocity.y+=0.5-Math.random();
		}
		if(board2.collide(ball)) {
			ball.velocity.y = - Math.abs(ball.velocity.y);
		}
	}
	startMain() {
		let game = this;
		this.timer = setInterval(function() {
			
			game.collideEvent();
			
			if(ball.position.y <= 0) game.endGame('玩家獲勝');
			if(ball.position.y >= 500) game.endGame('電腦獲勝');

			if (game.control["ArrowLeft"]) board2.position.x -= 8 ;
			if (game.control["ArrowRight"]) board2.position.x += 8;

			//自動移動的對手
			game.setComputer();
			
			ball.update();
			board1.update();
			board2.update();
		}, 30)
	} 
	endGame(msg) {
		clearInterval(this.timer);
		$('.infoText').text(msg);
	}
}


//開始遊戲倒數

//設置鍵盤控制

//主要遊戲的迴圈

//遊戲結束

//建立遊戲物件

let game = new Game()

