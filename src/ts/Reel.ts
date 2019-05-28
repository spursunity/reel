import PIXI from '../js/pixi-module.js' ;

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

class Reel {
    private soundJS: any = createjs.Sound ;
    private soundsPath: string = './sounds/' ;
    private stopSoundsIds: string[] ;
    private startSoundId: string = 'Start_Button' ;
    private sounds: TsoundData[] ;

    private app: any = new PIXI.Application({width: 600, height: 400}) ;
    private reel: HTMLElement = document.querySelector('#reel') ;
    private startButton: HTMLImageElement = document.querySelector('#button') ;
    private symbols: TfallingSymbol[] ;
    private symbolsSrc: string[] = [
        './images/symbols/symbol_1.png',
        './images/symbols/symbol_2.png',
        './images/symbols/symbol_3.png',
        './images/symbols/symbol_4.png',
        './images/symbols/symbol_5.png',
        './images/symbols/symbol_6.png',
        './images/symbols/symbol_7.png',
        './images/symbols/symbol_8.png'
    ] ;
    private buttonSrc = {
        normalButton: <string>'./images/ui/btn_spin_normal.png',
        hoverButton: <string>'./images/ui/btn_spin_hover.png',
        disabledButton: <string>'./images/ui/btn_spin_disabled.png',
        pressedButton: <string>'./images/ui/btn_spin_pressed.png'
    } ;

    constructor() {

    }

    public createReel(): void {
        this.reel.appendChild(this.app.view) ;
        this.createSoundsData() ;

        this.app.loader
        .add(this.symbolsSrc)
        .load((loader: any, resources: any) => {
            const maskHeight: number = this.app.renderer.height;
            const createNewImages: Function = () => this.createImages(this.symbolsSrc, maskHeight, resources) ;
            const control: TcontrolIs = {
                reelSpining: false
            } ;
            this.symbols = createNewImages() ;

            this.handleButtonAction() ;

            this.app.ticker.add((delta: any): void => gameLoop(delta)) ;

            const gameLoop = (delta: any): void => {
                this.symbols.forEach((item: TfallingSymbol) => {
                    const { image, endY, velocity } = item ;

                    image.y += velocity ;
                    control.reelSpining = velocity > 0 ;

                    if (image.y === endY && control.reelSpining) {
                        this.playStopSound() ;

                        item.velocity = 0 ;
                    }
                });

                if (this.symbols.every((item: TfallingSymbol) => item.image.y > maskHeight)) {
                    this.symbols = createNewImages() ;
                    this.startReelSpining() ;
                    console.log('start') ;
                } else if ( this.symbols.every((item: TfallingSymbol) => item.velocity === 0) && control.reelSpining ) {
                    this.handleButtonAction() ;
                    console.log('stop') ;
                    control.reelSpining = false ;
                }
            }
        });
    }

    private createImages(arrSrc: string[], maskHeight: number, resources: any): TfallingSymbol[] {
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
            this.setImageAttributes(symbolInitialData) ;

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

    private setImageAttributes(symbolItem: TfallingSymbol): void {
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

        this.app.stage.addChild(image) ;
    };

    private startReelSpining(): void {
        this.symbols.forEach((symbolItem: TfallingSymbol) => {
            setTimeout(() => {
                symbolItem.velocity = 10;
            }, symbolItem.delay);
        });
    };

    private handleButtonAction(): void {
        const { startButton } = this ;

        startButton.addEventListener('mouseup', this.buttonMouseUpHandler) ;
        startButton.addEventListener('mousedown', this.buttonMouseDownHandler) ;
        startButton.addEventListener('mouseover', this.buttonMouseOverHandler) ;
        startButton.addEventListener('mouseout', this.buttonMouseOutHandler) ;
    };

    private buttonMouseUpHandler = (e: Event): void => {
        const { startButton, buttonSrc } = this ;

        startButton.src = buttonSrc.disabledButton ;
        this.soundJS.play(this.startSoundId) ;

        startButton.removeEventListener('mouseup', this.buttonMouseUpHandler) ;
        startButton.removeEventListener('mousedown', this.buttonMouseDownHandler) ;
        startButton.removeEventListener('mouseover', this.buttonMouseOverHandler) ;
        startButton.removeEventListener('mouseout', this.buttonMouseOutHandler) ;

        this.startReelSpining() ;
    };

    private buttonMouseDownHandler = (e: Event): void => {
        const { startButton, buttonSrc } = this ;

        startButton.src = buttonSrc.pressedButton;
    };

    private buttonMouseOverHandler = (e: Event): void => {
        const { startButton, buttonSrc } = this ;

        startButton.src = buttonSrc.hoverButton;
    };

    private buttonMouseOutHandler = (e: Event): void => {
        const { startButton, buttonSrc } = this ;

        startButton.src = buttonSrc.normalButton;
    };

    private createStopSoundsIds(amountStopSounds: number): void {
        const baseStopName: string = 'Reel_Stop_' ;
        const ids = [] ;

        for (let i = 1; i <= amountStopSounds; i++) {
            const id = `${baseStopName}${i}` ;
            ids.push(id) ;
        }

        this.stopSoundsIds = ids ;
    };

    private createSoundsData(): void {
        this.createStopSoundsIds(5) ;

        const { startSoundId, stopSoundsIds } = this ;
        const soundsData = [] ;
        const extension: string = '.mp3' ;
        const startSoundData: TsoundData = { src: `${startSoundId}${extension}`, id: `${startSoundId}` } ;

        soundsData.push(startSoundData) ;

        stopSoundsIds.forEach((stopId: string): void => {
            const stopSoundData: TsoundData = { src: `${stopId}${extension}`, id: `${stopId}` } ;

            soundsData.push(stopSoundData) ;
        });

        this.sounds = soundsData ;
        this.soundJS.registerSounds( this.sounds, this.soundsPath ) ;
    };

    private playStopSound(): void {
        const { stopSoundsIds } = this ;
        const maxNumber: number = stopSoundsIds.length ;
        const randomNumber: number = Math.floor(Math.random() * maxNumber) ;
        const stopSoundId: string = stopSoundsIds[randomNumber] ;

        this.soundJS.play(stopSoundId) ;

        console.log(stopSoundId) ;
    };
}

export default Reel ;
