import { Component } from 'react'

/** Bila 3D gagal dimuat (WebGL tidak didukung, HP lama), tampilkan alternatif statis. */
export default class BatasGalat extends Component {
  constructor(props) {
    super(props)
    this.state = { galat: false }
  }

  static getDerivedStateFromError() {
    return { galat: true }
  }

  render() {
    return this.state.galat ? this.props.cadangan : this.props.children
  }
}
