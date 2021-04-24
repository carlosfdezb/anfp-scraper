<p align="center">
  <img src="./assets/img/logo.png" alt="campeonatochileno" width="100" height="100" />
</p>
<p align="center">
  <img src="./assets/img/anfp.png" alt="ANFP" />
</p>

  
<p align="center">
 ANFP Scraper es un proveedor de contenidos de todo el fútbol chileno, tabla de posiciones, estadísticas, programación, etc. Usando los sitios web de anfp.cl y campeonatochileno.cl para extraer toda la información
</p>

![npm](https://img.shields.io/npm/v/npm?style=flat-square) ![GitHub package.json version](https://img.shields.io/github/package-json/v/carlosfdezb/anfp-scraper?style=flat-square) ![NPM](https://img.shields.io/npm/l/anfp-scraper?style=flat-square)

[![NPM](https://nodei.co/npm/anfp-scraper.png)](https://nodei.co/npm/anfp-scraper/)

## Installation
```
npm install anfp-scraper
```

## 📖 Documentation
Available methods:

- [getPositions](#-getpositionstype): Devuelve la tabla de posiciones del campeonato seleccionado.
- [getSchedule](#-getschedulefecha-type): Devuelve la programación del campeonato seleccionado.
- [getScheduleTeam](#-getscheduleteamid-type): Devuelve la programación para el equipo seleccionado.
- [getTeams](#-getteamstype): Devuelve una lista de equipos del campeonato seleccionado.
- [getTeamInfo](#-getteaminfoid): Devuelve toda la información disponible del equipo seleccionado.


## 🚩 getPositions(type)
Devuelve la tabla de posiciones del campeonato seleccionado. Para ello especificar el tipo de campeonato con `type`.

| COMPETITION | TYPE |
| -----|----- |
| Campeonato PlanVital 2021 | 0 |
| Campeonato Ascenso Betsson | 1 |
| Campeonato Segunda | 2 |
| Eliminatorias FIFA Qatar 2022 | 3 |

Example:
```js
const anfp = require('anfp-scraper');

anfp.getPositions(0)
  .then((res) => console.log(res));
```

Results:
```json
[
  {
    logo: 'https://anfpfotos.cl/size/80x110/a/categorias/cb0a68fe91be8fc768729c098f559af7.png',
    competition: 'Campeonato PlanVital 2021 ',
    best_forward: { team: 'Deportes Antofagasta', goals_favor: '8' },
    best_defense: { team: 'Audax Italiano', goals_against: '2' },
    best_team: { team: 'Universidad Católica', games_won: '3' },
    scorer: { name: 'Eduard Bello', goals: '3' },
    teams: [
      {
        position: '1',
        logo: 'https://anfpfotos.cl/clubes/d01105ee6df81f19d3d25c2736c7d6ae.png',
        full_name: 'Universidad Católica',
        id: '47',
        points: '9',
        games_played: '4',
        games_won: '3',
        games_tied: '0',
        games_lost: '1',
        goals_favor: '5',
        goals_against: '3',
        difference: '2'
      },
      {
        position: '2',
        logo: 'https://anfpfotos.cl/clubes/90123d347a2b296c2988e6aeeab06056.png',
        full_name: 'Unión La Calera',
        id: '52',
        points: '8',
        games_played: '4',
        games_won: '2',
        games_tied: '2',
        games_lost: '0',
        goals_favor: '4',
        goals_against: '2',
        difference: '2'
      },
  ...
]
```

## 🚩 getSchedule(fecha, type)
Devuelve la programación de la fecha del campeonato seleccionado, mostrando resultados en los partidos ya jugados, la hora en los partidos que se jugarán, y el equipo que queda libre en el caso del campeonato de primera división. Para ello se debe usar `fecha` y el `type` para especificar la fecha y el campeonato.

| VALUE | FECHA |
| -----|----- |
| Fecha en curso/actual | 0 |
| Fecha específica | 1, n |
---
| COMPETITION | TYPE |
| -----|----- |
| Campeonato PlanVital 2021 | 0 |
| Campeonato Ascenso Betsson | 1 |

Example:
```js
const anfp = require('anfp-scraper');

anfp.getSchedule(0,0)
  .then((res) => console.log(res));
```

Results:
```json
[
  {
    logo: 'https://campeonatochileno.cl//uploads/campeonato-planvital/imagen/1616652990452_DWS_2021_7.svg',
    competition: 'Campeonato PlanVital',
    fecha: 'Fecha Actual',
    matchs: [
      {
        date: 'Vier. 23 Abril 2021',
        home_team: 'Curicó Unido',
        home_logo: 'https://anfpfotos.cl/clubes/logos/d0e92625dc0483270a9dcf72d9bd42c2.svg',
        score_home: '1',
        away_team: 'Everton',
        away_logo: 'https://anfpfotos.cl/clubes/logos//97702ca6993f502b3478d7608963d392.svg',
        score_away: '1',
        stadium: 'La Granja'
      },
      {
        date: 'Sáb. 24 Abril 2021',
        home_team: 'Deportes Antofagasta',
        home_logo: 'https://anfpfotos.cl/clubes/logos/bf05e04fc4b8179afa659b8654ef4deb.svg',
        score_home: '2',
        away_team: 'Cobresal',
        away_logo: 'https://anfpfotos.cl/clubes/logos/831340ccfeb595f722e7ae6009c5f7d7.svg',
        score_away: '1',
        stadium: 'Calvo y Bascuñán'
      },
      {
        date: 'Sáb. 24 Abril 2021',
        home_team: 'Deportes La Serena',
        home_logo: 'https://anfpfotos.cl/clubes/logos/27c1f908ec038de3c4564ac0574a1b7d.svg',
        score_home: '0',
        away_team: 'Unión Española',
        away_logo: 'https://anfpfotos.cl/clubes/logos//a6e9009b32c6c2e399604e0c3841534b.svg',
        score_away: '0',
        stadium: 'La Portada'
      },
      {
        date: 'Sáb. 24 Abril 2021',
        home_team: "O'Higgins",
        home_logo: 'https://anfpfotos.cl/clubes/logos//9c27509ed8b5acfedfea1cecbe0014d3.svg',
        away_team: 'Unión La Calera',
        away_logo: 'https://anfpfotos.cl/clubes/logos/90123d347a2b296c2988e6aeeab06056.svg',
        time: '18:00',
        stadium: 'El Teniente'
      },
  ...
]
```
  
## 🚩 getScheduleTeam(id, type)
Devuelve la programación para el equipo seleccionado. Para ello hay especificar el `id` del equipo y el campeonato con `type`.

| COMPETITION | TYPE |
| -----|----- |
| Campeonato PlanVital 2021 | 0 |
| Campeonato Ascenso Betsson | 1 |

Example:
```js
const anfp = require('anfp-scraper');

//56 = Huachipato
anfp.getScheduleTeam(56,0)
  .then((res) => console.log(res));
```

Results:
```json
[
  {
    logo: 'https://campeonatochileno.cl//uploads/campeonato-planvital/imagen/1616652990452_DWS_2021_7.svg',
    competition: 'Campeonato PlanVital',
    matchs: [
      {
        date: 'Dom. 28 Marzo 2021',
        home_team: 'Huachipato',
        home_logo: 'https://anfpfotos.cl/clubes/logos//3d922804892d2a43ec3328e272c5d451.svg',
        score_home: '0',
        away_team: 'Cobresal',
        away_logo: 'https://anfpfotos.cl/clubes/logos/831340ccfeb595f722e7ae6009c5f7d7.svg',
        score_away: '0',
        stadium: 'Huachipato Cap Acero'
      },
      {
        date: 'Sáb. 03 Abril 2021',
        home_team: 'Universidad de Chile',
        home_logo: 'https://anfpfotos.cl/clubes/logos/7fbceadc67d0639139019329cede98d7.svg',
        score_home: '1',
        away_team: 'Huachipato',
        away_logo: 'https://anfpfotos.cl/clubes/logos//3d922804892d2a43ec3328e272c5d451.svg',
        score_away: '1',
        stadium: 'El Teniente'
      },
  ...
]
```

## 🚩 getTeams(type)
Devuelve una lista de equipos del campeonato seleccionado. Para ello especificar el campeonato con `type`.

| COMPETITION | TYPE |
| -----|----- |
| Campeonato PlanVital 2021 | 0 |
| Campeonato Ascenso Betsson | 1 |
| Campeonato Segunda | 2 |

Example:
```js
const anfp = require('anfp-scraper');

anfp.getTeams(0)
  .then((res) => console.log(res));
```

Results:
```json
[
  {
    id: '47',
    full_name: 'Universidad Católica',
    logo: 'https://anfpfotos.cl/clubes/d01105ee6df81f19d3d25c2736c7d6ae.png'
  },
  {
    id: '52',
    full_name: 'Unión La Calera',
    logo: 'https://anfpfotos.cl/clubes/90123d347a2b296c2988e6aeeab06056.png'
  },
  {
    id: '44',
    full_name: 'Audax Italiano',
    logo: 'https://anfpfotos.cl/clubes/eb698680de4e5501239a60c9f9e8f98c.png'
  },
  {
    id: '60',
    full_name: 'Deportes Antofagasta',
    logo: 'https://anfpfotos.cl/clubes/bf05e04fc4b8179afa659b8654ef4deb.png'
  },
  ...
]
```

## 🚩 getTeamInfo(id)
Devuelve toda la información disponible del equipo seleccionado: presidente, estadio, director técnico, redes sociales, palmarés, plantilla, etc. Para ello señalar el equipo con `id`.

Example:
```js
const anfp = require('anfp-scraper');

//56 = Huachipato
anfp.getTeamInfo(56)
  .then((res) => console.log(res));
```

Results:
```json
  [
  {
    id: 56,
    full_name: 'Huachipato',
    logo: 'https://anfpfotos.cl/size/60x60/a/clubes//3d922804892d2a43ec3328e272c5d451.png',
    team_photo: 'https://anfpfotos.cl/size/680x425/a/clubes//7d763ca2c7d8a465a364c016e78ad54c.JPG',
    info: {
      foundation: '7 de Junio 1947',
      president: 'Marcelo Pesce Reyes',
      stadium: 'Huachipato-CAP Acero',
      web_site: 'https://www.huachipatofc.cl',
      social_media: {
        facebook: 'https://www.facebook.com/CFHuachipato',
        twitter: 'https://twitter.com/huachipato',
        instagram: 'https://www.instagram.com/huachipato_fc/'
      }
    },
    honors: [
      {
        trophy_img: 'https://anfpfotos.cl/img/primerad.png',
        trophy: 'Primera División',
        total: '2'
      },
      {
        trophy_img: 'https://anfpfotos.cl/img/primerab.png',
        trophy: 'Primera B',
        total: '1'
      }
    ],
    dt: 'Juan Luvera',
    team: {
      goalkeeper: [
        {
          number: '12',
          name: 'Martín Parra',
          birth: '1 de septiembre de 2000',
          nationality: 'Chile'
        },
        ...
      ],
      defender: [
        {
          number: '2',
          name: 'Antonio Castillo',
          birth: '15 de noviembre de 1998',
          nationality: 'Chile'
        },
        ...
      ],
      midfielder: [
        {
          number: '-',
          name: 'Carlos Lobos',
          birth: '21 de febrero de 1997',
          nationality: 'Chile'
        },
        ...
      ],
      forward: [
        {
          number: '18',
          name: 'Joaquín Verdugo',
          birth: '7 de octubre de 1996',
          nationality: 'Chile'
        },
        ...
      ]
    }
  }
]
```
---

### **:busts_in_silhouette: Credits**

- [Carlos Fernández](https://github.com/carlosfdezb) (Project Leader, and Developer)

---

### **:anger: Troubleshootings**

This is just a personal project created for study / demonstration purpose and to simplify my working life, it may or may
not be a good fit for your project(s).

---

### **:heart: Show your support**

Please :star: this repository if you like it or this project helped you!\
Feel free to open issues or submit pull-requests to help me improving my work.


---


### **:robot: Author**

_*Carlos Fernández*_

> You can follow me on
[github](https://github.com/carlosfdezb)

---

Copyright © 2021 [ANFP scraper](https://github.com/carlosfdezb/anfp-scraper).

<p align="center">
  <a href="http://forthebadge.com/" target="_blank">
    <img src="http://forthebadge.com/images/badges/built-with-love.svg"/>
  </a>
</p>

