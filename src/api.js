const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const {BASE_URL, SCHEDULE, SCHEDULE_TEAM, COMPETITION, C_SCHEDULE, BASETEAM_URL, TEAM_C, TEAM_URL} = require('./util/urls');

const util = require('util')

const getPositions = async(type) =>{
  const res = await cloudscraper(`${BASE_URL}${COMPETITION[type]}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  const teams = [];

  const logo = $(`#estadis-camp > div > h3 > img`).attr('src');
  const competition = $(`#estadis-camp > div > h3 > span`).text();

  const best_forward = $('#estadisticas > div:nth-child(7) > div > div > ul > li:nth-child(1) > div.name-cla > span').text();
  const goals_favor = $('#estadisticas > div:nth-child(7) > div > div > ul > li:nth-child(1) > div.goles-cla').text().trim();

  const best_defense = $('#estadisticas > div:nth-child(8) > div > div > ul > li:nth-child(1) > div.name-cla > span').text();
  const goals_against = $('#estadisticas > div:nth-child(8) > div > div > ul > li:nth-child(1) > div.goles-cla').text().trim();

  const best_games = $('#estadisticas > div:nth-child(10) > div > div > ul > li:nth-child(1) > div.name-cla > span').text();
  const games_won = $('#estadisticas > div:nth-child(10) > div > div > ul > li:nth-child(1) > div.goles-cla').text().trim();

  const scorer = $('#estadisticas > div:nth-child(11) > div > div > ul > li:nth-child(1) > div.name-cla > span').text();
  const goals = $('#estadisticas > div:nth-child(11) > div > div > ul > li:nth-child(1) > div.goles-cla').text().trim();
  
  
  $('#datatable-responsive > tbody > tr').each((index , element) =>{
    const $element = $(element);
    const position = $element.find('td:nth-child(1)').text();
    const logo = $element.find('td:nth-child(2) > a > img').attr('src') || $element.find('td:nth-child(2) > img').attr('src');
    const full_name = type !== 3 ? 
    $element.find('td:nth-child(2) > a > span.tiClub').text() :
    $element.find('td:nth-child(2)').text().split('\n\n')[1].trim();
    const id = type !==3 ? $element.find('td:nth-child(2) > a').attr('href') : '';
    const points = $element.find('td:nth-child(3)').text();
    const games_played = $element.find('td:nth-child(4)').text();
    const games_won = $element.find('td:nth-child(5)').text();
    const games_tied = $element.find('td:nth-child(6)').text();
    const games_lost = $element.find('td:nth-child(7)').text();
    const goals_favor = $element.find('td:nth-child(8)').text();
    const goals_against = $element.find('td:nth-child(9)').text();
    const difference = $element.find('td:nth-child(10)').text();

    if(full_name === '' ) {return false}
    
    teams.push({
      position: position || null,
      logo: logo || null,
      full_name: full_name || null,
      id: id.split('/')[2] || null,
      points: points || null,
      games_played: games_played || null,
      games_won: games_won || null,
      games_tied: games_tied || null,
      games_lost: games_lost || null,
      goals_favor: goals_favor || null,
      goals_against: goals_against || null,
      difference: difference || null,
    })
  })

  promises.push({
    logo: logo || null,
    competition: competition || null,
    best_forward: {
      team: best_forward || null, 
      goals_favor: goals_favor || null 
    },
    best_defense: {
      team: best_defense || null, 
      goals_against: goals_against || null 
    },
    best_team: {
      team: best_games || null, 
      games_won: games_won || null 
    },
    scorer: {
      name: scorer || null, 
      goals: goals || null 
    },
    teams: teams || null,
  });

  return await Promise.all(promises);
};

const getSchedule = async(fecha, type) =>{
  const res = await cloudscraper(`${SCHEDULE}${fecha}/${C_SCHEDULE[type]}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  const matchs = [];
 
  const t = type === 0 ? 1 : type === 1 ? 2 : type >= 2 && 1;

  const logo = $(`div.post__tabs a:nth-child(${t}) > img`).attr('src');
  const competition = $(`div.post__tabs a:nth-child(${t})`).attr('title');

  //equipo libre
  const escudo = $('div.h-auto.text-center > ul.text-center.accordion > li.p-4 > div.flex > span:nth-child(1) img').attr('src'); 
  const full_name = $('div.h-auto.text-center > ul.text-center.accordion > li.p-4 > div.flex > span:nth-child(2)').text(); 

  $('div.h-auto ul.text-center.accordion div.accordion__pane').each((index , element) =>{
    const $element = $(element);
    const date = $element.find('div.w-full.my-auto').text();
    const home_team = $element.find('li > div > span:nth-child(1)').text().trim();
    const home_logo = $element.find('li > div > a:nth-child(2) > img').attr('src');
    const away_team = $element.find('li > div > span:nth-child(5)').text().trim();
    const away_logo = $element.find('li > div > a:nth-child(4) > img').attr('src');
    const result = $element.find('li > div > span:nth-child(3)').text().trim();
    const problem = $element.find('div:nth-child(2)').text().trim();
    const stadium = $element.find('li > div > span:nth-child(6) > span').text();

    result.includes(':') || problem.trim() !== '' ?
      matchs.push({
        date: date || matchs[index-1].date,
        home_team: home_team || null,
        home_logo: home_logo || null,
        away_team: away_team || null,
        away_logo: away_logo || null,
        time: result || problem,
        stadium : stadium || null,
      }) : matchs.push({
        date: date || matchs[index-1].date,
        home_team: home_team || null,
        home_logo: home_logo || null,
        score_home: result.split(' ')[0],
        away_team: away_team || null,
        away_logo: away_logo || null,
        score_away: result.split(' ')[2],
        stadium : stadium || null,
      }) 
  })

  promises.push({
    logo: logo || null,
    competition: competition || null,
    fecha: fecha !== 0 ? `${fecha} Fecha` : 'Fecha Actual',
    matchs: matchs || null,
    libre: {
      logo: escudo || null,
      full_name: full_name || null,
    }
  });

  return await Promise.all(promises);
};

const getScheduleTeam = async(id, type) =>{
  const res = await cloudscraper(`${SCHEDULE_TEAM}${id}/${C_SCHEDULE[type]}` , {method: 'GET'});
  const body = await res;
  const $ = cheerio.load(body);
  const promises = [];
  const matchs = [];
 
  const t = type === 0 ? 1 : type === 1 && 2;

  const logo = $(`div.post__tabs a:nth-child(${t}) > img`).attr('src');
  const competition = $(`div.post__tabs a:nth-child(${t})`).attr('title');

  $('div.h-auto ul.text-center.accordion div.accordion__pane').each((index , element) =>{
    const $element = $(element);
    const date = $element.find('div.w-full.my-auto').text();
    const home_team = $element.find('li > div > span:nth-child(1)').text().trim();
    const home_logo = $element.find('li > div > a:nth-child(2) > img').attr('src');
    const away_team = $element.find('li > div > span:nth-child(5)').text().trim();
    const away_logo = $element.find('li > div > a:nth-child(4) > img').attr('src');
    const result = $element.find('li > div > span:nth-child(3)').text().trim();
    const problem = $element.find('div:nth-child(2)').text().trim();
    const stadium = $element.find('li > div > span:nth-child(6) > span').text();

    result.includes(':') || problem.trim() !== '' || result === ('') ?
      matchs.push({
        date: date || null,
        home_team: home_team || null,
        home_logo: home_logo || null,
        away_team: away_team || null,
        away_logo: away_logo || null,
        time: result || problem || null,
        stadium : stadium || null,
      }) : matchs.push({
        date: date || null,
        home_team: home_team || null,
        home_logo: home_logo || null,
        score_home: result.split(' ')[0],
        away_team: away_team || null,
        away_logo: away_logo || null,
        score_away: result.split(' ')[2],
        stadium : stadium || null,
      }) 
  })

  promises.push({
    logo: logo || null,
    competition: competition || null,
    matchs: matchs || null,
  });

  return await Promise.all(promises);
};

const getTeams = async(type) => {
  const promises = [];
  const select = `#${TEAM_C[type]}`;
  await nightmare
  .goto(BASETEAM_URL)
  .wait(select)
  .evaluate((select) => {return document.querySelector(select).innerHTML}, select)
  .end()
  .then(response => {
    const $ = cheerio.load(response);
    $(`div.owl-wrapper-outer > div.owl-wrapper > div.owl-item`).each((index , element) =>{
      const $element = $(element);
      const id = $element.find('li a').attr('href').split('/')[2];
      const name = $element.find('li a h2').text();
      const logo = $element.find('li a img').attr('src');

      promises.push({
        id: id || null,
        full_name: name || null,
        logo: logo || null,
      })
    })
  }).catch(err => {
    console.log(err)
  })
  return await Promise.all(promises);
};

const getTeamInfo = async(id) => {
  const promises = [];
  await nightmare
  .goto(`${TEAM_URL}${id}/`)
  .wait('body')
  .evaluate(() => document.querySelector('body').innerHTML)
  .end()
  .then(response => {
    const $ = cheerio.load(response);
    console.log(`${TEAM_URL}${id}`)
    const full_name = $('div.header-title.header-club > h3 > span').text();
    const logo = $('body > div.header-title.header-club > h3 > img').attr('src');
    const team_photo = $('body > div.banner > div > div.banner-info.animated.wow.zoomIn > img').attr('src');
    const foundation = $('#boxIN > div:nth-child(1) > h2').text();
    const president = $('#boxIN > div:nth-child(4) > h2').text();
    const stadium = $('#boxIN > div:nth-child(3) > h2').text();
    const web_site = $('#boxIN > div:nth-child(5) > h2 > a').attr('href');
    const facebook = $('#boxIN > div:nth-child(6) > ul > li:nth-child(1) > a').attr('href');
    const twitter = $('#boxIN > div:nth-child(6) > ul > li:nth-child(2) > a').attr('href');
    const instagram = $('#boxIN > div:nth-child(6) > ul > li:nth-child(3) > a').attr('href');

    const dt = $('#boxIN > div:nth-child(2) > h2').text();

    const honors = [];
    $(`#Primerad > div > div > div.owl-item`).each((index , element) =>{
      const $element = $(element);
      const trophy_img = $element.find('li a img').attr('src');
      const trophy = $element.find('li a h2').text();
      const total = $element.find('li a span').text().replace(/[()]/g, '');

      honors.push({
        trophy_img: trophy_img || null,
        trophy: trophy || null,
        total: total || null,
      })
    })

    const goalkeeper = [];
    $(`#datatable-responsive > tbody:nth-child(4) > tr`).each((index , element) =>{
      const $element = $(element);
      const number = $element.find('td:nth-child(1)').text();
      const name = $element.find('td:nth-child(2)').text().trim();
      const birth = $element.find('td:nth-child(3)').text();
      const nationality = $element.find('td:nth-child(4)').text();

      goalkeeper.push({
        number: number || null,
        name: name || null,
        birth: birth || null,
        nationality: nationality || null,
      })
    })

    const defender = [];
    $(`#datatable-responsive > tbody:nth-child(6) > tr`).each((index , element) =>{
      const $element = $(element);
      const number = $element.find('td:nth-child(1)').text();
      const name = $element.find('td:nth-child(2)').text().trim();
      const birth = $element.find('td:nth-child(3)').text();
      const nationality = $element.find('td:nth-child(4)').text();

      defender.push({
        number: number || null,
        name: name || null,
        birth: birth || null,
        nationality: nationality || null,
      })
    })

    const midfielder = [];
    $(`#datatable-responsive > tbody:nth-child(8) > tr`).each((index , element) =>{
      const $element = $(element);
      const number = $element.find('td:nth-child(1)').text();
      const name = $element.find('td:nth-child(2)').text().trim();
      const birth = $element.find('td:nth-child(3)').text();
      const nationality = $element.find('td:nth-child(4)').text();

      midfielder.push({
        number: number || null,
        name: name || null,
        birth: birth || null,
        nationality: nationality || null,
      })
    })

    const forward = [];
    $(`#datatable-responsive > tbody:nth-child(10) > tr`).each((index , element) =>{
      const $element = $(element);
      const number = $element.find('td:nth-child(1)').text();
      const name = $element.find('td:nth-child(2)').text().trim();
      const birth = $element.find('td:nth-child(3)').text();
      const nationality = $element.find('td:nth-child(4)').text();

      forward.push({
        number: number || null,
        name: name || null,
        birth: birth || null,
        nationality: nationality || null,
      })
    })

    promises.push({
      id: id || null,
      full_name: full_name || null,
      logo: logo || null,
      team_photo: team_photo || null,
      info: {
        foundation: foundation || null,
        president: president || null,
        stadium: stadium || null,
        web_site: web_site || null,
        social_media: {
          facebook: facebook || null,
          twitter: twitter || null,
          instagram: instagram || null,
        }
      },
      honors: honors || null,
      dt: dt || null,
      team: {
        goalkeeper: goalkeeper,
        defender: defender,
        midfielder: midfielder,
        forward: forward,
      }
    })
  }).catch(err => {
    console.log(err)
  })
  return await Promise.all(promises);
};

getTeamInfo(56).then(res => console.log(util.inspect(res, {showHidden: false, depth: null})))

module.exports = {
  getPositions,
  getSchedule,
  getScheduleTeam,
  getTeams,
  getTeamInfo
};

