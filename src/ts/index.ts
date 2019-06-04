import Reel from './Reel' ;
import '../css/main.css' ;

window.addEventListener('load', () => {
    try {
        const symbolWidth: number = 123 ;
        const reelRows: number = 3 ;
        const reelColumn: number = 5 ;
        const reelVelocity: number = 11 ;

        const reel = new Reel(symbolWidth, reelRows, reelColumn, reelVelocity) ;

        reel.initializeData() ;
        reel.createReel() ;
    } catch (error) {
        console.log('Ошибка!!! ', error.message);
    }
})
