import {action_message} from './app/messages';

export default socket => store => next => action => {
  if(action && action.meta && action.meta.remote){
    socket.emit(action_message, action);    
  }
  return next(action);
}
