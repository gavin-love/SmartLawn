const retrievePerson = async () => {
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
    console.log(user_data);

  } catch (err) {
    console.log(err)
  }
};

const retrieveZones = () => {
  $('.zones_info').empty();
}

$(window).ready(retrievePerson);

