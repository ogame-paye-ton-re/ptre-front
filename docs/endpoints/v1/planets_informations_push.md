# PTRE - Send planets informations

## Endpoint URL

- url: `https://ptre.chez.gg/scripts/api_galaxy_import_infos.php`
- One call per system to update
- Send only if some diffs are noticed (PTRE will still compare with public API and custom data from teammates)

## GET parameters

- tool: `oglight`, `infinity`, `easyptre`, `agr`
- country: `fr`
- univers: `123`

## POST parameters

One JSON per call and per system with only positions to update.

Example:
```
{
    "1": {
          "teamkey": "TMXXXXXXXXXXXXXXXX",
          "galaxy": "4",
          "system": "497",
          "position": "12",
          "coords": "4:497:12", // Deprecated
          "timestamp_ig": "123", // Not mandatory
          "player_id": "123456", // -1 if player left position (means planet destroyed or no more planet)
          "old_player_id": "-1", // Previous player ID (need to be different than -1 if player_id == -1)
          "id": "34003566", // Planet ID (still send id if planet destroyed)
          "name": "Black Box", // Player name
          "old_name": "-1", // Previous player name (if player_id == -1)
          "main": false, // Deprecated
          "rank": "10", // player rank
          "old_rank": "-1", // set if player_id == -1
          "status": "", // Player status, can be empty, one letter per status type (mandatory: v, i, I)
          "moon": {
            "id": "34003569", // -1 if no moon or moon destroyed
            "name": "lune 1"
          }
    },
    "2": {
          ...
    }
    "3": {
          ...
    }
}
```

## Response

JSON with:
- code (success if "1")
- message
- message_debug

## Debug

Check galaxy data via the [Galaxy Debug Page](https://ptre.chez.gg/?page=galaxy_debug). Raw import is available, plus data generated after galaxy interpretation (via public API and Team's custom data).