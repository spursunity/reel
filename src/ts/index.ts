import PIXI from '../js/index' ;
import '../css/main.css' ;

window.addEventListener('load', () => {
    const soundJS: any = createjs.Sound ;
    const soundsPath: string = './sounds/' ;
    const stopSoundsIds: string[] = createStopSoundsIds(5) ;
    const startSoundId: string = 'Start_Button' ;
    const sounds: TsoundData[] = createSoundsData(startSoundId, stopSoundsIds) ;

    soundJS.registerSounds( sounds, soundsPath ) ;

    const app: any = new PIXI.Application({width: 600, height: 400}) ;
    const reel: HTMLElement = document.querySelector('#reel') ;
    const startButton: HTMLImageElement = document.querySelector('#button') ;
    const symbolsSrc: string[] = [
        './images/symbols/symbol_1.png',
        './images/symbols/symbol_2.png',
        './images/symbols/symbol_3.png',
        './images/symbols/symbol_4.png',
        './images/symbols/symbol_5.png',
        './images/symbols/symbol_6.png',
        './images/symbols/symbol_7.png',
        './images/symbols/symbol_8.png'
    ] ;
    const buttonSrc = {
        normalButton: <string>'./images/ui/btn_spin_normal.png',
        hoverButton: <string>'./images/ui/btn_spin_hover.png',
        disabledButton: <string>'./images/ui/btn_spin_disabled.png',
        pressedButton: <string>'./images/ui/btn_spin_pressed.png'
    } ;
    type TfallingSymbol = {
        image: any,
        width: number,
        startY: number,
        endY: number,
        positionX: number,
        delay: number,
        velocity: number
    } ;
    type TcontrolIs = {
        reelSpining: boolean
    } ;
    type TsoundData = {
        src: string,
        id: string
    } ;


    reel.appendChild(app.view) ;

    app.loader
    .add(symbolsSrc)
    .load((loader: any, resources: any) => {
        const maskHeight: number = app.renderer.height;
        const createNewImages: Function = () => createImages(symbolsSrc, maskHeight, resources) ;
        const control: TcontrolIs = {
            reelSpining: false
        } ;
        let symbols: TfallingSymbol[] = createNewImages() ;

        handleButtonAction(symbols) ;

        app.ticker.add((delta: any): void => gameLoop(delta)) ;

        function gameLoop(delta: any): void {
            symbols.forEach((item) => {
                const { image, endY, velocity } = item ;

                image.y += velocity ;
                control.reelSpining = velocity > 0 ;

                if (image.y === endY && control.reelSpining) {
                    playStopSound() ;

                    item.velocity = 0 ;
                }
            });

            if (symbols.every(item => item.image.y > maskHeight)) {
                symbols = createNewImages() ;
                startReelSpining(symbols) ;
                console.log('start') ;
            } else if ( symbols.every(item => item.velocity === 0) && control.reelSpining ) {
                handleButtonAction(symbols) ;
                console.log('stop') ;
                control.reelSpining = false ;
            }
        }
    });

    function createImages(arrSrc: string[], maskHeight: number, resources: any): TfallingSymbol[] {
        const symbols: TfallingSymbol[] = [] ;
        const symbolsInRow: number = 5 ;
        const symbolsInColumn: number = 3 ;
        const symbolsAmount: number = symbolsInRow * symbolsInColumn ;
        const symbolWidth: number = 100 ;

        const startVelocity: number = 0 ;
        let columnCounter: number = 0 ;
        let rowCounter: number = 1 ;

        for (let i = 0; i < symbolsAmount; i++) {
            const index = Math.floor(Math.random() * arrSrc.length) ;
            const imagePath = arrSrc[index] ;
            const symbolInitialData: TfallingSymbol = {
                image: new PIXI.Sprite(resources[imagePath].texture),
                width: symbolWidth,
                startY: -(rowCounter * symbolWidth),
                endY: maskHeight - (symbolWidth * rowCounter),
                positionX: columnCounter * symbolWidth,
                delay: (rowCounter * columnCounter + rowCounter) * 100,
                velocity: startVelocity
            } ;

            symbols.push(symbolInitialData) ;
            setImageAttributes(symbolInitialData) ;

            columnCounter++ ;
            rowCounter++ ;

            if (columnCounter > (symbolsInRow - 1)) {
                columnCounter = 0 ;
            } else if (rowCounter > symbolsInColumn) {
                rowCounter = 1 ;
            }
        }

        return symbols ;
    }

    function setImageAttributes(symbolItem: TfallingSymbol): void {
        const {
            image,
            startY,
            positionX,
            width
        } = symbolItem ;
        const anchorX: number = 0 ;
        const anchorY: number = 0 ;

        image.x = positionX ;
        image.y = startY ;
        image.width = image.height = width ;
        image.anchor.x = anchorX ;
        image.anchor.y = anchorY ;

        app.stage.addChild(image) ;
    };

    function startReelSpining(symbolsData: TfallingSymbol[]): void {
        symbolsData.forEach((symbolItem: TfallingSymbol) => {
            setTimeout(() => {
                symbolItem.velocity = 10;
            }, symbolItem.delay);
        });
    };

    function handleButtonAction(symbolsData: TfallingSymbol[]): void {
        startButton.addEventListener('mouseup', buttonMouseUpHandler) ;
        startButton.addEventListener('mousedown', buttonMouseDownHandler) ;
        startButton.addEventListener('mouseover', buttonMouseOverHandler) ;
        startButton.addEventListener('mouseout', buttonMouseOutHandler) ;

        function buttonMouseUpHandler(e: Event) {
            startButton.src = buttonSrc.disabledButton ;

            soundJS.play(startSoundId) ;

            this.removeEventListener('mouseup', buttonMouseUpHandler) ;
            this.removeEventListener('mousedown', buttonMouseDownHandler) ;
            this.removeEventListener('mouseover', buttonMouseOverHandler) ;
            this.removeEventListener('mouseout', buttonMouseOutHandler) ;

            startReelSpining(symbolsData) ;
        };

        function buttonMouseDownHandler(e: Event) {
            startButton.src = buttonSrc.pressedButton;
        };

        function buttonMouseOverHandler(e: Event) {
            startButton.src = buttonSrc.hoverButton;
        };

        function buttonMouseOutHandler(e: Event) {
            startButton.src = buttonSrc.normalButton;
        };
    };

    function createStopSoundsIds(amountStopSounds: number): string[] {
        const baseStopName: string = 'Reel_Stop_' ;
        const stopSoundsIds = [] ;

        for (let i = 1; i <= amountStopSounds; i++) {
            const id = `${baseStopName}${i}` ;
            stopSoundsIds.push(id) ;
        }

        return stopSoundsIds;
    };

    function createSoundsData(startId: string, stopIds: string[]): TsoundData[] {
        const soundsData = [] ;
        const extension: string = '.mp3' ;
        const startSoundData: TsoundData = { src: `${startId}${extension}`, id: `${startId}` } ;

        soundsData.push(startSoundData) ;

        stopIds.forEach((stopId: string, index: number): void => {
            const soundNumber: number = index + 1 ;
            const stopSoundData: TsoundData = { src: `${stopId}${extension}`, id: `${stopId}` } ;

            soundsData.push(stopSoundData) ;
        });

        return soundsData ;
    };

    function playStopSound(): void {
        const maxNumber: number = stopSoundsIds.length ;
        const randomNumber: number = Math.floor(Math.random() * maxNumber) ;
        const stopSoundId: string = stopSoundsIds[randomNumber] ;

        soundJS.play(stopSoundId) ;

        console.log(stopSoundId) ;
    };
})
