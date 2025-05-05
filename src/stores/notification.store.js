import { defineStore } from "pinia";


export const useNotificationStore = defineStore('notification', {
        /**
         * Notification state
         * @property {boolean} show - is the notification visible
         * @property {string} message - the notification message
         * @property {string} color - the notification color (success, error, warning, info)
         */
    state: () => ({
        show: false,
        message: '',
        color: 'success'
    }),
    actions: {

        trigger(message, color) {
/*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Triggers a notification with the given message and color.
         * @param {string} message - the notification message
         * @param {string} color - the notification color (success, error, warning, info)
         */
/*******  7cebb073-8e4f-4246-8be4-3a605716b552  *******/            this.message = message
            this.color = color
            this.show = true
            setTimeout(() => (this.show = false), 3000)
        }
    }
})
