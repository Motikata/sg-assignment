import { Button } from "./Button";
import screenfull from "screenfull";

export class FullScreenButton extends Button {
    constructor() {
        super(
            "Fullscreen",
            () => {
                if (screenfull.isEnabled) {
                    screenfull.request();
                }
            },
            150,
            44,
            19
        );
    }
}
