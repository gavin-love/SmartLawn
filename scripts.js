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
    <h1>Zones</h1>
    <p>${user_data.username}</p >
    <p>${date}</p>
    <p>${standardTime}</p>
  `);
};

const displayZones = (zones) => {
  $('.zones').empty();

  zones.map(zone => {
    const nozzle = zone.customNozzle.name.replace(/_/g, ' ');

    $('.zones').prepend(`
      <article id="${zone.id}">
        <h1>${zone.name}</h1>
        <p>${nozzle}: ${zone.customNozzle.inchesPerHour}"/hr</p>
        <img src="${zone.imageUrl}">
        <p class="start_successful"></p>
        <form>
          <input type="text" placeholder="duration">seconds</input>
          <button class="start_one_zone">start</button>
        </form>
      </article>
    `)
  });
};

const displayStartAllZones = () => {
  $('.start_all').empty();

  $('.start_all').prepend(`
    <article>
      <p>Start All Zones</p>
      <form>
        <input class="duration" type="text" placeholder="Duration">seconds</input>
        <input class="sort_order"type="text" placeholder="Sort Order" />
        <button class="start_multiple_zones">Start</button>
      </form>
    </article>
  `);
};

const fetchPerson = async () => {
  $('.user_info').empty();

  const person_id = "2ee8a9ca-741d-4b1a-add3-8a7683e5aa28";
  const url = `https://api.rach.io/1/public/person/${person_id}`;
  const bearer_token = "76980330-8f0b-4659-a341-527364acf134";
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
    console.log(err)
  }
};

const startZone = async (zone_id, zone_duration) => {
  const id = zone_id;
  const url = "https://api.rach.io/1/public/zone/start"
  const bearer_token = "76980330-8f0b-4659-a341-527364acf134";
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
      $('.start_successful').text('System successfully started')
    };

  } catch (err) {
    console.log(err)
  }
}

const identifyZone = () => {
  event.preventDefault();

  const zone_id = $(event.target).parent().parent().attr('id');
  const zone_duration = parseInt($(event.target).siblings('input').val());

  startZone(zone_id, zone_duration);
};

const identifyAllZones = () => {
  event.preventDefault();

  const zone_duration = parseInt($(event.target).siblings('.duration').val());
  const sort_order = parseInt($(event.target).siblings('.sort_order').val());
  const zones = [];

  $('.zones').find('article').each(function () { zones.push({ id: this.id, duration: zone_duration, sortOrder: sort_order }); });

  console.log(zones);
};

$('.zones').on('click', 'article .start_one_zone', identifyZone);
$('.start_all').on('click', 'article .start_multiple_zones', identifyAllZones)
$(window).ready(fetchPerson);

