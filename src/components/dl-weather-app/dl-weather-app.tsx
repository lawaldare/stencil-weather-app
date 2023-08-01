import { Component, State, Watch, h } from '@stencil/core';
import { environment } from '../../environment';

@Component({
  tag: 'dl-weather-app',
  styleUrl: 'dl-weather-app.css',
  shadow: true,
})
export class DlWeatherApp {
  weatherInput: HTMLInputElement;
  @State() location: string;
  @State() weatherReport: any;
  @State() noCityFound: boolean;

  @Watch('location')
  onLocationChanged(newLocation: string, oldLocation: string) {
    if (newLocation !== oldLocation) {
      this.fetchWeatherData(newLocation);
    }
  }

  onFetchWeatherData = (e: Event) => {
    e.preventDefault();
    this.location = this.weatherInput.value;
  };

  fetchWeatherData(location: string) {
    if (location) {
      fetch(`${environment.baseURL}?q=${location}&units=metric&appid=${environment.apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.cod === 200) {
            this.weatherReport = data;
            this.weatherInput.value = '';
            this.noCityFound = false;
          } else {
            this.weatherReport = null;
            this.noCityFound = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      alert('Please enter a location');
    }
  }
  render() {
    let content = '';

    if (this.weatherReport) {
      content = (
        <div class="content">
          <p class="desc">{this.location.toUpperCase()}</p>
          <p class="desc">{this.weatherReport.weather[0].description}</p>
          <img src={'http://openweathermap.org/img/w/' + this.weatherReport.weather[0].icon + '.png'} alt="" />
          <p class="temperature">
            {this.weatherReport.main.temp}
            <sup>o</sup>C
          </p>
        </div>
      );
    }

    if (!this.weatherReport && this.noCityFound) {
      content = 'No City Found';
    }
    return [
      <h3 class="title">Weather</h3>,
      <form class="form" onSubmit={this.onFetchWeatherData.bind(this)}>
        <input type="text" class="input" placeholder="Enter city name" name="city" autocomplete="off" ref={el => (this.weatherInput = el)} />
        <button class="input btn">Show Weather!</button>
      </form>,
      <main>{content}</main>,
    ];
  }
}
