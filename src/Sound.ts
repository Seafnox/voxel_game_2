export class Sound {
    ctx: AudioContext;
    gain: GainNode;
    buffer: AudioBuffer;
    source: AudioBufferSourceNode | undefined;

    constructor(ctx: AudioContext, buffer: AudioBuffer, gain: GainNode) {
        this.ctx = ctx;
        this.gain = gain;
        this.buffer = buffer;
    }

    play() {
        if (this.source) return;
        let source = this.ctx.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.gain);
        source.onended = () => {
            this.source = undefined;
        };
        source.start();
        this.source = source;
    }

    stop() {
        if (this.source) {
            this.source.stop();
            this.source = undefined;
        }
    }
}
