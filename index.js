const scGap = 0.1
class State {

    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(cb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    constructor() {
        this.components = []
    }

    update() {
        const componentLength = this.components.length
        for (var i = componentLength - 1; i>= 0; i--) {
            const component = this.components[i]
            component.update(() => {
                this.components.splice(i, 1)
                if (this.components.length == 0) {
                    clearInterval(this.interval)
                }
            })
        }
    }

    start() {
      if (this.components.length == 1) {
          this.interval = setInterval(() => {
              this.update()
          }, 50)
      }
    }

    add(component) {
        this.components.push(component)
        this.start()
    }
}

const h = window.innerWidth
const w = window.innerHeight
const size = 100
const animator = new Animator()

Vue.component('box', {
    data() {
        return {
            state : new State(),
            y : 0,
            x : Math.random() * (w - size)
        }
    },

    methods : () {
        start() {
            this.state.startUpdating(() => {
                animator.add(this)
            })
        },

        update(cb) {
            this.y = (h + size) * this.state.scale
            this.state.update(cb)
        }
    },
    template : '#myBox'
})
