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
        <form>
          <input type="text" placeholder="duration">seconds</input>
          <button class="start">start</button>
        </form>
      </article>
    `)
  });
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
    displayZones(zones);

  } catch (err) {
    console.log(err)
  }
};

const fetchZone = (zone_id) => {
  const id = zone_id;
  const url = "https://api.rach.io/1/public/zone/start"


}

const startZone = () => {
  event.preventDefault();
  const zone_id = $(event.target).parent().parent().attr('id');

  fetchZone(zone_id);
}

$('.zones').on('click', 'article .start', startZone);
$(window).ready(fetchPerson);

