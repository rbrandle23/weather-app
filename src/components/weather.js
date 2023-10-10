import Logo from '../images/logo.png';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Data } from "../components/data";
import Pie from '../components/chart';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import { useEffect, useState, useRef } from 'react';


Chart.register(CategoryScale);
config.autoAddCss = false;
export default function Home() {

  const [theme, setTheme] = useState(false);
  const [current, setCurrent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [daily, setDaily] = useState([]);
  const [geoLocation, setGeoLocation] = useState([]);
  const analyticsRef = useRef(null);
  const dashRef = useRef(null);
  const dailyRef = useRef(null);
  const scrollEvent = () => {
    analyticsRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth"
    })
    dashRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth"
    })
    dailyRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth"
    })
  }
  
  useEffect(() => {
         navigator.geolocation.getCurrentPosition(
          (pinpoint) => {
            let lat = pinpoint.coords.latitude;
            let lng = pinpoint.coords.longitude;
              const APIKEY = '80061b04b1ab0e27e23cae3c9f560a5d';
              fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=${APIKEY}`)
                .then(res => res.json())
                .then(json => setCurrent(json.current))
                .then(setIsLoading(false))
                
                fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=${APIKEY}`)
                .then(res => res.json())
                .then(json => setDaily(json.daily))

              fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
              .then(res => res.json())
              .then(state => setGeoLocation(state))
     }
        )
    AOS.init()
  },[])
  const newObj = [
    {
      id: 1,
      title: "Humidity",
      weather: 1
    },
    {
      id: 2,
      title: "Pressure",
      weather: current.pressure
    },
    {
      id: 3,
      title: "Wind Speed",
      weather: 3
    },
    {
      id: 4,
      title: "Clouds",
      weather: 4
    }
  ];
  const analytics = Object.assign(Data, newObj);
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.title), 
    datasets: [
      {
        label: "Data",
        data: analytics.map((data) => data.weather),
        backgroundColor: [
          "#0d6efd",
          "#146c43",
          "#f3ba2f",
          "#dc3545"
        ],
        borderColor: "#fff",
        borderWidth: 4
      }
    ]
  });
  function dayname(x) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var day = new Date(x * 1000);
    var name = days[day.getDay()];
    return name
  }       
  return (
    <>
      <main className={theme ? 'dark-theme' : 'light-theme'}>
      <Navbar expand="lg" className={theme ? 'dark-theme' : 'light-theme'} id='nav' fixed='top'>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto mt-3">
                <Button variant="primary" className='rounded-pill me-3' onClick={scrollEvent}>
                  <FontAwesomeIcon icon={faHouse} style={{color: "#ffffff", marginRight: '5px'}} />Dash
                </Button>
                <Button variant="primary" className='rounded-pill me-3' onClick={scrollEvent}>
                  <FontAwesomeIcon icon={faChartPie} style={{color: "#ffffff", marginRight: '5px'}}/>Analytics
                </Button>
                <Button variant="primary" className='rounded-pill me-3' onClick={scrollEvent}>
                  <FontAwesomeIcon icon={faSun} style={{color: "#ffffff", marginRight: '5px'}} />Daily
                </Button>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand href="#home">
            <img alt='logo-img' src={Logo} width={45} height={45} />
          </Navbar.Brand>
            <Form>
              <Form.Check
                    type="switch"
                    label=""
                    id="theme-switch"
                    onClick={() => setTheme(prev => !prev)}
                  />
            </Form>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col>
          <Card ref={dashRef} className='card' id='current-card' style={{ width: '100%', height:'500px', margin: '10rem 0rem', padding: '50px 25px' }}>
          {isLoading ? (<Spinner animation="border" className='spinner' />) : (
            <Card.Body>
              <Card.Title className='current-title'>
                {geoLocation.city},{geoLocation.principalSubdivision} <br/>
                {Math.round(current.temp)} °F <br/>
                <p>Feels {Math.round(current.feels_like)} °F</p>
              </Card.Title>
              <Card.Text>
                Expect the unexpected or dont.
              </Card.Text>
            </Card.Body>
              )}
          </Card>
          </Col>
        </Row>
        <Row>
          <Col>
          <Card ref={analyticsRef} data-aos='fade-right' data-aos-duration='2000' className='mx-auto' style={{ width: '100%', margin: '15rem 0rem'}}>
            <Card.Body>
            <Card.Title className='chart-title'>Analytics</Card.Title>
                <Pie chartData={chartData}/>
            </Card.Body>
          </Card>
          </Col>
        </Row>
        <hr/>
    </Container>
    <Container>
      <Row>
        {daily.slice(1).map((item) => {
          return (
        <Col key={item.id}>
            <Card ref={dailyRef} className='card mx-auto' data-aos='fade-up' data-aos-duration='2000' style={{ width: '18rem', margin: '10rem 0rem' }}>
              <Card.Body>
                <Card.Title className='day-week'>{dayname(item.dt)}</Card.Title>
                <Card.Text style={{textAlign: 'left', fontSize: '20px'}}>
                  Morning: {item.temp.morn} °F <br/>
                  Day: {item.temp.day} °F <br/>
                  Night: {item.temp.night} °F
                </Card.Text>
              </Card.Body>
            </Card>
        </Col>
        )})}
      </Row>
      <hr/>
    </Container>
    <Container>
      <Row>
        <Col>
        </Col>
      </Row>
    </Container>
      </main>
    </>
  )
}
