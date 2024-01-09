export const settingsHtml = `
    <div class="menu menu-settings">
        <div class="box animated bounceIn">
            <ul>
                <li>
                    <h3>Graphics settings</h3>
                </li>

                <li>
                    <label><input class="settings-antialias" type="checkbox"> Antialias</label> <br>
                    <small>Enabling / disabling antialiasing requires a page refresh to take effect.</small>
                </li>

                <li>
                    <h3>Audio settings</h3>
                </li>

                <li>
                    <span>Sound effect volume:</span>
                    <input class="settings-sound" type="range" min="0" max="1" step="0.05">
                </li>

                <li>
                    <span>Music volume:</span>
                    <input class="settings-music" type="range" min="0" max="1" step="0.05">
                </li>
            </ul>
            <button class="button btn-menu">Return to menu</button>
        </div>
    </div>
`;
