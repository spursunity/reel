import Reel from './Reel' ;
import '../css/main.css' ;

window.addEventListener('load', () => {
    try {
        const reel = new Reel(123, 3, 5) ;

        reel.createReel() ;
    } catch (error) {
        console.log('Ошибка!!! ', error.message);
    }
})
