class StartButton {
    private startButton: HTMLImageElement = document.querySelector('#button') ;
    private buttonPathes: {
        basePath: string,
        ext: string,
        states: any
    } = {
        basePath: './images/ui/btn_spin_',
        ext: '.png',
        states: {
            normalButton: <string>'normal',
            hoverButton: <string>'hover',
            disabledButton: <string>'disabled',
            pressedButton: <string>'pressed'
        }
    } ;
    private buttonSrc: any ;

    constructor() {}

    public createButtonSrc(): void {
        // const { basePath, ext, states } = this.buttonPathes ;
        const buttonBasePath = this.buttonPathes.basePath ;
        const buttonExt = this.buttonPathes.ext ;
        const buttonStates = this.buttonPathes.states ;
        const sources: any = {} ;

        for (const key in buttonStates) {
            if (buttonStates.hasOwnProperty(key)) {
                const state: string = buttonStates[key] ;
                const path: string = `${buttonBasePath}${state}${buttonExt}` ;

                sources[key] = path ;
            }
        }

        this.buttonSrc = sources ;
    }

    public setButtonHandlers(callback: Function): void {
        // const { startButton } = this ;

        this.startButton.addEventListener('mouseup', (e: Event) => this.buttonMouseUpHandler(e, callback)) ;
        this.startButton.addEventListener('mousedown', this.buttonMouseDownHandler) ;
        this.startButton.addEventListener('mouseover', this.buttonMouseOverHandler) ;
        this.startButton.addEventListener('mouseout', this.buttonMouseOutHandler) ;
    }

    private buttonMouseUpHandler = (e: Event, callback: Function): void => {
        // const { startButton, buttonSrc } = this ;

        this.startButton.onmouseup = null ;
        this.startButton.removeEventListener('mousedown', this.buttonMouseDownHandler) ;
        this.startButton.removeEventListener('mouseover', this.buttonMouseOverHandler) ;
        this.startButton.removeEventListener('mouseout', this.buttonMouseOutHandler) ;

        this.startButton.src = this.buttonSrc.disabledButton ;

        callback() ;
    }

    private buttonMouseDownHandler = (e: Event): void => {
        this.startButton.src = this.buttonSrc.pressedButton;
    }

    private buttonMouseOverHandler = (e: Event): void => {
        this.startButton.src = this.buttonSrc.hoverButton;
    }

    private buttonMouseOutHandler = (e: Event): void => {
        this.startButton.src = this.buttonSrc.normalButton;
    }
}

export default StartButton ;
