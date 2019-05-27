import * as PIXI from 'pixi.js';
import '../css/main.css';

window.addEventListener('load', () => {
    const soundsPath = './sounds/' ;
    const sounds = [
        { src: 'Start_Button.mp3', id: 'start_btn' },
        { src: 'Reel_Stop_1.mp3', id: 'reel_stop_1' },
        { src: 'Reel_Stop_2.mp3', id: 'reel_stop_2' },
        { src: 'Reel_Stop_3.mp3', id: 'reel_stop_3' },
        { src: 'Reel_Stop_4.mp3', id: 'reel_stop_4' },
        { src: 'Reel_Stop_5.mp3', id: 'reel_stop_5' }
    ] ;
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSounds( sounds, soundsPath );
    // createjs.Sound.alternateExtensions = ["mp3"];
    // createjs.Sound.registerSound({src:"./sounds/Start_Button.mp3", id:"start_btn"});

    const app = new PIXI.Application({width: 600, height: 400});
    const reel = document.querySelector('#reel') ;
    const startButton = document.querySelector('#button') ;
    const buttonSrc = {
        normalButton: './images/ui/btn_spin_normal.png',
        hoverButton: './images/ui/btn_spin_hover.png',
        disabledButton: './images/ui/btn_spin_disabled.png',
        pressedButton: './images/ui/btn_spin_pressed.png'
    } ;
    const symbolsSrc = [
        './images/symbols/symbol_1.png',
        './images/symbols/symbol_2.png',
        './images/symbols/symbol_3.png',
        './images/symbols/symbol_4.png',
        './images/symbols/symbol_5.png',
        './images/symbols/symbol_6.png',
        './images/symbols/symbol_7.png',
        './images/symbols/symbol_8.png'
    ] ;

    reel.appendChild(app.view);

    app.loader
    .add(symbolsSrc)
    .load((loader, resources) => {
        const symbols = createImages(symbolsSrc) ;
        const fallingSpeed = 2 ;
        const controlIs = {
            reelSpining: false,
            start: true
        } ;
        let isReelSpining = false ;
        let isStart = true ;

        setImageAttribute(symbols) ;

        app.ticker.add(delta => gameLoop(delta));

        function gameLoop() {
            symbols.forEach((item) => {
                const { image, startY, endY, velocity } = item ;

                image.y += velocity ;
                controlIs.reelSpining = velocity > 0 ;

                if (image.y === endY && controlIs.reelSpining) {
                    const soundNumber = Math.ceil(Math.random() * 5) ;
                    const soundId = `reel_stop_${soundNumber}` ;

                    console.log(soundId);

                    item.velocity = 0 ;
                    createjs.Sound.play(soundId) ;
                } else if (image.y > app.renderer.height) {
                    item.image.y = startY;
                    item.velocity = 0 ;
                }
            });

            if (symbols.every(item => item.image.y < 0 && item.velocity === 0) && !controlIs.start) {
                startReelSpining(symbols) ;
                console.log('start');
            } else if ( symbols.every(item => item.velocity === 0) && controlIs.reelSpining ) {
                handleButtonAction(symbols) ;
                console.log('stop');
                controlIs.reelSpining = false ;
            }
        }

        function createImages(arr) {
            const symbols = [] ;
            const symbolsInRow = 5 ;
            const symbolsInColumn = 3 ;
            const symbolsAmount = symbolsInRow * symbolsInColumn ;
            const symbolWidth = 100 ;
            const anchorX = 0 ;
            const anchorY = 0 ;
            const maskHeight = app.renderer.height ;
            const startVelocity = 0 ;
            let columnCounter = 0 ;
            let rowCounter = 1 ;

            for (let i = 0; i < symbolsAmount; i++) {
                const index = Math.floor(Math.random() * arr.length) ;
                const imagePath = arr[index] ;

                symbols.push({
                    image: new PIXI.Sprite(resources[imagePath].texture),
                    anchorX,
                    anchorY,
                    width: symbolWidth,
                    startY: -(rowCounter * symbolWidth),
                    endY: maskHeight - (symbolWidth * rowCounter),
                    positionX: columnCounter * symbolWidth,
                    delay: (rowCounter * columnCounter + rowCounter) * 100,
                    velocity: startVelocity
                })

                columnCounter++ ;
                rowCounter++ ;

                if (columnCounter > (symbolsInRow - 1)) {
                    columnCounter = 0 ;
                } else if (rowCounter > symbolsInColumn) {
                    rowCounter = 1 ;
                }
            }

            return symbols;
        };

        function setImageAttribute(arr) {
            arr.forEach((item) => {
                const {
                    image,
                    startY,
                    positionX,
                    anchorX,
                    anchorY,
                    width,
                    delay
                } = item ;

                image.x = positionX ;
                image.y = startY ;
                image.width = image.height = width ;
                image.anchor.x = anchorX ;
                image.anchor.y = anchorY ;

                app.stage.addChild(image) ;
            });

            handleButtonAction(arr, controlIs) ;
        };
    });

    function startReelSpining(arr) {
        arr.forEach((item) => {
            setTimeout(() => {
                item.velocity = 10;
            }, item.delay);
        });
    };

    function handleButtonAction(arr, controlIs = {}) {
        startButton.addEventListener('mouseup', buttonMouseUpHandler);
        startButton.addEventListener('mousedown', buttonMouseDownHandler);
        startButton.addEventListener('mouseover', buttonMouseOverHandler);
        startButton.addEventListener('mouseout', buttonMouseOutHandler);

        function buttonMouseUpHandler(e) {
            startButton.src = buttonSrc.disabledButton;

            this.removeEventListener('mouseup', buttonMouseUpHandler);
            this.removeEventListener('mousedown', buttonMouseDownHandler);
            this.removeEventListener('mouseover', buttonMouseOverHandler);
            this.removeEventListener('mouseout', buttonMouseOutHandler);

            createjs.Sound.play('start_btn') ;
            controlIs.start = false ;
            startReelSpining(arr) ;
        };

        function buttonMouseDownHandler(e) {
            startButton.src = buttonSrc.pressedButton;
        };

        function buttonMouseOverHandler(e) {
            startButton.src = buttonSrc.hoverButton;
        };

        function buttonMouseOutHandler(e) {
            startButton.src = buttonSrc.normalButton;
        };
    };
});


