const blackjackGame = (() => {

    'use strict';

    /*
    * 2C => Two of Clubs
    * 2D => Two of Diamonds
    * 2H => Two of Hearts
    * 2S => Two of Spades
    */

    // Referencias HTML
    const playersPoints  = document.querySelectorAll('.puntaje'),          
          playersDeck    = document.querySelectorAll('.div-cartas-jugadores'),          
          btnNuevo       = document.querySelector('#btnNuevo'),
          btnPedir       = document.querySelector('#btnPedir'),
          btnPlantarse   = document.querySelector('#btnPlantarse');

    const referencesHTML = {
        'players-points' : playersPoints,        
        'players-deck' : playersDeck,        
    };
    
    const types    = ['H', 'D', 'C', 'S'],
          specials = ['A', 'J', 'Q', 'K'];

    let deck            = [],
        puntosJugadores = [],        
        computerPlaying = false;

    /* Eventos */
    btnNuevo.addEventListener('click', () => {
        startGame();
    });

    btnPedir.addEventListener('click', () => {
        askCard( 'players-deck', 0 );
    });

    btnPlantarse.addEventListener('click', () => {
        turnoComputadora();
    });

    const startGame = ( numPlayers = 2 ) => {

        resetGame( numPlayers );

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

    const resetGame = ( numPlayers ) => {

        puntosJugadores = [];

        for ( let i = 0; i < numPlayers; i++ ) {
            
            puntosJugadores.push(0);
        }
        
        deck = [];

        let element = getElem( 'players-points', 0 );
        refreshUI( element, puntosJugadores[0] );

        element = getElem( 'players-points', puntosJugadores.length - 1 );
        refreshUI( element, puntosJugadores[1] );

        element = getElem( 'players-deck', 0 );
        removeCards( element );

        element = getElem( 'players-deck', puntosJugadores.length - 1 );
        removeCards( element );       
    };

    const getElem = ( type, turno ) => {

        return referencesHTML[type][turno];
    };

    const refreshUI = ( element, points ) => {   

        element.innerText = points;

        if( puntosJugadores[0] === 0 ) {
            setDisabled( btnPlantarse, true);

        } else if ( puntosJugadores[0] >= 1 && puntosJugadores[0] < 21 ) {
            setDisabled( btnPlantarse, false );
        
        } else if ( puntosJugadores[0] === 21 ) {
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

    const askCard = ( who, turno ) => {

        if ( deck.length === 0 ) {
            throw 'No cards in deck';
        }

        const card = deck.shift(),
              cardValue = getCardValue( card ) * 1,
              element = getElem( who, turno );

        createCard( card, element );                
        setPoints( cardValue, turno );    
    };

    const getCardValue = ( card ) => {

        const value = card.substring( 0, card.length - 1 );
        
        return ( ['A'].includes(value) ) ? 11 :
               ( ['J', 'Q', 'K'].includes(value) ) ? 10 : value;
    };

    const createCard = ( card, element ) => {
        
        const imgNode = document.createElement('img');
        
        imgNode.src = `assets/cards/${card}.png`;
        imgNode.height = '240';
        imgNode.classList.add('carta');

        element.append(imgNode);
    };

    const setPoints = ( points, turno ) => {

        if ( turno === 0 ) {
            
            let element  = getElem('players-points', turno);
            
            if( isNaN ( puntosJugadores[0] ) ) {
                puntosJugadores[0] = points;    
            
            } else {
                puntosJugadores[0] += points;

            }           
            refreshUI( element, puntosJugadores[0] );
        
        } else {

            let element  = getElem('players-points', turno);

            if( isNaN ( puntosJugadores[1] ) ) {
                puntosJugadores[1] = points;    

            } else {

                puntosJugadores[1] += points;
            }
            
            
            refreshUI( element, puntosJugadores[1] );
        }    
    };

    const setDisabled = ( btn, value ) => {
        
        btn.disabled = value;    
    };

    const turnoComputadora = () => {
        
        setDisabled(btnPedir, true);
        setDisabled(btnPlantarse, true);        

        let state = getWinner();

        computerPlaying = false;

        setTimeout( () => {
            showMessage( state );
        }, 100 );

        setDisabled(btnNuevo, false);
        setDisabled(btnPedir, true);
        setDisabled(btnPlantarse, true);
    };

    const getWinner = () => {

        let state = '';

        do {
            askCard( 'players-deck', puntosJugadores.length - 1 );

            if( puntosJugadores[0] === 21 && puntosJugadores[1] === 21 ) {
                state = 'tie';
                break;            
            }

            if( puntosJugadores[0] > 21 || ( puntosJugadores[1] > puntosJugadores[0] && puntosJugadores[1] <= 21 ) ) {
                state = 'lost';
                break;            
            }        

            if (puntosJugadores[1] > 21 ) {
                state = 'won';
                break;
            }

        } while ( puntosJugadores[1] <= puntosJugadores[0] || puntosJugadores[1] === 21 );

        return state;
    };

    const showMessage = ( state ) => {

        if( state === 'won' ) {

            swal({
                title: "Awesome !!!",
                text: "You won!",
                icon: "success",                
            });
        
        } else if ( state === 'lost') {

            swal({
                title: "Bad news !",
                text: "You lost!",
                icon: "error",                
            });

        } else {

            swal({
                title: "Oh my god !!!",                
                text: "You both got 21. It's a tie",
                icon: "info",                                
            });
        }        
    };    

    const init = () => {
        setPoints( 0, 0 );
        setPoints( 0, 1 );
        setDisabled( btnPedir, true);
        setDisabled( btnPlantarse, true );
    };
    
    return {
        initGame : init 
    }

})();