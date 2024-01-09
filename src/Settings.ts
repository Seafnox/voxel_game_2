// TODO Make Settings Proxy, which will save config to localStorage
export class Settings {
  // TODO provide antialias to Renderer
  antialias: boolean;
  musicVolume: number;
  private playerNamProperty: string = 'playerName';
  playerName = localStorage.getItem(this.playerNamProperty) || `Player${Math.round(Math.random() * 100000)}`;
  private serverAddressProperty: string = 'serverAddress';
  serverAddress = localStorage.getItem(this.serverAddressProperty) || `${location.hostname}:8081`;
  private _soundVolume: number;
  isRunning = false;

  constructor(
    public audioContext: AudioContext,
    public gain: GainNode
  ) {
    // Parse existing config, and init values.
    this.antialias = this.getProperty('antialias') == 'true' || false;

    // If undefined, will be NaN and default is set, otherwise, set to stored volume.
    this._soundVolume = +this.getProperty('soundVolume') || 1;
    this.soundVolume = this.soundVolume + 1 ? this.soundVolume : 0.5;

    this.musicVolume = +this.getProperty('musicVolume') || 1;
    this.musicVolume = this.musicVolume + 1 ? this.musicVolume : 0.5;
  }

  setProperty(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  getProperty(name: string) {
    return localStorage.getItem(name) || '';
  }

  get soundVolume() {
    return this._soundVolume;
  }

  set soundVolume(vol) {
    this._soundVolume = vol;
    this.gain.gain.value = this.soundVolume;
  }
}
