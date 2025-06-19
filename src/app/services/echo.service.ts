import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
  broadcaster: 'pusher',
  key: 'k7ysspu6tjfsychzwnwv',
  wsHost: 'localhost',
  cluster: 'mt1', // ✅ required even if unused
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
});
