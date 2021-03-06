var Class = require('../../utils/Class');

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// https://patrickhlauke.github.io/touch/tests/results/
// https://www.html5rocks.com/en/mobile/touch/

var TouchManager = new Class({

    initialize:

    /**
     * [description]
     *
     * @class TouchManager
     * @memberOf Phaser.Input.Touch
     * @constructor
     * @since 3.0.0
     *
     * @param {Phaser.Input.InputManager} inputManager - [description]
     */
    function TouchManager (inputManager)
    {
        /**
         * [description]
         *
         * @property {Phaser.Input.InputManager} manager
         * @since 3.0.0
         */
        this.manager = inputManager;

        /**
         * If true the DOM events will have event.preventDefault applied to them, if false they will propagate fully.
         *
         * @property {boolean} capture
         * @default true
         * @since 3.0.0
         */
        this.capture = true;

        /**
         * [description]
         *
         * @property {boolean} enabled
         * @default false
         * @since 3.0.0
         */
        this.enabled = false;

        /**
         * [description]
         *
         * @property {null} target
         * @since 3.0.0
         */
        this.target;

        /**
         * [description]
         *
         * @property {function} handler
         * @since 3.0.0
         */
        this.handler;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Touch.TouchManager#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var config = this.manager.config;

        this.enabled = config.inputTouch;
        this.target = config.inputTouchEventTarget;
        this.capture = config.inputTouchCapture;

        if (!this.target)
        {
            this.target = this.manager.game.canvas;
        }

        if (this.enabled)
        {
            this.startListeners();
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Touch.TouchManager#startListeners
     * @since 3.0.0
     */
    startListeners: function ()
    {
        var queue = this.manager.queue;
        var target = this.target;

        var passive = { passive: true };
        var nonPassive = { passive: false };

        var handler;

        if (this.capture)
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                // console.log('touch', event);

                queue.push(event);

                event.preventDefault();
            };

            target.addEventListener('touchstart', handler, nonPassive);
            target.addEventListener('touchmove', handler, nonPassive);
            target.addEventListener('touchend', handler, nonPassive);
        }
        else
        {
            handler = function (event)
            {
                if (event.defaultPrevented)
                {
                    // Do nothing if event already handled
                    return;
                }

                queue.push(event);
            };

            target.addEventListener('touchstart', handler, passive);
            target.addEventListener('touchmove', handler, passive);
            target.addEventListener('touchend', handler, passive);
        }
        
        this.handler = handler;
    },

    /**
     * [description]
     *
     * @method Phaser.Input.Touch.TouchManager#stopListeners
     * @since 3.0.0
     */
    stopListeners: function ()
    {
        var target = this.target;

        target.removeEventListener('touchstart', this.handler);
        target.removeEventListener('touchmove', this.handler);
        target.removeEventListener('touchend', this.handler);
    }

});

module.exports = TouchManager;
