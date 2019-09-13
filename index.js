import { LitElement, html } from './lib/lit-element.min.js'
import './node_modules/xy-ui/components/xy-input.js'
import './node_modules/xy-ui/components/xy-table.js'
import { setUrl, resetUrl, getRedirectUrl } from './lib/tool.js'

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
    setUrl(this.editUrl, e.target.value)
  }

  handleReset = () => {
    resetUrl()
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
      <input value=${getRedirectUrl(this.editUrl)} @change=${this.handleEditUrl} />
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
