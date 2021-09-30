class Carousel {
  constructor(carousel) {
    this.carousel = carousel
    this.children = Array.from(this.carousel.children).filter((item) =>
      item.classList.contains('item'),
    )
    this.buttons = []
    this.indicator = []
    this.index = 0
    this.touchStart
  }

  setup() {
    const carousel = Array.from(this.carousel.children)
    let control = carousel.find((item) =>
      item.classList.contains('carousel-control'),
    )

    if (control)
      Array.from(control.children).forEach((item) => {
        if (item.classList.contains('carousel-button'))
          this.buttons = [...this.buttons, item]
        if (item.classList.contains('carousel-indicator'))
          this.indicator = [...item.children]
      })

    this.carousel.addEventListener(
      'touchstart',
      (e) => (this.touchStart = e.touches[0].clientX),
    )
    this.carousel.addEventListener('touchend', (e) => this.touchEvent(e))

    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.slide(
          btn.classList.contains('prev'),
          btn.classList.contains('next'),
        )
      })
    })

    this.arange()
    window.addEventListener('resize', () => this.arange())
  }

  touchEvent(e) {
    let touchEnd = e.changedTouches[0].clientX
    if (this.touchStart > touchEnd) this.slide(false, true)
    else this.slide(true, false)
  }

  arange() {
    this.updateIndicator()
    const carousel = Array.from(this.carousel.children)
    carousel[this.index].children[0].classList.add('active')
    carousel.forEach((child, key) => {
      if (child.classList.contains('item'))
        child.style.left = child.offsetWidth * key + 'px'
    })
  }

  updateIndicator() {
    const i = this.index + 1
    const len = this.children.length
    this.indicator.forEach((item) => {
      if (item.classList.contains('index')) item.innerText = i
      if (item.classList.contains('length')) item.innerText = len
    })

    const prev = this.buttons.find((btn) => btn.classList.contains('prev'))
    const next = this.buttons.find((btn) => btn.classList.contains('next'))
    if (i <= 1) {
      prev.classList.add('disabled')
      next.classList.remove('disabled')
      prev.setAttribute('disabled', true)
      next.removeAttribute('disabled')
    } else if (i >= len) {
      next.classList.add('disabled')
      prev.classList.remove('disabled')
      next.setAttribute('disabled', true)
      prev.removeAttribute('disabled')
    } else {
      prev.classList.remove('disabled')
      next.classList.remove('disabled')
      next.removeAttribute('disabled')
      prev.removeAttribute('disabled')
    }
  }

  slide(prev, next) {
    let i = this.index
    if (prev) i <= 0 ? 0 : (i -= 1)
    if (next)
      i >= this.children.length - 1 ? this.children.length - 1 : (i += 1)

    const carousel = Array.from(this.children)
    for (let car of carousel) {
      car.children[0].classList.remove('active')
      car.style.transform = `translateX(${-100 * i}%)`
      //   car.style.transform = `translateX(-${car.offsetWidth * i}px)`
    }
    carousel[i].children[0].classList.add('active')
    this.index = i
    this.updateIndicator()
    this.arange()
  }
}

class Toggle {
  constructor(collapsible, toggler, class_name = 'active') {
    this.collapsible = collapsible
    this.toggler = toggler
    this.class_name = class_name
    this.isToggled = false
  }
  setup() {
    this.toggler.addEventListener('click', () => this.toggle())
  }

  toggle() {
    this.isToggled = !this.isToggled
    this.collapsible.classList[this.isToggled ? 'add' : 'remove'](
      this.class_name,
    )
    this.toggler.classList[this.isToggled ? 'add' : 'remove'](this.class_name)
  }
}

const carousel = Array.from(document.querySelectorAll('.carousel'))
const navMenu = document.querySelector('.nav-menu')
const navToggler = document.querySelector('.btn-nav-toggle')
const toggleColorScheme = document.querySelector('.prefers-color-scheme .btn')

const useLight = window.matchMedia('(prefers-color-scheme: light)')
const toggleMode = () => {
  document.documentElement.classList.toggle('light-mode')
  toggleColorScheme.classList.toggle('light-mode')
}

toggleColorScheme.addEventListener('click', () => {
  toggleMode(useLight.matches)
})

const activateComponents = () => {
  const navMenuToggle = new Toggle(navMenu, navToggler, 'toggled')
  navMenuToggle.setup()
  carousel.forEach((item, key) => {
    const c = new Carousel(item)
    c.setup()
  })
}

activateComponents()
