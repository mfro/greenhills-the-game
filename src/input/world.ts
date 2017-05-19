import * as mouse from './mouse';
import * as camera from 'camera';

export function getMousePosition() {
    return camera.transform(mouse.position);
}
