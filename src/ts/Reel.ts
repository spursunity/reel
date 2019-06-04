import PIXI from '../js/pixi-module.js' ;
import StartButton from './StartButton' ;
import InitialData from './InitialData';
import { TfallingSymbol, TsoundData } from './types/types' ;

class Reel {
    private soundJS: any = createjs.Sound ;
    private stopSoundsIds: string[] ;
    private startSoundId: string = 'Start_Button' ;

    private app: any ;
    private reel: HTMLElement = document.querySelector('#reel') ;
    private symbols: TfallingSymbol[] ;
    private symbolsSrc: string[] ;

    private startButton = new StartButton() ;
    private initialData = new InitialData(this.symbolWidth, this.rows, this.columns) ;

    constructor(private symbolWidth: number, private rows: number, private columns: number, private fallingVelocity: number) {}

    public initializeData(): void {
        this.app = this.initialData.setApp() ;
        this.startButton.createButtonSrc() ;
        this.stopSoundsIds = this.initialData.createSoundsData() ;
        this.symbolsSrc = this.initialData.createSymbolsSrc() ;
    }

    public createReel(): void {
        this.reel.appendChild(this.app.view) ;

        this.app.loader
        .add(this.symbolsSrc)
        .load((loader: any, resources: any) => {
            this.symbols = this.initialData.createImages(resources, this.symbolsSrc, this.app) ;
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
                    this.symbols = this.initialData.createImages(resources, this.symbolsSrc, this.app) ;
                    this.startReelSpining() ;
                } else if (this.checkReelShouldStop(control)) {
                    this.startButton.setButtonHandlers(this.startReelSpining.bind(this, control.playSound)) ;
                    control.reelSpining = false ;
                }
            }
        });
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
