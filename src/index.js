import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  //Criar quadrado com propriedades e o click dele depende da propriedade do tabuleiro

  function Square(props){
    return (
      <button className={props.winners && props.winners.indexOf(props.square) > -1 ? 'bold-li square' : 'square'} onClick={props.onClick}>
          {props.value}
      </button>
    );
  }

  class Board extends React.Component {

    //mostrar quadrado com o valor definido pelo array do jogo e o click depende da propriedade do jogo
    renderSquare(i) {
      return (
        <Square value={this.props.squares[i]} square={i} winners={this.props.winners ? this.props.winners : null} onClick={() => this.props.onClick(i)}/>
      );
    }
    
    renderTotal() {
      let total = [];

      for(let i = 0; i < 3; i++){
        let row = []

        for(let u = 0; u < 3; u++){
          row.push(this.renderSquare(u + i*3));
        }

        total.push(<div className="board-row">{row}</div>);
      }
      return total;
    }
  
    render() {
      return (
        <div>
          {this.renderTotal()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {

    //propriedades para armazenar jogadas, se é o X ou O e o numero da jogada
    constructor(props){

        //super é necessario
        super(props);

        this.state = {

            //history com os estados dos quadrados e a posição da ultima jogada
            history: [{
              squares: Array(9).fill(null),
              position: null
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    //lidar com o click do botão, que sobe pro tabuleiro e depois pro quadrado
    handleClick(i) {

        //history com a history antigo até o step atual, que pode ter sido alterado
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        //o atual é o ultimo da history que acabou de definir
        const current = history[history.length - 1];
        
        //squares vai receber os squares
        const squares = current.squares.slice();

        //se alguem tiver vencido ou ja tiver um valor definido, não da pra jogar
        if((calculateWinner(squares)) || squares[i]){
            return;
        }

        const possi = ['1,1','1,2','1,3','2,1','2,2','2,3','3,1','3,2','3,3'];
        const posi = possi[i];

        //se a jogada for permitida seta a posição do squares com o X ou O
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({

            //adiciona essa ultima jogada, muda entre X e O e ver o novo step
            history: history.concat([{
                squares: squares,
                position: posi,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
      this.setState({

        //seta o novo step e caso seja par, vai ser X

        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {

      //var history vai receber history, o atual vai ser a ultima jogada e vai testar se nela alguem ganhou

      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      let ganhador = null;
      if(winner){ganhador = winner[1]};

      const atual = this.state.stepNumber;

      //cria array de movimentos com o step [vetor] e o move que é o numero da jogada
      const moves = history.map(( step, move ) => {
        const desc = move ? 'Go to move ' + move + ' | Position: '+ step.position : 'Go to game start';
        return (
          //id do botão que chama o jumpTo
          <li key={move} className={ move === atual ? 'bold-li' : ''}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      //mostra o status
      let status;
      if(winner === 'velha'){
        status = 'Velha!!!!';
        alert('Velhaa!!');
      }else if(winner){
        status = 'Winner: '+ winner[0];
      }else{
        status = 'Next player: '+ (this.state.xIsNext ? 'X' : 'O');
      }

      //ativa o click e passa o vetor de squares
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} winners={ganhador} onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares){
      const lines = [
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6]
      ];

      //com as possibilidades de vitoria comparar as posições e ver se elas tem o msm valor

      for(let i =0; i < lines.length; i++){
          const[a,b,c] = lines[i];
          if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
            const ret = [squares[a], lines[i]]
            return ret;
          }
      }
      let velha = true;
      for(let i =0; i < squares.length; i++){
        if(squares[i] == null){
          velha = false;
        }
      }
      if(velha){
        return 'velha';
      }else{
        return null;
      }
  }