# PTRE - Get planets informations

## Endpoint URL

- url: `https://ptre.chez.gg/scripts/api_galaxy_get_infos.php`
- One call per system to update

## GET parameters

- tool: `oglight`, `infinity`, `easyptre`, `agr`
- country: `fr`
- univers: `123`
- team_key: `TMXXXXXXXXXXXXXXXX` or `TM-XXXX-XXXX-XXXX-XXXX`
- player_id: `123456`

## Response

- code (success if "1")
- message
- count
- galaxy_array

```
{
    {
        "player_id": "123456",
        "timestamp_ig": "111",
        "id": "458799995", 
        "coords": "1:234:5",
        "galaxy": "1",
        "system": "234",
        "position": "5",
        "moon": {
            "id": "1111"
        }
    },
    {
        "player_id": "123456",
        "timestamp_ig": "111",
        "id": "3343454", 
        "coords": "1:234:7",
        "galaxy": "1",
        "system": "234",
        "position": "7",
        "moon": {
            "id": "22222"
        }
    }
}
```

Note: You may receive planets already registered localy.
