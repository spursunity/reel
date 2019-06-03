import PIXI from '../js/pixi-module.js' ;
import StartButton from './StartButton' ;

type TfallingSymbol = {
    image: any,
    width: number,
    startY: number,
    endY: number,
    positionX: number,
    delay: number,
    velocity: number
} ;
type TsoundData = {
    src: string,
    id: string
} ;

class Reel {
    private soundJS: any = createjs.Sound ;
    private baseSoundsPath: string = './sounds/' ;
    private stopSoundsIds: string[] ;
    private startSoundId: string = 'Start_Button' ;
    private sounds: TsoundData[] ;

    private maskSize: {width: number, height: number} ;
    private app: any ;
    private reel: HTMLElement = document.querySelector('#reel') ;
    private symbolsPath: {
        basePath: string,
        ext: string,
        amount: number
    } = {
        basePath: './images/symbols/symbol_',
        ext: '.png',
        amount: 8
    } ;
    private symbols: TfallingSymbol[] ;
    private symbolsSrc: string[] ;

    private startButton = new StartButton() ;

    constructor(private symbolWidth: number, private rows: number, private columns: number, private fallingVelocity: number) {  }

    public createReel(): void {
        this.setApp() ;
        this.startButton.createButtonSrc() ;
        this.createSoundsData() ;
        this.createSymbolsSrc() ;

        this.reel.appendChild(this.app.view) ;

        this.app.loader
        .add(this.symbolsSrc)
        .load((loader: any, resources: any) => {
            this.symbols = this.createImages(resources) ;
            const control: { reelSpining: boolean, playSound: boolean } = {
                reelSpining: false,
                playSound: true
            } ;

            this.startButton.setButtonHandlers(this.startReelSpining.bind(this, control.playSound)) ;
            this.app.ticker.add((delta: any): void => gameLoop(delta)) ;

            const gameLoop = (delta: any): void => {
                this.symbols.forEach((symb: TfallingSymbol) => {
                    // const { velocity } = symb ;

                    this.moveSymbol(symb) ;
                    control.reelSpining = symb.velocity > 0 ;

                    if (this.checkSymbolShouldStop(symb)) {
                        this.stopFallingSymbol(symb) ;
                    }
                });


                if (this.checkReelShouldStart()) {
                    this.symbols = this.createImages(resources) ;
                    this.startReelSpining() ;
                } else if (this.checkReelShouldStop(control)) {
                    this.startButton.setButtonHandlers(this.startReelSpining.bind(this, control.playSound)) ;
                    control.reelSpining = false ;
                }
            }
        });
    }

    private setMaskSize(): void {
        const width: number = this.symbolWidth * this.columns ;
        const height: number = this.symbolWidth * (this.rows + 1) ;

        this.maskSize = { width, height } ;
    }

    private setApp(): void {
        this.setMaskSize() ;

        this.app = new PIXI.Application(this.maskSize) ;
    }

    private createStopSoundsIds(amountStopSounds: number): void {
        const baseStopName: string = 'Reel_Stop_' ;
        const ids = [] ;

        for (let i = 1; i <= amountStopSounds; i++) {
            const id = `${baseStopName}${i}` ;
            ids.push(id) ;
        }

        this.stopSoundsIds = ids ;
    }

    private createSoundsData(): void {
        this.createStopSoundsIds(5) ;

        const soundsData = [] ;
        const extension: string = '.mp3' ;
        const startSoundData: TsoundData = { src: `${this.startSoundId}${extension}`, id: `${this.startSoundId}` } ;

        soundsData.push(startSoundData) ;

        this.stopSoundsIds.forEach((stopId: string): void => {
            const stopSoundData: TsoundData = { src: `${stopId}${extension}`, id: `${stopId}` } ;

            soundsData.push(stopSoundData) ;
        });

        this.sounds = soundsData ;
        this.soundJS.registerSounds( this.sounds, this.baseSoundsPath ) ;
    }

