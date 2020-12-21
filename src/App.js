import React, { Component } from 'react';
import { Food } from './components/Food'
import { Snake } from './components/Snake'

// 随机生成Food坐标（0-98）偶数
const getRandomCoordinates = () =>{
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * max + min)/2)*2;
    let y = Math.floor((Math.random() * max + min)/2)*2;
    return [x, y];
}

// 初始化state
const initialState = {
    food: getRandomCoordinates(),
    direction: 'RIGHT',
    prevDirection: 'STOP',
    speed: 100,
    snakeDots: [
        [0,0],
        [2,0]
    ]
}

// 定义定时器
let timer = null;

class App extends Component {
    state = initialState;
    // 键盘事件
    componentDidMount() {
        this.addSetInterval();
        document.onkeydown = this.onkeydown;
    }

    // 更新状态
    componentDidUpdate(){
        this.checkIfOutBorders();
        this.checkIfCollapsed()
        this.checkIfEat();
    }

    // 键盘函数
    onkeydown = (e) => {
        const direction = this.state.direction;
        switch (e.keyCode) {
            case 38:
                if (direction !== 'DOWN') { 
                    this.setState({ direction: 'UP'});
                }
                break;
            case 40:
                if (direction !== 'UP') { 
                    this.setState({ direction: 'DOWN'});
                }
                break;
            case 37:
                if (direction !== 'RIGHT') { 
                    this.setState({ direction: 'LEFT'});
                }
                break;
            case 39:
                if (direction !== 'LEFT') { 
                    this.setState({ direction: 'RIGHT'});
                }
                break;
            case 32:
                let curOpreation = 'STOP';
                const prevDirection = this.state.prevDirection;
                if (direction === 'STOP') {
                    this.setState({ direction: prevDirection });
                    this.addSetInterval();
                } else { 
                    this.setState({ direction: curOpreation, prevDirection: direction });
                    this.removeSetInterVal();
                }
                break;
            default:
                this.setState({ direction: 'RIGHT'});
        }
    }

    // 添加定时器
    addSetInterval = () => {
        timer = setInterval(this.moveSnake, this.state.speed);
    };

    // 清楚定时器
    removeSetInterVal = () => {
        clearInterval(timer);
        timer = null;
    };

    // 移动贪吃蛇函数
    moveSnake = () => {
        let dots = [...this.state.snakeDots];
        let head = dots[dots.length - 1];
        switch (this.state.direction) {

            case 'RIGHT':
                head = [head[0] + 2, head[1]];
                break;
            case 'LEFT':
                head = [head[0] - 2, head[1]];
            break;
            case 'DOWN':
                head = [head[0], head[1] + 2];
            break;
            case 'UP':
                head = [head[0], head[1] - 2];
                break;
            default:
                break;
        }
        dots.push(head);
        dots.shift();
        this.setState({
            snakeDots:dots
        })
    }

    // 限制活动范围
    checkIfOutBorders(){
        let head = this.state.snakeDots[this.state.snakeDots.length - 1];
        if(head[0] >= 100 || head[0] <0 || head[1] >= 100 || head[1] < 0){
            this.onGameOver();
        }
    }

    // 验证head是否撞击到自身
    checkIfCollapsed(){
        let snake = [...this.state.snakeDots];
        let head = snake[snake.length - 1];
        snake.pop();
        snake.forEach(dot => {
            if(head[0] === dot[0] && head[1] === dot[1]){
                this.onGameOver();
            }
        })
    }

    // 游戏结束
    onGameOver(){
        alert(`游戏结束！你的得分为：${this.state.snakeDots.length}`);
        this.setState(initialState);
    }

    // 验证是否吃到food方块
    checkIfEat(){
        let head = this.state.snakeDots[this.state.snakeDots.length -1];
        let food = this.state.food;

        if(head[0] === food[0] && head[1] === food[1]){
            this.setState({
                food:getRandomCoordinates(),
            })
            this.enlargtSnake();
            this.increaseSpeed();
        }
    }

    // 填充贪吃蛇
    enlargtSnake(){
        let newSnake = [...this.state.snakeDots];
        newSnake.unshift([]);
        this.setState({snakeDots: newSnake});
    }
    // 加速运动
    increaseSpeed(){
        if(this.state.speed > 10 ){
            this.setState({speed:this.state.speed - 50})
        }
    }
    render() {
        return (
            <div className='game-area'>
                <Snake snakeDots={this.state.snakeDots} />
                <Food food={this.state.food} />
            </div>
        );
    }
}

export default App;


