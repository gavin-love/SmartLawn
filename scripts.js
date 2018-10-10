const milToStandard = (militaryTime) => {
  standardTime = militaryTime.split(':');
  return (standardTime[0].charAt(0) == 1 && standardTime[0].charAt(1) > 2) ? (standardTime[0] - 6) + ':' + standardTime[1] + ':' + standardTime[2] + ' P.M.' : standardTime.join(':') + ' A.M.'
};

const displayUserInfo = (user_data) => {
  $('.user_info').empty();

  const dateWithTime = new Date();
  const date = dateWithTime.toJSON().slice(0, 10).replace(/-/g, '/');
  const militaryTime = dateWithTime.toJSON().slice(11, 19);
  const standardTime = milToStandard(militaryTime);

  $('.user_info').prepend(`
    <h1>SmartLawn</h1>
    <nav>
      <p>Zones</p>
      <p class="user_name">${user_data.username}</p>
      <p class="date">${date}</p>
      <p class="time">${standardTime}</p>
    </nav>
    <p class="invalid_user"></p>
  `);
};

const displayZones = (zones) => {
  $('.zones').empty();

  zones.map(zone => {
    const nozzle = zone.customNozzle.name.replace(/_/g, ' ');

    $('.zones').prepend(`
      <article id="${zone.id}">
        <p class="zone_name">${zone.name}</p>
        <p class="nozzle_inches">${nozzle}: ${zone.customNozzle.inchesPerHour}"/hr</p>
        <img class="zone_image"src="${zone.imageUrl}">
        <p class="single_start_message"></p>
        <form>
          <input class="duration" type="text" placeholder="duration">seconds</input>
          <button class="start_one_zone">start</button>
        </form>
      </article>
    `);
  });
};

const displayStartAllZones = () => {
  $('.start_all').empty();

  $('.start_all').prepend(`
    <article>
      <p>Start All Zones</p>
      <form>
        <input class="duration" type="text" placeholder="Duration">seconds</input>
        <input class="sort_order" type="text" placeholder="Sort Order" />
        <button class="start_multiple_zones">Start</button>
        <p class="multiple_start_message"></p>
      </form>
    </article>
  `);
};

const getPerson = async () => {
  $('.user_info').empty();

  const person_id = "xxxxx-xxx-xxxxx-xxxxxx-xx";
  const url = `https://api.rach.io/1/public/person/${person_id}`;
  const bearer_token = "yyyy-yyyyyyyy-yy-yyyyyy-yyy-yyy";
  const bearer = 'Bearer ' + bearer_token;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
      }
    });

    const user_data = await response.json();
    const zones = user_data.devices[0].zones;

    displayUserInfo(user_data);
    displayStartAllZones();
    displayZones(zones);

  } catch (err) {
    $('.invalid_user').text(err.message);
  };
};

const postSingleZone = async (zone_id, zone_duration) => {
  const id = zone_id;
  const url = "https://api.rach.io/1/public/zone/start"
  const bearer_token = "yyyy-yyyyyyyy-yy-yyyyyy-yyy-yyy";
  const bearer = 'Bearer ' + bearer_token;
  const zone_data = { id, duration: zone_duration };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zone_data)
    });

    const success = await response.ok;
    if (success) {
      $('.single_start_message').text('System successfully started');
    };

  } catch (err) {
    $('.single_start_message').text(err.message);
  };
};

const postMultipleZones = async (zones) => {
  const url = "https://api.rach.io/1/public/zone/start_multiple"
  const bearer_token = "yyyy-yyyyyyyy-yy-yyyyyy-yyy-yyy";
  const bearer = 'Bearer ' + bearer_token;
  const all_zones_data = { zones: zones };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': bearer,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(all_zones_data)
    });

    const success = await response.ok;

    if (success) {
      $('.multiple_start_message').text('System successfully started');
    };

  } catch (err) {
    $('.multiple_start_message').text(err.message);
  };
};

const identifySingleZone = () => {
  event.preventDefault();

  const zone_id = $(event.target).parent().parent().attr('id');
  const zone_duration = parseInt($(event.target).siblings('input').val());

  postSingleZone(zone_id, zone_duration);
};

const identifyAllZones = () => {
  event.preventDefault();

  const zone_duration = parseInt($(event.target).siblings('.duration').val());
  const sort_order = parseInt($(event.target).siblings('.sort_order').val());
  const zones = [];

  $('.zones').find('article').each(function () { zones.push({ id: this.id, duration: zone_duration, sortOrder: sort_order }); });

  postMultipleZones(zones);
};

$('.zones').on('click', 'article .start_one_zone', identifySingleZone);
$('.start_all').on('click', 'article .start_multiple_zones', identifyAllZones);
$(window).ready(getPerson);