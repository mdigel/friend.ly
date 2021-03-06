/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import NavbarLoggedIn from './NavbarLoggedIn.jsx';
import SettingsApp from './SettingsApp.jsx';
import Footer from './Footer.jsx';

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      loaded: false,
      status: '',
      newUser: {
        city: '',
        primary_interest: 'Live Music',
      },
    };
    this.setNewUser = this.setNewUser.bind(this);
    this.handleSettingsChange = this.handleSettingsChange.bind(this);
  }

  componentDidMount() {
    fetch('/checklogin')
      .then((res) => res.json())
      .then((data) => this.setState({
        user: data.currentUser,
        loaded: true,
      }));
  }

  setNewUser(e) {
    const { id, value } = e.target;
    this.setState((prevState) => {
      const newUser = { ...prevState.newUser };
      newUser[id] = value;
      return { newUser };
    });
  }

  handleSettingsChange() {
    let { user, newUser, status } = this.state;
    const promises = [];
    if (user && newUser.city && newUser.primary_interest) {
      const promise1 = fetch('/api/edituser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, newUser }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.message === 'success') status = 'Success!';
          else status = 'An error occurred, please try again later.';
        });
      promises.push(promise1);
    } else {
      status = 'Error, all fields must be filled in';
    }
    Promise.all(promises)
      .then(() => {
        this.setState(() => {
          if (status === 'Success!') setTimeout(() => window.location.href='/dashboard', 1000);
          return { status, newUser };
        });
      });
  }

  render() {
    return (
      <>
        <NavbarLoggedIn />
        <div className="settingsForm">
          <h3>Settings</h3>
          <span className="warning">Warning: changing these settings will reset your matches!</span>
          {
            this.state.loaded
              ? (
                <SettingsApp
                  user={this.state.user}
                  newUser={this.state.newUser}
                  status={this.state.status}
                  handleSettingsChange={this.handleSettingsChange}
                  setNewUser={this.setNewUser}
                />
              )
              : <h3>Loading...</h3>
          }
        </div>
        <Footer />
      </>
    );
  }
}

export default SettingsContainer;
