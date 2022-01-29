import { sendAmplitudeData } from './services/amplitude'

const steps = [
  {
    id: 'intro',
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    modalOverlayOpeningRadius: 10,
    title: 'Welcome To Flow!',
    text:
      `<div>
        Want me to show you around?
        <br/><br/>
        <p align="right">
          1/6
        </p>
      </div>`,
    buttons: [
      {
        action() {
          return this.next()
        },
        classes: 'shepherd-button-primary',
        text: 'Start'
      },
      {
        action() {
          return this.show('product-tour', true)
        },
        classes: 'shepherd-button-secondary',
        text: 'Skip',
      }
    ],
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: Welcome')
      }
    }
  },
  {
    id: 'flow-list-container',
    attachTo: { element: '.flow-list-container', on: "left" },
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    canClickTarget: false,
    modalOverlayOpeningRadius: 10,
    title: "Flow Dashboard",
    text:
      `<div>
        This is your Flow <b>dashboard</b>!
        <br/><br/>
        You can view all your Flows here.
        <p align="right">
          2/6
        </p>
      </div>`,
    buttons: [
      {
        action() {
          return this.next()
        },
        classes: 'shepherd-button-primary',
        text: 'Continue'
      },
    ],
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: Flow Dashboard')
      }
    }
  },
  {
    id: 'bundle-card',
    attachTo: { element: '.bundle-card', on: "left" },
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    canClickTarget: false,
    modalOverlayOpeningRadius: 10,
    title: "What is a Flow?",
    text:
      `<div>
        Flows are <b>workspaces</b> that save your tabs.
        <br/><br/>
        You can switch to a workspace by clicking the play button.
        <br/><br/>
        <p align="right">
          3/6
        </p>
      </div>`,
    buttons: [
      {
        action() {
          return this.next()
        },
        classes: 'shepherd-button-primary',
        text: 'Continue'
      },
    ],
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: What is a Flow?')
      }
    }
  },
  {
    id: 'plus-icon',
    attachTo: { element: '.plus-icon', on: "right" },
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    canClickTarget: false,
    modalOverlayOpeningRadius: 10,
    title: "How do I create a Flow?",
    text:
      `<div>
        Click the plus button to create an empty Flow.
        <br/><br/>
        <p align="right">
          4/6
        </p>
      </div>`,
    buttons: [
      {
        action() {
          return this.next()
        },
        classes: 'shepherd-button-primary',
        text: 'Continue'
      },
    ],
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: Create a Flow')
      }
    }
  },
  {
    id: 'current-tabs-container',
    attachTo: { element: '.current-tabs-container', on: "left" },
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    canClickTarget: false,
    modalOverlayOpeningRadius: 10,
    title: "View your current tabs",
    text:
      `<div>
        <b>Drag and drop</b> tabs into Flows from here.
        <br/><br/>
        You can also <b>reorder</b> and <b>close</b> tabs from here.
        <br/><br/>
        <p align="right">
          5/6
        </p>
      </div>`,
    buttons: [
      {
        action() {
          return this.next()
        },
        classes: 'shepherd-button-primary',
        text: 'Continue'
      }
    ],
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: Current Tabs View')
      }
    }
  },
  {
    id: 'faq-icon',
    attachTo: { element: '.faq-icon', on: "right" },
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    canClickTarget: false,
    modalOverlayOpeningRadius: 10,
    title: "FAQ",
    text:
      `<div>
        Reference the <b>FAQ</b> from here or hover over any button or icon for a <b>tooltip</b>. 
        <br/><br/>
        We hope Flow helps you save time and browse with intent!
        <br/><br/>
        <p align="right">
          6/6
        </p>
      </div>`,
    buttons: [
      {
        action() {
          return this.complete()
        },
        classes: 'shepherd-button-primary',
        text: 'Finish'
      }
    ],
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: Completed')
      }
    }
  },
  {
    id: 'product-tour',
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    canClickTarget: false,
    modalOverlayOpeningRadius: 10,
    attachTo: { element: '.faq-icon', on: "right" },
    title: 'FAQ',
    text: ["You can always view the FAQ to see how to use Flow."],
    buttons: [
      {
        action() {
          return this.cancel()
        },
        classes: 'shepherd-button-primary',
        text: 'Got it'
      }
    ],
    beforeShowPromise: () => new Promise(resolve => setTimeout(resolve, 500)),
    when: {
      show: function() {
        sendAmplitudeData('Product Tour: Show Product Guide Button')
      }
    }    
  },
];

export default steps