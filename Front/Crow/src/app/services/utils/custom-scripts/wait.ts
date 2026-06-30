declare global {
    interface Window {
        wait(timeout?: number): Promise<void>;
    }
}

window.wait = (t = 600) => new Promise<void>(r => setTimeout(r, t))

export { }
