import Reel from './Reel' ;
import '../css/main.css' ;

window.addEventListener('load', () => {
    try {
        const reel = new Reel() ;

        reel.createReel() ;
    } catch (error) {
        console.log('Ошибка!!! ', error.message);
    }
})
