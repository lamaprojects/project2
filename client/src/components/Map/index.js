import React, { Component } from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import './style.css';
import { Modal, Button } from 'react-bootstrap';
const axios = require('axios');

export class MapContainer extends Component {
  // shouldn't set markers like this but fuck it for now
  state = {
    activeMarker: {},
    selectedPlace: {},
    showingInfoWindow: false,
    show: false,
    tag: '',
    renderMarkers: 0,
  };

  putData = async () => {
    let getData = await axios
      .put(`${process.env.REACT_APP_URL}/api/location/locations`, {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        tag: this.state.tag,
      })
      .then(response => response.data)
      .catch(error => console.log(error));

    console.log('Put Data method called');
    this.setState({
      // markers: [...this.props.markers, getData],
      tag: '',
    });
  };

  onMarkerClick = event => {
    // console.log('props = ', props);
    let latitude = event.latLng.lat();
    let longitude = event.latLng.lng();
    this.handleShow();
    this.setState({
      latitude: latitude,
      longitude: longitude,
    });
    //show an input or modal wherever on the page, we can make it pretty later
    // from that input console log what the user typed here.
  };

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        tag: '',
      });
    }
  };

  renderMarkers = locations =>
    locations.map((marker, i) => (
      <Marker
        key={i}
        position={{
          lat: parseFloat(marker.latitude),
          lng: parseFloat(marker.longitude),
        }}
        onClick={this.onMarkerClick}
      />
    ));

  handleClose = () => {
    this.setState({ show: false });
    this.putData(this.state.tag);
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  handleInputChange = event => {
    // Getting the value and name of the input which triggered the change
    const { name, value } = event.target;

    // Updating the input's state
    this.setState({
      [name]: value,
    });
  };

  render() {
    let { locations, onMapClicked } = this.props;
    return (
      <GoogleMap
        onClick={onMapClicked}
        defaultZoom={12}
        defaultCenter={{ lat: 30.2672, lng: -97.7431 }}
      >
        {this.renderMarkers(locations)}
        <Modal show={this.state.show} onHide={this.handleShow}>
          <Modal.Header>
            <Modal.Title>Add a tag</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <input
                value={this.state.tag}
                name="tag"
                onChange={this.handleInputChange}
                type="text"
                placeholder="Tag"
              />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={this.handleClose}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
      process.env.REACT_APP_GMAPS_API_KEY
    }&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '600px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(MapContainer);
