export const menuHtml = `
    <div class="menu">
        <div id="mainmenu">
            <div class="warning" style="display: none">
                Your browser has poor support for some technologies used in this game.
                It may still be playable, but please consider upgrading your browser.
            </div>
            <div class="error" style="display: none">
                Your browser does not support all the technologies required to play this game,
                and it will most likely not work. Please upgrade your browser.
            </div>
            <ul class="box animated bounceIn">
                <li>
                    <span>Player name:</span>
                    <input type="text" class="input" id="name" placeholder="Name">
                </li>

                <li>
                    <span>Server:</span>
                    <input type="text" class="input" id="server" placeholder="Server address and port">
                </li>

                <li>
                    <button class="button btn-join">Join server</button>
                </li>

                <li>
                    <button class="button btn-settings">Settings</button>
                </li>
            </ul>
        </div>
    </div>
`;
