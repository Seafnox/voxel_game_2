export class Settings {
  // TODO provide antialias to Renderer
  antialias = false;
  musicVolume = 100;
  private _soundVolume = 100;

  get soundVolume() {
    return this._soundVolume;
  }

  set soundVolume(vol) {
    this._soundVolume = vol;
    this.gain.gain.value = this.soundVolume;
  }

  private gain: GainNode;

  constructor(audioContext: AudioContext, gain: GainNode) {
    this.gain = gain;

    // Parse existing config, and init values.
    let json = JSON.parse(localStorage.getItem('settings') || '{}');
    this.antialias = json['antialias'] || false;

    // If undefined, will be NaN and default is set, otherwise, set to stored volume.
    let soundVolume = json['soundVolume'];
    this.soundVolume = soundVolume + 1 ? soundVolume : 0.5;

    let musicVolume = json['musicVolume'];
    this.musicVolume = musicVolume + 1 ? musicVolume : 0.5;
  }
}
