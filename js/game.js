/*
* 2C => Two of Clubs
* 2D => Two of Diamonds
* 2H => Two of Hearts
* 2S => Two of Spades
*/

// Referencias HTML
const playerPoints   = document.querySelector('#player-points');
const computerPoints = document.querySelector('#computer-points');
const playerDeck     = document.querySelector('#player-deck');
const computerDeck   = document.querySelector('#computer-deck');
const btnNuevo       = document.querySelector('#btnNuevo');
const btnPedir       = document.querySelector('#btnPedir');
const btnPlantarse   = document.querySelector('#btnPlantarse');

const referencesHTML = {
    'player-points' : playerPoints,
    'computer-points' : computerPoints,
    'player-deck' : playerDeck,
    'computer-deck' : computerDeck,
};

let deck       = [];
const types    = ['H', 'D', 'C', 'S'];
const specials = ['A', 'J', 'Q', 'K'];
let puntosJugador = 0;
let puntosComputadora = 0;
let computerPlaying = false;

btnNuevo.addEventListener('click', () => {
    createDeck();
});

btnPedir.addEventListener('click', () => {
    askCard( 'player-deck' );
});

btnPlantarse.addEventListener('click', () => {
    turnoComputadora();
});

const createDeck = () => {

    resetGame();

    for ( let i = 2; i <= 10; i++ ) {

        for ( let type of types ) {

            deck.push( i + type );
        }
    }

    for ( let special of specials ) {

        for ( let type of types ) {

            deck.push( special + type );
        }
    }   

    deck = _.shuffle( deck );  
        
    setDisabled( btnPedir, false );
    setDisabled( btnPlantarse, false );
    setDisabled( btnNuevo, true );
};

const resetGame = () => {

    puntosJugador = 0;
    puntosComputadora = 0;    
    deck = [];

    let element = getElem( 'player-points' );
    refreshUI( element, puntosJugador );

    element = getElem( 'computer-points' );
    refreshUI( element, puntosComputadora );

    element = getElem( 'player-deck' );
    removeCards( element );

    element = getElem( 'computer-deck' );
    removeCards( element );       
};

const getElem = ( type ) => {

    return referencesHTML[type];
};

const refreshUI = ( element, points ) => {   

    element.innerText = points;

    if( puntosJugador === 0 ) {
        setDisabled( btnPlantarse, true);

    } else if ( puntosJugador >= 1 && puntosJugador < 21 ) {
        setDisabled( btnPlantarse, false );
    
    } else if ( puntosJugador === 21 ) {
        setDisabled( btnPlantarse, true ); 
        setDisabled( btnPedir, true ); 
        
        if ( !computerPlaying ) {
            computerPlaying = true;
            turnoComputadora();       
        }

    } else {
        setDisabled(btnPedir, true);
        setDisabled(btnPlantarse, true);
        setDisabled(btnNuevo, false);

        if ( !computerPlaying ) {
            computerPlaying = true;
            turnoComputadora();       
        }
        
    }
};

const removeCards = ( element ) => {

    while( element.hasChildNodes() ) {

        element.removeChild(element.firstChild);
    } 
};

const askCard = ( who ) => {

    if ( deck.length === 0 ) {
        throw 'No cards in deck';
    }

    const card = deck.shift();    

    const element = getElem( who );
    
    const imgNode = document.createElement('img');
    
    imgNode.src = `assets/cards/${card}.png`;
    imgNode.classList.add('carta');

    element.append(imgNode);

    cardValue = getCardValue( card ) * 1;
    setPoints( who, cardValue );    
};

const getCardValue = ( card ) => {

    const value = card.substring( 0, card.length - 1 );
    
    return ( ['A'].includes(value) ) ? 11 :
           ( ['J', 'Q', 'K'].includes(value) ) ? 10 : value;
};

const setPoints = ( who, value ) => {

    if ( who === 'player-deck' ) {
        let element  = getElem('player-points');
        
        puntosJugador += value;
        refreshUI( element, puntosJugador );
    
    } else {

        let element  = getElem('computer-points');
        
        puntosComputadora += value;
        refreshUI( element, puntosComputadora );
    }    
};

const setDisabled = ( btn, value ) => {
    
    btn.disabled = value;    
};

const turnoComputadora = () => {

    let state = '';

    setDisabled(btnPedir, true);
    setDisabled(btnPlantarse, true);

    do {
        askCard( 'computer-deck' );

        if( puntosJugador > 21 || ( puntosComputadora > puntosJugador && puntosComputadora <= 21 ) ) {
            state = 'lost';
            break;            
        }

        if (puntosComputadora > 21 ) {
            state = 'won';
            break;
        }

    } while ( puntosComputadora <= puntosJugador || puntosComputadora === 21 );

    computerPlaying = false;

    setTimeout( () => {

        if( state === 'won' ) {

            swal({
                title: "Awesome !!!",
                text: "You won!",
                icon: "success",                
            });
        
        } else {

            swal({
                title: "Bad news !",
                text: "You lost!",
                icon: "error",                
            });

        }
        
    }, 100 );

    setDisabled(btnNuevo, false);
    setDisabled(btnPedir, true);
    setDisabled(btnPlantarse, true);
};

setPoints( 'player-deck', puntosJugador );
setPoints( 'computer-deck', puntosComputadora );
setDisabled( btnPedir, true);
setDisabled( btnPlantarse, true );
