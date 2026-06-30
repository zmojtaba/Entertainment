
HTMLElement.prototype.execAnimation = execAnimation;

function execAnimation(this: HTMLElement, classNames: string) {
    return new Promise<HTMLElement>(resolve => {
        let _classNames = classNames.split(' ')

        this.classList.add(..._classNames);
        this.addEventListener('animationend', () => {
            this.classList.remove(..._classNames);
            resolve(this)
        })
    })
}


export { }