import React, { Component } from 'react';
import Button from '../../Button';
import Input from '../../Input';
import './style.css';

class OrganizationSearch extends Component {
  state = {
    value: this.props.OrganizationName,
  };

  onChange = (event) => {
    this.setState({ value: event.target.value });
  };

  onSubmit = (event) => {
    this.props.onOrganizationSearch(this.state.value);

    event.preventDefault();
  };

  render() {
    const { value } = this.state;

    return (
      <div className="Navigation-search">
        <form onSubmit={this.onSubmit}>
          <Input color={'white'} type="text" value={value} onChange={this.onChange} />{' '}
          <Button color={'white'} type="submit">
            Search
          </Button>
        </form>
      </div>
    );
  }
}

export default OrganizationSearch;