    private createSymbolsSrc(): void {
        // const { basePath, ext, amount } = this.symbolsPath ; Bad practice???
        const symbolsBasePath = this.symbolsPath.basePath ;
        const symbolsExt = this.symbolsPath.ext ;
        const symbolsAmount = this.symbolsPath.amount ;
        const sources = [] ;

        for (let i = 1; i <= symbolsAmount; i++) {
            const path: string = `${symbolsBasePath}${i}${symbolsExt}` ;

            sources.push(path) ;
        }

        this.symbolsSrc = sources ;
    }

    private createImages(resources: any): TfallingSymbol[] {
        const symbols: TfallingSymbol[] = [] ;
        const symbolsInRow: number = this.columns ;
        const symbolsInColumn: number = this.rows ;
        const symbolsAmount: number = symbolsInRow * symbolsInColumn ;
        // const { height: maskHeight } = this.app.renderer ;

        const startVelocity: number = 0 ;
        let columnCounter: number = 0 ;
        let rowCounter: number = 1 ;

        for (let i = 0; i < symbolsAmount; i++) {
            const index = Math.floor(Math.random() * this.symbolsSrc.length) ;
            const imagePath = this.symbolsSrc[index] ;
            const symbolInitialData: TfallingSymbol = {
                image: new PIXI.Sprite(resources[imagePath].texture),
                width: this.symbolWidth,
                startY: -(rowCounter * this.symbolWidth),
                endY: this.app.renderer.height - (this.symbolWidth * rowCounter),
                positionX: columnCounter * this.symbolWidth,
                delay: (rowCounter * columnCounter + rowCounter) * 100,
                velocity: startVelocity
            } ;

            symbols.push(symbolInitialData) ;
            this.setImageAttributes(symbolInitialData) ;

            columnCounter++ ;

            if (columnCounter > (symbolsInRow - 1)) {
                columnCounter = 0 ;
                rowCounter++ ;
            }
        }

        return symbols ;
    }

    private setImageAttributes(symbolItem: TfallingSymbol): void {
        /* const {
            image,
            startY,
            positionX,
            width
        } = symbolItem ;*/
        const anchorX: number = 0 ;
        const anchorY: number = 0 ;

        symbolItem.image.x = symbolItem.positionX ;
        symbolItem.image.y = symbolItem.startY ;
        symbolItem.image.width = symbolItem.image.height = symbolItem.width ;
        symbolItem.image.anchor.x = anchorX ;
        symbolItem.image.anchor.y = anchorY ;

        this.app.stage.addChild(symbolItem.image) ;
    }

    private startReelSpining(playSound?: boolean): void {
        if (playSound) {
            this.soundJS.play(this.startSoundId) ;
        }

        this.symbols.forEach((symbolItem: TfallingSymbol) => {
            setTimeout(() => {
                symbolItem.velocity = this.fallingVelocity;
            }, symbolItem.delay);
        });
    }

    private moveSymbol(symbolData: TfallingSymbol): void {
        symbolData.image.y += symbolData.velocity ;
    }

    private checkSymbolShouldStop(symbolData: TfallingSymbol): boolean {
        // const { endY, image, velocity } = symbolData ;
        // const { y: positionY } = image ;
        const remainingDistance: number = symbolData.endY - symbolData.image.y ;

        return remainingDistance >= 0 && remainingDistance < symbolData.velocity ;
    }

    private stopFallingSymbol(symbolData: TfallingSymbol): void {
        symbolData.image.y = symbolData.endY ;
        symbolData.velocity = 0 ;
        this.playStopSound() ;
    }

    private checkReelShouldStart(): boolean {
        // const { symbols, app } = this ;
        // const { height: maskHeight } = app.renderer ;

        return this.symbols.every((symb: TfallingSymbol) => symb.image.y > this.app.renderer.height) ;
    }

    private checkReelShouldStop(control: { reelSpining: boolean }): boolean {
        // const { symbols } = this ;

        return this.symbols.every((symb: TfallingSymbol) => symb.velocity === 0) && control.reelSpining ;
    }

    private playStopSound(): void {
        // const { stopSoundsIds } = this ;
        const maxNumber: number = this.stopSoundsIds.length ;
        const randomNumber: number = Math.floor(Math.random() * maxNumber) ;
        const stopSoundId: string = this.stopSoundsIds[randomNumber] ;

        this.soundJS.play(stopSoundId) ;
    }
}

export default Reel ;
