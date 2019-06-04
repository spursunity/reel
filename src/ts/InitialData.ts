import PIXI from '../js/pixi-module.js' ;
import { TfallingSymbol, TsoundData } from './types/types' ;

class InitialData {
    private soundJS: any = createjs.Sound ;
    private baseSoundsPath: string = './sounds/' ;
    private startSoundId: string = 'Start_Button' ;

    private symbolsPath: {
        basePath: string,
        ext: string,
        amount: number
    } = {
        basePath: './images/symbols/symbol_',
        ext: '.png',
        amount: 8
    } ;

    constructor(private symbolWidth: number, private reelRows: number, private reelColumns: number) {}

    public setApp(): any {
        const width: number = this.reelColumns * this.symbolWidth ;
        const height: number = (this.reelRows + 1) * this.symbolWidth ;

        return new PIXI.Application({ width, height }) ;
    }

    private createStopSoundsIds(amountStopSounds: number): string[] {
        const baseStopName: string = 'Reel_Stop_' ;
        const ids = [] ;

        for (let i = 1; i <= amountStopSounds; i++) {
            const id = `${baseStopName}${i}` ;
            ids.push(id) ;
        }

        return ids ;
    }

    public createSoundsData(): string[] {
        const soundsIds: string[] = this.createStopSoundsIds(5) ;

        const soundsData = [] ;
        const extension: string = '.mp3' ;
        const startSoundData: TsoundData = { src: `${this.startSoundId}${extension}`, id: `${this.startSoundId}` } ;

        soundsData.push(startSoundData) ;

        soundsIds.forEach((stopId: string): void => {
            const stopSoundData: TsoundData = { src: `${stopId}${extension}`, id: `${stopId}` } ;

            soundsData.push(stopSoundData) ;
        });

        this.soundJS.registerSounds( soundsData, this.baseSoundsPath ) ;

        return soundsIds ;
    }

    public createSymbolsSrc(): string[] {
        // const { basePath, ext, amount } = this.symbolsPath ; Bad practice???
        const symbolsBasePath = this.symbolsPath.basePath ;
        const symbolsExt = this.symbolsPath.ext ;
        const symbolsAmount = this.symbolsPath.amount ;
        const sources = [] ;

        for (let i = 1; i <= symbolsAmount; i++) {
            const path: string = `${symbolsBasePath}${i}${symbolsExt}` ;

            sources.push(path) ;
        }

        return sources ;
    }

    public createImages(resources: any, symbolsSrc: string[], app: any): TfallingSymbol[] {
        const symbols: TfallingSymbol[] = [] ;
        const symbolsInRow: number = this.reelColumns ;
        const symbolsInColumn: number = this.reelRows ;
        const symbolsAmount: number = symbolsInRow * symbolsInColumn ;
        // const { height: maskHeight } = this.app.renderer ;

        const startVelocity: number = 0 ;
        let columnCounter: number = 0 ;
        let rowCounter: number = 1 ;

        for (let i = 0; i < symbolsAmount; i++) {
            const index = Math.floor(Math.random() * symbolsSrc.length) ;
            const imagePath = symbolsSrc[index] ;
            const symbolInitialData: TfallingSymbol = {
                image: new PIXI.Sprite(resources[imagePath].texture),
                width: this.symbolWidth,
                startY: -(rowCounter * this.symbolWidth),
                endY: app.renderer.height - (this.symbolWidth * rowCounter),
                positionX: columnCounter * this.symbolWidth,
                delay: (rowCounter * columnCounter + rowCounter) * 100,
                velocity: startVelocity
            } ;

            symbols.push(symbolInitialData) ;
            this.setImageAttributes(symbolInitialData, app) ;

            columnCounter++ ;

            if (columnCounter > (symbolsInRow - 1)) {
                columnCounter = 0 ;
                rowCounter++ ;
            }
        }

        return symbols ;
    }

    private setImageAttributes(symbolItem: TfallingSymbol, app:any): void {
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

        app.stage.addChild(symbolItem.image) ;
    }
}

export default InitialData ;
