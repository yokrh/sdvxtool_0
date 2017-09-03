import React from 'react';

export default class Client extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const level = this.refs.level.value;
    if (!level) return false;

    location.href = "http://www.sdvx.in/sort/sort_" + level + ".htm";
    return false;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <select ref="level" defaultValue="18">
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
        </select>
        <input type="submit" value="検索" />
      </form>
    );
  }
}
