import { LitElement, html } from './lib/lit-element.min.js'
import './node_modules/xy-ui/components/xy-input.js'
import './node_modules/xy-ui/components/xy-table.js'

customElements.define('app-main', class extends LitElement {
  static get properties() {
    return {
      urls: {
        type: Array,
        reflect: true,
      },
      filter: {
        type: String,
        reflect: true,
      },
      editUrl: {
        type: String,
      }
    }
  }

  constructor() {
    super()

    this.urls = []
    this.filter = ''
    this.editUrl = ''

    chrome.webRequest && chrome.webRequest.onBeforeRequest.addListener (
      ({ url }) => {
        this.urls = [...this.urls, url]

        const redirectUrl = this.getUrl()[this.replaceQuery(url)]

        if (redirectUrl) {
          return {
            redirectUrl
          }
        }
      },
      {
        urls: ['http://*/*', 'https://*/*']
      },
      ['blocking'] 
    );
  }

  handleSearch({ detail: { value } }) {
    this.filter = value
  }

  handleItemClick = (url) => () => {
    this.editUrl = url
  }

  handleBack = () => {
    this.editUrl = ''
  }

  handleEditUrl = (e) => {
    this.setUrl(e.target.value)
  }

  handleReset = () => {
    this.resetUrl()
  }

  getUrl = () => {
    return JSON.parse(localStorage.getItem('$http-intercept-url')) || {}
  }

  setUrl = (url) => {
    localStorage.setItem('$http-intercept-url', JSON.stringify({
      ...this.getUrl(),
      [this.editUrl]: this.replaceQuery(url)
    }))
  }

  resetUrl = () => {
    localStorage.removeItem('$http-intercept-url')
  }

  getRedirectUrl = () => {
    return this.getUrl()[this.replaceQuery(this.editUrl)] || this.replaceQuery(this.editUrl)
  }

  replaceQuery = (url) => {
    const { origin, pathname } = new URL(url)

    return origin + pathname
  }

  renderRequestList = () => {
    if (this.editUrl) {
      return ''
    }

    return html`
      <h2>--- 请求列表 ---</h2>
      <ul>
        ${
          this.urls
            .filter(url => new RegExp(this.filter, 'ig').test(url))
            .map(url => (html`
              <li @click=${this.handleItemClick(url)}>${url}</li>
            `))
        }
      </ul>
    `
  }

  renderRedirectUrl = () => {
    if (!this.editUrl) {
      return ''
    }

    return html`
      <p>${this.editUrl}</p>
      <input value=${this.getRedirectUrl()} @change=${this.handleEditUrl} />
      <xy-button type="primary" @click=${this.handleBack}>返回列表</xy-button>
    `
  }

  render() {
    return html`
      <style>
        ul,
        li,
        div,
        h2 {
          margin: 0;
          padding: 0;
        }

        :host {
          display: block;
          width: 300px;
        }

        .list h2 {
          margin: 12px 0;
          font-size: 14px;
          font-weight: normal;
        }

        .list ul {
          list-style: none;
        }

        .list ul li {
          height: 30px;
          line-height: 30px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      </style>
      <div>
        <xy-input
          type="search"
          placeholder="过滤请求"
          @change=${this.handleSearch}
        ></xy-input>
        <xy-button type="primary" @click=${this.handleReset}>清空代理</xy-button>
        <nav class="list">
          ${this.renderRequestList()}
          ${this.renderRedirectUrl()}
        </nav>
      </div>
    `
  }
})
