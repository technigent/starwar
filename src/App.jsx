/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React, { Component } from 'react';
import logo from './assets/logo.png';
import star from './assets/star.png'
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filmData: [],
      loading: true,
      biggestCrawl: '',
      peopleData: [],
      highestFilm: '',
      speciesData: [],
      descSpecies: [],
      planetData: [],
      maxPilots: [],
      visible: false,
    };
    this.findBiggestCrawl = this.findBiggestCrawl.bind(this);
    this.findMostAppearedPerson = this.findMostAppearedPerson.bind(this);
  }

  componentDidMount() {
    fetch('https://swapi.co/api/planets/')
      .then((res) => res.json())
      .then((res3) => {
        if (res3.next) {
          this.getNextPlanetData(res3.next);
        }
        this.setState({ planetData: res3.results });
      })
      .then(() => {
        fetch('https://swapi.co/api/species/')
          .then((res) => res.json())
          .then((res) => {
            if (res.next) {
              this.getNextSpeciesData(res.next);
            }
            this.setState({ speciesData: res.results });
          })
          .then(() => {
            fetch('https://swapi.co/api/people/')
              .then((res1) => res1.json())
              .then((res1) => {
                if (res1.next) {
                  this.getNextPeopleData(res1.next);
                }
                this.setState({ peopleData: res1.results });
              })
              .then(() => {
                fetch('https://swapi.co/api/films/')
                  .then((res2) => res2.json())
                  .then((res2) => {
                    this.setState({ filmData: res2.results });
                  })
                  .then(() => {
                    setInterval(
                      () => this.setState({ loading: false }), 5000,
                    );
                  })
                  .catch((err) => console.log(err));
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      })

      .catch((err) => console.log(err));
  }

  getNextPeopleData(next) {
    fetch(next)
      .then((res) => res.json())
      .then((res) => {
        if (res.next) {
          this.getNextPeopleData(res.next);
          res.results.forEach((element) => {
            this.setState({ peopleData: [...this.state.peopleData, element] });
          });
        } else {
          res.results.forEach((element) => {
            this.setState({ peopleData: [...this.state.peopleData, element] });
          });
        }
      })

      .catch((err) => console.log(err));
  }

  getNextSpeciesData(next) {
    fetch(next)
      .then((res) => res.json())
      .then((res) => {
        if (res.next) {
          this.getNextSpeciesData(res.next);
          res.results.forEach((element) => {
            this.setState({ speciesData: [...this.state.speciesData, element] });
          });
        } else {
          res.results.forEach((element) => {
            this.setState({
              speciesData: [...this.state.speciesData, element],
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }

  getNextPlanetData(next) {
    fetch(next)
      .then((res) => res.json())
      .then((res) => {
        if (res.next) {
          this.getNextPlanetData(res.next);
          res.results.forEach((element) => {
            this.setState({ planetData: [...this.state.planetData, element] });
          });
        } else {
          res.results.forEach((element) => {
            this.setState({
              planetData: [...this.state.planetData, element],
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }

  getMostOccupiedVehicle() {
    const { planetData, peopleData, speciesData } = this.state;
    const vehicleData = [];
    planetData.forEach((element) => {
      const planetVehicleData = [];
      if (element.residents) {
        element.residents.forEach((resident) => {
          peopleData.forEach((people) => {
            if (people.url === resident) {
              if (people.vehicles) {
                speciesData.forEach((species) => {
                  if (species.url === people.species[0]) {
                    planetVehicleData.push({
                      name: people.name,
                      species: species.name,
                    });
                  }
                });
              }
            }
          });
        });
      }
      vehicleData.push({
        planet: element.name,
        numberPilots: planetVehicleData.length,
        pilots: planetVehicleData,
      });
    });
    const compare = (a, b) => {
      if (a.numberPilots > b.numberPilots) return -1;
      return 1;
    };
    vehicleData.sort(compare);
    this.setState({ maxPilots: vehicleData });
  }

  getMostOccouredSpecies() {
    const { speciesData, filmData, peopleData } = this.state;
    const speciesCount = [];
    speciesData.forEach((element) => {
      speciesCount.push({
        name: element.name,
        classification: element.classification,
        url: element.url,
        count: 0,
      });
    });
    filmData.forEach((element) => {
      element.characters.forEach((charName) => {
        peopleData.forEach((people) => {
          if (people.url === charName) {
            speciesCount.forEach((urls) => {
              if (urls.url === people.species[0]) {
                urls.count += 1;
              }
            });
          }
        });
      });
    });
    const compare = (a, b) => {
      if (a.count > b.count) return -1;
      return 1;
    };
    speciesCount.sort(compare);
    this.setState({ descSpecies: speciesCount.slice(0, 3) });
  }

  findMostAppearedPerson() {
    const { peopleData } = this.state;
    let maxFilms = peopleData[0];
    let max = maxFilms.films.length;
    peopleData.forEach((element) => {
      if (element.films.length > max) {
        maxFilms = element;
        max = maxFilms.films.length;
      }
    });
    this.setState({ highestFilm: maxFilms.name });
  }

  findBiggestCrawl() {
    const { filmData } = this.state;
    const crawlLengths = [];
    if (filmData) {
      filmData.forEach((element) => {
        const crawl = element.opening_crawl;
        crawlLengths.push(crawl.length);
      });
      let max = crawlLengths[0]; let
        index = 0;
      for (let i = 1; i < crawlLengths.length; i += 1) {
        if (crawlLengths[i] > max) {
          max = crawlLengths[i];
          index = i;
        }
      }
      return filmData[index].title;
    }
    return 'API not reachable';
  }

  render() {
    const {
      loading, visible, biggestCrawl, highestFilm,
    } = this.state;
    if (loading) {
      return (
        <div className="loader">
          <p style={{ color: 'white' }}>Loading...</p>
        </div>
      );
    }
    return (
      <section className="wrapper">
        <img className="logo" src={logo} alt="star war" />
        <div
          className={this.state.visible ? 'button clicked' : 'button'}
          onClick={() => {
            if (!loading) {
              this.setState({ visible: !visible });
              if (!this.state.visible) {
                const biggestCrawl1 = this.findBiggestCrawl();
                this.findMostAppearedPerson();
                this.getMostOccouredSpecies();
                this.getMostOccupiedVehicle();
                this.setState({ biggestCrawl: biggestCrawl1 });
              }
            }
          }}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.setState({ visible: !visible });
            }
          }}
        >
          <div className="upper">
            <p className="text">
              <span className="left-star"><img src={star} alt="star"/></span>
              Do. Or Do not. There is no try.
              <span className="right-star"><img src={star} alt="star"/></span>
            </p>
          </div>
        </div>
        {visible
          ? (
            <div>
              <div className="que">
                <p style={{ color: 'white' }}>Which of all star war movies has longest opening crawl?</p>
                <p className="yellow-text">{biggestCrawl}</p>
                <p style={{ color: 'white' }}>Which character (person) appeared in the most star war films?</p>
                <p className="yellow-text">{highestFilm}</p>
                <p style={{ color: 'white' }}>What species appeared in the most number of star war films?</p>
                <ul>
                  {this.state.descSpecies.map((element, index) => (
                    <li className="yellow-text" key={index.toString()}>
                      {element.name}
                      (
                      {element.count}
                      )
                    </li>
                  ))}
                </ul>
                <p style={{ color: 'white' }}>What planet in StarWars universe provided largest number of vehicles?</p>
                <div style={{ color: 'white' }}>
                  {this.state.maxPilots.map((element) => (
                    <div>
                      <p className="yellow-text p-0">
                        Planet :
                        {element.planet}

                        Pilots: (
                        {element.numberPilots}
                        )
                        {element.pilots.map((pilot, index1) => (
                          <span key={index1.toString()}>
                            &nbsp;
                            {pilot.name}
                            -
                            {pilot.species}
                            &nbsp;
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )
          : null}
      </section>
    );
  }
}
