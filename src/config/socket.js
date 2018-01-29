import io from 'socket.io-client';
import ioLocation from './socketIOLocation';

export const socket = io(ioLocation);
export default socket;
