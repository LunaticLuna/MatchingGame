"use strict";

const Symbol = {
    ANCHOR : 'fa fa-anchor',
    BICYCLE : 'fa fa-bicycle',
    BOLT : 'fa fa-bolt',
    BOMB : 'fa fa-bomb',
    CUBE : 'fa fa-cube',
    DIAMOND : 'fa fa-diamond',
    LEAF : 'fa fa-leaf',
    PLANE : 'fa fa-paper-plane-o',
}
const State = {
    CLOSED : 'card',
    OPENED : 'card open show',
    MATCHED: 'card match',

}

let Timer;

Object.freeze(Symbol);
const ScorePanel = {
    moves : 0,
    timer : 0,

    incrementMoves : () =>{
        ScorePanel.moves += 1;
        ViewController.setMoves(ScorePanel.moves);
    },
    incrementTime : () =>{
        ScorePanel.timer += 1;
        ViewController.setTimer(ScorePanel.timer);
    },
    restart: () =>{
        ScorePanel.moves = 0;
        ScorePanel.timer = 0;
        ViewController.clearScorePanel();
    },

}
Object.seal(ScorePanel);


const Deck = {
    cards : [Symbol.ANCHOR, Symbol.ANCHOR, Symbol.BICYCLE, Symbol.BICYCLE, Symbol.BOLT, Symbol.BOLT, Symbol.BOMB, Symbol.BOMB, Symbol.CUBE, Symbol.CUBE, Symbol.DIAMOND, Symbol.DIAMOND, Symbol.LEAF, Symbol.LEAF, Symbol.PLANE, Symbol.PLANE],
    opened: [],
    matched: [],

    tryOpenCard : (index,symbol)=>{
        Deck.opened.push({index,symbol});
        ViewController.openCard(index);
        //when we have 2 cards opened, check ?equal
        if (Deck.opened.length === 2) {
            window.setTimeout(Deck.checkMatch,200);
        }
    },

    checkMatch: () =>{
        if (Deck.opened.length !== 2){
            return;
        }else {
            const card0 = Deck.opened[0];
            const card1 = Deck.opened[1];

            if (card0.symbol !== card1.symbol){
                ViewController.closeCard(card0.index);
                ViewController.closeCard(card1.index);
                Deck.opened.length = 0;
            }else{
                ViewController.matchCard(card0.index);
                ViewController.matchCard(card1.index);
                Deck.matched.push({card0});
                Deck.matched.push({card1});
                Deck.opened.length = 0;
                //win condition: all cards matched
                if (Deck.matched.length === Deck.cards.length){
                    window.clearInterval(Timer)
                    ViewController.win()
                }
            }

        }
    },
    restart:()=>{
        for (let i = 0; i < Deck.cards.length;i++){
            ViewController.closeCard(i);
        }

        Deck.opened.length = 0;
        Deck.matched.length = 0;
    },
}

Object.freeze(Deck);
Object.seal(Deck.cards)

class ViewController{
    static openCard(index){
        const e = document.getElementById(index);
        e.setAttribute("class",State.OPENED);
    }
    static closeCard(index){
        console.log("close card" + index)
        const e = document.getElementById(index);
        e.setAttribute("class",State.CLOSED);
    }
    static matchCard(index){
        const e = document.getElementById(index);
        e.setAttribute("class",State.MATCHED);
    }

    static win(){
        console.log("yayyyyy");

    }
    static setMoves(moves){
        const e = document.getElementsByClassName("moves")[0];
        e.innerHTML = moves;
    }
    static setTimer(time){
        const e = document.getElementsByClassName("timer")[0];
        e.innerHTML = time;
    }
    static clearScorePanel(){
        ViewController.setMoves(0);
        ViewController.setTimer(0);
    }

}


class EventListener{
    static start(){
        //shuffle cards:
        const cards = shuffle(Deck.cards);
        for (let i = 0; i < cards.length; i++){
            const e = document.getElementById(i);
            e.firstChild.setAttribute("class",cards[i]);
        }
        //bind clicking event
        //click card:
        const d = document.getElementsByClassName("deck")[0];
        console.log("bind clicking event to element");
        d.addEventListener("click",(e) =>{
            const state = e.target.className;
            if (state === State.CLOSED){
                //call eventHandler when card is clicked
                EventHandler.cardClicked(e);
            }
        })
        //start Timer:
        Timer = window.setInterval(ScorePanel.incrementTime,1000);
        //restart:
        console.log('bind clicking event to restart')
        const re = document.getElementsByClassName("restart")[0];
        re.addEventListener("click",EventHandler.restartClicked);

    }

}

class EventHandler{
    static cardClicked(e){
        ScorePanel.incrementMoves();
        const index = e.target.id;
        const symbol = e.target.firstChild.className;

        Deck.tryOpenCard(index,symbol);
    }
    static restartClicked(){
        Deck.restart();
        ScorePanel.restart();
        //shuffle cards:
        const cards = shuffle(Deck.cards);
        for (let i = 0; i < cards.length; i++){
            const e = document.getElementById(i);
            e.firstChild.setAttribute("class",cards[i]);
        }
    }

}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function main(){
    console.log("welcome to memgam");
    EventListener.start();


}

main();
